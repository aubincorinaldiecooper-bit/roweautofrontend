"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { ArrowRight, Car, Check, CheckCircle, ClipboardCheck, Plus, ShieldCheck, Trash, User, WarningTriangle } from "iconoir-react";
import { Button } from "@/components/atoms/Button";
import { SegmentedControl } from "@/components/atoms/SegmentedControl";
import { Switch } from "@/components/atoms/Switch";
import { StatusPill } from "@/components/atoms/StatusPill";
import { ThemeToggle } from "@/components/site/ThemeToggle";

type Mode = "Repair" | "Vehicle sale";
type Rec = { work:string; estimate:string; urgency:"Safety"|"Soon"|"Watch"; followUp:string };

const initial = {
  name:"", phone:"", email:"", address:"", referral:"", accountType:"Retail", textOk:true,
  year:"", make:"", model:"", color:"", plate:"", state:"", mileage:"", vin:"", arrived:"Drove in",
  serviceRequested:[] as string[], concern:"", diagnosticLimit:"", promisedAt:"",
  estimateTotal:"", decision:"", approvedAmount:"", approvedBy:"", approvalHow:"Text",
  mileageOut:"", finalInvoice:"", payment:"Card", nextService:"",
  salesIntent:"Buy", desiredVehicle:"", budget:"", financing:"Undecided", tradeIn:false,
  tradeYear:"", tradeMake:"", tradeModel:"", tradeMileage:"", tradeVin:"", notes:""
};
const services = ["Diagnostic","European synthetic oil service","Full vehicle health check","Brake inspection","Pre-purchase inspection — European","Pre-purchase inspection — domestic","Repair","Collision / frame / paint","Programming / ADAS","Heavy truck / diesel"];
const fieldClass = "h-10 w-full rounded-control border border-line-strong bg-surface px-3 text-[13px] text-ink shadow-[var(--shadow-inset-field)] outline-none transition-[box-shadow,border-color] placeholder:text-ink-3 focus:border-accent focus:shadow-[0_0_0_2px_var(--accent-tint)]";
const areaClass = fieldClass + " min-h-[104px] resize-y py-2.5";

function Brand() {
  const homeHref = process.env.NODE_ENV === "production" ? "/roweautofrontend/" : "/";
  return <a href={homeHref} aria-label="First Rowe Auto home" className="flex items-center gap-2.5 rounded-control outline-none focus-visible:ring-2 focus-visible:ring-accent">
    <span className="flex size-9 items-center justify-center rounded-control bg-ink text-canvas shadow-btn"><Car width={19}/></span>
    <div><div className="text-[13px] font-semibold leading-4">FIRST ROWE AUTO</div><div className="text-[11px] text-ink-3">Repairs & Sales</div></div>
  </a>;
}

function Hero({onStart}:{onStart:()=>void}) {
  const homeHref = process.env.NODE_ENV === "production" ? "/roweautofrontend/" : "/";
  return <section id="home" className="relative flex min-h-[720px] w-full items-end overflow-hidden bg-ink text-white sm:min-h-[760px]">
    <div
      className="absolute inset-0 bg-cover"
      style={{
        backgroundImage:"url(https://images.unsplash.com/photo-1643700973089-baa86a1ab9ee?auto=format&fit=crop&fm=jpg&q=86&w=2400)",
        backgroundPosition:"center 45%"
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/35"/>

    <div className="absolute inset-x-0 top-0 z-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
        <a href={homeHref} aria-label="First Rowe Auto home" className="flex items-center gap-2.5 rounded-control outline-none focus-visible:ring-2 focus-visible:ring-white/70">
          <span className="flex size-9 items-center justify-center rounded-control bg-white/95 text-black shadow-btn"><Car width={19}/></span>
          <div>
            <div className="text-[13px] font-semibold leading-4 text-white">FIRST ROWE AUTO</div>
            <div className="text-[11px] text-white/70">Repairs & Sales</div>
          </div>
        </a>
        <div className="hidden text-right text-[12px] leading-5 text-white/70 sm:block">
          <div>Hollywood, Florida</div>
          <div>954-374-8384</div>
        </div>
      </div>
    </div>

    <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 sm:pb-14 md:pb-16">
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_320px] md:items-end md:gap-12">
        <div className="max-w-3xl">
          <div className="mb-4 text-[12px] font-medium uppercase tracking-[.12em] text-white/65">Repair · maintenance · vehicle sales</div>
          <h1 className="text-[42px] font-semibold leading-[.98] tracking-[-.045em] text-white sm:text-[58px] md:text-[72px]">Straight answers for your car.</h1>
          <p className="mt-5 max-w-2xl text-[16px] leading-7 text-white/80 sm:text-[18px]">Tell us what you need before you arrive. We’ll keep the details clear from drop-off and approval through pickup—or help you get started on your next vehicle.</p>
        </div>

        <div className="rounded-window bg-surface/95 p-5 text-ink shadow-raised backdrop-blur">
          <div className="mb-4">
            <div className="text-[11px] font-medium uppercase tracking-[.08em] text-ink-3">Plan your visit</div>
            <div className="mt-1 text-[16px] font-semibold">First Rowe Auto</div>
          </div>
          <div className="grid gap-3 border-y border-line py-4 text-[13px]">
            <div>
              <div className="text-[11px] text-ink-3">Address</div>
              <div className="mt-0.5 font-medium">5821 Rodman St, Hollywood, FL</div>
            </div>
            <div>
              <div className="text-[11px] text-ink-3">Hours</div>
              <div className="mt-0.5 font-medium">Mon–Fri 9–6 · Sat 9–1</div>
            </div>
            <div>
              <div className="text-[11px] text-ink-3">Phone</div>
              <div className="mt-0.5 font-medium">954-374-8384</div>
            </div>
          </div>
          <Button variant="primary" size="md" onClick={onStart} className="group mt-5 w-full">
            Start an intake <ArrowRight width={16} className="transition-transform duration-150 group-hover:translate-x-0.5"/>
          </Button>
        </div>
      </div>
    </div>
  </section>;
}
function Field({label,required,children,hint}:{label:string;required?:boolean;children:ReactNode;hint?:string}) {
  return <label className="block min-w-0"><span className="mb-1.5 flex items-center gap-1 text-[12px] font-medium text-ink-2">{label}{required&&<span className="text-accent">*</span>}</span>{children}{hint&&<span className="mt-1 block text-[11px] text-ink-3">{hint}</span>}</label>;
}
function Section({number,title,icon,children}:{number:string;title:string;icon:ReactNode;children:ReactNode}) {
  return <section className="overflow-hidden rounded-window bg-surface shadow-card">
    <div className="flex items-center gap-3 border-b border-line px-4 py-3">
      <span className="flex size-8 items-center justify-center rounded-control bg-inset text-ink-2 shadow-hairline">{icon}</span>
      <div><div className="text-[11px] font-medium uppercase tracking-[.08em] text-ink-3">Section {number}</div><h2 className="text-[15px] font-semibold">{title}</h2></div>
    </div>
    <div className="p-4 sm:p-5">{children}</div>
  </section>;
}
function Onboarding({onDone}:{onDone:()=>void}) {
  const metrics=[["Mileage","4 / 281","Needed for due-service reminders","red"],["VIN","158 / 281","Not consistently captured","orange"],["Phone","157 / 281","Needed for text follow-up","orange"],["Declined work","0 captured","Follow-up opportunity disappears","red"]] as const;
  return <main className="min-h-screen bg-page px-4 py-8 text-ink sm:px-6">
    <div className="mx-auto max-w-5xl">
      <div className="mb-10 flex items-center justify-between"><Brand/><ThemeToggle/></div>
      <div className="max-w-2xl"><StatusPill tone="accent">New intake workflow</StatusPill><h1 className="mt-4 text-[34px] font-semibold leading-tight tracking-[-.035em] sm:text-[42px]">Capture the details that make follow-up possible.</h1><p className="mt-3 max-w-xl text-[15px] leading-6 text-ink-2">The invoice records the bill. This intake records the customer, vehicle, approval and next opportunity before anything gets lost.</p></div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(([k,v,d,t])=><div key={k} className="rounded-card bg-surface p-4 shadow-card"><div className="mb-3 flex items-center justify-between"><span className="text-[12px] font-medium text-ink-3">{k}</span><StatusPill tone={t} dot={false}>Gap</StatusPill></div><div className="font-mono text-[21px] font-semibold">{v}</div><p className="mt-1.5 text-[12px] leading-5 text-ink-2">{d}</p></div>)}
      </div>
      <div className="mt-5 rounded-window bg-surface p-5 shadow-card sm:flex sm:items-center sm:justify-between">
        <div className="flex max-w-2xl gap-3"><span className="mt-0.5 text-accent"><ShieldCheck/></span><div><h2 className="font-semibold">What changes now</h2><p className="mt-1 text-[13px] leading-5 text-ink-2">Required fields prevent incomplete records. Recommended or declined work stays attached to the customer. QuickBooks can stay the invoicing system while this becomes the operational intake.</p></div></div>
        <Button variant="accent" className="mt-4 shrink-0 sm:mt-0" onClick={onDone}>Start intake <ArrowRight width={16}/></Button>
      </div>
    </div>
  </main>;
}

export default function IntakeApp() {
  const [showWhy,setShowWhy]=useState(false);
  const [mode,setMode]=useState<Mode>("Repair");
  const [step,setStep]=useState(1);
  const [data,setData]=useState(initial);
  const [recs,setRecs]=useState<Rec[]>([]);
  const [status,setStatus]=useState<"idle"|"sending"|"done"|"error">("idle");
  const set=(key:keyof typeof initial,value:any)=>setData(p=>({...p,[key]:value}));
  const ready = useMemo(()=>mode==="Repair" ? !!(data.name&&data.phone&&data.email&&data.referral&&data.year&&data.make&&data.model&&data.mileage&&data.vin.length===17&&data.concern) : !!(data.name&&data.phone&&data.email&&data.desiredVehicle),[data,mode]);
  if(showWhy) return <Onboarding onDone={()=>setShowWhy(false)}/>;

  async function submit(e:FormEvent) {
    e.preventDefault(); setStatus("sending");
    try {
      const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/intakes`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:mode,data,recommendations:recs})});
      if(!res.ok) throw new Error("save failed"); setStatus("done");
    } catch { setStatus("error"); }
  }
  if(status==="done") return <main className="min-h-screen bg-page p-4"><div className="mx-auto flex min-h-[80vh] max-w-lg items-center justify-center"><div className="w-full rounded-window bg-surface p-8 text-center shadow-raised"><span className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-tint text-green"><CheckCircle/></span><h1 className="mt-4 text-xl font-semibold">Intake saved</h1><p className="mt-2 text-[13px] text-ink-2">The record is ready for follow-up.</p><Button variant="primary" className="mt-5" onClick={()=>{setData(initial);setRecs([]);setStep(1);setStatus("idle")}}>New intake</Button></div></div></main>;

  const toggleService=(s:string)=>set("serviceRequested",data.serviceRequested.includes(s)?data.serviceRequested.filter(x=>x!==s):[...data.serviceRequested,s]);

  return <main className="min-h-screen bg-page text-ink">
    <Hero onStart={()=>document.getElementById("intake")?.scrollIntoView({behavior:"smooth",block:"start"})}/>
    <header className="sticky top-0 z-30 border-b border-line bg-page/95 backdrop-blur"><div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"><Brand/><div className="flex items-center gap-3"><button className="hidden text-[12px] text-ink-3 hover:text-ink sm:block" onClick={()=>setShowWhy(true)}>Why this intake?</button><ThemeToggle/></div></div></header>
    <form id="intake" onSubmit={submit} className="mx-auto max-w-6xl scroll-mt-16 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><div className="mb-2 text-[12px] font-medium text-ink-3">NEW INTAKE</div><h1 className="text-[27px] font-semibold tracking-[-.03em]">What are we helping with?</h1><p className="mt-1 text-[13px] text-ink-2">Choose a lane. Only relevant fields appear.</p></div>
        <SegmentedControl options={["Repair","Vehicle sale"] as const} value={mode} onChange={v=>{setMode(v);setStep(1)}} className="w-full sm:w-[260px]"/>
      </div>

      {mode==="Repair" ? <>
        <div className="mb-5 grid grid-cols-3 gap-2 rounded-card bg-surface p-2 shadow-hairline">{["Drop-off","Estimate","Pickup"].map((x,i)=><button key={x} type="button" onClick={()=>setStep(i+1)} className={`rounded-control px-3 py-2 text-[12px] font-medium transition-colors ${step===i+1?"bg-ink text-canvas":"text-ink-3 hover:bg-hover hover:text-ink"}`}>{i+1}. {x}</button>)}</div>
        {step===1&&<div className="grid gap-4">
          <Section number="1" title="Customer" icon={<User width={17}/>}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Name / company" required><input className={fieldClass} value={data.name} onChange={e=>set("name",e.target.value)}/></Field>
              <Field label="Mobile phone" required><input className={fieldClass} inputMode="tel" value={data.phone} onChange={e=>set("phone",e.target.value)}/></Field>
              <Field label="Email" required><input className={fieldClass} type="email" value={data.email} onChange={e=>set("email",e.target.value)}/></Field>
              <Field label="Address"><input className={fieldClass} value={data.address} onChange={e=>set("address",e.target.value)}/></Field>
              <Field label="How did you hear about us?" required><select className={fieldClass} value={data.referral} onChange={e=>set("referral",e.target.value)}><option value="">Select source</option>{["Google","Referral","Repeat","Drive-by","Social","Other"].map(x=><option key={x}>{x}</option>)}</select></Field>
              <Field label="Account type"><select className={fieldClass} value={data.accountType} onChange={e=>set("accountType",e.target.value)}>{["Retail","Dealer / wholesale","Fleet / commercial","Body shop / other shop","Insurance"].map(x=><option key={x}>{x}</option>)}</select></Field>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-control bg-inset p-3 shadow-hairline"><div><div className="text-[13px] font-medium">Text service updates & reminders</div><div className="text-[11px] text-ink-3">Document consent at intake.</div></div><Switch checked={data.textOk} onChange={v=>set("textOk",v)}/></div>
          </Section>
          <Section number="2" title="Vehicle" icon={<Car width={17}/>}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Year" required><input className={fieldClass} value={data.year} onChange={e=>set("year",e.target.value)}/></Field>
              <Field label="Make" required><input className={fieldClass} value={data.make} onChange={e=>set("make",e.target.value)}/></Field>
              <Field label="Model / trim" required><input className={fieldClass} value={data.model} onChange={e=>set("model",e.target.value)}/></Field>
              <Field label="Color"><input className={fieldClass} value={data.color} onChange={e=>set("color",e.target.value)}/></Field>
              <Field label="Plate"><input className={fieldClass} value={data.plate} onChange={e=>set("plate",e.target.value)}/></Field>
              <Field label="State"><input className={fieldClass} value={data.state} onChange={e=>set("state",e.target.value)}/></Field>
              <Field label="Mileage in" required hint="Enables due-service reminders."><input className={fieldClass} inputMode="numeric" value={data.mileage} onChange={e=>set("mileage",e.target.value)}/></Field>
              <Field label="Arrived"><select className={fieldClass} value={data.arrived} onChange={e=>set("arrived",e.target.value)}>{["Drove in","Towed","Drop-off","Waiting"].map(x=><option key={x}>{x}</option>)}</select></Field>
              <div className="sm:col-span-2 lg:col-span-4"><Field label="VIN — 17 characters" required><input className={fieldClass+" font-mono uppercase"} maxLength={17} value={data.vin} onChange={e=>set("vin",e.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g,""))}/></Field><div className="mt-1 text-right font-mono text-[11px] text-ink-3">{data.vin.length}/17</div></div>
            </div>
          </Section>
          <Section number="3" title="Reason for visit" icon={<ClipboardCheck width={17}/>}>
            <div className="mb-4"><div className="mb-2 text-[12px] font-medium text-ink-2">Service requested</div><div className="flex flex-wrap gap-2">{services.map(s=><button key={s} type="button" onClick={()=>toggleService(s)} className={`rounded-full px-3 py-1.5 text-[12px] shadow-hairline ${data.serviceRequested.includes(s)?"bg-accent-tint text-accent-ink":"bg-surface text-ink-2 hover:bg-hover"}`}>{data.serviceRequested.includes(s)&&<Check width={13} className="mr-1 inline"/>}{s}</button>)}</div></div>
            <Field label="Customer concern — what, when it happens, how long" required><textarea className={areaClass} value={data.concern} onChange={e=>set("concern",e.target.value)} placeholder="Use the customer's own words…"/></Field>
            <div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label="Authorized diagnosis up to $"><input className={fieldClass} value={data.diagnosticLimit} onChange={e=>set("diagnosticLimit",e.target.value)}/></Field><Field label="Promised time / date"><input className={fieldClass} type="datetime-local" value={data.promisedAt} onChange={e=>set("promisedAt",e.target.value)}/></Field></div>
          </Section>
          <div className="flex justify-end"><Button type="button" variant="accent" disabled={!ready} onClick={()=>setStep(2)}>Continue <ArrowRight width={16}/></Button></div>
        </div>}
        {step===2&&<div className="grid gap-4">
          <Section number="4" title="Estimate & approval" icon={<ClipboardCheck width={17}/>}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Estimate total $"><input className={fieldClass} value={data.estimateTotal} onChange={e=>set("estimateTotal",e.target.value)}/></Field>
              <Field label="Customer decision"><select className={fieldClass} value={data.decision} onChange={e=>set("decision",e.target.value)}><option value="">Pending</option>{["Approved all","Approved part","Declined all"].map(x=><option key={x}>{x}</option>)}</select></Field>
              <Field label="Approved $"><input className={fieldClass} value={data.approvedAmount} onChange={e=>set("approvedAmount",e.target.value)}/></Field>
              <Field label="Approved by"><input className={fieldClass} value={data.approvedBy} onChange={e=>set("approvedBy",e.target.value)}/></Field>
              <Field label="How"><select className={fieldClass} value={data.approvalHow} onChange={e=>set("approvalHow",e.target.value)}>{["In person","Phone","Text"].map(x=><option key={x}>{x}</option>)}</select></Field>
            </div>
          </Section>
          <Section number="5" title="Recommended — not done today" icon={<WarningTriangle width={17}/>}>
            <div className="grid gap-3">{recs.map((r,i)=><div key={i} className="grid gap-3 rounded-card bg-inset p-3 shadow-hairline sm:grid-cols-[1.5fr_.6fr_.7fr_.8fr_auto]"><input className={fieldClass} placeholder="Recommended work" value={r.work} onChange={e=>setRecs(a=>a.map((x,j)=>j===i?{...x,work:e.target.value}:x))}/><input className={fieldClass} placeholder="Est. $" value={r.estimate} onChange={e=>setRecs(a=>a.map((x,j)=>j===i?{...x,estimate:e.target.value}:x))}/><select className={fieldClass} value={r.urgency} onChange={e=>setRecs(a=>a.map((x,j)=>j===i?{...x,urgency:e.target.value as Rec["urgency"]}:x))}>{["Safety","Soon","Watch"].map(x=><option key={x}>{x}</option>)}</select><input className={fieldClass} type="date" value={r.followUp} onChange={e=>setRecs(a=>a.map((x,j)=>j===i?{...x,followUp:e.target.value}:x))}/><Button type="button" variant="quiet" size="sm" onClick={()=>setRecs(a=>a.filter((_,j)=>j!==i))}><Trash width={15}/></Button></div>)}</div>
            <Button type="button" variant="secondary" size="sm" className="mt-3" onClick={()=>setRecs(a=>[...a,{work:"",estimate:"",urgency:"Soon",followUp:""}])}><Plus width={14}/> Add recommendation</Button>
            <p className="mt-3 text-[11px] text-ink-3">Every finding the customer does not approve belongs here.</p>
          </Section>
          <div className="flex justify-between"><Button type="button" variant="quiet" onClick={()=>setStep(1)}>Back</Button><Button type="button" variant="accent" onClick={()=>setStep(3)}>Continue <ArrowRight width={16}/></Button></div>
        </div>}
        {step===3&&<div className="grid gap-4">
          <Section number="6" title="Pickup & next visit" icon={<CheckCircle width={17}/>}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Field label="Mileage out"><input className={fieldClass} value={data.mileageOut} onChange={e=>set("mileageOut",e.target.value)}/></Field><Field label="Final invoice $"><input className={fieldClass} value={data.finalInvoice} onChange={e=>set("finalInvoice",e.target.value)}/></Field><Field label="Paid by"><select className={fieldClass} value={data.payment} onChange={e=>set("payment",e.target.value)}>{["Card","Cash","Zelle","Check","Account"].map(x=><option key={x}>{x}</option>)}</select></Field><Field label="Next service due"><input className={fieldClass} value={data.nextService} onChange={e=>set("nextService",e.target.value)} placeholder="Date / mileage / what"/></Field></div>
          </Section>
          <div className="rounded-card bg-surface p-4 text-[12px] text-ink-2 shadow-hairline">Customer authorization should acknowledge approved diagnosis/work and vehicle condition. Storage charge: $100/day after work is completed and the customer has been notified.</div>
          {status==="error"&&<div className="rounded-control bg-red-tint px-3 py-2 text-[12px] text-red">Could not save. Check the API connection and try again.</div>}
          <div className="flex justify-between"><Button type="button" variant="quiet" onClick={()=>setStep(2)}>Back</Button><Button type="submit" variant="success" disabled={status==="sending"}>{status==="sending"?"Saving…":"Save repair intake"} <Check width={16}/></Button></div>
        </div>}
      </> : <div className="grid gap-4 lg:grid-cols-2">
        <Section number="1" title="Customer & sales intent" icon={<Car width={17}/>}>
          <div className="grid gap-4 sm:grid-cols-2"><Field label="Name" required><input className={fieldClass} value={data.name} onChange={e=>set("name",e.target.value)}/></Field><Field label="Mobile phone" required><input className={fieldClass} value={data.phone} onChange={e=>set("phone",e.target.value)}/></Field><Field label="Email" required><input className={fieldClass} type="email" value={data.email} onChange={e=>set("email",e.target.value)}/></Field><Field label="Intent"><select className={fieldClass} value={data.salesIntent} onChange={e=>set("salesIntent",e.target.value)}>{["Buy","Sell / trade","Browse"].map(x=><option key={x}>{x}</option>)}</select></Field><div className="sm:col-span-2"><Field label="Vehicle interested in" required><input className={fieldClass} value={data.desiredVehicle} onChange={e=>set("desiredVehicle",e.target.value)} placeholder="Year, make, model or stock #"/></Field></div><Field label="Budget / target payment"><input className={fieldClass} value={data.budget} onChange={e=>set("budget",e.target.value)}/></Field><Field label="Financing"><select className={fieldClass} value={data.financing} onChange={e=>set("financing",e.target.value)}>{["Undecided","Cash","Needs financing","Pre-approved"].map(x=><option key={x}>{x}</option>)}</select></Field></div>
        </Section>
        <Section number="2" title="Trade-in & follow-up" icon={<Car width={17}/>}>
          <div className="mb-4 flex items-center justify-between rounded-control bg-inset p-3 shadow-hairline"><div><div className="text-[13px] font-medium">Customer has a trade-in</div><div className="text-[11px] text-ink-3">Capture it during intake.</div></div><Switch checked={data.tradeIn} onChange={v=>set("tradeIn",v)}/></div>
          {data.tradeIn&&<div className="grid gap-3 sm:grid-cols-2"><Field label="Year"><input className={fieldClass} value={data.tradeYear} onChange={e=>set("tradeYear",e.target.value)}/></Field><Field label="Make"><input className={fieldClass} value={data.tradeMake} onChange={e=>set("tradeMake",e.target.value)}/></Field><Field label="Model"><input className={fieldClass} value={data.tradeModel} onChange={e=>set("tradeModel",e.target.value)}/></Field><Field label="Mileage"><input className={fieldClass} value={data.tradeMileage} onChange={e=>set("tradeMileage",e.target.value)}/></Field><div className="sm:col-span-2"><Field label="VIN"><input className={fieldClass+" font-mono uppercase"} maxLength={17} value={data.tradeVin} onChange={e=>set("tradeVin",e.target.value.toUpperCase())}/></Field></div></div>}
          <div className="mt-4"><Field label="Notes"><textarea className={areaClass} value={data.notes} onChange={e=>set("notes",e.target.value)} placeholder="Timing, preferences, objections, next step…"/></Field></div>
        </Section>
        <div className="lg:col-span-2 flex justify-end">{status==="error"&&<span className="mr-3 self-center text-[12px] text-red">Could not save.</span>}<Button type="submit" variant="accent" disabled={!ready||status==="sending"}>{status==="sending"?"Saving…":"Save sales intake"} <ArrowRight width={16}/></Button></div>
      </div>}
    </form>
  </main>;
}
