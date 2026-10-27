/* Figuras interactivas del Módulo 8 (2) — lotes, gradientes que se desvanecen y sobreajuste */
(function(){"use strict";
const C=Curso,{num,numT,F,rgba,arrow,rrect,node,thou,sup}=C;
const sig=z=>1/(1+Math.exp(-z));
function heat(k,pl,fn,nx,ny,cache,key,levels=14,logEps){const ck=key+C.theme;if(!cache[ck]){const off=document.createElement("canvas");off.width=k.cv.width;off.height=k.cv.height;const oc=off.getContext("2d");const dpr=k.cv.width/k.W;oc.scale(dpr,dpr);
    const V=new Float64Array(nx*ny);let lo=1e9,hi=-1e9;for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){let v=fn(pl.xr[0]+(pl.xr[1]-pl.xr[0])*i/(nx-1),pl.yr[0]+(pl.yr[1]-pl.yr[0])*j/(ny-1));if(logEps)v=Math.log(v+logEps);V[j*nx+i]=v;lo=Math.min(lo,v);hi=Math.max(hi,v)}
    const cv=document.createElement("canvas");cv.width=nx;cv.height=ny;const x=cv.getContext("2d");const im=x.createImageData(nx,ny);
    for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const t=(V[j*nx+i]-lo)/(hi-lo);const lv=Math.floor(t*levels)/levels;const col=C.cmap(C.theme==="dark"?0.04+0.6*lv:1-0.95*lv);const o=4*((ny-1-j)*nx+i);im.data[o]=col[0];im.data[o+1]=col[1];im.data[o+2]=col[2];im.data[o+3]=255}
    x.putImageData(im,0,0);oc.imageSmoothingEnabled=false;oc.drawImage(cv,pl.x0,pl.y0,pl.x1-pl.x0,pl.y1-pl.y0);cache[ck]=off}
  k.c.save();k.c.setTransform(1,0,0,1,0,0);k.c.drawImage(cache[ck],0,0);k.c.restore()}
function star(c,x,y,r,fill,stroke){c.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;c.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}c.closePath();c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=1.2;c.stroke()}}
// segmentos de la curva de nivel 0.5 de una rejilla (marching squares)
function contour(G,nx,ny,lev){const seg=[];for(let j=0;j<ny-1;j++)for(let i=0;i<nx-1;i++){const a=G[j*nx+i],b=G[j*nx+i+1],c=G[(j+1)*nx+i+1],d=G[(j+1)*nx+i];const p=[];
  const e=(v1,v2,x1,y1,x2,y2)=>{if((v1-lev)*(v2-lev)<0){const t=(lev-v1)/(v2-v1);p.push([x1+(x2-x1)*t,y1+(y2-y1)*t])}};e(a,b,i,j,i+1,j);e(b,c,i+1,j,i+1,j+1);e(c,d,i+1,j+1,i,j+1);e(d,a,i,j+1,i,j);
  if(p.length===2)seg.push(p);else if(p.length===4){seg.push([p[0],p[1]]);seg.push([p[2],p[3]])}}return chain(seg)}
function chain(seg){const key=q=>q[0].toFixed(4)+","+q[1].toFixed(4);const M=new Map();seg.forEach((s,i)=>s.forEach(q=>{const k=key(q);if(!M.has(k))M.set(k,[]);M.get(k).push(i)}));const used=new Uint8Array(seg.length),out=[];
  const ext=(line,end)=>{for(;;){const q=line[end?line.length-1:0];const c=(M.get(key(q))||[]).find(i=>!used[i]);if(c===undefined)return;used[c]=1;const s=seg[c];const nq=key(s[0])===key(q)?s[1]:s[0];if(end)line.push(nq);else line.unshift(nq)}};
  seg.forEach((s,i)=>{if(used[i])return;used[i]=1;const line=[s[0],s[1]];ext(line,true);ext(line,false);out.push(line)});return out}

// =====================================================================
// Figura 36 · batch completo, mini-batch y estocástico
// =====================================================================
C.define("lotes-sgd",function(host,opts,api){
  const D=window.DATA_M8.logit,M=window.DATA_M8.f36;const X=D.X,Y=D.y,n=Y.length;
  function cost(w1,w2){let s=0;for(let i=0;i<n;i++){let p=sig(X[2*i]*w1+X[2*i+1]*w2);p=Math.min(1-1e-12,Math.max(1e-12,p));s-=Y[i]*Math.log(p)+(1-Y[i])*Math.log(1-p)}return s/n}
  const [A,B]=C.panels(host,[{W:500,H:350,sub:"(a) Recorrido durante dos épocas"},{W:500,H:350,sub:"(b) Cerca del mínimo (ampliado)"}]);
  const R={b200:["Batch completo","ocre",2],b20:["Mini-batch de 20","blue",20],b1:["Estocástico","red",400]};const P2=k=>{const p=M[k].path,o=[];for(let i=0;i<p.length;i+=2)o.push([p[i],p[i+1]]);return o};const paths={b200:P2("b200"),b20:P2("b20"),b1:P2("b1")};
  let prog=1,on={b200:true,b20:true,b1:true},ep=6,anim=-1;const cache={};
  const pa=()=>new C.Plot(A.k,[56,14,486,290],{xr:[-3.6,3.2],yr:[-2.6,3]}),pb=()=>new C.Plot(B.k,[70,14,486,290],{xr:[0,6],yr:[0.44,0.4745]});
  function draw(){const P=api.pal();
    {const k=A.k,c=k.c;k.clear();const pl=pa();heat(k,pl,cost,140,120,cache,"a",14,0);pl.axes({xt:[-3,-2,-1,0,1,2,3],yt:[-2,-1,0,1,2,3],xl:"Peso w₁",yl:"Peso w₂",grid:false,ylgap:32});
      pl.clip();Object.keys(R).forEach(kk=>{if(!on[kk])return;const p=paths[kk];const m=Math.max(1,Math.round(prog*(p.length-1)));const s=p.slice(0,m+1);const col=P[R[kk][1]];
        pl.line(s.map(q=>q[0]),s.map(q=>q[1]),{color:col,w:kk==="b1"?1.3:kk==="b200"?3:2.4});if(kk!=="b1")s.forEach(q=>pl.dot(q[0],q[1],{color:col,r:3.6}));const q=s[s.length-1];pl.dot(q[0],q[1],{color:col,r:6,stroke:"#fff",sw:2})});pl.unclip();
      pl.dot(-3,2.5,{color:"#333",r:6,stroke:"#fff",sw:1.5});pl.text("inicio",-2.8,2.75,{color:P.ink,font:`700 13px ${F.ui}`});star(c,pl.X(M.wbest[0]),pl.Y(M.wbest[1]),9,"#fff",P.ink);
      const ks=Object.keys(R).filter(kk=>on[kk]);if(ks.length){c.fillStyle=rgba(P.bg,.9);c.strokeStyle=P.lgray;c.lineWidth=1;rrect(c,62,284-ks.length*18,196,ks.length*18+2,5);c.fill();c.stroke();
        C.legend(c,ks.map(kk=>({color:P[R[kk][1]],label:`${R[kk][0]}: ${R[kk][2]} pasos`})),70,284-ks.length*18+10,{lh:18,fs:12})}}
    {const k=B.k,c=k.c;k.clear();const pl=pb();pl.axes({xt:[0,1,2,3,4,5,6],yt:[0.44,0.445,0.45,0.455,0.46,0.465,0.47],fmty:v=>num(v,3),xl:"Épocas (pasadas completas por los datos)",yl:"Coste sobre todos los datos",ylgap:52});
      pl.hline(M.best,{color:P.ink,dash:[2,3]});pl.text("mínimo",5.95,M.best,{align:"right",dy:16,color:P.text});
      const nn=Math.round(ep*200);const xs=[];for(let i=0;i<=nn;i++)xs.push(i/200);pl.clip();pl.line(xs,M.const.slice(0,nn+1),{color:P.red,w:1.4});pl.line(xs,M.decay.slice(0,nn+1),{color:P.blue,w:2});pl.unclip();
      if(ep<6)pl.vline(ep,{color:P.gray,dash:[3,3]});C.legend(c,[{color:P.red,label:"Estocástico, tasa constante"},{color:P.blue,label:"Estocástico, tasa decreciente"}],250,30,{lh:19,fs:12})}}
  const lp=C.loop(api,dt=>{if(anim>=0){anim+=dt/6;prog=Math.min(1,anim);ep=Math.min(6,anim*6);sl.set(Math.round(prog*100));if(anim>=1)anim=-1}draw();upd();return anim>=0});
  const row=C.ctlRow(host);const sl=C.slider(row,"Avance",0,100,1,100,v=>{prog=v/100;ep=6*prog;anim=-1;draw();upd()},v=>v+" %");const g=C.group(row);C.button(g,"▶ Animar",()=>{anim=0;lp.start()},{primary:true});
  const g2=C.group(row,"Mostrar");Object.keys(R).forEach(kk=>C.toggle(g2,R[kk][0],true,v=>{on[kk]=v;draw()}));
  const rd=C.readout(host);function upd(){const nn=Math.round(ep*200);rd.innerHTML=`En la misma cantidad de datos (dos épocas), el batch completo da 2 pasos, el mini-batch 20 y el estocástico 400. Época ${num(ep,2)}: coste <b>${num(M.const[nn],4)}</b> con tasa constante y <b>${num(M.decay[nn],4)}</b> con tasa decreciente (mínimo ${num(M.best,4)}).`}
  api.onTheme(draw);draw();upd();
});

// =====================================================================
// Figura 37 · época, lotes e iteraciones
// =====================================================================
C.define("epoca-lotes",function(host,opts,api){
  const N=1347,SIZES=[1,8,16,32,64,128,256,512,1347];let B=32,t=0,seed=1,run=true;
  const [A]=C.panels(host,[{W:1000,H:250}]);
  function draw(){const k=A.k,c=k.c,P=api.pal();k.clear();const nb=Math.ceil(N/B),last=N-(nb-1)*B;const x0=20,x1=980,y0=112,h=48;const cur=Math.floor(t)%nb;
    c.fillStyle=P.text;c.font=`700 19px ${F.head}`;c.textAlign="center";c.fillText(`1 época = una pasada por los ${thou(N)} ejemplos = ${thou(nb)} iteraci${nb===1?"ón":"ones"}`,500,30);arrow(c,500,44,x1,44,P.text,1.6,9);arrow(c,500,44,x0,44,P.text,1.6,9);
    const r=C.rng(seed);for(let i=0;i<nb;i++){const a=x0+(x1-x0)*i*B/N,b=x0+(x1-x0)*Math.min(N,(i+1)*B)/N;let col=i%2?P.blue2:P.blue;if(i===0)col=P.red;else if(i===1&&nb>2)col=P.ocre;else if(i===nb-1&&nb>1)col=P.green;
      c.globalAlpha=i<cur?0.35:1;c.fillStyle=col;c.fillRect(a,y0,Math.max(0.6,b-a-(b-a>4?1.2:0)),h);c.globalAlpha=1;
      if(i===cur){c.strokeStyle=P.orange;c.lineWidth=3;c.strokeRect(a-1,y0-4,Math.max(3,b-a+1),h+8)}}
    c.font=`15px ${F.ui}`;c.textAlign="left";c.fillStyle=P.red;c.fillText("Lote 1",x0,94);if(nb>2){c.fillStyle=P.ocre;const a=x0+(x1-x0)*B/N;c.fillText("Lote 2",Math.max(x0+60,a+8),94)}
    if(nb>1){c.fillStyle=P.green;c.textAlign="right";c.fillText(`Lote ${thou(nb)} (${thou(last)} ejemplo${last===1?"":"s"})`,x1,94)}
    c.fillStyle=P.text;c.textAlign="center";c.font=`16px ${F.ui}`;c.fillText(`Antes de cada época se barajan los ejemplos y se reparten en lotes de ${thou(B)}`,500,196);
    c.fillStyle=P.red;c.fillText("1 iteración = calcular el gradiente con un lote y actualizar los pesos una vez",500,226)}
  const lp=C.loop(api,dt=>{if(run){const nb=Math.ceil(N/B);t+=dt*Math.min(30,Math.max(2,nb/4));if(t>=nb){t=0;seed++}}draw();upd();return true});
  const row=C.ctlRow(host);C.slider(row,"Tamaño del lote",0,SIZES.length-1,1,3,v=>{B=SIZES[v];t=0;upd();lp.kick()},v=>thou(SIZES[v]));const g=C.group(row);C.toggle(g,"Recorrer la época",true,v=>{run=v;lp.kick()});C.button(g,"Barajar",()=>{seed++;t=0;lp.kick()});
  const rd=C.readout(host);function upd(){const nb=Math.ceil(N/B);rd.innerHTML=`Con lotes de ${thou(B)}: ${thou(nb)} actualizaciones de los pesos por época${B===1?" (estocástico)":B===N?" (batch completo)":" (mini-batch)"}. Procesando el lote ${thou(Math.floor(t)%nb+1)} de ${thou(nb)}.`}
  api.onTheme(()=>lp.kick());lp.start();upd();
});

// =====================================================================
// Figura 38 · tamaño de lote: por época y por tiempo
// =====================================================================
C.define("lotes-tiempo",function(host,opts,api){
  const D=window.DATA_M8.f38;const K=[["1","Estocástico (lote de 1)","red"],["32","Mini-batch (lote de 32)","blue"],["1347","Batch completo (1347)","ocre"]];
  const [A,B]=C.panels(host,[{W:500,H:320,sub:"(a) Pérdida por época"},{W:500,H:320,sub:"(b) Pérdida según el tiempo de cálculo"}]);let T=0.6,on={1:true,32:true,1347:true},anim=-1;
  const pa=()=>new C.Plot(A.k,[60,14,486,262],{xr:[-1,31],yr:[0,2.4]}),pb=()=>new C.Plot(B.k,[60,14,486,262],{xr:[0,0.6],yr:[0,2.4]});
  const val=(kk,ep)=>{const h=D[kk].h,i=Math.min(h.length-1,Math.floor(ep)),f=ep-i;return i+1<h.length?h[i]*(1-f)+h[i+1]*f:h[i]};
  function draw(){const P=api.pal();const tm=anim>=0?anim:T;
    {const k=A.k,c=k.c;k.clear();const pl=pa();pl.axes({xt:[0,5,10,15,20,25,30],yt:[0,0.5,1,1.5,2],xl:"Épocas",yl:"Pérdida en entrenamiento",ylgap:42});
      K.forEach(([kk,l,col])=>{if(!on[kk])return;const h=D[kk].h.slice(0,31);const epn=Math.min(30,tm/D[kk].budget*D[kk].ep_budget);pl.line(h.map((_,i)=>i),h,{color:P[col],w:2.6});pl.dot(epn,val(kk,epn),{color:P[col],r:5.5,stroke:P.bg,sw:2})});
      C.legend(c,K.filter(([kk])=>on[kk]).map(([,l,col])=>({color:P[col],label:l})),250,30,{lh:19,fs:12})}
    {const k=B.k,c=k.c;k.clear();const pl=pb();pl.axes({xt:[0,0.1,0.2,0.3,0.4,0.5,0.6],yt:[0,0.5,1,1.5,2],xl:"Tiempo de cálculo (segundos, CPU)",yl:"Pérdida en entrenamiento",ylgap:42});
      K.forEach(([kk,l,col])=>{if(!on[kk])return;const d=D[kk];const n=d.ep_budget;const xs=[],ys=[];for(let i=0;i<=n;i++){const x=i*d.budget/n;if(x>tm)break;xs.push(x);ys.push(d.h[i])}pl.line(xs,ys,{color:P[col],w:2.4});if(xs.length)pl.dot(xs[xs.length-1],ys[ys.length-1],{color:P[col],r:5.5,stroke:P.bg,sw:2})});
      pl.vline(tm,{color:P.gray,dash:[3,3]});C.legend(c,K.filter(([kk])=>on[kk]).map(([,l,col])=>({color:P[col],label:l})),250,30,{lh:19,fs:12})}}
  const lp=C.loop(api,dt=>{if(anim>=0){anim+=dt*0.12;if(anim>=0.6){anim=-1;T=0.6;sl.set(0.6)}else sl.set(anim)}draw();upd();return anim>=0});
  const row=C.ctlRow(host);const sl=C.slider(row,"Tiempo de cálculo",0,0.6,0.01,0.6,v=>{T=v;anim=-1;draw();upd()},v=>num(v,2)+" s");const g=C.group(row);C.button(g,"▶ Carrera",()=>{anim=0;lp.start()},{primary:true});
  const g2=C.group(row,"Mostrar");K.forEach(([kk,l])=>C.toggle(g2,l.split(" (")[0],true,v=>{on[kk]=v;draw()}));
  const rd=C.readout(host);function upd(){const tm=anim>=0?anim:T;rd.innerHTML=`En ${num(tm,2)} s de cálculo: `+K.map(([kk,l])=>{const d=D[kk];const e=Math.min(d.ep_budget,Math.floor(tm/d.budget*d.ep_budget+1e-9));return `${l.split(" (")[0].toLowerCase()} ${thou(e)} época${e===1?"":"s"}, pérdida <b>${num(d.h[e],3)}</b>`}).join(" · ")+". Los puntos de (a) marcan hasta qué época llega cada uno en ese tiempo."}
  api.onTheme(draw);draw();upd();
});

// =====================================================================
// Figura 39 · multiplicar capa a capa
// =====================================================================
C.define("factores",function(host,opts,api){
  const D=window.DATA_M8.f39;const [A,B]=C.panels(host,[{W:500,H:330,sub:"(a) Efecto de multiplicar capa a capa"},{W:500,H:330,sub:"(b) Medido en una red de 10 capas ocultas"}]);
  let fac=0.8,L=20,on={big:true,he:true,sig:true},anim=-1;
  const FS=[[1.5,"red",[]],[1.1,"ocre",[7,5]],[1.0,"ink",[2,4]],[0.9,"blue2",[7,5]],[0.5,"blue",[]],[0.25,"green",[]]];
  const pa=()=>new C.Plot(A.k,[70,14,486,272],{xr:[0,20],yr:[1e-12,1e5],ylog:true}),pb=()=>new C.Plot(B.k,[70,14,486,272],{xr:[0.5,10.5],yr:[1e-7,1e3],ylog:true});
  const S={big:["ReLU con pesos iniciales demasiado grandes","red"],he:["ReLU con inicialización de He","blue"],sig:["Sigmoide","green"]};
  function draw(){const P=api.pal();const lim=anim>=0?anim:L;
    {const k=A.k,c=k.c;k.clear();const pl=pa();pl.axes({xt:[0,5,10,15,20],yt:[1e-12,1e-10,1e-8,1e-6,1e-4,1e-2,1,1e2,1e4],ylab:v=>"10"+sup(Math.round(Math.log10(v))),xl:"Número de capas que atraviesa la señal",yl:"Tamaño relativo de la señal",ylgap:52});
      pl.clip();FS.forEach(([f,col,d])=>pl.fn(x=>f**x,{color:P[col],w:2.4,dash:d,from:0,to:lim}));pl.fn(x=>fac**x,{color:P.orange,w:3.4,from:0,to:lim});pl.unclip();
      pl.dot(lim,Math.max(1e-12,Math.min(1e5,fac**lim)),{color:P.orange,r:6,stroke:P.bg,sw:2});pl.text("explota",19.6,2e4,{align:"right",color:P.red});pl.text("se desvanece",19.6,1e-10,{align:"right",color:P.green});
      C.legend(c,FS.slice(0,3).map(([f,col,d])=>({color:P[col],dash:d,label:"factor "+(f===0.25?"0.25":num(f,1))})),84,186,{lh:17,fs:11.5});C.legend(c,FS.slice(3).map(([f,col,d])=>({color:P[col],dash:d,label:"factor "+(f===0.25?"0.25":num(f,1))})),206,186,{lh:17,fs:11.5});
      C.legend(c,[{color:P.orange,w:3.4,label:"tu factor: "+numT(fac,2)}],330,186,{fs:11.5})}
    {const k=B.k,c=k.c;k.clear();const pl=pb();pl.axes({xt:[1,2,3,4,5,6,7,8,9,10],yt:[1e-7,1e-5,1e-3,1e-1,10,1e3],ylab:v=>"10"+sup(Math.round(Math.log10(v))),xl:"Capa oculta (1 = la más cercana a la entrada)",yl:"Señal de error δ (capa 10 = 1)",ylgap:52});
      arrow(c,pl.X(9.8),pl.Y(3e2),pl.X(1.4),pl.Y(3e2),P.text,1.5,9);c.fillStyle=P.text;c.font=`12.5px ${F.ui}`;c.textAlign="center";c.fillText("sentido de la retropropagación",pl.X(5.6),pl.Y(3e2)-8);
      const reach=anim>=0?Math.max(1,10-anim/2):1;
      Object.keys(S).forEach(kk=>{if(!on[kk])return;const d=D[kk],col=P[S[kk][1]];const xs=[],ys=[];for(let i=9;i>=0;i--){if(i+1<reach-1e-9)break;xs.push(i+1);ys.push(d[i])}pl.line(xs,ys,{color:col,w:2.4});xs.forEach((x,i)=>pl.dot(x,ys[i],{color:col,r:5}))});
      C.legend(c,Object.keys(S).filter(kk=>on[kk]).map(kk=>({color:P[S[kk][1]],label:S[kk][0]})),236,222,{lh:17,fs:11.5})}}
  const lp=C.loop(api,dt=>{if(anim>=0){anim+=dt*6;if(anim>=20){anim=-1}}draw();return anim>=0});
  const row=C.ctlRow(host);C.slider(row,"Tu factor por capa",0.2,1.6,0.01,fac,v=>{fac=v;draw();upd()},v=>numT(v,2));const g=C.group(row);C.button(g,"▶ Animar",()=>{anim=0;lp.start()},{primary:true});
  const g2=C.group(row,"Red de (b)");Object.keys(S).forEach(kk=>C.toggle(g2,{big:"ReLU, pesos grandes",he:"ReLU + He",sig:"Sigmoide"}[kk],true,v=>{on[kk]=v;draw()}));
  const rd=C.readout(host);function upd(){const v=fac**20;rd.innerHTML=`Con un factor de ${numT(fac,2)} por capa, tras 20 capas la señal mide ${C.sci(v,1)} veces su tamaño inicial${fac>1.001?": <b>explota</b>":fac<0.999?": <b>se desvanece</b>":": se conserva"}. En la red medida, la señal que llega a la primera capa es ${C.sci(D.sig[0],1)} con sigmoide, ${num(D.he[0],2)} con ReLU y He y ${num(D.big[0],1)} con pesos demasiado grandes.`}
  api.onTheme(draw);draw();upd();
});

// =====================================================================
// Figura 41 · bloque normal y bloque residual
// =====================================================================
C.define("residual",function(host,opts,api){
  const [A,B]=C.panels(host,[{W:500,H:340,sub:"(a) Bloque normal"},{W:500,H:340,sub:"(b) Bloque residual"}]);let f=0.5,t=0;
  function block(Q,res){const k=Q.k,c=k.c,P=api.pal();k.clear();const cx=res?220:250;
    c.fillStyle=P.text;c.font=`17px ${F.ui}`;c.textAlign="center";c.fillText("entrada x",cx,28);
    const box=(y,l)=>{c.fillStyle=P.fillb;c.strokeStyle=P.blue;c.lineWidth=2;rrect(c,cx-75,y,150,40,7);c.fill();c.stroke();c.fillStyle=P.text;c.font=`700 16px ${F.ui}`;c.fillText(l,cx,y+26)};
    arrow(c,cx,38,cx,64,P.text,2,9);box(66,"Capa densa + ReLU");arrow(c,cx,106,cx,138,P.text,2,9);box(140,"Capa densa");
    if(res){arrow(c,cx,180,cx,210,P.text,2,9);c.strokeStyle=P.green;c.lineWidth=2.4;c.beginPath();c.arc(cx,226,14,0,7);c.stroke();c.fillStyle=P.green;c.font=`700 22px ${F.ui}`;c.fillText("+",cx,234);
      c.beginPath();c.moveTo(cx,50);c.lineTo(cx+130,50);c.lineTo(cx+130,226);c.lineTo(cx+22,226);c.stroke();arrow(c,cx+40,226,cx+16,226,P.green,2.4,10);
      c.fillStyle=P.green;c.font=`700 15px ${F.ui}`;c.fillText("atajo:",cx+205,96);c.fillText("se suma x",cx+205,114);c.fillText("sin cambios",cx+205,132);
      arrow(c,cx,240,cx,262,P.text,2,9);c.fillStyle=P.text;c.font=`700 16px ${F.ui}`;c.fillText("salida = F(x) + x",cx,284);c.fillStyle=P.green;c.font=`14.5px ${F.ui}`;c.fillText("La señal de error tiene un camino directo",cx,310);c.fillText("que no se multiplica",cx,328)}
    else{arrow(c,cx,180,cx,240,P.text,2,9);c.fillStyle=P.text;c.font=`700 16px ${F.ui}`;c.fillText("salida = F(x)",cx,264);c.fillStyle=P.red;c.font=`14.5px ${F.ui}`;c.fillText("La señal de error atraviesa todas las capas",cx,294);c.fillText("y se multiplica en cada una",cx,312)}
    // pulsos de error hacia atrás
    const u=(t%3)/3;const main=[[cx,res?208:236],[cx,160],[cx,86],[cx,46]];const seg=Math.min(2.999,u*3);const i=Math.floor(seg),fr=seg-i;const sz=[1,f,f*f][i]*(1-fr)+[f,f*f,f*f][i]*fr;const p0=main[i],p1=main[i+1];
    const r=3+7*Math.min(1.4,Math.sqrt(sz));c.fillStyle=rgba(P.red,0.8);c.beginPath();c.arc(p0[0],p0[1]+(p1[1]-p0[1])*fr,r,0,7);c.fill();
    if(res){const L=[[cx+30,226],[cx+130,226],[cx+130,50],[cx,50]];const tot=100+176+130;let d=u*tot;let j=0;const lens=[100,176,130];while(j<2&&d>lens[j]){d-=lens[j];j++}const q0=L[j],q1=L[j+1],fr2=Math.min(1,d/lens[j]);
      c.fillStyle=rgba(P.green,0.8);c.beginPath();c.arc(q0[0]+(q1[0]-q0[0])*fr2,q0[1]+(q1[1]-q0[1])*fr2,10,0,7);c.fill()}
    c.fillStyle=P.muted;c.font=`12px ${F.ui}`;c.textAlign="left";c.fillText("● señal de error (hacia atrás)",8,16)}
  const lp=C.loop(api,dt=>{t+=dt;block(A,false);block(B,true);return true});
  const row=C.ctlRow(host);C.slider(row,"Factor de cada capa",0.1,1.5,0.05,f,v=>{f=v;upd()},v=>numT(v,2));
  const rd=C.readout(host);function upd(){rd.innerHTML=`Si cada capa multiplica la señal de error por ${numT(f,2)}, al salir del bloque normal mide ${numT(f*f,3)}. En el bloque residual se suma además el atajo, que la deja pasar sin cambios: ${numT(f*f,3)} + 1 = <b>${numT(f*f+1,3)}</b>. Tras 10 bloques normales quedaría ${C.sci(f**20,1)}.`}
  upd();api.onTheme(()=>lp.kick());lp.start();
});

// =====================================================================
// Figura 43 · curvas de aprendizaje y fronteras de decisión
// =====================================================================
C.define("sobreajuste-curvas",function(host,opts,api){
  const D=window.DATA_M8.f43;const [nx,ny]=D.grid;const G=D.snaps.map(s=>{const b=atob(s),a=new Float32Array(b.length);for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i)/255;return a});
  const SEG=G.map(g=>contour(g,nx,ny,0.5));const iBest=D.snapE.indexOf(D.best);let si=D.snapE.length-1,anim=-1,showVal=false;
  const [A,B]=C.panels(host,[{W:500,H:330,sub:"(a) Curvas de aprendizaje"},{W:500,H:330,sub:"(b) Fronteras de decisión"}]);
  const pa=()=>new C.Plot(A.k,[60,14,486,272],{xr:[0,3000],yr:[0,3.3]}),pb=()=>new C.Plot(B.k,[60,14,486,272],{xr:D.xr,yr:D.yr});let drag=false;
  function drawSeg(pl,seg,col,w,dash){const c=pl.c;c.strokeStyle=col;c.lineWidth=w;c.setLineDash(dash);c.beginPath();const sx=(D.xr[1]-D.xr[0])/(nx-1),sy=(D.yr[1]-D.yr[0])/(ny-1);seg.forEach(line=>line.forEach((q,i)=>{const X=pl.X(D.xr[0]+q[0]*sx),Y=pl.Y(D.yr[0]+q[1]*sy);i?c.lineTo(X,Y):c.moveTo(X,Y)}));c.lineJoin="round";c.stroke();c.setLineDash([])}
  function draw(){const P=api.pal();const E=D.snapE[si];
    {const k=A.k,c=k.c;k.clear();const pl=pa();const xs=D.htr.map((_,i)=>i);pl.area(xs,D.hva,0,P.fillr,0.8);pl.area(xs,D.htr,0,P.bg,1);
      pl.axes({xt:[0,500,1000,1500,2000,2500,3000],yt:[0,0.5,1,1.5,2,2.5,3],xl:"Época",yl:"Pérdida (entropía cruzada)",ylgap:42});pl.line(xs,D.htr,{color:P.blue,w:2.4});pl.line(xs,D.hva,{color:P.red,w:2.4});
      pl.vline(D.best,{color:P.green,dash:[5,4],w:1.6});pl.text("mínimo de validación\n(época 35): parada temprana",130,2.05,{color:P.green,fs:12});pl.text("brecha creciente:\nsobreajuste",2000,1.85,{color:P.red,align:"center",fs:12.5});
      pl.vline(E,{color:P.orange,w:2});pl.dot(E,D.htr[E],{color:P.blue,r:6,stroke:P.bg,sw:2});pl.dot(E,D.hva[E],{color:P.red,r:6,stroke:P.bg,sw:2});c.fillStyle=P.orange;c.font=`700 12px ${F.ui}`;c.textAlign=E>2600?"right":"left";c.fillText("época "+thou(E),pl.X(E)+(E>2600?-6:6),pl.y0+12);
      C.legend(c,[{color:P.blue,label:"Entrenamiento (80 ejemplos)"},{color:P.red,label:"Validación (1000 ejemplos)"}],240,200,{lh:19,fs:12})}
    {const k=B.k,c=k.c;k.clear();const pl=pb();pl.axes({xt:[-2,-1,0,1,2,3],yt:[-1.5,-1,-0.5,0,0.5,1,1.5,2],xl:"x₁",yl:"x₂",ylgap:38});pl.clip();
      const pts=(Xs,Ys,a,r)=>{for(let i=0;i<Ys.length;i++){const x=pl.X(Xs[2*i]),y=pl.Y(Xs[2*i+1]);c.globalAlpha=a;if(Ys[i]){c.fillStyle=P.red;c.fillRect(x-r,y-r,2*r,2*r)}else{c.fillStyle=P.blue;c.beginPath();c.arc(x,y,r,0,7);c.fill()}}c.globalAlpha=1};
      if(showVal)pts(D.Xva,D.yva,0.28,2.6);pts(D.Xtr,D.ytr,1,4);drawSeg(pl,SEG[iBest],P.green,2.8,[]);if(si!==iBest)drawSeg(pl,SEG[si],P.ink,2.2,[7,5]);pl.unclip();
      const a=D.accs[si],b=D.accs[iBest];c.fillStyle=rgba(P.bg,.92);c.strokeStyle=P.lgray;rrect(c,70,206,262,58,6);c.fill();c.stroke();c.fillStyle=P.text;c.font=`12px ${F.ui}`;c.textAlign="left";c.fillText("Acierto (entrenamiento / validación)",78,222);
      C.legend(c,[{color:P.green,label:`Época 35: ${Math.round(b[0]*100)} % / ${Math.round(b[1]*100)} %`}].concat(si!==iBest?[{color:P.ink,dash:[7,5],label:`Época ${thou(D.snapE[si])}: ${Math.round(a[0]*100)} % / ${Math.round(a[1]*100)} %`}]:[]),80,238,{lh:17,fs:12})}}
  const lp=C.loop(api,dt=>{if(anim>=0){anim+=dt*4;si=Math.min(D.snapE.length-1,Math.floor(anim));sl.set(si);if(anim>=D.snapE.length)anim=-1}draw();upd();return anim>=0});
  function near(E){let b=0;D.snapE.forEach((e,i)=>{if(Math.abs(e-E)<Math.abs(D.snapE[b]-E))b=i});return b}
  A.k.cv.addEventListener("pointerdown",e=>{drag=true;A.k.cv.setPointerCapture(e.pointerId);mv(e)});A.k.cv.addEventListener("pointermove",e=>{A.k.cv.style.cursor="ew-resize";if(drag)mv(e)});A.k.cv.addEventListener("pointerup",()=>drag=false);
  function mv(e){si=near(pa().iX(A.k.ptr(e).x));anim=-1;sl.set(si);draw();upd()}
  const row=C.ctlRow(host);const sl=C.slider(row,"Época",0,D.snapE.length-1,1,si,v=>{si=v;anim=-1;draw();upd()},v=>thou(D.snapE[v]));const g=C.group(row);C.button(g,"▶ Entrenar",()=>{anim=0;lp.start()},{primary:true});C.button(g,"Parada temprana (35)",()=>{si=iBest;sl.set(si);draw();upd()});
  C.toggle(g,"Ver datos de validación",false,v=>{showVal=v;draw()});
  const rd=C.readout(host);function upd(){const E=D.snapE[si],a=D.accs[si];rd.innerHTML=`Época ${thou(E)}: pérdida ${num(D.htr[E],3)} en entrenamiento y ${num(D.hva[E],3)} en validación; acierto ${Math.round(a[0]*100)} % y ${Math.round(a[1]*100)} %. ${E>D.best?"La frontera se retuerce para acertar ejemplos sueltos del entrenamiento: memoriza en lugar de generalizar.":E===D.best?"Es el punto de menor pérdida de validación: la parada temprana conserva estos pesos.":"La red todavía está aprendiendo el patrón general."}`}
  C.hint(host,"Arrastra sobre las curvas de (a) para elegir la época.");api.onTheme(draw);draw();upd();
});

// =====================================================================
// Figura 44 · dropout
// =====================================================================
C.define("dropout",function(host,opts,api){
  const [A,B]=C.panels(host,[{W:500,H:330,sub:"(a) Red completa (predicción)"},{W:500,H:330,sub:"(b) Un paso de entrenamiento con dropout"}]);
  let p=1/3,mask=[[1,0,1,1,0,1],[1,1,0,1,1,0]],auto=false,tm=0,steps=1;
  const LX=[60,190,320,450],ys=n=>Array.from({length:n},(_,i)=>165+(i-(n-1)/2)*47);
  function net(Q,m){const k=Q.k,c=k.c,P=api.pal();k.clear();const L=[ys(4),ys(6),ys(6),[165]];const alive=(l,i)=>l===0||l===3||!m||m[l-1][i];
    c.strokeStyle=P.lgray;c.lineWidth=1.1;for(let l=0;l<3;l++)L[l].forEach((y0,i)=>L[l+1].forEach((y1,j)=>{if(alive(l,i)&&alive(l+1,j)){c.beginPath();c.moveTo(LX[l],y0);c.lineTo(LX[l+1],y1);c.stroke()}}));
    L.forEach((col,l)=>col.forEach((y,i)=>{if(l===0)node(c,LX[l],y,15,P.node,P.blue,"",{lw:2.6});else if(l===3)node(c,LX[l],y,15,P.green,P.green,"");else if(alive(l,i))node(c,LX[l],y,15,P.red,P.red,"");
      else{c.setLineDash([4,3]);c.strokeStyle=P.lgray;c.lineWidth=2;c.beginPath();c.arc(LX[l],y,15,0,7);c.stroke();c.setLineDash([]);c.strokeStyle=P.red;c.lineWidth=2.6;c.beginPath();c.moveTo(LX[l]-8,y-8);c.lineTo(LX[l]+8,y+8);c.moveTo(LX[l]+8,y-8);c.lineTo(LX[l]-8,y+8);c.stroke()}}))}
  function resample(){mask=mask.map(r=>r.map(()=>Math.random()<p?0:1));steps++;upd()}
  function draw(){net(A,null);net(B,mask)}
  const lp=C.loop(api,dt=>{if(auto){tm+=dt;if(tm>1.1){tm=0;resample()}}draw();return auto});
  const row=C.ctlRow(host);C.slider(row,"Probabilidad de apagar (p)",0,0.7,0.05,p,v=>{p=v;resample();draw()},v=>Math.round(v*100)+" %");const g=C.group(row);C.button(g,"Nuevo paso",()=>{resample();draw()},{primary:true});
  C.toggle(g,"Pasos automáticos",false,v=>{auto=v;if(v)lp.start();else lp.stop()});
  const rd=C.readout(host);function upd(){const off=mask.flat().filter(v=>!v).length;rd.innerHTML=`Paso ${thou(steps)} de entrenamiento: se han apagado al azar <b>${off}</b> de las 12 neuronas ocultas (con p = ${Math.round(p*100)} % se apagan de media ${num(12*p,1)}). En cada paso el sorteo cambia, así que ninguna neurona puede depender de otra concreta. Al predecir (a) se usan todas.`}
  api.onTheme(draw);draw();upd();
});
})();
