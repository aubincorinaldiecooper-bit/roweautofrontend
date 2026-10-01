"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { ArrowRight, Car, CheckCircle, Mail, NavArrowLeft, SendDiagonal } from "iconoir-react";
import { Button } from "@/components/atoms/Button";
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

type Step = keyof IntakeData | "complete";
type Message = { id:number; role:"assistant"|"user"; text:string };

const questions: Record<Exclude<Step,"complete">, string> = {
  name: "Hi — I’ll help get your vehicle checked in. What’s your name?",
  email: "What email should we use for your estimate and updates?",
  phone: "And what’s the best mobile number to reach you?",
  vehicle: "What vehicle are we looking at? Include the year, make, model and trim if you know it.",
  mileage: "About how many miles are on it right now?",
  vin: "If you have the VIN, send the 17 characters. If not, type “skip.”",
  concern: "What’s going on with the vehicle? Describe it in your own words.",
  symptoms: "Anything else we should know — warning lights, sounds, smells, when it happens, or how long it’s been happening?",
};

const order: Exclude<Step,"complete">[] = ["name","email","phone","vehicle","mileage","vin","concern","symptoms"];

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

export default function IntakeApp() {
  const [stepIndex,setStepIndex]=useState(0);
  const [draft,setDraft]=useState("");
  const [data,setData]=useState<IntakeData>({name:"",email:"",phone:"",vehicle:"",mileage:"",vin:"",concern:"",symptoms:""});
  const [messages,setMessages]=useState<Message[]>([{id:1,role:"assistant",text:questions.name}]);
  const [complete,setComplete]=useState(false);
  const [emailState,setEmailState]=useState<"idle"|"sending"|"sent"|"unavailable">("idle");
  const nextId=useRef(2);

  const currentStep = order[stepIndex];
  const canSend = draft.trim().length > 0 && !complete;
  const summary = useMemo(()=>[
    ["Customer",data.name],
    ["Email",data.email],
    ["Phone",data.phone],
    ["Vehicle",data.vehicle],
    ["Mileage",data.mileage],
    ["VIN",data.vin || "Not provided"],
    ["Concern",data.concern],
  ],[data]);

  async function finish(nextData:IntakeData) {
    setComplete(true);
    setMessages(m=>[...m,{
      id:nextId.current++,
      role:"assistant",
      text:"Thanks — I’ve got what we need for the initial diagnostic intake. We’ll review the details and follow up with an estimate shortly."
    }]);

    const api = process.env.NEXT_PUBLIC_API_URL;
    if(!api) {
      setEmailState("unavailable");
      return;
    }

    setEmailState("sending");
    try {
      const res=await fetch(`${api}/api/intake-chat/complete`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({data:nextData})
      });
      if(!res.ok) throw new Error("email failed");
      const result=await res.json();
      setEmailState(result.email_sent ? "sent" : "unavailable");
    } catch {
      setEmailState("unavailable");
    }
  }

  async function send(e:FormEvent) {
    e.preventDefault();
    const value=draft.trim();
    if(!value || complete) return;

    const userMessage:Message={id:nextId.current++,role:"user",text:value};
    const normalized=currentStep==="vin" && value.toLowerCase()==="skip" ? "" : value;
    const nextData={...data,[currentStep]:normalized};
    setData(nextData);
    setMessages(m=>[...m,userMessage]);
    setDraft("");

    if(stepIndex===order.length-1) {
      await finish(nextData);
      return;
    }

    const nextIndex=stepIndex+1;
    setStepIndex(nextIndex);
    setTimeout(()=>{
      setMessages(m=>[...m,{id:nextId.current++,role:"assistant",text:questions[order[nextIndex]]}]);
    },180);
  }

  function reset() {
    setStepIndex(0);
    setDraft("");
    setData({name:"",email:"",phone:"",vehicle:"",mileage:"",vin:"",concern:"",symptoms:""});
    setMessages([{id:1,role:"assistant",text:questions.name}]);
    setComplete(false);
    setEmailState("idle");
    nextId.current=2;
  }

  return (
    <main className="min-h-screen bg-page text-ink">
      <header className="border-b border-line bg-page/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Brand/>
          <div className="flex items-center gap-3">
            <a href={homeHref()} className="hidden items-center gap-1 text-[12px] text-ink-3 hover:text-ink sm:flex"><NavArrowLeft width={14}/> Home</a>
            <ThemeToggle/>
          </div>
        </div>
      </header>

      <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-5xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:py-8">
        <section className="flex min-h-[68vh] flex-col overflow-hidden rounded-window bg-surface shadow-card">
          <div className="border-b border-line px-4 py-3 sm:px-5">
            <div className="text-[11px] font-medium uppercase tracking-[.08em] text-ink-3">AI intake</div>
            <div className="mt-0.5 text-[15px] font-semibold">Tell us what’s going on</div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5">
            {messages.map(message=>(
              <div key={message.id} className={message.role==="user"?"flex justify-end":"flex justify-start"}>
                <div className={message.role==="user"
                  ?"max-w-[82%] rounded-[18px] rounded-br-[6px] bg-ink px-4 py-3 text-[13px] leading-5 text-canvas"
                  :"max-w-[82%] rounded-[18px] rounded-bl-[6px] bg-inset px-4 py-3 text-[13px] leading-5 text-ink shadow-hairline"}>
                  {message.text}
                </div>
              </div>
            ))}

            {complete&&(
              <div className="mt-2 rounded-card bg-green-tint p-4 shadow-hairline">
                <div className="flex gap-3">
                  <CheckCircle className="mt-0.5 shrink-0 text-green" width={19}/>
                  <div>
                    <div className="text-[13px] font-semibold text-ink">Diagnostic intake complete</div>
                    <div className="mt-1 text-[12px] leading-5 text-ink-2">
                      {emailState==="sent"&&"A confirmation email has been sent. We’ll follow up with the estimate shortly."}
                      {emailState==="sending"&&"Sending your confirmation email…"}
                      {emailState==="unavailable"&&"We’ll follow up with the estimate shortly."}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={send} className="border-t border-line p-3 sm:p-4">
            {!complete ? (
              <div className="flex items-end gap-2 rounded-card bg-inset p-2 shadow-hairline">
                <textarea
                  value={draft}
                  onChange={e=>setDraft(e.target.value)}
                  onKeyDown={e=>{
                    if(e.key==="Enter"&&!e.shiftKey){
                      e.preventDefault();
                      if(canSend) e.currentTarget.form?.requestSubmit();
                    }
                  }}
                  placeholder="Type your answer…"
                  rows={1}
                  autoFocus
                  className="min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-[13px] leading-5 text-ink outline-none placeholder:text-ink-3"
                />
                <Button type="submit" variant="accent" size="sm" disabled={!canSend} aria-label="Send message">
                  Send <SendDiagonal width={15}/>
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <span className="text-[12px] text-ink-3">Need to enter another vehicle?</span>
                <Button type="button" variant="secondary" size="sm" onClick={reset}>Start another intake <ArrowRight width={14}/></Button>
              </div>
            )}
          </form>
        </section>

        <aside className="h-fit rounded-window bg-surface p-4 shadow-card lg:sticky lg:top-6">
          <div className="text-[11px] font-medium uppercase tracking-[.08em] text-ink-3">Intake summary</div>
          <div className="mt-3 grid gap-3">
            {summary.map(([label,value])=>(
              <div key={label} className="border-b border-line pb-3 last:border-0 last:pb-0">
                <div className="text-[11px] text-ink-3">{label}</div>
                <div className="mt-0.5 break-words text-[12px] font-medium text-ink">{value || "—"}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-control bg-inset p-3 text-[11px] leading-5 text-ink-2 shadow-hairline">
            <div className="mb-1 flex items-center gap-1.5 font-medium text-ink"><Mail width={14}/> What happens next</div>
            We review the diagnostic intake, prepare an estimate, and contact the customer using the email and phone provided.
          </div>
        </aside>
      </div>
    </main>
  );
}
