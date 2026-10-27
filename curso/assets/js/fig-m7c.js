/* Figuras interactivas del Módulo 7 (3) — tipos de capa y aplicaciones */
(function(){"use strict";
const C=Curso,{num,numT,F,rgba,arrow,rrect,node,ease,thou}=C;
function b64u8(s){const b=atob(s),a=new Uint8Array(b.length);for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return a}
function b64i8(s){const u=b64u8(s);return new Int8Array(u.buffer)}

// =====================================================================
// Figura 22 · densa, convolucional y recurrente
// =====================================================================
C.define("tipos-capa",function(host,opts,api){
  const PS=C.panels(host,[{W:330,H:330,sub:"(a) Densa",flex:"1 1 280px"},{W:330,H:330,sub:"(b) Convolucional",flex:"1 1 280px"},{W:340,H:330,sub:"(c) Recurrente",flex:"1 1 280px"}]);
  let t=0,hovD=-1,pos=0,playing=true,step=0;
  const IN=[0,1,2,3,4].map(i=>({x:60,y:60+i*55})),OUT=[0,1,2].map(i=>({x:260,y:115+i*55}));
  const GR=[255,229,189,127,189,229,255];const WK=[-1,2,-1];
  function drawD(){const Q=PS[0],k=Q.k,c=k.c,P=api.pal();k.clear();const act=hovD>=0?hovD:Math.floor(t/1.4)%3;
    IN.forEach(p=>OUT.forEach((q,j)=>{const on=j===act;c.strokeStyle=on?P.orange:P.lgray;c.lineWidth=on?2:1.1;c.beginPath();c.moveTo(p.x+16,p.y);c.lineTo(q.x-17,q.y);c.stroke();
      if(on){const u=(t%1.4)/1.4;c.fillStyle=P.orange;c.beginPath();c.arc(p.x+16+(q.x-17-p.x-16)*u,p.y+(q.y-p.y)*u,2.8,0,7);c.fill()}}));
    IN.forEach(p=>node(c,p.x,p.y,16,P.node,P.blue,""));OUT.forEach((q,j)=>{c.save();if(j===act){c.shadowColor=P.orange;c.shadowBlur=14}node(c,q.x,q.y,17,P.red,P.red,"");c.restore()});
    c.fillStyle=P.cap;c.font=`12.5px ${F.ui}`;c.textAlign="center";c.fillText("Cada neurona ve todas las entradas",165,24);c.fillText(`${IN.length} conexiones por neurona`,165,320)}
  function drawCv(){const Q=PS[1],k=Q.k,c=k.c,P=api.pal();k.clear();const ys=[...Array(7)].map((_,i)=>36+i*42);const cols=[P.blue,P.ocre,P.green];const p0=Math.floor(pos)%5;
    for(let j=0;j<5;j++)for(let d=0;d<3;d++){const on=j===p0;c.strokeStyle=on?cols[d]:rgba(cols[d],.28);c.lineWidth=on?2.6:1.2;c.beginPath();c.moveTo(78,ys[j+d]);c.lineTo(242,ys[j+1]);c.stroke()}
    ys.forEach((y,i)=>{const g=GR[i];c.fillStyle=`rgb(${g},${g},${g})`;c.strokeStyle=P.blue;c.lineWidth=2;c.fillRect(48,y-15,30,30);c.strokeRect(48,y-15,30,30);
      if(i>=p0&&i<p0+3){c.strokeStyle=P.orange;c.lineWidth=3;c.strokeRect(45,y-18,36,36)}c.fillStyle=g<160?"#fff":"#222";c.font=`10.5px ${F.mono}`;c.textAlign="center";c.fillText(numT((255-g)/255,2),63,y+4)});
    for(let j=0;j<5;j++){const v=WK.reduce((s,w,d)=>s+w*(255-GR[j+d])/255,0);const on=j===p0;const inten=Math.min(1,Math.abs(v)/0.8);c.save();if(on){c.shadowColor=P.orange;c.shadowBlur=14}node(c,258,ys[j+1],15,C.mix(P.node,P.red,.25+.75*inten),P.red,"");c.restore();
      c.fillStyle=P.text;c.font=`600 11px ${F.mono}`;c.textAlign="left";c.fillText(num(v,2),278,ys[j+1]+4)}
    c.fillStyle=P.cap;c.font=`12.5px ${F.ui}`;c.textAlign="center";c.fillText("Ventana de 3 píxeles con los",165,14);c.fillText("mismos 3 pesos (colores)",165,28+0);
    c.font=`11.5px ${F.mono}`;c.fillStyle=P.muted;c.fillText(`pesos: ${WK.map(w=>num(w,0)).join(", ")}`,165,326)}
  const SEQ=["«Pago»","«no»","«recibido»"];
  function drawR(){const Q=PS[2],k=Q.k,c=k.c,P=api.pal();k.clear();const xs=[60,170,280];const st=Math.floor(step)%4;
    xs.forEach((x,i)=>{const done=i<st;const cur=i===st-1;c.fillStyle=P.node;c.strokeStyle=P.blue;c.lineWidth=2;rrect(c,x-46,248,92,32,14);c.fill();c.stroke();c.fillStyle=P.text;c.font=`12px ${F.ui}`;c.textAlign="center";c.fillText(SEQ[i],x,269);
      arrow(c,x,246,x,190,done?P.orange:P.gray,done?2.4:1.5,9);c.save();if(cur){c.shadowColor=P.orange;c.shadowBlur=16}c.fillStyle=done?P.red:C.mix(P.node,P.red,.35);rrect(c,x-26,138,52,52,12);c.fill();c.restore();
      c.fillStyle="#fff";c.font=`italic 16px Georgia,serif`;c.fillText("h"+"₁₂₃"[i],x,170);arrow(c,x,136,x,86,done?P.gray:P.lgray,1.5,9);c.fillStyle=P.cap;c.font=`11.5px ${F.ui}`;c.fillText("salida",x,76);
      if(i<2){const on=st>i+1;arrow(c,x+28,164,xs[i+1]-28,164,on?P.green:rgba(P.green,.35),on?3:2,10);c.fillStyle=P.green;c.font=`11px ${F.ui}`;c.fillText("memoria",(x+xs[i+1])/2,154)}});
    c.fillStyle=P.cap;c.font=`12.5px ${F.ui}`;c.textAlign="center";c.fillText("Lee la secuencia paso a paso",170,24);
    c.fillStyle=P.muted;c.font=`11.5px ${F.ui}`;c.fillText(st===0?"Pulsa ▶ para leer la frase":st===3?"h₃ recuerda «Pago» y «no»: el pago no llegó":`Paso ${st}: lee ${SEQ[st-1]}${st>1?" y recuerda lo anterior":""}`,170,316)}
  const lp=C.loop(api,dt=>{t+=dt;if(playing){pos+=dt*0.8;step+=dt*0.6}drawD();drawCv();drawR();return true});
  PS[0].k.cv.addEventListener("pointermove",e=>{const q=PS[0].k.ptr(e);hovD=OUT.findIndex(o=>Math.hypot(q.x-o.x,q.y-o.y)<22);PS[0].k.cv.style.cursor=hovD>=0?"pointer":"default"});PS[0].k.cv.addEventListener("pointerleave",()=>hovD=-1);
  const row=C.ctlRow(host);const g=C.group(row);const pb=C.button(g,"❚❚ Pausa",()=>{playing=!playing;pb.textContent=playing?"❚❚ Pausa":"▶ Animar"});
  C.button(g,"Mover la ventana",()=>{pos=Math.floor(pos)+1});C.button(g,"Siguiente palabra",()=>{step=Math.floor(step)+1});
  const rd=C.readout(host);rd.innerHTML="Densa: cada neurona conecta con todas las entradas. Convolucional: una ventana pequeña, con los mismos pesos, recorre la imagen. Recurrente: lee la secuencia paso a paso y pasa una memoria de un paso al siguiente.";
  C.hint(host,"Pasa el ratón por las neuronas de la capa densa.");api.onTheme(()=>lp.kick());lp.start();
});

// =====================================================================
// Figura 23 · riesgo crediticio: red (a) y probabilidades con umbrales (b)
// =====================================================================
C.define("riesgo",function(host,opts,api){
  const D=window.DATA_M7.f23;const p=D.p,y=D.y,n=p.length;let thr=[0.5,0.2],drag=-1,cli=-1,t=0,fw=0;
  const [A,B]=C.panels(host,[{W:500,H:330,sub:"(a) Red para evaluar el riesgo"},{W:520,H:330,sub:"(b) Probabilidades que devuelve la red"}]);
  const names=["Impagos previos","Antigüedad laboral","Deuda / ingresos","Ingresos"];
  function drawA(){const k=A.k,c=k.c,P=api.pal();k.clear();const I=[0,1,2,3].map(i=>({x:180,y:66+i*62})),H1=[0,1,2,3,4].map(i=>({x:300,y:48+i*58})),H2=[0,1,2].map(i=>({x:390,y:108+i*58})),O={x:466,y:166};
    [[I,H1],[H1,H2],[H2,[O]]].forEach(([a,b],l)=>a.forEach(pp=>b.forEach(q=>{c.strokeStyle=P.lgray;c.lineWidth=1;c.beginPath();c.moveTo(pp.x,pp.y);c.lineTo(q.x,q.y);c.stroke();
      if(cli>=0&&fw>l&&fw<l+1){const u=fw-l;c.fillStyle=P.orange;c.beginPath();c.arc(pp.x+(q.x-pp.x)*u,pp.y+(q.y-pp.y)*u,2.4,0,7);c.fill()}})));
    const ex=cli>=0?D.ex[cli]:null;const vals=ex?[ex.imp?"sí":"no",num(ex.ant,1)+" años",num(ex.ratio*100,0)+" %",num(ex.ing,1)+" mil €"]:null;
    I.forEach((q,i)=>{node(c,q.x,q.y,14,P.node,P.blue,"");c.fillStyle=P.text;c.font=`12.5px ${F.ui}`;c.textAlign="right";c.fillText(names[i],q.x-22,q.y+(vals?-2:4));if(vals){c.fillStyle=P.blue;c.font=`600 11.5px ${F.mono}`;c.fillText(vals[i],q.x-22,q.y+13)}});
    H1.concat(H2).forEach(q=>node(c,q.x,q.y,14,P.red,P.red,""));node(c,O.x,O.y,18,P.green,P.green,"σ",{fs:15});
    c.fillStyle=P.text;c.font=`12.5px ${F.ui}`;c.textAlign="center";c.fillText("P(impago)",O.x,O.y+38);c.fillText("Capas ocultas (ReLU)",345,22);
    if(ex&&fw>=3){c.fillStyle=ex.p>=thr[0]?P.red:P.green;c.font=`700 15px ${F.mono}`;c.fillText(num(ex.p,2),O.x,O.y+58);c.font=`11.5px ${F.ui}`;c.fillStyle=P.muted;c.fillText(ex.y?"(impagó)":"(pagó)",O.x,O.y+74)}}
  const pb=()=>new C.Plot(B.k,[58,20,500,270],{xr:[-0.04,1.04],yr:[0,56]});
  const bins=[...Array(26)].map((_,i)=>i/25);
  function hist(cls){const h=new Array(25).fill(0);let m=0;for(let i=0;i<n;i++)if(y[i]===cls){m++;const b=Math.min(24,Math.floor(p[i]*25));h[b]++}return h.map(v=>v/m*100)}
  const H0=hist(0),H1h=hist(1);
  function rates(u){let tp=0,fp=0,P1=0,P0=0;for(let i=0;i<n;i++){if(y[i]){P1++;if(p[i]>=u)tp++}else{P0++;if(p[i]>=u)fp++}}return[tp/P1,fp/P0]}
  function drawB(){const k=B.k,c=k.c,P=api.pal();k.clear();const pl=pb();pl.axes({xt:[0,0.2,0.4,0.6,0.8,1],yt:[0,10,20,30,40,50],xl:"Probabilidad de impago estimada",yl:"% de clientes del grupo",ylgap:42});
    [[H0,P.blue2,.85],[H1h,P.red,.65]].forEach(([h,col,al])=>{c.fillStyle=rgba(col,al);h.forEach((v,i)=>{const x0=pl.X(bins[i]),x1=pl.X(bins[i+1]);c.fillRect(x0,pl.Y(Math.min(v,56)),x1-x0,pl.Y(0)-pl.Y(Math.min(v,56)))})});
    thr.forEach((u,j)=>{c.strokeStyle=P.ink;c.lineWidth=drag===j?2.6:1.8;c.setLineDash(j?[6,4]:[]);c.beginPath();c.moveTo(pl.X(u),pl.y0);c.lineTo(pl.X(u),pl.y1);c.stroke();c.setLineDash([]);
      c.fillStyle=P.ink;c.font=`12.5px ${F.ui}`;c.textAlign="left";c.fillText(`umbral ${numT(u,2)}`,pl.X(u)+6,pl.y0+(j?48:16));c.fillStyle=P.bg;c.strokeStyle=P.ink;c.lineWidth=1.5;c.beginPath();c.arc(pl.X(u),pl.y1-6,6,0,7);c.fill();c.stroke()});
    C.legend(c,[{type:"box",color:P.blue2,label:"Clientes que pagaron"},{type:"box",color:P.red,label:"Clientes que impagaron"}],300,110,{lh:20})}
  const lp=C.loop(api,dt=>{t+=dt;if(cli>=0&&fw<3)fw+=dt*1.6;drawA();drawB();return cli>=0&&fw<3});
  B.k.cv.addEventListener("pointerdown",e=>{const q=B.k.ptr(e),pl=pb();let best=-1,bd=14;thr.forEach((u,j)=>{const d=Math.abs(q.x-pl.X(u));if(d<bd){bd=d;best=j}});if(best>=0){drag=best;B.k.cv.setPointerCapture(e.pointerId)}});
  B.k.cv.addEventListener("pointermove",e=>{const q=B.k.ptr(e),pl=pb();if(drag>=0){thr[drag]=Math.round(Math.max(0.02,Math.min(0.98,pl.iX(q.x)))*100)/100;upd();lp.kick()}else B.k.cv.style.cursor=thr.some(u=>Math.abs(q.x-pl.X(u))<14)?"ew-resize":"default"});
  B.k.cv.addEventListener("pointerup",()=>{drag=-1;lp.kick()});
  const row=C.ctlRow(host);const g=C.group(row,"Cliente de prueba");C.button(g,"▶ Evaluar un cliente",()=>{cli=(cli+1)%D.ex.length;fw=0;lp.start();upd()},{primary:true});
  const g2=C.group(row,"Umbrales");C.button(g2,"0.5 y 0.2 (texto)",()=>{thr=[0.5,0.2];upd();lp.kick()});
  const rd=C.readout(host);
  function upd(){const r0=rates(thr[0]),r1=rates(thr[1]);let s=`Con un umbral de <b>${numT(thr[0],2)}</b>, la red detecta el <b>${num(r0[0]*100,0)} %</b> de los impagos y rechaza al ${num(r0[1]*100,0)} % de los buenos clientes; con <b>${numT(thr[1],2)}</b>, detecta el <b>${num(r1[0]*100,0)} %</b> y rechaza al ${num(r1[1]*100,0)} %.`;
    if(cli>=0){const ex=D.ex[cli];s+=` Cliente evaluado: probabilidad de impago ${num(ex.p,2)}, ${ex.p>=thr[0]?"se rechaza":"se concede"} con el primer umbral (${ex.y?"impagó":"pagó"}).`}rd.innerHTML=s}
  C.hint(host,"Arrastra las líneas de los umbrales sobre el histograma.");upd();api.onTheme(()=>lp.kick());lp.kick();
});

// =====================================================================
// Figura 24 · valoración inmobiliaria (a) y previsión de demanda (b)
// =====================================================================
C.define("regresion",function(host,opts,api){
  const A_=window.DATA_M7.f24a,B_=window.DATA_M7.f24b;const n=A_.y.length;let hovA=-1,hovB=-1,zona=-1,all=false;
  const [A,B]=C.panels(host,[{W:500,H:340,sub:"(a) Valoración inmobiliaria"},{W:520,H:340,sub:"(b) Previsión de demanda diaria"}]);
  const mx=Math.max(...A_.y,...A_.p)*1.03;const pa=()=>new C.Plot(A.k,[64,16,486,276],{xr:[0,mx],yr:[0,mx]});
  const ZN=["A","B","C"];
  function drawA(){const k=A.k,c=k.c,P=api.pal();k.clear();const pl=pa();const tk=C.niceTicks(0,mx,5);pl.axes({xt:tk,yt:tk,xl:"Precio real (miles de €)",yl:"Precio estimado (miles de €)",ylgap:46});
    for(let i=0;i<n;i++){if(zona>=0&&A_.zona[i]!==zona)continue;c.fillStyle=rgba(P.blue,.45);c.beginPath();c.arc(pl.X(A_.y[i]),pl.Y(A_.p[i]),2.6,0,7);c.fill()}
    pl.line([0,mx],[0,mx],{color:P.red,w:2});C.legend(c,[{color:P.red,label:"Predicción perfecta"}],78,30);
    let mae=0,m=0;for(let i=0;i<n;i++){if(zona>=0&&A_.zona[i]!==zona)continue;mae+=Math.abs(A_.p[i]-A_.y[i]);m++}mae/=m;
    c.font=`13px ${F.ui}`;const lab=`Error medio: ${num(mae,0)} mil €`;const w=c.measureText(lab).width+16;c.fillStyle=P.bg;c.strokeStyle=P.lgray;rrect(c,476-w,236,w,28,7);c.fill();c.stroke();c.fillStyle=P.text;c.textAlign="right";c.fillText(lab,468,255);
    if(hovA>=0){const i=hovA;c.strokeStyle=P.orange;c.lineWidth=2;c.beginPath();c.arc(pl.X(A_.y[i]),pl.Y(A_.p[i]),6,0,7);c.stroke();
      C.tip(c,pl.X(A_.y[i]),pl.Y(A_.p[i]),[`${A_.m2[i]} m² · ${A_.hab[i]} hab. · zona ${ZN[A_.zona[i]]}`,`${A_.edad[i]} años · planta ${A_.planta[i]}`,`Real: ${num(A_.y[i],0)} mil € · estimado: ${num(A_.p[i],0)} mil €`],{W:500})}}
  const d=B_.d,pr=B_.pred,nt=B_.ntest,N=d.length;
  function viewB(){const show=all?N:56;return{show,off:N-show}}
  function pb(){const {show}=viewB();let lo=1e9,hi=-1e9;for(let i=N-show;i<N;i++){lo=Math.min(lo,d[i]);hi=Math.max(hi,d[i])}return new C.Plot(B.k,[56,16,506,276],{xr:[0,show-1],yr:[Math.floor((lo-10)/20)*20,Math.ceil((hi+10)/20)*20]})}
  function drawB(){const k=B.k,c=k.c,P=api.pal();k.clear();const pl=pb();const {show,off}=viewB();pl.axes({xt:C.niceTicks(0,show-1,6),yt:C.niceTicks(pl.yr[0],pl.yr[1],5),xl:"Día",yl:"Unidades",ylgap:42});
    pl.vspan(show-nt-0.5,show-0.5,P.fillr);pl.text("periodo previsto",show-nt/2,pl.yr[0],{align:"center",color:P.red,dy:-8,fs:12});
    pl.line([...Array(show)].map((_,i)=>i),d.slice(off),{color:P.blue,w:2});pl.line([...Array(nt)].map((_,i)=>show-nt+i),pr,{color:P.red,w:2.2,dash:[6,4]});pr.forEach((v,i)=>pl.dot(show-nt+i,v,{color:P.red,r:3.2}));
    C.legend(c,[{color:P.blue,label:"Demanda real"},{color:P.red,dash:[6,4],label:"Previsión de la red"}],70,30,{lh:19});
    if(hovB>=0){const i=hovB;const x=pl.X(i);c.strokeStyle=P.gray;c.setLineDash([3,3]);c.beginPath();c.moveTo(x,pl.y0);c.lineTo(x,pl.y1);c.stroke();c.setLineDash([]);
      const dayIdx=off+i;const wd=["lunes","martes","miércoles","jueves","viernes","sábado","domingo"][dayIdx%7];const j=i-(show-nt);
      C.tip(c,x,pl.Y(d[dayIdx]),[`Día ${i} (${wd})`,`Real: ${num(d[dayIdx],0)} unidades`].concat(j>=0?[`Previsto: ${num(pr[j],0)} (error ${num(Math.abs(pr[j]-d[dayIdx])/d[dayIdx]*100,1)} %)`]:[]),{W:520})}}
  function draw(){drawA();drawB()}
  A.k.cv.addEventListener("pointermove",e=>{const q=A.k.ptr(e),pl=pa();let best=-1,bd=10;for(let i=0;i<n;i++){if(zona>=0&&A_.zona[i]!==zona)continue;const dd=Math.hypot(q.x-pl.X(A_.y[i]),q.y-pl.Y(A_.p[i]));if(dd<bd){bd=dd;best=i}}if(best!==hovA){hovA=best;drawA()}});
  A.k.cv.addEventListener("pointerleave",()=>{hovA=-1;drawA()});
  B.k.cv.addEventListener("pointermove",e=>{const q=B.k.ptr(e),pl=pb();const i=Math.round(pl.iX(q.x));const {show}=viewB();const h=i>=0&&i<show&&pl.inside(q)?i:-1;if(h!==hovB){hovB=h;drawB()}});
  B.k.cv.addEventListener("pointerleave",()=>{hovB=-1;drawB()});
  const row=C.ctlRow(host);const g=C.group(row,"Zona (a)");const setZ=C.seg(g,[["-1","Todas"],["0","A"],["1","B"],["2","C"]],kk=>{zona=+kk;setZ(kk);draw();upd()});
  const g2=C.group(row,"Serie (b)");C.toggle(g2,"Ver todo el histórico",false,v=>{all=v;drawB()});
  const rd=C.readout(host);function upd(){let mae=0,mape=0,m=0;for(let i=0;i<n;i++){if(zona>=0&&A_.zona[i]!==zona)continue;mae+=Math.abs(A_.p[i]-A_.y[i]);mape+=Math.abs(A_.p[i]-A_.y[i])/A_.y[i];m++}
    let md=0;pr.forEach((v,i)=>md+=Math.abs(v-d[N-nt+i])/d[N-nt+i]);rd.innerHTML=`(a) ${m} viviendas de prueba${zona>=0?" de la zona "+ZN[zona]:""}: error medio de <b>${num(mae/m*1000,0).replace(/\B(?=(\d{3})+(?!\d))/g," ")} €</b> (${num(mape/m*100,1)} % del precio). (b) Error medio de la previsión: <b>${num(md/nt*100,1)} %</b>.`}
  C.hint(host,"Pasa el ratón por los puntos y por la serie para ver cada dato.");setZ("-1");upd();api.onTheme(draw);draw();
});

// =====================================================================
// Figura 25 · OCR: dígito de 8 × 8 editable y salida de la red real
// =====================================================================
C.define("ocr",function(host,opts,api){
  const D=window.DATA_M7.f25;const Xall=b64u8(D.X);const nT=D.y.length;const W1=D.W1,b1=D.b1,W2=D.W2,b2=D.b2;
  let idx=D.idx,img=Array.from(Xall.slice(idx*64,idx*64+64)),label=D.y[idx],mode=1,painting=false,shownP=null;
  const [A,B]=C.panels(host,[{W:420,H:420,sub:"(a) La imagen son 64 números (0–16)"},{W:560,H:420,sub:"(b) Salida softmax de la red"}]);
  function predict(x){const h=new Array(32).fill(0);for(let j=0;j<32;j++){let s=b1[j];for(let i=0;i<64;i++)s+=x[i]/16*W1[i*32+j];h[j]=Math.max(0,s)}
    const z=new Array(10).fill(0);for(let k=0;k<10;k++){let s=b2[k];for(let j=0;j<32;j++)s+=h[j]*W2[j*10+k];z[k]=s}const m=Math.max(...z);const e=z.map(v=>Math.exp(v-m));const S=e.reduce((a,b)=>a+b,0);return e.map(v=>v/S)}
  const G={x0:30,y0:20,s:45};shownP=predict(img);
  function drawA(){const k=A.k,c=k.c,P=api.pal();k.clear();for(let i=0;i<8;i++)for(let j=0;j<8;j++){const v=img[i*8+j];const g=Math.round(255-v/16*255);c.fillStyle=api.theme==="dark"?`rgb(${255-g},${255-g},${255-g})`:`rgb(${g},${g},${g})`;
      c.fillRect(G.x0+j*G.s,G.y0+i*G.s,G.s,G.s);c.fillStyle=(api.theme==="dark"?v<=8:v>8)?"#fff":P.cap;c.font=`12px ${F.mono}`;c.textAlign="center";c.fillText(v,G.x0+j*G.s+G.s/2,G.y0+i*G.s+G.s/2+4)}
    c.strokeStyle=P.axis;c.lineWidth=1.2;c.strokeRect(G.x0,G.y0,G.s*8,G.s*8)}
  const pb=()=>new C.Plot(B.k,[60,24,540,360],{xr:[-0.5,9.5],yr:[0,1.05]});
  function drawB(){const k=B.k,c=k.c,P=api.pal();k.clear();const p=predict(img);if(!shownP)shownP=[...p];const pl=pb();pl.axes({yt:[0,0.2,0.4,0.6,0.8,1],xt:[0,1,2,3,4,5,6,7,8,9],xl:"Dígito",yl:"Probabilidad (softmax)",ylgap:46});
    const best=p.indexOf(Math.max(...p));shownP.forEach((v,i)=>{const x=pl.X(i);c.fillStyle=i===best?P.red:P.blue2;c.fillRect(x-17,pl.Y(v),34,pl.Y(0)-pl.Y(v));if(p[i]>0.01){c.fillStyle=P.text;c.font=`12.5px ${F.ui}`;c.textAlign="center";c.fillText(num(p[i],2),x,pl.Y(v)-7)}})}
  function draw(){drawA();drawB()}
  const lp=C.loop(api,dt=>{const p=predict(img);let mv=false;for(let i=0;i<10;i++){const d=p[i]-shownP[i];if(Math.abs(d)>1e-3){shownP[i]+=d*Math.min(1,dt*12);mv=true}}draw();return mv});
  function paint(e){const q=A.k.ptr(e);const j=Math.floor((q.x-G.x0)/G.s),i=Math.floor((q.y-G.y0)/G.s);if(i<0||i>7||j<0||j>7)return;
    const v=mode===1?16:0;img[i*8+j]=v;// pincel suave en los vecinos
    if(mode===1)[[0,1],[1,0],[0,-1],[-1,0]].forEach(([a,b])=>{const ii=i+a,jj=j+b;if(ii>=0&&ii<8&&jj>=0&&jj<8)img[ii*8+jj]=Math.max(img[ii*8+jj],6)});label=null;upd();lp.start()}
  A.k.cv.addEventListener("pointerdown",e=>{painting=true;A.k.cv.setPointerCapture(e.pointerId);paint(e)});A.k.cv.addEventListener("pointermove",e=>{A.k.cv.style.cursor="crosshair";if(painting)paint(e)});A.k.cv.addEventListener("pointerup",()=>painting=false);
  const row=C.ctlRow(host);const g=C.group(row,"Imagen");C.button(g,"Dígito del documento",()=>{idx=D.idx;img=Array.from(Xall.slice(idx*64,idx*64+64));label=D.y[idx];upd();lp.start()});
  C.button(g,"Otro dígito de prueba",()=>{idx=Math.floor(Math.random()*nT);img=Array.from(Xall.slice(idx*64,idx*64+64));label=D.y[idx];upd();lp.start()},{primary:true});C.button(g,"Borrar",()=>{img=new Array(64).fill(0);label=null;upd();lp.start()});
  const g2=C.group(row,"Pincel");const setM=C.seg(g2,[["1","Pintar"],["0","Borrar"]],kk=>{mode=+kk;setM(kk)});
  const rd=C.readout(host);function upd(){const p=predict(img);const best=p.indexOf(Math.max(...p));rd.innerHTML=`La red 64-32-10, entrenada con 1347 dígitos (acierta el ${num(D.acc*100,0)} % de otros 450), asigna un <b>${num(p[best]*100,0)} %</b> de probabilidad al <b>${best}</b>${label!==null?` (es un ${label}${label===best?": acierta":": se equivoca"})`:""}.`}
  C.hint(host,"Pinta o borra píxeles en la imagen: la red real recalcula sus probabilidades al momento.");setM("1");upd();api.onTheme(draw);lp.start();
});

// =====================================================================
// Figura 26 · onda y espectrograma, con reproducción del sonido
// =====================================================================
C.define("audio",function(host,opts,api){
  const D=window.DATA_M7.f26;const S=b64i8(D.sig);const SP=b64u8(D.spec);const N=S.length;let cur=-1,ctx=null,src=null,t0=0,hov=null;
  const [A,B]=C.panels(host,[{W:500,H:320,sub:"(a) Onda de audio"},{W:520,H:320,sub:"(b) Espectrograma: el sonido como imagen"}]);
  const pa=()=>new C.Plot(A.k,[62,16,486,262],{xr:[0,D.T],yr:[-1.05,1.05]}),pb=()=>new C.Plot(B.k,[62,16,506,262],{xr:[0,D.T],yr:[0,4.5]});
  let specImg=null,specKey="";
  function buildSpec(){const key=api.theme;if(specKey===key)return;specKey=key;const c2=document.createElement("canvas");c2.width=D.nt;c2.height=D.nf;const x=c2.getContext("2d");const im=x.createImageData(D.nt,D.nf);
    for(let f=0;f<D.nf;f++)for(let t=0;t<D.nt;t++){const v=SP[f*D.nt+t]/255;const col=C.cmap(api.theme==="dark"?v:v);const o=4*((D.nf-1-f)*D.nt+t);im.data[o]=col[0];im.data[o+1]=col[1];im.data[o+2]=col[2];im.data[o+3]=255}x.putImageData(im,0,0);specImg=c2}
  function drawA(){const k=A.k,c=k.c,P=api.pal();k.clear();const pl=pa();pl.axes({xt:[0,0.2,0.4,0.6,0.8,1,1.2],yt:[-1,-0.5,0,0.5,1],xl:"Tiempo (s)",yl:"Amplitud",ylgap:44});
    c.strokeStyle=P.blue;c.lineWidth=0.8;c.beginPath();const W=pl.x1-pl.x0;for(let px=0;px<W;px++){const i0=Math.floor(px/W*N),i1=Math.floor((px+1)/W*N);let lo=1,hi=-1;for(let i=i0;i<i1;i++){const v=S[i]/127;if(v<lo)lo=v;if(v>hi)hi=v}c.moveTo(pl.x0+px,pl.Y(lo));c.lineTo(pl.x0+px,pl.Y(hi))}c.stroke();
    if(cur>=0)pl.vline(cur,{color:P.orange,w:2})}
  function drawB(){const k=B.k,c=k.c,P=api.pal();k.clear();buildSpec();const pl=pb();c.imageSmoothingEnabled=true;const x0=pl.X(D.t0),x1=pl.X(D.t1);c.drawImage(specImg,x0,pl.Y(D.fmax/1000),x1-x0,pl.Y(0)-pl.Y(D.fmax/1000));
    pl.axes({xt:[0,0.2,0.4,0.6,0.8,1,1.2],yt:[0,1,2,3,4],xl:"Tiempo (s)",yl:"Frecuencia (kHz)",ylgap:40,grid:false});if(cur>=0)pl.vline(cur,{color:P.orange,w:2});
    if(hov){C.tip(c,hov.x,hov.y,[`t = ${num(hov.t,2)} s`,`f = ${thou(hov.f)} Hz`],{W:520})}}
  function draw(){drawA();drawB()}
  const lp=C.loop(api,dt=>{if(ctx&&cur>=0){cur=ctx.currentTime-t0;if(cur>D.T){cur=-1;pbtn.textContent="▶ Escuchar"}}draw();return cur>=0});
  B.k.cv.addEventListener("pointermove",e=>{const q=B.k.ptr(e),pl=pb();if(pl.inside(q)){hov={x:q.x,y:q.y,t:pl.iX(q.x),f:pl.iY(q.y)*1000}}else hov=null;drawB()});B.k.cv.addEventListener("pointerleave",()=>{hov=null;drawB()});
  function play(){try{ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();const buf=ctx.createBuffer(1,N,D.fs);const ch=buf.getChannelData(0);for(let i=0;i<N;i++)ch[i]=S[i]/127*0.6;
    if(src)try{src.stop()}catch(e){}src=ctx.createBufferSource();src.buffer=buf;src.connect(ctx.destination);t0=ctx.currentTime+0.02;src.start(t0);cur=0;pbtn.textContent="■ Reproduciendo";lp.start()}catch(e){rd.innerHTML="El navegador no permite reproducir audio aquí."}}
  const row=C.ctlRow(host);const g=C.group(row);const pbtn=C.button(g,"▶ Escuchar",play,{primary:true});
  const rd=C.readout(host);rd.innerHTML="Señal de voz simulada de 1.3 segundos con tres sílabas. En el espectrograma, las zonas más oscuras son las frecuencias con más energía en cada instante: así el audio puede procesarse como una imagen.";
  C.hint(host,"Pulsa «Escuchar» y sigue la línea naranja, o pasa el ratón por el espectrograma.");api.onTheme(()=>{specKey="";draw()});draw();
});

// =====================================================================
// Figura 27 · mapa de las doce aplicaciones
// =====================================================================
C.define("mapa-aplicaciones",function(host,opts,api){
  const [A]=C.panels(host,[{W:1040,H:550}]);const k=A.k,c=k.c;let hov=null,fam=null;
  const rows=["Datos tabulares","Imágenes","Texto","Audio"],cols=["Una categoría\n(clasificación)","Un número\n(regresión)","Una secuencia\n(texto)"];
  const FAM={C:["blue","Clasificación (5.1)","ap-5-1"],R:["ocre","Regresión (5.2)","ap-5-2"],V:["green","Visión (5.3)","ap-5-3"],P:["red","Lenguaje y voz (5.4)","ap-5-4"]};
  const items={"0,0":[["Riesgo crediticio","C"],["Diagnóstico (analíticas)","C"]],"0,1":[["Valoración inmobiliaria","R"],["Demanda de recursos","R"],["Ventas","R"]],"1,0":[["Control de calidad","V"],["Reconocimiento facial","V"],["Diagnóstico (radiografías)","C"]],
    "1,2":[["OCR","V"]],"2,0":[["Detección de spam","C"]],"2,2":[["Traducción y corrección","P"]],"3,0":[["Comandos de voz","P"]],"3,2":[["Transcripción automática","P"]]};
  const X0=200,Y0=70,CW=270,RH=106;const chips=[];
  Object.entries(items).forEach(([key,lst])=>{const [i,j]=key.split(",").map(Number);lst.forEach((it,m)=>{const yc=Y0+i*RH+RH*(m+1)/(lst.length+1);chips.push({x:X0+j*CW+18,y:yc-12,w:CW-36,h:24,t:it[0],f:it[1]})})});
  function draw(){const P=api.pal();k.clear();
    rows.forEach((r,i)=>{c.fillStyle=P.text;c.font=`700 14px ${F.ui}`;c.textAlign="right";c.fillText(r,X0-14,Y0+i*RH+RH/2+5);for(let j=0;j<3;j++){c.fillStyle=(i+j)%2===0?C.mix(P.bg,P.fillb,.45):P.bg;c.strokeStyle=P.lgray;c.lineWidth=1;c.fillRect(X0+j*CW,Y0+i*RH,CW,RH);c.strokeRect(X0+j*CW,Y0+i*RH,CW,RH)}});
    cols.forEach((t,j)=>{c.fillStyle=P.text;c.font=`700 14px ${F.ui}`;c.textAlign="center";t.split("\n").forEach((l,m)=>c.fillText(l,X0+j*CW+CW/2,26+m*18))});
    chips.forEach(ch=>{const col=P[FAM[ch.f][0]];const dim=(fam&&fam!==ch.f)||(hov&&hov.f!==ch.f&&!fam);c.globalAlpha=dim?.28:1;c.save();if(hov===ch){c.shadowColor=col;c.shadowBlur=14}c.fillStyle=col;rrect(c,ch.x,ch.y,ch.w,ch.h,10);c.fill();c.restore();
      c.fillStyle="#fff";c.font=`700 12.5px ${F.ui}`;c.textAlign="center";c.fillText(ch.t,ch.x+ch.w/2,ch.y+16.5);c.globalAlpha=1});
    let lx=X0;Object.entries(FAM).forEach(([kk,[col,l]])=>{c.globalAlpha=fam&&fam!==kk?.35:1;c.fillStyle=P[col];c.fillRect(lx,Y0+4*RH+22,14,14);c.fillStyle=P.text;c.font=`13px ${F.ui}`;c.textAlign="left";c.fillText(l,lx+20,Y0+4*RH+34);lx+=200;c.globalAlpha=1})}
  function hit(q){return chips.find(ch=>q.x>=ch.x&&q.x<=ch.x+ch.w&&q.y>=ch.y&&q.y<=ch.y+ch.h)||null}
  k.cv.addEventListener("pointermove",e=>{const h=hit(k.ptr(e));if(h!==hov){hov=h;k.cv.style.cursor=h?"pointer":"default";draw();upd()}});k.cv.addEventListener("pointerleave",()=>{hov=null;draw();upd()});
  k.cv.addEventListener("click",e=>{const h=hit(k.ptr(e));if(h){location.hash=FAM[h.f][2]}});
  const row=C.ctlRow(host);const g=C.group(row,"Familia");const setF=C.seg(g,Object.entries(FAM).map(([kk,v])=>[kk,v[1]]),kk=>{fam=fam===kk?null:kk;setF(fam);draw();upd()});
  const rd=C.readout(host);function upd(){rd.innerHTML=hov?`<b>${hov.t}</b>: ${FAM[hov.f][1]}. Pulsa para ir a su apartado.`:"Las doce aplicaciones del apartado 5 según el tipo de dato que recibe la red y el tipo de respuesta que devuelve."}
  C.hint(host,"Pasa el ratón por las aplicaciones o filtra por familia.");upd();api.onTheme(draw);draw();
});
})();
