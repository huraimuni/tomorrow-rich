const {chromium}=require('playwright');
(async()=>{
 const b=await chromium.launch();const p=await (await b.newContext()).newPage();await p.route('**/fonts.g*/**',r=>r.abort());
 await p.goto('file://'+process.cwd()+'/sim.html');
 const rows=await p.evaluate(()=>{
  const out=[];
  window.__G.EV.forEach(e=>{
   if(!e.choice)return;
   const cs=e.choice.map((c,i)=>{
     if(!c.outs)return {i,label:c.label,sc:null,cost:c.cost||0};
     let cash=-(c.cost||0),h=0,ins=0,f=0;
     c.outs.forEach(o=>{cash+=o.p*((o.cash||0)+((o.ret!==undefined&&c.cost)?c.cost*o.ret:0));h+=o.p*(o.happy||0);ins+=o.p*(o.insight||0);f+=o.p*(o.fatigue||0);});
     const sc=cash/150000+h*.25+ins*.5-f*.05;
     return {i,label:c.label,cash:Math.round(cash),h:+h.toFixed(1),ins:+ins.toFixed(1),sc:+sc.toFixed(2),cost:c.cost||0};
   });
   const ok=cs.filter(c=>c.sc!==null);
   const best=ok.reduce((a,c)=>!a||c.sc>a.sc?c:a,null);
   const flags=[];
   if(ok.length&&ok.every(c=>c.sc<0))flags.push('모든선택손해');
   if(ok.length>1&&best&&best.cost===Math.min(...ok.map(c=>c.cost)))flags.push('최저비용=최선');
   if(ok.length&&ok.every(c=>c.sc>=0))flags.push('모두이득');
   out.push({id:e.id,who:e.who,n:e.choice.length,flags,cs});
  });
  return out;});
 const sum={total:rows.length,allBad:rows.filter(r=>r.flags.includes('모든선택손해')).length,cheapBest:rows.filter(r=>r.flags.includes('최저비용=최선')).length,allGood:rows.filter(r=>r.flags.includes('모두이득')).length};
 console.log(JSON.stringify(sum));
 rows.filter(r=>r.flags.length).forEach(r=>console.log(r.id,r.flags.join(','),r.cs.map(c=>c.sc).join('/')));
 require('fs').writeFileSync('audit.json',JSON.stringify(rows));
 await b.close();})();
