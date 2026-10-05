import React,{useEffect,useState} from "react";
import {createRoot} from "react-dom/client";
import "./style.css";

type Opportunity={id:string;url:string;title:string|null;relevanceScore:number;policyScore:number;riskScore:number;status:string;reason:string|null;project:{name:string}};
type Draft={id:string;body:string;approved:boolean;includesLink:boolean};

const API=import.meta.env.VITE_API_URL??"http://localhost:4000";

function App(){
 const [items,setItems]=useState<Opportunity[]>([]);
 const [selected,setSelected]=useState<Opportunity|null>(null);
 const [drafts,setDrafts]=useState<Draft[]>([]);
 const load=()=>fetch(API+"/api/opportunities/top?limit=50").then(r=>r.json()).then(setItems);
 useEffect(()=>{load()},[]);
 const open=async(o:Opportunity)=>{setSelected(o);const r=await fetch(API+"/api/opportunities/"+o.id+"/content");setDrafts(await r.json())};
 const generate=async()=>{if(!selected)return;const r=await fetch(API+"/api/opportunities/"+selected.id+"/generate-content",{method:"POST"});const d=await r.json();setDrafts([d,...drafts])};
 const approve=async(id:string,approved:boolean)=>{await fetch(API+"/api/content/"+id+"/approval",{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({approved})});setDrafts(drafts.map(d=>d.id===id?{...d,approved}:d))};
 return <main><header><h1>Casino Outreach Agent</h1><button onClick={load}>Refresh</button></header>
 <section className="grid"><aside><h2>Opportunities</h2>{items.map(o=><button className={"card "+(selected?.id===o.id?"active":"")} onClick={()=>open(o)} key={o.id}><b>{o.title||o.url}</b><span>{o.relevanceScore}/100 · policy {o.policyScore} · risk {o.riskScore}</span><small>{o.status}</small></button>)}</aside>
 <article>{selected?<><h2>{selected.title||selected.url}</h2><a href={selected.url} target="_blank">{selected.url}</a><p>{selected.reason}</p><button onClick={generate}>Generate Draft</button>{drafts.map(d=><div className="draft" key={d.id}><pre>{d.body}</pre><div><button onClick={()=>approve(d.id,true)}>Approve</button><button onClick={()=>approve(d.id,false)}>Reject</button><span>{d.approved?"Approved":"Pending"}</span></div></div>)}</>:<p>Select an opportunity.</p>}</article></section></main>
}
createRoot(document.getElementById("root")!).render(<App/>);
