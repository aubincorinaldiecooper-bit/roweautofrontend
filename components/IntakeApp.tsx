"use client";

import { useRef, useState } from "react";
import { Car } from "iconoir-react";
import { Button } from "@/components/atoms/Button";
import { StatusPill } from "@/components/atoms/StatusPill";
import ChatComposer, { type ChatThreadMessage } from "@/components/primitives/ChatComposer";
import DiagnosticAttachments, { type DiagnosticAttachment } from "@/components/primitives/DiagnosticAttachments";
import { ThemeToggle } from "@/components/site/ThemeToggle";

type IntakeData = {
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  mileage: string;
  vin: string;
  concern: string;
  symptoms: string;
};

const order: (keyof IntakeData)[] = ["name","email","phone","vehicle","mileage","vin","concern","symptoms"];

const questions: Record<keyof IntakeData,string> = {
  name: "Hi — I’ll help get your vehicle checked in. What’s your name?",
  email: "What email should we use for your estimate and updates?",
  phone: "What’s the best mobile number to reach you?",
  vehicle: "What vehicle are we looking at? Include the year, make, model and trim if you know it.",
  mileage: "About how many miles are on it right now?",
  vin: "If you have the VIN, send the 17 characters. If not, type “skip.”",
  concern: "What’s going on with the vehicle? Describe it in your own words.",
  symptoms: "Anything else we should know — warning lights, sounds, smells, when it happens, or how long it’s been happening?",
};

function homeHref() {
  return process.env.NODE_ENV === "production" ? "/roweautofrontend/" : "/";
}

function Brand() {
  return (
    <a href={homeHref()} aria-label="First Rowe Auto home" className="flex items-center gap-2.5 rounded-control outline-none focus-visible:ring-2 focus-visible:ring-accent">
      <span className="flex size-9 items-center justify-center rounded-control bg-ink text-canvas shadow-btn"><Car width={19}/></span>
      <div>
        <div className="text-[13px] font-semibold leading-4">FIRST ROWE AUTO</div>
        <div className="text-[11px] text-ink-3">Repairs & Sales</div>
      </div>
    </a>
  );
}

const emptyData:IntakeData = {name:"",email:"",phone:"",vehicle:"",mileage:"",vin:"",concern:"",symptoms:""};

export default function IntakeApp() {
  const [stepIndex,setStepIndex]=useState(0);
  const [data,setData]=useState<IntakeData>(emptyData);
  const [messages,setMessages]=useState<ChatThreadMessage[]>([
    {id:1,role:"assistant",text:questions.name}
  ]);
  const [complete,setComplete]=useState(false);
  const [emailState,setEmailState]=useState<"idle"|"sending"|"sent"|"unavailable">("idle");
  const [confirmationNumber,setConfirmationNumber]=useState("");
  const [attachments,setAttachments]=useState<DiagnosticAttachment[]>([]);
  const fileInputRef=useRef<HTMLInputElement>(null);
  const photoInputRef=useRef<HTMLInputElement>(null);
  const videoInputRef=useRef<HTMLInputElement>(null);
  const nextId=useRef(2);

  const currentStep=order[stepIndex];

  async function finish(nextData:IntakeData) {
    setComplete(true);
    setMessages(current=>[
      ...current,
      {
        id:nextId.current++,
        role:"assistant",
        text:"Thanks — I’ve got what we need for the initial diagnostic intake. We’ll review the details and follow up with an estimate shortly."
      }
    ]);

    const api=process.env.NEXT_PUBLIC_API_URL;
    if(!api){
      setEmailState("unavailable");
      return;
    }

    setEmailState("sending");
    try{
      const res=await fetch(`${api}/api/intake-chat/complete`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          data:nextData,
          attachments:attachments.map(({name,type,size})=>({name,type,size}))
        })
      });
      if(!res.ok) throw new Error("send failed");
      const result=await res.json();
      setEmailState(result.email_sent ? "sent" : "unavailable");
      setConfirmationNumber(result.confirmation_number || "");
    }catch{
      setEmailState("unavailable");
    }
  }

  function send(text:string) {
    if(complete) return;

    const value=text.trim();
    if(!value) return;

    const normalized=currentStep==="vin" && value.toLowerCase()==="skip" ? "" : value;
    const nextData={...data,[currentStep]:normalized};
    setData(nextData);
    setMessages(current=>[
      ...current,
      {id:nextId.current++,role:"user",text:value}
    ]);

    if(stepIndex===order.length-1){
      void finish(nextData);
      return;
    }

    const nextIndex=stepIndex+1;
    setStepIndex(nextIndex);
    window.setTimeout(()=>{
      setMessages(current=>[
        ...current,
        {id:nextId.current++,role:"assistant",text:questions[order[nextIndex]]}
      ]);
    },180);
  }

  function addFiles(files:FileList) {
    Array.from(files).forEach((file,index)=>{
      const base:DiagnosticAttachment={
        id:`${Date.now()}-${index}-${file.name}`,
        name:file.name,
        type:file.type || "application/octet-stream",
        size:file.size,
      };

      if(file.type.startsWith("image/") || file.type.startsWith("video/")){
        const reader=new FileReader();
        reader.onload=()=>{
          setAttachments(current=>[
            ...current,
            {...base,preview:typeof reader.result==="string" ? reader.result : undefined}
          ]);
        };
        reader.readAsDataURL(file);
      }else{
        setAttachments(current=>[...current,base]);
      }
    });
  }

  function reset() {
    setStepIndex(0);
    setData(emptyData);
    setMessages([{id:1,role:"assistant",text:questions.name}]);
    setComplete(false);
    setEmailState("idle");
    setConfirmationNumber("");
    setAttachments([]);
    nextId.current=2;
  }

  return (
    <main className="min-h-screen bg-page text-ink">
      <header className="border-b border-line bg-page">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Brand/>
          <ThemeToggle/>
        </div>
      </header>

      <section className="mx-auto flex h-[calc(100dvh-64px)] max-w-[1280px] flex-col overflow-hidden px-4 py-5 sm:px-6 sm:py-6">
        <input
          ref={fileInputRef}
          className="hidden"
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.txt,.doc,.docx"
          onChange={(event)=>{
            if(event.target.files?.length) addFiles(event.target.files);
            event.currentTarget.value="";
          }}
        />
        <input
          ref={photoInputRef}
          className="hidden"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(event)=>{
            if(event.target.files?.length) addFiles(event.target.files);
            event.currentTarget.value="";
          }}
        />
        <input
          ref={videoInputRef}
          className="hidden"
          type="file"
          accept="video/*"
          capture="environment"
          onChange={(event)=>{
            if(event.target.files?.length) addFiles(event.target.files);
            event.currentTarget.value="";
          }}
        />

        <div className="grid min-h-0 w-full flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="flex min-h-0 min-w-0 flex-col">
            <div className="min-h-0 flex-1">
              <ChatComposer
                messages={messages}
                labels={{placeholder:"Type your answer…"}}
                onSend={send}
                disabled={complete}
              />
            </div>

            {complete && (
              <div className="mt-3 flex shrink-0 items-center justify-between gap-4">
                <div className="flex items-center gap-2" style={{animation:"pop-in 260ms cubic-bezier(0.23,1,0.32,1) both"}}>
                  <StatusPill tone="green" dot={false}>We’ll get in touch</StatusPill>
                  {confirmationNumber && <span className="font-mono text-[11.5px] text-ink-3">{confirmationNumber}</span>}
                </div>
                <Button variant="secondary" size="sm" onClick={reset}>Start another intake</Button>
              </div>
            )}
          </div>

          <div className="hidden min-h-0 lg:block">
            <DiagnosticAttachments
              files={attachments}
              onRequestAdd={()=>fileInputRef.current?.click()}
              onRequestPhoto={()=>photoInputRef.current?.click()}
              onRequestVideo={()=>videoInputRef.current?.click()}
              onRemove={(id)=>setAttachments(current=>current.filter(file=>file.id!==id))}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
