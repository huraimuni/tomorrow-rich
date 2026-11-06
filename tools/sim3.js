const {chromium}=require('playwright');
const tier=process.argv[2],runs=+process.argv[3]||60,batch=15,tag=process.argv[4]||'base';
(async()=>{
 const b=await chromium.launch();const all=[];
 for(let k=0;k<runs;k+=batch){
  const p=await (await b.newContext()).newPage();await p.route('**/fonts.g*/**',r=>r.abort());
  await p.goto('file://'+process.cwd()+'/sim.html');
  const r=await p.evaluate(({tier,batch,k})=>{
   const G=window.__G,res=[];
   const score=c=>{if(!c.outs)return -99;let cash=-(c.cost||0),h=0,ins=0,f=0;c.outs.forEach(o=>{cash+=o.p*((o.cash||0)+((o.ret!==undefined&&c.cost)?c.cost*o.ret:0));h+=o.p*(o.happy||0);ins+=o.p*(o.insight||0);f+=o.p*(o.fatigue||0)});return cash/150000+h*.25+ins*.5-f*.05};
   for(let s=0;s<batch;s++){
    G.newGame();const S=G.S();S.rs=7000+(k+s)*131;S.late=0;
    const bucket={};let guard=0,bro=0,hs=0,hn=0;
    const basket=tier==='expert'?['bankstk','cola','ent']:tier==='normal'?['gold','bankstk','cola']:[];
    if(tier!=='novice'){basket.forEach(id=>G.buyAsset(id,Math.round(S.cash*.12)));}
    while(S.day<361&&guard++<2000){
     if(S.pending){const e=G.evById(S.pending);let idx=0;
       if(e&&e.choice){
         if(tier==='novice')idx=Math.floor(Math.random()*e.choice.length);
         else if(tier==='normal'){let bc=1e18;e.choice.forEach((c,i)=>{const kk=c.cost||0;if(kk<bc&&kk<=S.cash){bc=kk;idx=i}})}
         else{let bs=-1e9;e.choice.forEach((c,i)=>{if((c.cost||0)>S.cash)return;const sc=score(c);if(sc>bs){bs=sc;idx=i}})}
       }
       try{G.resolveChoice(idx)}catch(x){}S.pending=null}
     S.rq.length=0;S.news.length=0;if(S.broke){bro=1;break;}
     if(tier==='novice')S.action=Math.random()<.7?'work':'rest';
     else S.action=(S.fatigue>=70||S.happy<30)?'rest':'work';
     if(tier!=='novice'&&S.day%7===0&&S.job!=='mgr'){['mgr','dev','office','sales'].forEach(j=>{if(S.job!==j&&G.JOBS.filter(x=>x.id===j)[0]){try{G.applyJob(j)}catch(x){}}});}
     if(tier==='expert'&&S.day%30===0&&S.cash>2500000){const m=Math.round((S.cash-1500000)/3);basket.forEach(id=>G.buyAsset(id,m));}
     if(tier!=='novice'&&S.day%30===0&&S.cash>4000000){const mv=S.cash-3000000;S.cash-=mv;S.deposit+=mv;}
     G.nextDay();hs+=S.happy;hn++;
     if([30,90,180,360].includes(S.day))bucket[S.day]=Math.round(G.net()/1e4);
    }
    res.push({b:bucket,bro,happy:Math.round(hs/Math.max(1,hn)),job:S.job,ins:S.insight});
   }
   return res;},{tier,batch,k}).catch(e=>[]);
  all.push(...r);await p.close();
 }
 await b.close();
 const q=(a,f)=>{a=a.slice().sort((x,y)=>x-y);return a.length?a[Math.floor((a.length-1)*f)]:null};
 const out={tier,n:all.length,broke:all.filter(r=>r.bro).length};
 [30,90,180,360].forEach(d=>{const v=all.map(r=>r.b[d]).filter(x=>x!==undefined);out['d'+d]=[q(v,.1),q(v,.5),q(v,.9)].join('/');});
 out.happy=Math.round(all.reduce((a,r)=>a+r.happy,0)/Math.max(1,all.length));
 const jobs={};all.forEach(r=>jobs[r.job]=(jobs[r.job]||0)+1);out.jobs=jobs;
 console.log(JSON.stringify(out));
 require('fs').writeFileSync('res_'+tag+'_'+tier+'.json',JSON.stringify(out));
})();
