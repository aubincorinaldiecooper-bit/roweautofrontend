"use client";

import { useRef, useState } from "react";
import { Car } from "iconoir-react";
import { Button } from "@/components/atoms/Button";
import { StatusPill } from "@/components/atoms/StatusPill";
import ContextCards, { type ContextChunk } from "@/components/primitives/ContextCards";
import ChatComposer from "@/components/primitives/ChatComposer";
import { ThemeToggle } from "@/components/site/ThemeToggle";

type DiagnosticAttachment = {
  id: string;
  name: string;
  type: string;
  size: number;
};

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

type Message = {
  id: number;
  role: "assistant" | "user";
  text: string;
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
  const [messages,setMessages]=useState<Message[]>([
    {id:1,role:"assistant",text:questions.name}
  ]);
  const [complete,setComplete]=useState(false);
  const [confirmationNumber,setConfirmationNumber]=useState("");
  const [attachments,setAttachments]=useState<DiagnosticAttachment[]>([]);
  const fileInputRef=useRef<HTMLInputElement>(null);
  const photoInputRef=useRef<HTMLInputElement>(null);
  const videoInputRef=useRef<HTMLInputElement>(null);
  const nextId=useRef(2);
  const currentStep=order[stepIndex];

  const diagnosticChunks:ContextChunk[]=attachments.map((file)=>({
    title:file.name,
    chars:file.size < 1024
      ? `${file.size} B`
      : file.size < 1024*1024
        ? `${Math.round(file.size/1024)} KB`
        : `${(file.size/(1024*1024)).toFixed(1)} MB`,
    body:file.type.startsWith("image/")
      ? "Photo"
      : file.type.startsWith("video/")
        ? "Video"
        : "Document",
    source:"Diagnostic upload",
    badge:file.type.startsWith("image/") ? "IMG" : file.type.startsWith("video/") ? "VID" : "FILE",
    tone:"bg-accent",
  }));

  async function finish(nextData:IntakeData) {
    setComplete(true);
    setMessages(current=>[
      ...current,
      {
        id:nextId.current++,
        role:"assistant",
        text:"Thanks — I’ve got what we need. We’ll get in touch."
      }
    ]);

    const api=process.env.NEXT_PUBLIC_API_URL;
    if(!api) return;

    try{
      const res=await fetch(`${api}/api/intake-chat/complete`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          data:nextData,
          attachments:attachments.map(({name,type,size})=>({name,type,size}))
        })
      });
      if(!res.ok) return;
      const result=await res.json();
      setConfirmationNumber(result.confirmation_number || "");
    }catch{}
  }

  function submitAnswer(text:string) {
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
    const next=Array.from(files).map((file,index)=>({
      id:`${Date.now()}-${index}-${file.name}`,
      name:file.name,
      type:file.type || "application/octet-stream",
      size:file.size,
    }));
    setAttachments(current=>[...current,...next]);
  }

  function reset() {
    setStepIndex(0);
    setData(emptyData);
    setMessages([{id:1,role:"assistant",text:questions.name}]);
    setComplete(false);
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

      <section className="mx-auto grid h-[calc(100dvh-64px)] max-w-[1280px] min-h-0 gap-4 overflow-hidden px-4 py-5 sm:px-6 sm:py-6 lg:grid-cols-[minmax(0,1fr)_340px]">
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

        <div className="flex min-h-0 min-w-0 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-1 py-1">
            <div className="mx-auto flex max-w-[720px] flex-col gap-5 py-3">
              {messages.map((message)=>(
                <div key={message.id} className={message.role==="user" ? "text-right" : "text-left"}>
                  {message.role==="assistant" && (
                    <div className="mb-1 text-[12px] font-medium text-ink-2">First Rowe Auto</div>
                  )}
                  <p className={message.role==="user"
                    ? "ml-auto max-w-[620px] text-[13px] leading-6 text-ink"
                    : "max-w-[620px] text-[13px] leading-6 text-ink"}>
                    {message.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="shrink-0 pt-3">
            {!complete ? (
              <div className="mx-auto max-w-[720px] [&>div]:!h-auto [&>div]:!max-w-none [&>div]:!overflow-visible [&>div]:!rounded-none [&>div]:!bg-transparent [&>div]:!shadow-none [&>div>div:first-child]:hidden [&>div>div:nth-child(2)]:hidden">
                <ChatComposer
                  messages={[]}
                  suggestions={[]}
                  labels={{initialPrompt:"",placeholder:"Type your answer…"}}
                  onSend={submitAnswer}
                />
              </div>
            ) : (
              <div className="mx-auto flex max-w-[720px] items-center justify-between gap-3">
                <div className="flex items-center gap-2" style={{animation:"pop-in 260ms cubic-bezier(0.23,1,0.32,1) both"}}>
                  <StatusPill tone="green" dot={false}>We’ll get in touch</StatusPill>
                  {confirmationNumber && <span className="font-mono text-[11.5px] text-ink-3">{confirmationNumber}</span>}
                </div>
                <Button variant="secondary" size="sm" onClick={reset}>Start another intake</Button>
              </div>
            )}
          </div>
        </div>

        <aside className="hidden min-h-0 lg:flex lg:flex-col">
          <div className="mb-2 flex shrink-0 flex-wrap items-center gap-1.5">
            <Button type="button" variant="secondary" size="xs" onClick={()=>photoInputRef.current?.click()}>
              Take photo
            </Button>
            <Button type="button" variant="secondary" size="xs" onClick={()=>videoInputRef.current?.click()}>
              Record video
            </Button>
            <Button type="button" variant="secondary" size="xs" onClick={()=>fileInputRef.current?.click()}>
              Add files
            </Button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <ContextCards
              chunks={diagnosticChunks}
              labels={{header:"Diagnostic files",count:String(attachments.length)}}
            />
          </div>
        </aside>
      </section>
    </main>
  );
}
