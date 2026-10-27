/* Figuras interactivas del Módulo 7 (1) — apartados 1 y 2 */
(function(){"use strict";
const C=Curso,{num,numT,F,rgba,arrow,rrect,node,ease}=C;

// =====================================================================
// Figuras 1 y 3 · neurona biológica y artificial
// =====================================================================
C.define("bioneurona",function(host,opts,api){
  const mode=opts.mode||"bio";
  const [A]=C.panels(host,[{W:1040,H:380,aria:"Neurona biológica y neurona artificial con sus partes correspondientes"}]);
  const k=A.k,c=k.c;
  const PAIRS=[
    {k:"dend",bio:"Dendritas",art:"Entradas x₁,…,xₙ",txt:"Las dendritas reciben las señales de otras neuronas; en la neurona artificial son las entradas."},
    {k:"syn",bio:"Fuerza de cada sinapsis (excitatoria o inhibitoria)",art:"Pesos wᵢ (positivos o negativos)",txt:"Cada conexión tiene su propia fuerza: en la artificial, un peso que multiplica a su entrada."},
    {k:"soma",bio:"Integración de señales en el soma",art:"Suma ponderada",txt:"El soma reúne todas las señales; la neurona artificial las suma, cada una multiplicada por su peso."},
    {k:"umbral",bio:"Umbral de disparo",art:"Sesgo b y función de activación",txt:"Solo se dispara si se supera el umbral: en la artificial, lo deciden el sesgo y la función de activación."},
    {k:"axon",bio:"Axón",art:"Salida y",txt:"El axón transmite la señal de salida hacia otras neuronas."},
    {k:"learn",bio:"Refuerzo de las sinapsis",art:"Ajuste de los pesos (entrenamiento)",txt:"Aprender es cambiar la fuerza de las conexiones: en la red, ajustar los pesos durante el entrenamiento."}];
  let sel=mode==="bio"?null:"soma",hover=null,t=0,playing=true;
  // geometría fija de la neurona biológica
  const r0=C.rng(11);const SO={x:170,y:200,r:36};
  const dend=[];const angs=[118,148,172,196,222,248];
  angs.forEach((a,i)=>{const ang=a*Math.PI/180,len=78+r0()*26;const p0={x:SO.x+Math.cos(ang)*SO.r*.9,y:SO.y+Math.sin(ang)*SO.r*.9};const p1={x:SO.x+Math.cos(ang)*(SO.r+len),y:SO.y+Math.sin(ang)*(SO.r+len)};
    const subs=[];for(let s=0;s<2;s++){const at=.5+s*.25,b={x:p0.x+(p1.x-p0.x)*at,y:p0.y+(p1.y-p0.y)*at};const sa=ang+(s?-.55:.5),sl=26+r0()*16;subs.push({b,e:{x:b.x+Math.cos(sa)*sl,y:b.y+Math.sin(sa)*sl}})}
    const tips=[-.35,.35].map(d=>({x:p1.x+Math.cos(ang+d)*18,y:p1.y+Math.sin(ang+d)*18}));dend.push({p0,p1,subs,tips})});
  const AX={x0:SO.x+SO.r,x1:430,y:200};const TER=[{x:478,y:150},{x:490,y:180},{x:492,y:220},{x:478,y:250}];const JUN={x:452,y:200};
  // neurona artificial
  const IN=[{x:600,y:95,l:"x₁"},{x:600,y:165,l:"x₂"},{x:600,y:300,l:"xₙ"}],SUM={x:800,y:200,r:38},ACT={x:880,y:172,w:62,h:56},OUTX=1000;
  function glow(on,col){if(on){c.shadowColor=col;c.shadowBlur=18}else c.shadowBlur=0}
  function isOn(key){return sel===key||hover===key}
  function draw(){const P=api.pal();k.clear();const T=(t%3.6);
    const ph1=Math.min(1,T/1.3),ph2=Math.max(0,Math.min(1,(T-1.3)/.4)),ph3=Math.max(0,Math.min(1,(T-1.7)/1.3));
    const hl=P.orange;
    // separador
    c.strokeStyle=P.grid;c.setLineDash([4,6]);c.beginPath();c.moveTo(540,40);c.lineTo(540,340);c.stroke();c.setLineDash([]);
    // ---- dendritas
    const dOn=isOn("dend");
    dend.forEach(d=>{c.save();glow(dOn,hl);c.strokeStyle=dOn?hl:P.blue;c.lineCap="round";c.lineWidth=5;c.beginPath();c.moveTo(d.p0.x,d.p0.y);c.lineTo(d.p1.x,d.p1.y);c.stroke();
      c.lineWidth=2.6;d.subs.forEach(s=>{c.beginPath();c.moveTo(s.b.x,s.b.y);c.lineTo(s.e.x,s.e.y);c.stroke()});c.lineWidth=2;d.tips.forEach(tp=>{c.beginPath();c.moveTo(d.p1.x,d.p1.y);c.lineTo(tp.x,tp.y);c.stroke()});c.restore();
      if(playing&&ph1<1){const u=ease(ph1);const x=d.p1.x+(d.p0.x-d.p1.x)*u,y=d.p1.y+(d.p0.y-d.p1.y)*u;c.fillStyle=rgba(P.orange,.95);c.beginPath();c.arc(x,y,4.5,0,7);c.fill()}});
    // ---- axón
    const aOn=isOn("axon");c.save();glow(aOn,hl);c.strokeStyle=aOn?hl:P.blue;c.lineWidth=5;c.beginPath();c.moveTo(AX.x0,AX.y);c.lineTo(JUN.x,JUN.y);c.stroke();
    TER.forEach(tp=>{c.lineWidth=3;c.beginPath();c.moveTo(JUN.x,JUN.y);c.quadraticCurveTo(JUN.x+14,tp.y,tp.x,tp.y);c.stroke()});c.restore();
    for(let i=0;i<5;i++){const x=AX.x0+18+i*44;c.fillStyle=aOn?rgba(P.orange,.35):P.blue3;c.strokeStyle=aOn?hl:P.blue;c.lineWidth=1.5;rrect(c,x,AX.y-10,36,20,9);c.fill();c.stroke()}
    const sOn=isOn("syn")||isOn("learn");const big=isOn("learn")?1+.25*Math.sin(t*4)**2:1;
    TER.forEach(tp=>{c.save();glow(sOn,hl);c.fillStyle=sOn?hl:P.blue;c.beginPath();c.arc(tp.x,tp.y,7.5*big,0,7);c.fill();c.restore()});
    if(playing&&ph3>0&&ph3<1){const u=ease(ph3);const x=AX.x0+(JUN.x-AX.x0)*Math.min(1,u*1.25);c.fillStyle=P.orange;c.beginPath();c.arc(x,AX.y,6,0,7);c.fill();
      if(u>.8)TER.forEach(tp=>{const v=(u-.8)/.2;c.beginPath();c.arc(JUN.x+(tp.x-JUN.x)*v,JUN.y+(tp.y-JUN.y)*v,4,0,7);c.fill()})}
    // ---- soma
    const soOn=isOn("soma"),uOn=isOn("umbral");c.save();glow(soOn||ph2>0&&ph2<1,soOn?hl:P.orange);c.fillStyle=P.blue;c.beginPath();c.arc(SO.x,SO.y,SO.r,0,7);c.fill();c.restore();
    if(soOn){c.strokeStyle=hl;c.lineWidth=3;c.beginPath();c.arc(SO.x,SO.y,SO.r+3,0,7);c.stroke()}
    c.fillStyle=P.blue3;c.beginPath();c.arc(SO.x+2,SO.y,14,0,7);c.fill();
    if(uOn){c.save();glow(true,hl);c.strokeStyle=hl;c.lineWidth=4;c.beginPath();c.arc(SO.x,SO.y,SO.r+6,-.5,.5);c.stroke();c.restore()}
    // etiquetas bio
    c.fillStyle=P.text;c.font=`13px ${F.ui}`;c.textAlign="center";c.fillText("Dendritas",70,46);c.fillText("(entradas)",70,62);
    c.fillText("Axón (salida)",320,170);c.fillText("Sinapsis",480,112);
    c.strokeStyle=P.gray;c.lineWidth=1;c.beginPath();c.moveTo(SO.x+22,SO.y+28);c.lineTo(230,262);c.stroke();c.textAlign="left";c.fillText("Soma (integra las señales)",234,268);
    c.font=`700 15px ${F.ui}`;c.fillStyle=P.blue;c.textAlign="center";c.fillText("Neurona biológica",270,352);
    // ---- neurona artificial
    const artDim=mode==="bio"&&!sel&&!hover?0.55:1;c.globalAlpha=artDim;
    const iOn=isOn("dend"),wOn=isOn("syn")||isOn("learn");
    IN.forEach((p,i)=>{const end={x:SUM.x-SUM.r*.95,y:SUM.y+(i-1)*14};c.strokeStyle=wOn?hl:P.gray;c.lineWidth=wOn?(isOn("learn")?1.5+2.5*Math.abs(Math.sin(t*3+i)):2.4):1.6;arrow(c,p.x+22,p.y,end.x,end.y,wOn?hl:P.gray,c.lineWidth,10);
      c.fillStyle=wOn?hl:P.red;c.font=`italic 15px Georgia,serif`;c.textAlign="center";const mx=p.x+22+(end.x-p.x-22)*.45,my=p.y+(end.y-p.y)*.45-10;c.fillText(["w₁","w₂","wₙ"][i],mx,my);
      if(playing&&ph1<1){const u=ease(ph1);c.fillStyle=P.orange;c.beginPath();c.arc(p.x+22+(end.x-p.x-22)*u,p.y+(end.y-p.y)*u,4.5,0,7);c.fill()}});
    IN.forEach(p=>{c.save();glow(iOn,hl);node(c,p.x,p.y,22,P.node,iOn?hl:P.red,p.l,{tc:P.text,fs:16,italic:true,serif:true});c.restore()});
    c.fillStyle=P.text;c.font=`20px ${F.ui}`;c.textAlign="center";c.fillText("⋮",600,240);c.font=`13px ${F.ui}`;c.fillText("Entradas",600,342);
    c.save();glow(soOn||(ph2>0&&ph2<1),soOn?hl:P.orange);node(c,SUM.x,SUM.y,SUM.r,P.red,soOn?hl:P.red,"Σ",{fs:24});c.restore();
    c.fillStyle=uOn?hl:P.red;c.font=`italic 17px Georgia,serif`;c.fillText("+ b",SUM.x,96);arrow(c,SUM.x,104,SUM.x,SUM.y-SUM.r-4,uOn?hl:P.gray,1.6,9);
    c.save();glow(uOn,hl);c.fillStyle=P.node;c.strokeStyle=uOn?hl:P.red;c.lineWidth=2.4;rrect(c,ACT.x,ACT.y,ACT.w,ACT.h,10);c.fill();c.stroke();c.restore();
    c.strokeStyle=uOn?hl:P.red;c.lineWidth=2.2;c.beginPath();for(let i=0;i<=30;i++){const z=-6+12*i/30;const x=ACT.x+10+(ACT.w-20)*i/30,y=ACT.y+ACT.h-12-(ACT.h-24)/(1+Math.exp(-z));i?c.lineTo(x,y):c.moveTo(x,y)}c.stroke();
    arrow(c,SUM.x+SUM.r+4,SUM.y,ACT.x-4,SUM.y,P.gray,1.6,9);const oOn=isOn("axon");arrow(c,ACT.x+ACT.w+4,SUM.y,OUTX-16,SUM.y,oOn?hl:P.gray,oOn?3:1.6,10);
    c.fillStyle=oOn?hl:P.text;c.font=`italic 20px Georgia,serif`;c.fillText("y",OUTX,SUM.y+6);
    if(playing&&ph3>0&&ph3<1){const u=ease(ph3);const x=SUM.x+SUM.r+(OUTX-16-SUM.x-SUM.r)*u;c.fillStyle=P.orange;c.beginPath();c.arc(x,SUM.y,5.5,0,7);c.fill()}
    c.fillStyle=P.text;c.font=`13px ${F.ui}`;c.fillText("Suma",SUM.x,262);c.fillText("ponderada",SUM.x,278);c.fillText("Función de",ACT.x+ACT.w/2,262);c.fillText("activación",ACT.x+ACT.w/2,278);c.fillText("Salida",OUTX,226);
    c.font=`700 15px ${F.ui}`;c.fillStyle=P.red;c.fillText("Neurona artificial",800,352);c.globalAlpha=1;
  }
  // zonas sensibles
  function hit(p){if(Math.hypot(p.x-SO.x,p.y-SO.y)<SO.r+4)return "soma";if(p.x<SO.x-20&&p.x>10&&p.y>60&&p.y<330)return "dend";
    if(p.x>AX.x0&&p.x<JUN.x&&Math.abs(p.y-AX.y)<16)return "axon";if(p.x>JUN.x&&p.x<510&&p.y>130&&p.y<270)return "syn";
    if(Math.hypot(p.x-SUM.x,p.y-SUM.y)<SUM.r+4)return "soma";if(p.x>570&&p.x<630&&p.y>60&&p.y<330)return "dend";if(p.x>630&&p.x<SUM.x-SUM.r&&p.y>70&&p.y<320)return "syn";
    if((p.x>ACT.x-4&&p.x<ACT.x+ACT.w+4&&p.y>ACT.y-4&&p.y<ACT.y+ACT.h+4)||(Math.abs(p.x-SUM.x)<26&&p.y>80&&p.y<SUM.y-SUM.r))return "umbral";if(p.x>ACT.x+ACT.w&&p.x<1040&&Math.abs(p.y-SUM.y)<28)return "axon";return null}
  k.cv.addEventListener("pointermove",e=>{const h=hit(k.ptr(e));if(h!==hover){hover=h;k.cv.style.cursor=h?"pointer":"default";upd();lp.kick()}});
  k.cv.addEventListener("pointerleave",()=>{hover=null;upd();lp.kick()});
  k.cv.addEventListener("click",e=>{const h=hit(k.ptr(e));sel=h&&sel!==h?h:(h?null:sel);upd();lp.kick()});
  const row=C.ctlRow(host);const g=C.group(row,"Correspondencia");
  const setSel=C.seg(g,PAIRS.map(p=>[p.k,p.bio.split(" (")[0].replace("Fuerza de cada sinapsis","Sinapsis").replace("Integración de señales en el soma","Soma")]),kk=>{sel=sel===kk?null:kk;upd();lp.kick()});
  const g2=C.group(row);const pb=C.button(g2,"❚❚ Pausa",()=>{playing=!playing;pb.textContent=playing?"❚❚ Pausa":"▶ Animar";if(playing)lp.start();else lp.kick()});
  const rd=C.readout(host);
  function upd(){setSel(sel);const p=PAIRS.find(x=>x.k===(hover||sel));rd.innerHTML=p?`<b>${p.bio}</b> ↔ <b>${p.art}</b>. ${p.txt}`:(mode==="bio"?"La señal entra por las dendritas, se integra en el soma y sale por el axón. Pasa el ratón por cada parte, o pulsa los botones, para ver su equivalente en la neurona artificial.":"Pulsa una parte de cualquiera de las dos neuronas para ver su equivalente.")}
  C.hint(host,"Pasa el ratón o pulsa sobre las partes de cada neurona.");
  const lp=C.loop(api,dt=>{if(playing)t+=dt;draw();return playing||!!(sel==="learn"||hover==="learn")});
  api.onTheme(()=>lp.kick());upd();lp.start();
});

// =====================================================================
// Figura 2 · sinapsis (a) y balance de señales (b)
// =====================================================================
C.define("sinapsis",function(host,opts,api){
  const [A,B]=C.panels(host,[{W:520,H:350,sub:"(a) Comunicación en la sinapsis"},{W:520,H:350,sub:"(b) Balance de señales y umbral"}]);
  let t=0,firing=0;const vals=[0.8,0.5,-0.6,0.7,-0.2];let shown=[...vals],thr=1.0,drag=-1;
  const r=C.rng(5);const ves=[...Array(5)].map((_,i)=>({x:118+(i%3)*24+(i>2?12:0),y:150+Math.floor(i/3)*30+(i===4?-60:0),ph:r()*6}));ves[3].y=124;ves[4].x=140;ves[4].y=196;
  const nts=[...Array(16)].map(()=>({a:r(),b:r(),c:r()}));
  function drawA(){const k=A.k,c=k.c,P=api.pal();k.clear();const T=t%3.4;
    const imp=Math.min(1,T/1.0),rel=Math.max(0,Math.min(1,(T-1.0)/1.2)),bind=Math.max(0,Math.min(1,(T-2.0)/.8));
    // axón
    c.strokeStyle=P.blue;c.lineWidth=12;c.lineCap="round";c.beginPath();c.moveTo(20,170);c.lineTo(100,170);c.stroke();
    c.fillStyle=P.text;c.font=`13px ${F.ui}`;c.textAlign="left";c.fillText("Impulso eléctrico",12,120);arrow(c,22,132,96,132,P.gray,1.6,9);
    if(imp<1){c.fillStyle=P.orange;c.beginPath();c.arc(20+imp*110,170,8,0,7);c.fill();c.fillStyle=rgba(P.orange,.25);c.beginPath();c.arc(20+imp*110,170,15,0,7);c.fill()}
    // terminal
    c.save();if(imp>=1&&rel<1){c.shadowColor=P.orange;c.shadowBlur=16}c.fillStyle=P.blue;c.beginPath();c.ellipse(150,170,52,62,0,0,7);c.fill();c.restore();
    ves.forEach((v,i)=>{const mv=rel>0?Math.min(1,rel*1.6):0;const x=v.x+(198-v.x)*mv*(i%2?0.7:1)*0.6,y=v.y;c.fillStyle=P.blue3;c.strokeStyle=P.bg;c.lineWidth=1.5;c.beginPath();c.arc(x,y,11,0,7);c.fill();c.stroke();
      c.fillStyle=P.ocre;for(let j=0;j<3;j++){c.beginPath();c.arc(x-4+j*4,y+(j%2?3:-2),2.2,0,7);c.fill()}});
    // dendrita receptora
    c.save();if(bind>0){c.shadowColor=P.orange;c.shadowBlur=22*bind}c.fillStyle=P.blue2;rrect(c,236,92,120,156,30);c.fill();c.restore();
    const rec=[110,140,170,200];rec.forEach((y,i)=>{c.fillStyle=bind>0&&i<4?P.orange:P.red;c.fillRect(229,y,12,12)});
    // neurotransmisores
    if(rel>0){nts.forEach((n,i)=>{const u=Math.min(1,rel*1.1+n.c*.2);const y0=150+n.a*40,yt=rec[i%4]+6;const x=204+(233-204)*u+Math.sin(t*7+i)*2*(1-u),y=y0+(yt-y0)*u+Math.cos(t*5+i)*3*(1-u);
      if(bind<1||u<1){c.fillStyle=P.ocre;c.beginPath();c.arc(x,y,3,0,7);c.fill()}})}
    c.fillStyle=P.ocre;c.font=`13px ${F.ui}`;c.textAlign="center";c.fillText("Neurotransmisores",190,46);c.strokeStyle=P.ocre;c.lineWidth=1;c.beginPath();c.moveTo(190,52);c.lineTo(205,140);c.stroke();
    c.fillStyle=P.red;c.fillText("Receptores",300,46);c.strokeStyle=P.red;c.beginPath();c.moveTo(290,52);c.lineTo(240,108);c.stroke();
    c.fillStyle=P.text;c.fillText("Terminal del axón",150,262);c.fillText("(neurona emisora)",150,278);c.fillText("Dendrita",296,268);c.fillText("(neurona receptora)",296,284);
    c.fillText("Hendidura sináptica",210,318);c.strokeStyle=P.gray;c.beginPath();c.moveTo(212,304);c.lineTo(214,232);c.stroke();
    const step=imp<1?"1 · Llega el potencial de acción por el axón":rel<1?"2 · Se liberan neurotransmisores en la hendidura":"3 · Activan los receptores de la neurona siguiente";
    c.fillStyle=P.muted;c.font=`600 12px ${F.ui}`;c.textAlign="left";c.fillText(step,12,22);
  }
  const PB={x0:56,y0:40,x1:504,y1:300};
  function drawB(){const k=B.k,c=k.c,P=api.pal();k.clear();
    const pl=new C.Plot(k,[PB.x0,PB.y0,PB.x1,PB.y1],{xr:[0,7],yr:[-1.1,1.6]});
    c.strokeStyle=P.axis;c.lineWidth=1.2;c.beginPath();c.moveTo(PB.x0,pl.Y(0));c.lineTo(PB.x1,pl.Y(0));c.stroke();
    const tot=shown.reduce((a,b)=>a+b,0);const fire=vals.reduce((a,b)=>a+b,0)>thr;
    shown.forEach((v,i)=>{const x=pl.X(i+0.75),w=34;c.fillStyle=v>=0?P.green:P.red;const y0=pl.Y(0),y1=pl.Y(v);c.fillRect(x-w/2,Math.min(y0,y1),w,Math.abs(y1-y0));
      c.fillStyle=P.text;c.font=`13px ${F.ui}`;c.textAlign="center";c.fillText("S"+(i+1),x,PB.y1+22);c.font=`600 12px ${F.mono}`;c.fillText(num(vals[i],1),x,v>=0?y1-8:y1+16);
      if(drag===i){c.strokeStyle=P.orange;c.lineWidth=2;c.strokeRect(x-w/2-3,Math.min(y0,y1)-3,w+6,Math.abs(y1-y0)+6)}});
    const xt=pl.X(6.3);c.save();if(fire){c.shadowColor=P.blue;c.shadowBlur=14+8*Math.sin(t*6)}c.fillStyle=P.blue;const y1=pl.Y(tot),y0=pl.Y(0);c.fillRect(xt-28,Math.min(y0,y1),56,Math.abs(y1-y0));c.restore();
    c.fillStyle=P.text;c.font=`13px ${F.ui}`;c.textAlign="center";c.fillText("Total",xt,PB.y1+22);c.font=`700 12.5px ${F.mono}`;c.fillText(num(tot,1),xt,tot>=0?y1-8:y1+16);
    c.setLineDash([7,5]);c.strokeStyle=P.ink;c.lineWidth=1.6;c.beginPath();c.moveTo(PB.x0,pl.Y(thr));c.lineTo(PB.x1,pl.Y(thr));c.stroke();c.setLineDash([]);
    c.fillStyle=P.text;c.textAlign="left";c.fillText("Umbral",PB.x0+250,pl.Y(thr)-7);
    C.legend(c,[{type:"box",color:P.green,label:"Excitatoria (empuja a disparar)"},{type:"box",color:P.red,label:"Inhibitoria (frena el disparo)"}],PB.x0+6,16,{lh:19});
    c.font=`700 13.5px ${F.ui}`;c.textAlign="center";c.fillStyle=fire?P.blue:P.muted;c.fillText(fire?"Total > umbral: la neurona dispara":"Total ≤ umbral: la neurona no dispara",pl.X(3.4),PB.y1-8+0);
  }
  const lp=C.loop(api,dt=>{t+=dt;let moving=false;for(let i=0;i<5;i++){const d=vals[i]-shown[i];if(Math.abs(d)>1e-3){shown[i]+=d*Math.min(1,dt*12);moving=true}}drawA();drawB();return true});
  // arrastrar las barras
  const pl=()=>new C.Plot(B.k,[PB.x0,PB.y0,PB.x1,PB.y1],{xr:[0,7],yr:[-1.1,1.6]});
  B.k.cv.addEventListener("pointerdown",e=>{const p=B.k.ptr(e),P_=pl();for(let i=0;i<5;i++){if(Math.abs(p.x-P_.X(i+0.75))<24){drag=i;B.k.cv.setPointerCapture(e.pointerId);setV(p);break}}});
  function setV(p){const v=Math.round(Math.max(-1,Math.min(1,pl().iY(p.y)))*10)/10;vals[drag]=v;upd()}
  B.k.cv.addEventListener("pointermove",e=>{const p=B.k.ptr(e);if(drag>=0)setV(p);else{const P_=pl();B.k.cv.style.cursor=[0,1,2,3,4].some(i=>Math.abs(p.x-P_.X(i+0.75))<24)?"ns-resize":"default"}});
  B.k.cv.addEventListener("pointerup",()=>{drag=-1});
  const row=C.ctlRow(host);const g=C.group(row,"Sinapsis");C.button(g,"Enviar otro impulso",()=>{t=0});
  const sl=C.slider(row,"Umbral",0.2,2.5,0.1,thr,v=>{thr=v;upd()},v=>num(v,1));
  const g2=C.group(row,"Casos");C.button(g2,"Señales del ejemplo",()=>{[0.8,0.5,-0.6,0.7,-0.2].forEach((v,i)=>vals[i]=v);thr=1;sl.set(1);upd()});C.button(g2,"Más inhibición",()=>{[0.8,0.5,-0.9,0.4,-0.6].forEach((v,i)=>vals[i]=v);upd()});
  const rd=C.readout(host);
  function upd(){const tot=vals.reduce((a,b)=>a+b,0);rd.innerHTML=`Suma de las señales: ${vals.map((v,i)=>(i&&v>=0?"+ ":"")+num(v,1).replace("−","− ")).join(" ")} = <b>${num(tot,1)}</b>. ${tot>thr?`Supera el umbral (${num(thr,1)}): <b>la neurona dispara</b>.`:`No supera el umbral (${num(thr,1)}): la neurona permanece en reposo.`}`}
  C.hint(host,"Arrastra las barras S1–S5 hacia arriba o hacia abajo para cambiar cada señal.");
  api.onTheme(()=>lp.kick());upd();lp.start();
});

// =====================================================================
// Figura 4 · una neurona (a) y una red multicapa (b)
// =====================================================================
C.define("neurona-red",function(host,opts,api){
  const [A,B]=C.panels(host,[{W:500,H:320,sub:"(a) Una neurona"},{W:540,H:320,sub:"(b) Red neuronal multicapa"}]);
  const x=[1,1,1],w=[4,3,-2],b=-4;let t=0,fw=-1;
  const sizes=[3,4,4,1];const r=C.rng(21),gs=C.gauss(r);const Wn=[];for(let l=0;l<3;l++){Wn.push([...Array(sizes[l+1])].map(()=>[...Array(sizes[l])].map(()=>gs()*1.1)))}
  let xin=[0.9,0.2,0.6];
  const sig=z=>1/(1+Math.exp(-z));
  function fwd(){const acts=[xin];for(let l=0;l<3;l++){const a=acts[l];acts.push(Wn[l].map((row,j)=>{const z=row.reduce((s,wi,i)=>s+wi*a[i],0)+(l===2?0:0.1*j-0.1);return sig(z)}))}return acts}
  const XS=[{x:70,y:80},{x:70,y:160},{x:70,y:240}],S={x:230,y:160};
  function drawA(){const k=A.k,c=k.c,P=api.pal();k.clear();const z=w.reduce((s,wi,i)=>s+wi*x[i],0)+b,p=sig(z);
    XS.forEach((q,i)=>{arrow(c,q.x+24,q.y,S.x-34,S.y+(i-1)*10,P.gray,1.5+Math.abs(w[i])*.45,10);c.fillStyle=w[i]>=0?P.blue:P.red;c.font=`600 12px ${F.mono}`;c.textAlign="center";c.fillText((w[i]>0?"+":"")+num(w[i],0).replace("−","−"),q.x+70,q.y+(S.y-q.y)*.42-8)});
    XS.forEach((q,i)=>node(c,q.x,q.y,24,x[i]?C.mix(api.pal().node,P.blue3,.6):P.node,P.green,["x₁","x₂","x₃"][i],{tc:P.text,fs:17,italic:true,serif:true}));
    XS.forEach((q,i)=>{c.fillStyle=P.muted;c.font=`12px ${F.mono}`;c.textAlign="right";c.fillText("= "+x[i],q.x-30,q.y+4)});
    node(c,S.x,S.y,34,P.red,P.red,"Σ",{fs:22});c.fillStyle=P.muted;c.font=`12px ${F.mono}`;c.textAlign="center";c.fillText("b = −4",S.x,S.y+52);c.fillText("z = "+num(z,0),S.x,S.y-44);
    arrow(c,S.x+36,S.y,316,S.y,P.gray,1.6,9);c.fillStyle=P.node;c.strokeStyle=P.green;c.lineWidth=2.2;rrect(c,320,134,58,52,10);c.fill();c.stroke();
    c.strokeStyle=P.green;c.lineWidth=2.2;c.beginPath();for(let i=0;i<=30;i++){const zz=-6+12*i/30;const xx=328+42*i/30,yy=176-32*sig(zz);i?c.lineTo(xx,yy):c.moveTo(xx,yy)}c.stroke();
    const zz=Math.max(-6,Math.min(6,z));c.fillStyle=P.orange;c.beginPath();c.arc(328+42*(zz+6)/12,176-32*sig(zz),4,0,7);c.fill();
    c.fillStyle=P.muted;c.font=`12px ${F.ui}`;c.fillText("sigmoide",349,206);arrow(c,382,S.y,428,S.y,P.gray,1.6,9);
    c.fillStyle=P.text;c.font=`italic 19px Georgia,serif`;c.fillText("p",446,S.y+6);c.font=`700 15px ${F.mono}`;c.fillStyle=P.orange;c.fillText(num(p,2),446,S.y+32);
    c.fillStyle=P.muted;c.font=`12px ${F.ui}`;c.textAlign="left";c.fillText("Pulsa una entrada para cambiarla",16,302)}
  function drawB(){const k=B.k,c=k.c,P=api.pal();k.clear();const acts=fwd();const xs=[60,200,340,470];const pos=sizes.map((n,l)=>[...Array(n)].map((_,i)=>({x:xs[l],y:160+(i-(n-1)/2)*62})));
    for(let l=0;l<3;l++)pos[l].forEach((p,i)=>pos[l+1].forEach((q,j)=>{const lit=fw>=0&&fw>l&&fw<l+1.999;const wv=Wn[l][j][i];c.strokeStyle=lit?rgba(wv>0?P.blue:P.red,.25+.55*Math.min(1,Math.abs(wv)/1.5)):P.lgray;c.lineWidth=lit?1+Math.abs(wv):1;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(q.x,q.y);c.stroke();
      if(fw>l&&fw<l+1){const u=fw-l;c.fillStyle=P.orange;c.beginPath();c.arc(p.x+(q.x-p.x)*u,p.y+(q.y-p.y)*u,2.6,0,7);c.fill()}}));
    pos.forEach((col,l)=>col.forEach((p,i)=>{const a=acts[l][i];const on=fw<0||fw>=l;const face=l===0?P.node:(l===3?P.green:P.red);const shade=on&&l>0?C.mix(P.node,face,.35+.65*Math.min(1,a)):(l===0?P.node:C.mix(P.node,face,.35));
      node(c,p.x,p.y,18,shade,l===0?P.blue:face,"",{});if(on&&l>0||l===0){c.fillStyle=l===0?P.text:"#fff";c.font=`600 10.5px ${F.mono}`;c.textAlign="center";c.fillText(num(a,2),p.x,p.y+4)}}));
    c.fillStyle=P.text;c.font=`13px ${F.ui}`;c.textAlign="center";c.fillText("Entrada",60,40);c.fillText("Capas ocultas",270,30);c.fillText("Salida",470,110)}
  const lp=C.loop(api,dt=>{t+=dt;if(fw>=0){fw+=dt*1.2;if(fw>=3.2)fw=-1}drawA();drawB();return fw>=0});
  A.k.cv.addEventListener("click",e=>{const p=A.k.ptr(e);XS.forEach((q,i)=>{if(Math.hypot(p.x-q.x,p.y-q.y)<28){x[i]=1-x[i];upd();lp.kick()}})});
  A.k.cv.addEventListener("pointermove",e=>{const p=A.k.ptr(e);A.k.cv.style.cursor=XS.some(q=>Math.hypot(p.x-q.x,p.y-q.y)<28)?"pointer":"default"});
  const row=C.ctlRow(host);const g=C.group(row,"Red multicapa");C.button(g,"▶ Propagar hacia delante",()=>{fw=0;lp.start()},{primary:true});C.button(g,"Otro ejemplo",()=>{const rr=Math.random;xin=[rr(),rr(),rr()];fw=0;lp.start()});
  const rd=C.readout(host);function upd(){const z=w.reduce((s,wi,i)=>s+wi*x[i],0)+b;rd.innerHTML=`Neurona del correo: z = ${num(z,0)} y la sigmoide da <b>p = ${num(1/(1+Math.exp(-z)),2)}</b>. La red de la derecha repite el mismo cálculo en cada neurona, capa a capa.`}
  C.hint(host,"Pulsa las entradas de la neurona o propaga un ejemplo por la red.");
  api.onTheme(()=>lp.kick());upd();lp.kick();
});

// =====================================================================
// Figura 5 · línea de tiempo
// =====================================================================
C.define("hitos",function(host,opts,api){
  const [A]=C.panels(host,[{W:1040,H:300}]);const k=A.k,c=k.c;
  const H=[{y:1943,t:"Primer modelo\nde neurona\n(McCulloch y Pitts)",up:true,d:"Primer modelo matemático de neurona: recibir señales, combinarlas y activarse si superan un umbral."},
    {y:1958,t:"Perceptrón\n(Rosenblatt)",up:false,d:"El perceptrón añade una regla para aprender los pesos a partir de ejemplos."},
    {y:1969,t:"Límites del\nperceptrón\n(Minsky y Papert)",up:true,d:"Minsky y Papert demuestran sus limitaciones y el interés se desploma."},
    {y:1986,t:"Backpropagation\n(Rumelhart, Hinton\ny Williams)",up:false,d:"La retropropagación permite entrenar redes de varias capas."},
    {y:1998,t:"Lectura de cheques\ncon redes (LeCun)",up:true,d:"Una aplicación real: lectura automática de cheques con redes neuronales."},
    {y:2012,t:"AlexNet: arranca\nel deep learning",up:false,red:true,d:"La red AlexNet arrasa en la competición de reconocimiento de imágenes ImageNet."},
    {y:2017,t:"Transformer",up:true,red:true,d:"La arquitectura de los modelos de lenguaje actuales."},
    {y:2022,t:"ChatGPT",up:false,red:true,d:"Los modelos de lenguaje llegan al gran público."},
    {y:2024,t:"Nobel de Física\n(Hopfield y Hinton)",up:true,red:true,lift:44,d:"El Nobel de Física de 2024 reconoce a Hopfield y Hinton."}];
  const X=y=>40+(y-1940)/(2027-1940)*960,YL=150;let sel=null,hov=null,t=0,intro=0;
  function draw(){const P=api.pal();k.clear();const prog=ease(Math.min(1,intro));
    [[1969,1986,"Pérdida de interés"],[1998,2012,"Otros métodos dominan"]].forEach(([a,b,l])=>{c.fillStyle=P.shade;c.fillRect(X(a),YL-34,X(b)-X(a),68);c.fillStyle=P.muted;c.font=`italic 13px ${F.ui}`;c.textAlign="center";c.fillText(l,(X(a)+X(b))/2,YL+26)});
    c.strokeStyle=P.ink;c.lineWidth=2;c.beginPath();c.moveTo(20,YL);c.lineTo(20+(1020-20)*prog,YL);c.stroke();
    H.forEach((h,i)=>{const x=X(h.y);const vis=prog>=(x-20)/1000;if(!vis)return;const on=sel===i||hov===i;const col=h.red?P.red:P.blue;
      const yy=h.up?YL-46-(h.lift||0):YL+46;c.strokeStyle=P.gray;c.lineWidth=1.2;c.beginPath();c.moveTo(x,YL);c.lineTo(x,yy+(h.up?0:0));c.stroke();
      c.save();if(on){c.shadowColor=col;c.shadowBlur=16}c.fillStyle=col;c.beginPath();c.arc(x,YL,on?10:7,0,7);c.fill();c.restore();
      c.fillStyle=col;c.font=`700 ${on?16:15}px ${F.ui}`;c.textAlign="center";
      const lines=h.t.split("\n");if(h.up){c.fillText(h.y,x,yy-8);c.fillStyle=on?P.text:P.text;c.font=`${on?600:400} 12.5px ${F.ui}`;lines.forEach((l,j)=>c.fillText(l,x,yy-26-(lines.length-1-j)*15))}
      else{c.fillText(h.y,x,yy+18);c.font=`${on?600:400} 12.5px ${F.ui}`;c.fillStyle=P.text;lines.forEach((l,j)=>c.fillText(l,x,yy+38+j*15))}});
  }
  const lp=C.loop(api,dt=>{t+=dt;if(intro<1)intro+=dt*.7;draw();return intro<1});
  function hit(p){let best=-1,bd=40;H.forEach((h,i)=>{const d=Math.abs(p.x-X(h.y));if(d<bd&&p.y>20&&p.y<290){bd=d;best=i}});return best<0?null:best}
  k.cv.addEventListener("pointermove",e=>{const h=hit(k.ptr(e));if(h!==hov){hov=h;k.cv.style.cursor=h!==null?"pointer":"default";upd();lp.kick()}});
  k.cv.addEventListener("pointerleave",()=>{hov=null;upd();lp.kick()});
  k.cv.addEventListener("click",e=>{sel=hit(k.ptr(e));upd();lp.kick()});
  const row=C.ctlRow(host);const g=C.group(row);C.button(g,"◀",()=>{sel=sel===null?0:Math.max(0,sel-1);upd();lp.kick()});C.button(g,"▶ Siguiente hito",()=>{sel=sel===null?0:Math.min(H.length-1,sel+1);upd();lp.kick()});C.button(g,"Repetir animación",()=>{intro=0;lp.start()});
  const rd=C.readout(host);function upd(){const i=hov!==null?hov:sel;rd.innerHTML=i===null?"Etapas de entusiasmo y de abandono: pasa el ratón por cada hito.":`<b>${H[i].y}</b> · ${H[i].t.replace(/\n/g," ")}. ${H[i].d}`}
  api.onTheme(()=>lp.kick());upd();lp.start();
});

// =====================================================================
// Figura 6 · los tres factores
// =====================================================================
C.define("factores",function(host,opts,api){
  const [A]=C.panels(host,[{W:1040,H:250}]);const k=A.k,c=k.c;const on=[true,true,true];let t=0,lit=1;
  const BX=[{x:20,col:"blue",t:"Datos masivos",d:"Millones de ejemplos\npara ajustar los pesos"},{x:270,col:"ocre",t:"Cómputo (GPU)",d:"Miles de operaciones\nen paralelo"},{x:520,col:"green",t:"Algoritmos y software",d:"ReLU, mejores técnicas,\nTensorFlow y PyTorch"}];
  function icon(i,x,y,col,P){c.save();if(i===0){[0,1,2].forEach(j=>{c.fillStyle=j===0?col:P.blue3;c.strokeStyle=col;c.lineWidth=1.6;c.beginPath();c.ellipse(x,y-14+j*14,30,9,0,0,7);c.fill();c.stroke()})}
    else if(i===1){c.fillStyle=col;c.fillRect(x-24,y-24,48,48);c.strokeStyle=col;c.lineWidth=2;for(let j=0;j<5;j++){[-1,1].forEach(s=>{c.beginPath();c.moveTo(x-18+j*9,y+s*24);c.lineTo(x-18+j*9,y+s*31);c.stroke();c.beginPath();c.moveTo(x+s*24,y-18+j*9);c.lineTo(x+s*31,y-18+j*9);c.stroke()})}
      c.fillStyle="#fff";c.font=`700 12px ${F.ui}`;c.textAlign="center";c.textBaseline="middle";c.fillText("GPU",x,y);c.textBaseline="alphabetic"}
    else{c.fillStyle=col;c.font=`22px ${F.mono}`;c.textAlign="center";c.fillText("{ f(x) }",x,y+8)}c.restore()}
  function draw(){const P=api.pal();k.clear();const all=on.every(v=>v);
    BX.forEach((b,i)=>{const col=P[b.col];c.globalAlpha=on[i]?1:.3;c.fillStyle=P.bg;c.strokeStyle=col;c.lineWidth=3;rrect(c,b.x,30,200,170,18);c.fill();c.stroke();
      c.fillStyle=col;c.font=`700 16px ${F.ui}`;c.textAlign="center";c.fillText(b.t,b.x+100,60);icon(i,b.x+100,112,col,P);c.fillStyle=P.text;c.font=`13px ${F.ui}`;b.d.split("\n").forEach((l,j)=>c.fillText(l,b.x+100,158+j*16));
      if(!on[i]){c.fillStyle=P.muted;c.font=`600 12px ${F.ui}`;c.fillText("(sin este factor)",b.x+100,192)}c.globalAlpha=1;
      if(i<2){c.fillStyle=P.gray;c.font=`26px ${F.ui}`;c.fillText("+",b.x+225,124)}});
    arrow(c,735,115,790,115,P.gray,3,12);
    const g=all?ease(Math.min(1,lit)):0;c.save();if(all){c.shadowColor=P.red;c.shadowBlur=10+14*Math.abs(Math.sin(t*2))}c.fillStyle=all?P.red:P.lgray;rrect(c,800,60,220,110,18);c.fill();c.restore();
    c.fillStyle="#fff";c.font=`700 16px ${F.ui}`;c.textAlign="center";(all?["Despegue del","deep learning","(2012 →)"]:["Sin despegue:","falta un","ingrediente"]).forEach((l,j)=>c.fillText(l,910,98+j*20));
    if(all){for(let j=0;j<6;j++){const a=t*1.5+j;c.fillStyle=rgba(P.orange,.6*(1-((a%1))));c.beginPath();c.arc(910+Math.cos(j)*130*((a%1)),115-Math.sin(j*1.7)*70*((a%1)),3,0,7);c.fill()}}}
  const lp=C.loop(api,dt=>{t+=dt;lit+=dt;draw();return on.every(v=>v)});
  const row=C.ctlRow(host);const g=C.group(row,"Ingredientes");BX.forEach((b,i)=>C.toggle(g,b.t,true,v=>{on[i]=v;lit=0;upd();lp.start()}));
  const rd=C.readout(host);function upd(){const off=BX.filter((b,i)=>!on[i]).map(b=>b.t.toLowerCase());rd.innerHTML=off.length?`Sin ${off.join(" ni ")} no hay despegue: las ideas existían desde los años ochenta, pero hacían falta los tres ingredientes a la vez.`:"Con los tres ingredientes a la vez, el deep learning despega a partir de 2012."}
  C.hint(host,"Desactiva cualquiera de los tres factores.");api.onTheme(()=>lp.kick());upd();lp.start();
});

// =====================================================================
// Figura 7 · modelo clásico o red neuronal
// =====================================================================
C.define("regla-practica",function(host,opts,api){
  const [A]=C.panels(host,[{W:1040,H:250}]);const k=A.k,c=k.c;let pick=null,t=0;
  const TIPOS=[["tab","Tabla de clientes"],["img","Imágenes"],["txt","Texto"],["aud","Audio"]];
  function draw(){const P=api.pal();k.clear();const left=pick==="tab",right=pick&&pick!=="tab";
    c.fillStyle=P.blue;c.font=`700 16px ${F.ui}`;c.textAlign="center";c.fillText("Datos tabulares",190,30);c.fillStyle=P.red;c.fillText("Datos no estructurados",700,30);
    c.strokeStyle=P.lgray;c.setLineDash([5,6]);c.beginPath();c.moveTo(460,20);c.lineTo(460,230);c.stroke();c.setLineDash([]);
    c.globalAlpha=right?.35:1;for(let i=0;i<4;i++)for(let j=0;j<4;j++){c.fillStyle=i===0?P.blue:((i%2)?C.mix(P.bg,P.fillb,.7):P.bg);c.strokeStyle=P.blue;c.lineWidth=1;c.fillRect(70+j*52,50+i*28,52,28);c.strokeRect(70+j*52,50+i*28,52,28)}
    c.fillStyle=P.text;c.font=`13px ${F.ui}`;c.fillText("Clientes, transacciones, pedidos…",190,200);c.globalAlpha=1;
    arrow(c,300,105,350,105,left?P.orange:P.gray,left?3:2,11);c.save();if(left){c.shadowColor=P.blue;c.shadowBlur=18}c.fillStyle=P.blue;rrect(c,354,72,92,66,14);c.fill();c.restore();c.fillStyle="#fff";c.font=`700 13px ${F.ui}`;c.fillText("Modelos",400,101);c.fillText("clásicos",400,118);
    c.globalAlpha=left?.35:1;const ox=530;c.strokeStyle=P.red;c.lineWidth=2;c.fillStyle=C.mix(P.bg,P.fillb,.6);c.fillRect(ox,70,66,56);c.strokeRect(ox,70,66,56);c.fillStyle=P.red;c.beginPath();c.moveTo(ox+6,120);c.lineTo(ox+30,90);c.lineTo(ox+44,104);c.lineTo(ox+60,120);c.closePath();c.fill();c.fillStyle=P.ocre;c.beginPath();c.arc(ox+48,84,6,0,7);c.fill();
    c.strokeStyle=P.red;c.lineWidth=4;[0,1,2,3].forEach(j=>{c.beginPath();c.moveTo(ox+90,78+j*13);c.lineTo(ox+150-(j===3?20:0),78+j*13);c.stroke()});
    c.lineWidth=2.4;c.beginPath();for(let i=0;i<=60;i++){const xx=ox+170+i;const yy=98+Math.sin(i/3.2)*16*Math.exp(-(((i-30)/18)**2));i?c.lineTo(xx,yy):c.moveTo(xx,yy)}c.stroke();
    c.fillStyle=P.text;c.font=`13px ${F.ui}`;c.fillText("Imágenes, texto, audio, vídeo",ox+115,200);c.globalAlpha=1;
    arrow(c,ox+240,105,ox+290,105,right?P.orange:P.gray,right?3:2,11);c.save();if(right){c.shadowColor=P.red;c.shadowBlur=18}c.fillStyle=P.red;rrect(c,ox+294,72,100,66,14);c.fill();c.restore();c.fillStyle="#fff";c.font=`700 13px ${F.ui}`;c.fillText("Redes",ox+344,101);c.fillText("neuronales",ox+344,118);
    if(pick){c.fillStyle=P.orange;c.font=`700 13px ${F.ui}`;c.fillText("▲",pick==="tab"?190:({img:563,txt:640,aud:730})[pick],170)}}
  const lp=C.loop(api,dt=>{t+=dt;draw();return false});
  const row=C.ctlRow(host);const g=C.group(row,"¿Qué datos tienes?");const set=C.seg(g,TIPOS,kk=>{pick=pick===kk?null:kk;set(pick);upd();lp.kick()});
  const rd=C.readout(host);function upd(){rd.innerHTML=!pick?"Elige un tipo de dato para ver qué recomienda la regla práctica.":pick==="tab"?"<b>Datos tabulares:</b> empezar por un modelo clásico (random forest, gradient boosting) y recurrir a una red solo si mejora claramente.":"<b>Datos no estructurados:</b> las redes neuronales son la referencia."}
  api.onTheme(()=>lp.kick());upd();lp.kick();
});

// =====================================================================
// Figura 8 · función escalón (a) y frontera AND (b)
// =====================================================================
C.define("escalon-and",function(host,opts,api){
  const [A,B]=C.panels(host,[{W:500,H:330,sub:"(a) Función escalón"},{W:500,H:330,sub:"(b) Frontera de decisión (ejemplo AND)"}]);
  let z=1,w1=0.6,w2=0.4,b=-0.9,dragA=false,dragB=null;
  const pa=()=>new C.Plot(A.k,[56,24,480,280],{xr:[-3,3],yr:[-0.25,1.3]});
  const pb=()=>new C.Plot(B.k,[56,24,480,280],{xr:[-0.5,1.55],yr:[-0.5,1.55]});
  function drawA(){const k=A.k,c=k.c,P=api.pal();k.clear();const p=pa();p.axes({xt:[-2,-1,0,1,2],yt:[0,1],xl:"z",yl:"ŷ",ylgap:34});
    p.line([-3,0],[0,0],{color:P.red,w:3});p.line([0,3],[1,1],{color:P.red,w:3});p.line([0,0],[0,1],{color:P.red,w:1.2,dash:[2,3]});p.dot(0,0,{color:P.red,r:5});p.dot(0,1,{color:P.bg,r:5.5,stroke:P.red,sw:2});
    p.text("ŷ = 1 si z > 0",1.4,1.12,{align:"center",color:P.text});p.text("ŷ = 0 si z ≤ 0",-1.4,0.12,{align:"center",color:P.text});
    const y=z>0?1:0;p.vline(z,{color:P.orange,dash:[4,4],top:p.Y(y)});p.dot(z,y,{color:P.orange,r:8,stroke:P.bg,sw:2.5});
    p.text(`z = ${num(z,2)} → ŷ = ${y}`,z+(z>1.2?-0.08:0.08),0.5,{align:z>1.2?"right":"left",color:P.orange,font:`700 13px ${F.mono}`})}
  const PTS=[[0,0,0],[0,1,0],[1,0,0],[1,1,1]];
  function drawB(){const k=B.k,c=k.c,P=api.pal();k.clear();const p=pb();
    // regiones
    const poly=(sign)=>{let pts=[[-0.5,-0.5],[1.55,-0.5],[1.55,1.55],[-0.5,1.55]];const f=q=>sign*(w1*q[0]+w2*q[1]+b);const out=[];for(let i=0;i<4;i++){const a=pts[i],bb=pts[(i+1)%4],fa=f(a),fb=f(bb);if(fa>0)out.push(a);if((fa>0)!==(fb>0)){const tt=fa/(fa-fb);out.push([a[0]+(bb[0]-a[0])*tt,a[1]+(bb[1]-a[1])*tt])}}return out};
    [[1,P.fillr],[-1,P.fillb]].forEach(([s,col])=>{const o=poly(s);if(o.length>2){c.fillStyle=col;c.beginPath();o.forEach((q,i)=>i?c.lineTo(p.X(q[0]),p.Y(q[1])):c.moveTo(p.X(q[0]),p.Y(q[1])));c.closePath();c.fill()}});
    p.axes({xt:[0,1],yt:[0,1],xl:"x₁",yl:"x₂",grid:false,ylgap:30});
    p.clip();c.strokeStyle=P.ink;c.lineWidth=2.4;c.beginPath();if(Math.abs(w2)>1e-6){c.moveTo(p.X(-0.5),p.Y(-(w1*-0.5+b)/w2));c.lineTo(p.X(1.55),p.Y(-(w1*1.55+b)/w2))}else if(Math.abs(w1)>1e-6){c.moveTo(p.X(-b/w1),p.Y(-0.5));c.lineTo(p.X(-b/w1),p.Y(1.55))}c.stroke();
    // vector w perpendicular desde un punto de la recta
    const n=Math.hypot(w1,w2)||1;const bx=-b*w1/(n*n),by=-b*w2/(n*n);const L=0.35;arrow(c,p.X(bx),p.Y(by),p.X(bx+w1/n*L),p.Y(by+w2/n*L),P.gray,2,9);p.text("w",bx+w1/n*L+0.04,by+w2/n*L+0.04,{color:P.gray,font:`700 13px ${F.ui}`});p.unclip();
    PTS.forEach(([a,bb,y])=>{const pred=(w1*a+w2*bb+b>0)?1:0;p.dot(a,bb,{color:y?P.red:P.blue,r:9,stroke:"#fff",sw:2});if(pred!==y){c.strokeStyle=P.orange;c.lineWidth=2.5;c.beginPath();c.arc(p.X(a),p.Y(bb),15,0,7);c.stroke()}});
    p.text("ŷ = 1",1.35,1.4,{color:P.red,font:`italic 14px ${F.ui}`,align:"center"});p.text("ŷ = 0",-0.3,-0.35,{color:P.blue,font:`italic 14px ${F.ui}`});
    c.fillStyle=P.bg;c.strokeStyle=P.lgray;rrect(c,p.X(-0.45),p.Y(0.72),168,40,6);c.fill();c.stroke();c.fillStyle=P.text;c.font=`12px ${F.ui}`;c.textAlign="left";c.fillText("Frontera:",p.X(-0.45)+8,p.Y(0.72)+16);
    c.font=`12px ${F.mono}`;c.fillText(`${num(w1,1)}x₁ + ${num(w2,1)}x₂ ${b<0?"− "+num(-b,1):"+ "+num(b,1)} = 0`,p.X(-0.45)+8,p.Y(0.72)+32)}
  function draw(){drawA();drawB()}
  A.k.cv.addEventListener("pointerdown",e=>{dragA=true;A.k.cv.setPointerCapture(e.pointerId);setZ(e)});A.k.cv.addEventListener("pointermove",e=>{A.k.cv.style.cursor="ew-resize";if(dragA)setZ(e)});A.k.cv.addEventListener("pointerup",()=>dragA=false);
  function setZ(e){z=Math.round(Math.max(-3,Math.min(3,pa().iX(A.k.ptr(e).x)))*20)/20;draw();upd()}
  const row=C.ctlRow(host);const s1=C.slider(row,"w₁",-1.5,1.5,0.1,w1,v=>{w1=v;draw();upd()},v=>num(v,1)),s2=C.slider(row,"w₂",-1.5,1.5,0.1,w2,v=>{w2=v;draw();upd()},v=>num(v,1)),s3=C.slider(row,"b",-2,1,0.1,b,v=>{b=v;draw();upd()},v=>num(v,1));
  const g=C.group(row);C.button(g,"Pesos aprendidos (Tabla 4)",()=>{w1=0.6;w2=0.4;b=-0.9;s1.set(w1);s2.set(w2);s3.set(b);draw();upd()});
  const rd=C.readout(host);function upd(){const ok=PTS.filter(([a,bb,y])=>((w1*a+w2*bb+b>0)?1:0)===y).length;rd.innerHTML=`Con estos pesos, la recta clasifica bien <b>${ok} de 4</b> casos del ejemplo AND${ok===4?": solo el (1, 1) queda en la zona ŷ = 1.":"; los fallos aparecen rodeados."} Los pesos inclinan la recta y el sesgo la desplaza sin girarla; el vector w es perpendicular a ella.`}
  C.hint(host,"Arrastra el punto sobre la función escalón y mueve los pesos de la frontera.");
  api.onTheme(draw);draw();upd();
});

// =====================================================================
// Figura 9 · frontera con tres variables: un plano (3D girable)
// =====================================================================
C.define("plano3d",function(host,opts,api){
  const [A]=C.panels(host,[{W:1040,H:470}]);const k=A.k,c=k.c;
  let w=[0.5,0.3,1],b=-2,yaw=-0.75,pitch=0.38,drag=null,auto=true,t=0;
  const r=C.rng(9),gs=C.gauss(r);const pts=[];for(let i=0;i<110;i++){const x1=r()*3+0.2,x2=r()*3+0.2;const onp=(2-0.5*x1-0.3*x2);const d=gs()*0.9;const x3=onp+(d>=0?d+0.25:d-0.25);pts.push([x1,x2,x3])}
  function proj(p){const x=p[0]-1.7,y=p[1]-1.7,z=p[2]-1;const cy=Math.cos(yaw),sy=Math.sin(yaw);const X=x*cy-y*sy,Y=x*sy+y*cy;const cp=Math.cos(pitch),sp=Math.sin(pitch);const Z=z*cp-Y*sp,D=Y*cp+z*sp;const s=82;return{x:520+X*s,y:236-Z*s,d:D}}
  function draw(){const P=api.pal();k.clear();
    // ejes y rejilla del suelo
    c.strokeStyle=P.grid;c.lineWidth=1;for(let v=0;v<=3.5;v+=0.5){let a=proj([v,0,-1.4]),bb=proj([v,3.5,-1.4]);c.beginPath();c.moveTo(a.x,a.y);c.lineTo(bb.x,bb.y);c.stroke();a=proj([0,v,-1.4]);bb=proj([3.5,v,-1.4]);c.beginPath();c.moveTo(a.x,a.y);c.lineTo(bb.x,bb.y);c.stroke()}
    [["x₁",[3.9,0,-1.4]],["x₂",[0,3.9,-1.4]],["x₃",[0,0,3.6]]].forEach(([l,e])=>{const o=proj([0,0,-1.4]),q=proj(e);c.strokeStyle=P.axis;c.lineWidth=1.3;c.beginPath();c.moveTo(o.x,o.y);c.lineTo(q.x,q.y);c.stroke();c.fillStyle=P.text;c.font=`italic 17px Georgia,serif`;c.textAlign="center";c.fillText(l,q.x,q.y-6)});
    // plano w·x+b=0 → x3=(−b−w1x1−w2x2)/w3
    const items=[];pts.forEach(p=>{const s=w[0]*p[0]+w[1]*p[1]+w[2]*p[2]+b;const q=proj(p);items.push({d:q.d,f:()=>{c.fillStyle=s>0?P.red:P.blue;c.strokeStyle="#fff";c.lineWidth=1.2;c.beginPath();c.arc(q.x,q.y,5.5,0,7);c.fill();c.stroke()}})});
    if(Math.abs(w[2])>0.05){const corner=(a,bb)=>[a,bb,(-b-w[0]*a-w[1]*bb)/w[2]];const cs=[corner(0,0),corner(3.4,0),corner(3.4,3.4),corner(0,3.4)].map(proj);const dd=cs.reduce((s,q)=>s+q.d,0)/4;
      items.push({d:dd,f:()=>{c.fillStyle=rgba(api.theme==="dark"?"#8fa1b3":"#7f8c99",.38);c.strokeStyle=P.gray;c.lineWidth=1.5;c.beginPath();cs.forEach((q,i)=>i?c.lineTo(q.x,q.y):c.moveTo(q.x,q.y));c.closePath();c.fill();c.stroke()}});
      const o=corner(1.7,1.7);const n=Math.hypot(...w);const e=[o[0]+w[0]/n*1.1,o[1]+w[1]/n*1.1,o[2]+w[2]/n*1.1];const po=proj(o),pe=proj(e);items.push({d:(po.d+pe.d)/2+0.01,f:()=>{arrow(c,po.x,po.y,pe.x,pe.y,P.ink,3,12);c.fillStyle=P.ink;c.font=`700 16px ${F.ui}`;c.fillText("w",pe.x+12,pe.y)}})}
    items.sort((a,b)=>b.d-a.d).forEach(it=>it.f());
    c.fillStyle=P.bg;c.strokeStyle=P.lgray;rrect(c,16,14,280,50,8);c.fill();c.stroke();c.fillStyle=P.text;c.textAlign="left";c.font=`13px ${F.ui}`;c.fillText("Frontera:",28,34);c.font=`13px ${F.mono}`;
    c.fillText(`${num(w[0],1)}x₁ + ${num(w[1],1)}x₂ + ${num(w[2],1)}x₃ ${b<0?"− "+num(-b,1):"+ "+num(b,1)} = 0`,28,54);
    c.font=`italic 18px ${F.ui}`;c.textAlign="right";c.fillStyle=P.red;c.fillText("ŷ = 1 (por encima)",1020,40);c.fillStyle=P.blue;c.fillText("ŷ = 0 (por debajo)",1020,64)}
  const lp=C.loop(api,dt=>{t+=dt;if(auto&&!drag)yaw+=dt*0.18;draw();return auto&&!drag});
  k.cv.addEventListener("pointerdown",e=>{drag=k.ptr(e);auto=false;ab.setAttribute("aria-pressed","false");k.cv.setPointerCapture(e.pointerId)});
  k.cv.addEventListener("pointermove",e=>{k.cv.style.cursor="grab";if(!drag)return;const p=k.ptr(e);yaw+=(p.x-drag.x)*0.008;pitch=Math.max(-0.2,Math.min(1.3,pitch+(p.y-drag.y)*0.006));drag=p;draw()});
  k.cv.addEventListener("pointerup",()=>{drag=null});
  const row=C.ctlRow(host);[0,1,2].forEach(i=>C.slider(row,["w₁","w₂","w₃"][i],-1,1.5,0.1,w[i],v=>{w[i]=v;draw();upd()},v=>num(v,1)));C.slider(row,"b",-3,1,0.1,b,v=>{b=v;draw();upd()},v=>num(v,1));
  const g=C.group(row);const ab=C.toggle(g,"Girar solo",true,v=>{auto=v;if(v)lp.start()});
  const rd=C.readout(host);function upd(){const above=pts.filter(p=>w[0]*p[0]+w[1]*p[1]+w[2]*p[2]+b>0).length;rd.innerHTML=`Con tres variables la frontera es un plano: ${above} puntos quedan por encima (ŷ = 1) y ${pts.length-above} por debajo (ŷ = 0). Los pesos inclinan el plano, el sesgo lo sube o lo baja y el vector w es perpendicular a él.`}
  C.hint(host,"Arrastra para girar la vista en 3D y mueve los pesos para inclinar el plano.");
  api.onTheme(()=>lp.kick());upd();lp.start();
});

// =====================================================================
// Figura 10 · XOR: ninguna recta lo separa (recta arrastrable)
// =====================================================================
C.define("xor-recta",function(host,opts,api){
  const [A]=C.panels(host,[{W:760,H:520}]);A.p.style.flex="0 1 760px";A.p.style.margin="0 auto";const k=A.k,c=k.c;
  let H=[{x:-0.3,y:1.15},{x:1.3,y:-0.15}],drag=-1,best=null;
  const PTS=[[0,0,0],[0,1,1],[1,0,1],[1,1,0]];
  const pl=()=>new C.Plot(k,[80,30,730,450],{xr:[-0.45,1.55],yr:[-0.45,1.55]});
  function side(px,py){const [a,b]=H;return Math.sign((b.x-a.x)*(py-a.y)-(b.y-a.y)*(px-a.x))||1}
  function errors(){// la recta deja cada lado a una clase; se cuenta el mejor etiquetado de los dos
    let e1=0,e2=0;PTS.forEach(([x,y,cl])=>{const s=side(x,y)>0?1:0;if(s!==cl)e1++;if(1-s!==cl)e2++});return Math.min(e1,e2)}
  function draw(){const P=api.pal();k.clear();const p=pl();
    // sombreado de los dos lados
    const [a,b]=H;const dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy)||1;const ux=dx/L,uy=dy/L;const far=10;const e1={x:a.x-ux*far,y:a.y-uy*far},e2={x:a.x+ux*far,y:a.y+uy*far};
    const nx=-uy,ny=ux;p.clip();[[1,P.fillr],[-1,P.fillb]].forEach(([s,col])=>{let e1_=e1,e2_=e2;let lab=0;PTS.forEach(([x,y,cl])=>{});c.fillStyle=col;c.globalAlpha=.6;c.beginPath();c.moveTo(p.X(e1.x),p.Y(e1.y));c.lineTo(p.X(e2.x),p.Y(e2.y));c.lineTo(p.X(e2.x+s*nx*far),p.Y(e2.y+s*ny*far));c.lineTo(p.X(e1.x+s*nx*far),p.Y(e1.y+s*ny*far));c.closePath();c.fill();c.globalAlpha=1});
    c.strokeStyle=P.ink;c.lineWidth=2.6;c.beginPath();c.moveTo(p.X(e1.x),p.Y(e1.y));c.lineTo(p.X(e2.x),p.Y(e2.y));c.stroke();p.unclip();
    p.axes({xt:[0,1],yt:[0,1],xl:"x₁",yl:"x₂",grid:false,fs:16,xlfs:20,ylfs:20,xlgap:44,ylgap:40});
    const s0=side(0,0)>0?1:0,e=errors();
    PTS.forEach(([x,y,cl])=>{p.dot(x,y,{color:cl?P.red:P.blue,r:15,stroke:"#fff",sw:2.5});const s=side(x,y)>0?1:0;const lab=(()=>{let e1=0,e2=0;PTS.forEach(([xx,yy,cc])=>{const ss=side(xx,yy)>0?1:0;if(ss!==cc)e1++;if(1-ss!==cc)e2++});return e1<=e2?s:1-s})();
      if(lab!==cl){c.strokeStyle=P.orange;c.lineWidth=3;c.beginPath();c.arc(p.X(x),p.Y(y),24,0,7);c.stroke();p.text("✗",x+0.09,y+0.09,{color:P.orange,font:`700 16px ${F.ui}`})}});
    H.forEach((h,i)=>{c.fillStyle=drag===i?P.orange:P.bg;c.strokeStyle=P.ink;c.lineWidth=2;c.beginPath();c.arc(p.X(h.x),p.Y(h.y),9,0,7);c.fill();c.stroke()});
    C.legend(c,[{type:"dot",color:P.red,label:"Clase 1"},{type:"dot",color:P.blue,label:"Clase 0"}],590,54,{fs:15,lh:24});
    c.fillStyle=e?P.orange:P.green;c.font=`700 16px ${F.ui}`;c.textAlign="left";c.fillText(e?`${e} punto${e>1?"s":""} en el lado equivocado`:"¡Separado!",100,60)}
  k.cv.addEventListener("pointerdown",e=>{const q=k.ptr(e),p=pl();H.forEach((h,i)=>{if(Math.hypot(q.x-p.X(h.x),q.y-p.Y(h.y))<18)drag=i});if(drag<0){// arrastrar la recta entera
      drag=2;best=q}k.cv.setPointerCapture(e.pointerId)});
  k.cv.addEventListener("pointermove",e=>{const q=k.ptr(e),p=pl();if(drag===0||drag===1){H[drag]={x:p.iX(q.x),y:p.iY(q.y)};draw();upd()}else if(drag===2){const dx=p.iX(q.x)-p.iX(best.x),dy=p.iY(q.y)-p.iY(best.y);H.forEach(h=>{h.x+=dx;h.y+=dy});best=q;draw();upd()}
    else k.cv.style.cursor=H.some(h=>Math.hypot(q.x-p.X(h.x),q.y-p.Y(h.y))<18)?"grab":"move"});
  k.cv.addEventListener("pointerup",()=>{drag=-1;draw()});
  const row=C.ctlRow(host);const g=C.group(row,"Rectas de ejemplo");
  [["diagonal",[{x:-0.3,y:1.15},{x:1.3,y:-0.15}]],["otra diagonal",[{x:-0.3,y:-0.25},{x:1.4,y:1.45}]],["vertical",[{x:0.5,y:-0.4},{x:0.5,y:1.5}]]].forEach(([l,hh])=>C.button(g,l,()=>{H=hh.map(h=>({...h}));draw();upd()}));
  const rd=C.readout(host);function upd(){const e=errors();rd.innerHTML=`Los puntos de la clase 1, (0, 1) y (1, 0), están en una diagonal y los de la clase 0, en la otra. Coloques como coloques la recta, quedan como mínimo <b>${Math.max(1,e)===e?e:e}</b> punto${e===1?"":"s"} en el lado equivocado: XOR no es linealmente separable.`}
  C.hint(host,"Arrastra los extremos de la recta, o la recta entera, e intenta separar las dos clases.");
  api.onTheme(draw);draw();upd();
});

// =====================================================================
// Figura 11 · red de dos capas que resuelve XOR (a) y franja (b)
// =====================================================================
C.define("xor-capas",function(host,opts,api){
  const [A,B]=C.panels(host,[{W:520,H:340,sub:"(a) Red de dos capas que calcula XOR"},{W:480,H:340,sub:"(b) Las dos rectas delimitan una franja"}]);
  let x=[0,1],t=0;const step=z=>z>0?1:0;
  function vals(x1,x2){const h1=step(x1+x2-0.5),h2=step(-x1-x2+1.5),y=step(h1+h2-1.5);return{h1,h2,y}}
  const N={x1:{x:60,y:110},x2:{x:60,y:250},h1:{x:250,y:105},h2:{x:250,y:255},y:{x:430,y:180}};
  function drawA(){const k=A.k,c=k.c,P=api.pal();k.clear();const v=vals(...x);
    const E=[["x1","h1","1"],["x2","h1","1"],["x1","h2","−1"],["x2","h2","−1"],["h1","y","1"],["h2","y","1"]];
    E.forEach(([a,b,l])=>{const A_=N[a],B_=N[b];const act=(a.startsWith("x")?x[+a[1]-1]:v[a])===1;arrow(c,A_.x+26,A_.y+(B_.y-A_.y)*0.1,B_.x-28,B_.y-(B_.y-A_.y)*0.1,act?P.orange:P.gray,act?2.6:1.5,10);
      c.fillStyle=P.red;c.font=`600 13px ${F.ui}`;c.textAlign="center";const cross=a==="x1"&&b==="h2"||a==="x2"&&b==="h1";const tt=cross?0.78:0.5;const px=A_.x+(B_.x-A_.x)*tt,py=A_.y+(B_.y-A_.y)*tt;c.fillText(l,px+(cross?(a==="x1"?-14:-14):0),py+(cross?(a==="x1"?-4:12):-8))});
    node(c,N.x1.x,N.x1.y,24,P.node,P.blue,"x₁",{tc:P.text,italic:true,serif:true,fs:16});node(c,N.x2.x,N.x2.y,24,P.node,P.blue,"x₂",{tc:P.text,italic:true,serif:true,fs:16});
    c.fillStyle=P.muted;c.font=`600 13px ${F.mono}`;c.textAlign="right";c.fillText("= "+x[0],N.x1.x-32,N.x1.y+5);c.fillText("= "+x[1],N.x2.x-32,N.x2.y+5);
    [["h1","h₁","OR   b = −0.5",-40],["h2","h₂","NAND   b = 1.5",48]].forEach(([kk,l,d,dy])=>{node(c,N[kk].x,N[kk].y,26,v[kk]?P.red:C.mix(P.node,P.red,.45),P.red,l,{italic:true,serif:true,fs:16});c.fillStyle=P.text;c.font=`12.5px ${F.ui}`;c.textAlign="center";c.fillText(d,N[kk].x,N[kk].y+dy);
      c.font=`700 12.5px ${F.mono}`;c.fillStyle=P.red;c.textAlign="left";c.fillText("= "+v[kk],N[kk].x+30,N[kk].y+(kk==="h1"?28:-20))});
    node(c,N.y.x,N.y.y,28,v.y?P.green:C.mix(P.node,P.green,.45),P.green,"ŷ",{italic:true,serif:true,fs:18});c.fillStyle=P.text;c.font=`12.5px ${F.ui}`;c.textAlign="center";c.fillText("AND   b = −1.5",N.y.x,N.y.y-42);c.fillText("Salida",N.y.x,N.y.y+48);
    c.font=`700 15px ${F.mono}`;c.fillStyle=P.green;c.fillText("XOR = "+v.y,N.y.x,N.y.y+72);c.fillStyle=P.muted;c.font=`12px ${F.ui}`;c.fillText("Capa intermedia",250,330);c.fillText("Entradas",60,40)}
  const pb=()=>new C.Plot(B.k,[50,24,460,290],{xr:[-0.45,1.55],yr:[-0.45,1.55]});
  function drawB(){const k=B.k,c=k.c,P=api.pal();k.clear();const p=pb();
    p.clip();c.fillStyle=P.fillb;c.fillRect(p.x0,p.y0,p.x1-p.x0,p.y1-p.y0);c.fillStyle=P.fillr;c.beginPath();const band=[[-1,1.5],[1.5,-1],[2.5,-1],[-1,2.5]];band.forEach((q,i)=>i?c.lineTo(p.X(q[0]),p.Y(q[1])):c.moveTo(p.X(q[0]),p.Y(q[1])));c.closePath();c.fill();
    c.strokeStyle=P.ink;c.lineWidth=2.2;c.beginPath();c.moveTo(p.X(-1),p.Y(1.5));c.lineTo(p.X(1.5),p.Y(-1));c.stroke();c.setLineDash([6,4]);c.beginPath();c.moveTo(p.X(-1),p.Y(2.5));c.lineTo(p.X(2.5),p.Y(-1));c.stroke();c.setLineDash([]);p.unclip();
    p.axes({xt:[0,1],yt:[0,1],xl:"x₁",yl:"x₂",grid:false,ylgap:32});
    [[0,0,0],[0,1,1],[1,0,1],[1,1,0]].forEach(([a,bb,cl])=>{const cur=a===x[0]&&bb===x[1];p.dot(a,bb,{color:cl?P.red:P.blue,r:9,stroke:"#fff",sw:2});if(cur){c.strokeStyle=P.orange;c.lineWidth=3;c.beginPath();c.arc(p.X(a),p.Y(bb),16,0,7);c.stroke()}});
    p.text("ŷ = 1",0.5,0.55,{color:P.red,font:`italic 14px ${F.ui}`,align:"center"});
    C.legend(c,[{color:P.ink,label:"recta de h₁ (OR)"},{color:P.ink,dash:[6,4],label:"recta de h₂ (NAND)"}],250,40,{fs:12,lh:18})}
  function draw(){drawA();drawB()}
  function click(e,k,which){const p=k.ptr(e);if(which==="A"){if(Math.hypot(p.x-N.x1.x,p.y-N.x1.y)<28)x[0]=1-x[0];else if(Math.hypot(p.x-N.x2.x,p.y-N.x2.y)<28)x[1]=1-x[1];else return}
    else{const pp=pb();let best=null,bd=30;[[0,0],[0,1],[1,0],[1,1]].forEach(q=>{const d=Math.hypot(p.x-pp.X(q[0]),p.y-pp.Y(q[1]));if(d<bd){bd=d;best=q}});if(!best)return;x=[...best]}draw();upd();setC(x.join(""))}
  A.k.cv.addEventListener("click",e=>click(e,A.k,"A"));B.k.cv.addEventListener("click",e=>click(e,B.k,"B"));
  [A,B].forEach(P_=>P_.k.cv.addEventListener("pointermove",()=>P_.k.cv.style.cursor="pointer"));
  const row=C.ctlRow(host);const g=C.group(row,"Caso");const setC=C.seg(g,[["00","(0, 0)"],["01","(0, 1)"],["10","(1, 0)"],["11","(1, 1)"]],kk=>{x=[+kk[0],+kk[1]];draw();upd();setC(kk)});
  const rd=C.readout(host);function upd(){const v=vals(...x);rd.innerHTML=`Caso (${x[0]}, ${x[1]}): h₁ = OR = ${v.h1} y h₂ = NAND = ${v.h2}; la salida comprueba que se cumplen las dos (AND): <b>XOR = ${v.y}</b>. Geométricamente, la alerta solo salta dentro de la franja entre las dos rectas.`}
  C.hint(host,"Pulsa las entradas de la red o un punto del plano.");
  api.onTheme(draw);setC("01");draw();upd();
});
})();
