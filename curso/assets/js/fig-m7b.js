/* Figuras interactivas del Módulo 7 (2) — apartados 3 y 4 */
(function(){"use strict";
const C=Curso,{num,numT,F,rgba,arrow,rrect,node,ease}=C;
const sig=z=>1/(1+Math.exp(-z));
function b64u8(s){const b=atob(s),a=new Uint8Array(b.length);for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return a}

// ---------------------------------------------------------------- red densa pequeña para entrenar en el navegador
function makeMLP(sizes,act,seed){const r=C.rng(seed),g=C.gauss(r);const W=[],B=[];for(let l=0;l<sizes.length-1;l++){const fi=sizes[l],fo=sizes[l+1];const sd=act==="relu"?Math.sqrt(2/fi):Math.sqrt(1/fi);W.push(Float64Array.from({length:fi*fo},()=>g()*sd));B.push(new Float64Array(fo))}
  const m=W.map(w=>new Float64Array(w.length)),v=W.map(w=>new Float64Array(w.length)),mb=B.map(b=>new Float64Array(b.length)),vb=B.map(b=>new Float64Array(b.length));
  const A={identity:[z=>z,()=>1],relu:[z=>z>0?z:0,z=>z>0?1:0],tanh:[z=>Math.tanh(z),(z,a)=>1-a*a],sigmoid:[sig,(z,a)=>a*(1-a)]}[act];
  let t=0;
  function fwd(x){const as=[x],zs=[];for(let l=0;l<W.length;l++){const fi=sizes[l],fo=sizes[l+1],a=as[l],z=new Float64Array(fo),o=new Float64Array(fo);for(let j=0;j<fo;j++){let s=B[l][j];for(let i=0;i<fi;i++)s+=W[l][j*fi+i]*a[i];z[j]=s;o[j]=l===W.length-1?sig(s):A[0](s)}zs.push(z);as.push(o)}return{as,zs}}
  function prob(x){return fwd(x).as[W.length][0]}
  function epoch(X,Y,lr){const gW=W.map(w=>new Float64Array(w.length)),gB=B.map(b=>new Float64Array(b.length));const n=Y.length;
    for(let k=0;k<n;k++){const {as,zs}=fwd([X[2*k],X[2*k+1]]);let d=new Float64Array([(as[W.length][0]-Y[k])/n]);
      for(let l=W.length-1;l>=0;l--){const fi=sizes[l],fo=sizes[l+1];const dn=new Float64Array(fi);for(let j=0;j<fo;j++){gB[l][j]+=d[j];for(let i=0;i<fi;i++){gW[l][j*fi+i]+=d[j]*as[l][i];dn[i]+=d[j]*W[l][j*fi+i]}}
        if(l>0){for(let i=0;i<fi;i++)dn[i]*=A[1](zs[l-1][i],as[l][i])}d=dn}}
    t++;const b1=.9,b2=.999,c1=1-b1**t,c2=1-b2**t;const up=(P,G,M,V)=>{for(let i=0;i<P.length;i++){M[i]=b1*M[i]+(1-b1)*G[i];V[i]=b2*V[i]+(1-b2)*G[i]*G[i];P[i]-=lr*(M[i]/c1)/(Math.sqrt(V[i]/c2)+1e-8)}};
    for(let l=0;l<W.length;l++){up(W[l],gW[l],m[l],v[l]);up(B[l],gB[l],mb[l],vb[l])}}
  return{prob,epoch,get t(){return t}}}

// =====================================================================
// Figura 12 · sin activación frente a ReLU
// =====================================================================
C.define("activacion-frontera",function(host,opts,api){
  const D=window.DATA_M7.f12;const X=D.X,Y=D.y,n=Y.length;const [GW,GH]=D.grid;
  const pre={identity:b64u8(D.identity.P),relu:b64u8(D.relu.P)};
  const panelsL=C.panels(host,[{W:500,H:320,sub:"(a) Sin activación: la red equivale a una recta"},{W:500,H:320,sub:"(b) Con ReLU: la frontera puede curvarse"}]);
  let live=null,actB="relu",running=false,epochs=0;
  function accOf(fnP){let ok=0;for(let k=0;k<n;k++){if((fnP(X[2*k],X[2*k+1])>.5)===(Y[k]===1))ok++}return ok/n}
  function drawPanel(P_,which){const k=P_.k,c=k.c,P=api.pal();k.clear();const box=[16,10,484,300];const pl=new C.Plot(k,box,{xr:D.xr,yr:D.yr});
    const img=c.createImageData(GW,GH);let probAt;
    if(live){const net=live[which];probAt=(x,y)=>net.prob([x,y])}
    const lb=hex(P.fillb),lr=hex(P.fillr);
    const val=(i,j)=>{const x=D.xr[0]+(i/(GW-1))*(D.xr[1]-D.xr[0]),y=D.yr[0]+(j/(GH-1))*(D.yr[1]-D.yr[0]);return(live?probAt(x,y):pre[which==="a"?"identity":"relu"][j*GW+i]/255)-.5};
    const V=[];for(let j=0;j<GH;j++){V.push([]);for(let i=0;i<GW;i++)V[j].push(val(i,j))}
    for(let j=0;j<GH;j++)for(let i=0;i<GW;i++){const col=V[j][i]>0?lr:lb;const o=4*((GH-1-j)*GW+i);img.data[o]=col[0];img.data[o+1]=col[1];img.data[o+2]=col[2];img.data[o+3]=255}
    const tmp=document.createElement("canvas");tmp.width=GW;tmp.height=GH;tmp.getContext("2d").putImageData(img,0,0);c.imageSmoothingEnabled=false;c.drawImage(tmp,box[0],box[1],box[2]-box[0],box[3]-box[1]);c.imageSmoothingEnabled=true;
    // contorno 0.5
    c.strokeStyle=P.ink;c.lineWidth=2;c.beginPath();
    const cw=(box[2]-box[0])/(GW-1),ch=(box[3]-box[1])/(GH-1);
    for(let j=0;j<GH-1;j++)for(let i=0;i<GW-1;i++){const a=V[j][i],b=V[j][i+1],cc=V[j+1][i+1],d=V[j+1][i];const pts=[];const X0=box[0]+i*cw,Y0=box[3]-j*ch;
      const e=(v1,v2,x1,y1,x2,y2)=>{if(v1*v2<0){const t=v1/(v1-v2);pts.push([x1+(x2-x1)*t,y1+(y2-y1)*t])}};e(a,b,X0,Y0,X0+cw,Y0);e(b,cc,X0+cw,Y0,X0+cw,Y0-ch);e(cc,d,X0+cw,Y0-ch,X0,Y0-ch);e(d,a,X0,Y0-ch,X0,Y0);
      if(pts.length>=2){c.moveTo(pts[0][0],pts[0][1]);c.lineTo(pts[1][0],pts[1][1])}}c.stroke();
    for(let q=0;q<n;q++){c.fillStyle=Y[q]?P.red:P.blue;c.strokeStyle="#fff";c.lineWidth=1;c.beginPath();c.arc(pl.X(X[2*q]),pl.Y(X[2*q+1]),4.6,0,7);c.fill();c.stroke()}
    const acc=live?accOf((x,y)=>live[which].prob([x,y])):(which==="a"?D.identity.acc:D.relu.acc);
    c.font=`13px ${F.ui}`;const lab=`Acierto: ${num(acc*100,0)} %`;const w=c.measureText(lab).width+16;c.fillStyle=P.bg;c.strokeStyle=P.lgray;rrect(c,box[0]+8,box[3]-34,w,26,6);c.fill();c.stroke();c.fillStyle=P.text;c.textAlign="left";c.fillText(lab,box[0]+16,box[3]-16);
    c.font=`italic 14px Georgia,serif`;c.fillStyle=P.axis;c.textAlign="center";c.fillText("x₁",(box[0]+box[2])/2,316);
  }
  function hex(h){if(h.startsWith("rgb")){return h.match(/\d+/g).map(Number)}const v=parseInt(h.slice(1),16);return[v>>16,(v>>8)&255,v&255]}
  function draw(){drawPanel(panelsL[0],"a");drawPanel(panelsL[1],"b")}
  let fr_=0;const lp=C.loop(api,dt=>{if(running&&live){for(let s=0;s<4;s++){live.a.epoch(X,Y,0.01);live.b.epoch(X,Y,0.01)}epochs+=4;if(epochs>=800)running=false;upd()}if(!running||++fr_%3===0)draw();return running});
  const row=C.ctlRow(host);const g=C.group(row);
  const tb=C.button(g,"▶ Entrenar en directo",()=>{if(!running){live={a:makeMLP([2,16,16,1],"identity",epochs+3),b:makeMLP([2,16,16,1],actB,epochs+3)};epochs=0;running=true;lp.start();tb.textContent="❚❚ Pausa"}else{running=false;tb.textContent="▶ Continuar"}upd()},{primary:true});
  C.button(g,"Resultado del documento",()=>{live=null;running=false;tb.textContent="▶ Entrenar en directo";epochs=0;draw();upd()});
  const g2=C.group(row,"Activación en (b)");const setA=C.seg(g2,[["relu","ReLU"],["tanh","Tanh"],["sigmoid","Sigmoide"]],kk=>{actB=kk;setA(kk);panelsL[1].p._sub.textContent=kk==="relu"?"(b) Con ReLU: la frontera puede curvarse":`(b) Con ${kk==="tanh"?"tanh":"sigmoide"}: la frontera puede curvarse`;live={a:makeMLP([2,16,16,1],"identity",7),b:makeMLP([2,16,16,1],actB,7)};epochs=0;running=true;tb.textContent="❚❚ Pausa";lp.start();upd()});
  const rd=C.readout(host);
  function upd(){rd.innerHTML=live?`Red 2-16-16-1 entrenándose en directo: época <b>${epochs}</b>. Sin activación, por muchas capas que tenga, la frontera sigue siendo una recta; con activación, se dobla para seguir la forma de los datos.`:`Mismos 160 puntos y misma red de dos capas ocultas de 16 neuronas, entrenada sin activación (${num(D.identity.acc*100,0)} % de acierto) y con ReLU (${num(D.relu.acc*100,0)} %).`}
  setA("relu");api.onTheme(()=>lp.kick());upd();lp.kick();
});

// =====================================================================
// Figuras 13–15 · sigmoide, tanh y ReLU con punto arrastrable
// =====================================================================
function curvePair(host,api,cfg){
  const [A,B]=C.panels(host,[{W:500,H:330,sub:cfg.subA},{W:500,H:330,sub:cfg.subB}]);
  let z=cfg.z0,drag=null;const st=cfg.state||{};
  const pa=()=>new C.Plot(A.k,[62,20,484,272],{xr:cfg.xr,yr:cfg.yrA()}),pb=()=>new C.Plot(B.k,[62,20,484,272],{xr:cfg.xr,yr:cfg.yrB()});
  function draw(){const P=api.pal();[[A,pa(),"A"],[B,pb(),"B"]].forEach(([Q,p,w])=>{Q.k.clear();cfg.draw(w,p,Q.k.c,P,z,st)})}
  [A,B].forEach((Q,i)=>{const pf=i?pb:pa;Q.k.cv.addEventListener("pointerdown",e=>{drag=Q;Q.k.cv.setPointerCapture(e.pointerId);mv(e)});Q.k.cv.addEventListener("pointermove",e=>{Q.k.cv.style.cursor="ew-resize";if(drag===Q)mv(e)});Q.k.cv.addEventListener("pointerup",()=>drag=null);
    function mv(e){z=Math.round(Math.max(cfg.xr[0],Math.min(cfg.xr[1],pf().iX(Q.k.ptr(e).x)))*100)/100;draw();rd.innerHTML=cfg.read(z,st)}});
  const row=C.ctlRow(host);const rd=C.readout(host);
  const set=v=>{z=v;draw();rd.innerHTML=cfg.read(z,st)};
  cfg.controls&&cfg.controls(row,set,()=>{draw();rd.innerHTML=cfg.read(z,st)});
  C.hint(host,"Arrastra sobre cualquiera de las dos gráficas para mover el punto.");
  api.onTheme(draw);draw();rd.innerHTML=cfg.read(z,st);
}
C.define("sigmoide",function(host,opts,api){
  const d=z=>sig(z)*(1-sig(z));
  curvePair(host,api,{subA:"(a) Función sigmoide",subB:"(b) Su pendiente (derivada)",xr:[-6,6],z0:1,yrA:()=>[-0.03,1.05],yrB:()=>[0,0.28],
    draw(w,p,c,P,z){p.vspan(-6,-4,P.shade);p.vspan(4,6,P.shade);
      if(w==="A"){p.axes({xt:[-6,-4,-2,0,2,4,6],yt:[0,0.2,0.4,0.6,0.8,1],xl:"z",yl:"σ(z)",ylgap:44});p.hline(0.5,{dash:[5,4],color:P.cap});p.text("umbral 0.5",-5.9,0.53,{color:P.cap});
        p.fn(sig,{color:P.blue,w:3});p.text("saturada",-5,0.9,{align:"center",color:P.muted});p.text("saturada",5,0.1,{align:"center",color:P.muted});
        const y=sig(z);p.line([z,z],[0,y],{color:P.red,w:1.4,dash:[2,3]});p.line([-6,z],[y,y],{color:P.red,w:1.4,dash:[2,3]});
        const s=d(z);p.clip();p.line([z-1.2,z+1.2],[y-1.2*s,y+1.2*s],{color:P.orange,w:2.4});p.unclip();p.dot(z,y,{color:P.red,r:8,stroke:P.bg,sw:2.5});
        if(Math.abs(z-1)<0.01)p.text("correo de la Tabla 2\nz = 1 → 0.73",1.6,0.36,{color:P.red});}
      else{p.axes({xt:[-6,-4,-2,0,2,4,6],yt:[0,0.05,0.1,0.15,0.2,0.25],xl:"z",yl:"σ′(z)",ylgap:50});p.fn(d,{color:P.ocre,w:3});p.dot(0,0.25,{color:P.ocre,r:5});p.text("máximo: 0.25 en z = 0",0.6,0.262,{color:P.cap});
        p.text("pendiente\n≈ 0",-5,0.08,{align:"center",color:P.muted});p.text("pendiente\n≈ 0",5,0.08,{align:"center",color:P.muted});p.vline(z,{color:P.red,dash:[2,3],top:p.Y(d(z))});p.dot(z,d(z),{color:P.red,r:8,stroke:P.bg,sw:2.5})}},
    read:z=>`σ(${num(z,2)}) = <b>${num(sig(z),3)}</b> y su pendiente vale <b>${num(d(z),4)}</b>, ${d(z)>0.2?"cerca del máximo (0.25): la neurona aprende con facilidad.":d(z)<0.02?`unas ${num(0.25/d(z),0)} veces menor que en el centro: la neurona está <b>saturada</b> y apenas aprende.`:`${num(d(z)/0.25*100,0)} % del máximo.`}`,
    controls(row,set){const g=C.group(row,"Casos");C.button(g,"z = 1 (correo)",()=>set(1));C.button(g,"z = 0",()=>set(0));C.button(g,"z = 5 (saturada)",()=>set(5));C.button(g,"z = −5",()=>set(-5))}});
});
C.define("tanh",function(host,opts,api){
  const ds=z=>sig(z)*(1-sig(z)),dt=z=>1-Math.tanh(z)**2;
  curvePair(host,api,{subA:"(a) Misma forma, centrada en cero",subB:"(b) Pendiente hasta 4 veces mayor",xr:[-6,6],z0:0,yrA:()=>[-1.1,1.1],yrB:()=>[0,1.4],
    draw(w,p,c,P,z){if(w==="A"){p.axes({xt:[-6,-4,-2,0,2,4,6],yt:[-1,-0.5,0,0.5,1],xl:"z",ylgap:40});p.hline(0,{color:P.lgray});p.vline(0,{color:P.lgray});
        p.fn(Math.tanh,{color:P.blue,w:3});p.fn(sig,{color:P.red,w:2.2,dash:[7,5]});p.dot(z,Math.tanh(z),{color:P.blue,r:7.5,stroke:P.bg,sw:2});p.dot(z,sig(z),{color:P.red,r:7.5,stroke:P.bg,sw:2});
        C.legend(c,[{color:P.blue,label:"tanh (de −1 a 1)"},{color:P.red,dash:[7,5],label:"sigmoide (de 0 a 1)"}],78,34,{lh:20})}
      else{p.vspan(-6,-3,P.shade);p.vspan(3,6,P.shade);p.axes({xt:[-6,-4,-2,0,2,4,6],yt:[0,0.2,0.4,0.6,0.8,1,1.2,1.4],xl:"z",ylgap:40});p.fn(dt,{color:P.blue,w:3});p.fn(ds,{color:P.red,w:2.2,dash:[7,5]});
        p.text("ambas\nse saturan",4.5,0.5,{align:"center",color:P.muted});p.vline(z,{color:P.gray,dash:[2,3]});p.dot(z,dt(z),{color:P.blue,r:7.5,stroke:P.bg,sw:2});p.dot(z,ds(z),{color:P.red,r:7.5,stroke:P.bg,sw:2});
        C.legend(c,[{color:P.blue,label:"pendiente de tanh (máx. 1)"},{color:P.red,dash:[7,5],label:"pendiente de la sigmoide (máx. 0.25)"}],78,34,{lh:20})}},
    read:z=>`En z = ${num(z,2)}: tanh = <b>${num(Math.tanh(z),3)}</b> y sigmoide = <b>${num(sig(z),3)}</b>. Pendientes: tanh′ = <b>${num(dt(z),4)}</b>, σ′ = <b>${num(ds(z),4)}</b>${ds(z)>1e-4?` (tanh tiene ${num(dt(z)/ds(z),1)} veces más pendiente)`:""}.`,
    controls(row,set){const g=C.group(row,"Casos");C.button(g,"z = 0",()=>set(0));C.button(g,"z = 1",()=>set(1));C.button(g,"z = 3 (saturada)",()=>set(3))}});
});
C.define("relu",function(host,opts,api){
  const st={alpha:0.1};
  curvePair(host,api,{subA:"(a) ReLU y su variante Leaky ReLU",subB:"(b) Su pendiente (derivada)",xr:[-4,4],z0:2,state:st,yrA:()=>[-0.8,4.1],yrB:()=>[-0.15,1.3],
    draw(w,p,c,P,z,s){const a=s.alpha;if(w==="A"){p.axes({xt:[-4,-3,-2,-1,0,1,2,3,4],yt:[0,1,2,3,4],xl:"z",ylgap:34});p.hline(0,{color:P.lgray});p.vline(0,{color:P.lgray});
        p.fn(v=>Math.max(0,v),{color:P.blue,w:3});p.fn(v=>v>0?v:a*v,{color:P.ocre,w:2.2,dash:[7,5]});p.dot(z,Math.max(0,z),{color:P.blue,r:7.5,stroke:P.bg,sw:2});if(z<0)p.dot(z,a*z,{color:P.ocre,r:6.5,stroke:P.bg,sw:2});
        C.legend(c,[{color:P.blue,label:"ReLU: max(0, z)"},{color:P.ocre,dash:[7,5],label:`Leaky ReLU (α = ${numT(a,2)})`}],78,34,{lh:20});
        p.text("z < 0: se anula",-2.6,1.0,{color:P.cap,align:"center"});p.text("z > 0: pasa tal cual",1.4,3.5,{color:P.cap,align:"center"})}
      else{p.vspan(-4,0,P.fillr);p.vspan(0,4,P.fillb);p.axes({xt:[-4,-3,-2,-1,0,1,2,3,4],yt:[0,a,1].filter((v,i,ar)=>ar.indexOf(v)===i),xl:"z",ylgap:34,fmty:v=>numT(v,2)});
        p.line([-4,0],[0,0],{color:P.blue,w:3});p.line([0,4],[1,1],{color:P.blue,w:3});p.dot(0,0,{color:P.bg,r:5.5,stroke:P.blue,sw:2});p.dot(0,1,{color:P.blue,r:5.5});p.line([-4,0],[a,a],{color:P.ocre,w:2.2,dash:[7,5]});
        p.text("pendiente 0:\nsi siempre cae aquí,\nla neurona «muere»",-2,0.68,{align:"center",color:P.red,lh:17});p.text("pendiente 1:\nno se satura",2,0.6,{align:"center",color:P.blue,lh:17});
        p.vline(z,{color:P.gray,dash:[2,3]});p.dot(z,z>0?1:0,{color:P.blue,r:7.5,stroke:P.bg,sw:2})}},
    read:(z,s)=>z>0?`z = ${num(z,2)} > 0: ReLU deja pasar el valor tal cual (${num(z,2)}) y su pendiente es <b>1</b>, así que la señal de corrección no se encoge.`:`z = ${num(z,2)} ≤ 0: ReLU devuelve <b>0</b> y su pendiente es <b>0</b>; si le ocurre con todos los ejemplos, la neurona «muere». Leaky ReLU devuelve ${num(s.alpha*z,2)} y conserva una pendiente de ${numT(s.alpha,2)}.`,
    controls(row,set,redraw){C.slider(row,"Leaky ReLU: α",0,0.3,0.01,st.alpha,v=>{st.alpha=v;redraw()},v=>numT(v,2));const g=C.group(row,"Casos");C.button(g,"z = 2",()=>set(2));C.button(g,"z = −2.5",()=>set(-2.5))}});
});

// =====================================================================
// Figura 16 · softmax con barras arrastrables
// =====================================================================
C.define("softmax",function(host,opts,api){
  const [A,B]=C.panels(host,[{W:470,H:330,sub:"(a) Puntuaciones de la capa de salida"},{W:470,H:330,sub:"(b) Probabilidades tras aplicar softmax"}]);
  const L=["Facturación","Incidencia\ntécnica","Consulta\ncomercial"];let z=[2.0,1.0,0.1],shown=null,drag=-1;
  const pa=()=>new C.Plot(A.k,[62,24,456,270],{xr:[0,3],yr:[-1,4]}),pb=()=>new C.Plot(B.k,[62,24,456,270],{xr:[0,3],yr:[0,1]});
  function probs(v){const e=v.map(Math.exp),s=e.reduce((a,b)=>a+b,0);return e.map(x=>x/s)}
  shown={z:[...z],p:probs(z)};
  function draw(){const P=api.pal();const p=probs(z);if(!shown)shown={z:[...z],p:[...p]};
    {const k=A.k,c=k.c;k.clear();const pl=pa();pl.axes({yt:[-1,0,1,2,3,4],yl:"puntuación zₖ",ylgap:46});pl.hline(0,{color:P.axis});const cols=[P.blue,P.blue2,P.blue3];
      shown.z.forEach((v,i)=>{const x=pl.X(i+0.5),w=72;c.fillStyle=cols[i];const y0=pl.Y(0),y1=pl.Y(v);c.fillRect(x-w/2,Math.min(y0,y1),w,Math.abs(y1-y0));if(drag===i){c.strokeStyle=P.orange;c.lineWidth=2;c.strokeRect(x-w/2-3,Math.min(y0,y1)-3,w+6,Math.abs(y1-y0)+6)}
        c.fillStyle=P.text;c.font=`700 13.5px ${F.ui}`;c.textAlign="center";c.fillText(num(z[i],1),x,v>=0?y1-8:y1+18);c.font=`13px ${F.ui}`;L[i].split("\n").forEach((l,j)=>c.fillText(l,x,290+j*16))})}
    {const k=B.k,c=k.c;k.clear();const pl=pb();pl.axes({yt:[0,0.2,0.4,0.6,0.8,1],yl:"probabilidad",ylgap:46});const cols=[P.green,P.green2,P.green3];
      shown.p.forEach((v,i)=>{const x=pl.X(i+0.5),w=72;c.fillStyle=cols[i];c.fillRect(x-w/2,pl.Y(v),w,pl.Y(0)-pl.Y(v));c.fillStyle=P.text;c.font=`700 13.5px ${F.ui}`;c.textAlign="center";c.fillText(num(p[i]*100,1)+" %",x,pl.Y(v)-8);c.font=`13px ${F.ui}`;L[i].split("\n").forEach((l,j)=>c.fillText(l,x,290+j*16))});
      c.fillStyle=P.cap;c.textAlign="right";c.font=`13px ${F.ui}`;c.fillText("suma = 100 %",450,40)}}
  const lp=C.loop(api,dt=>{const p=probs(z);let mv=false;for(let i=0;i<3;i++){const d1=z[i]-shown.z[i],d2=p[i]-shown.p[i];if(Math.abs(d1)>1e-3||Math.abs(d2)>1e-4){shown.z[i]+=d1*Math.min(1,dt*10);shown.p[i]+=d2*Math.min(1,dt*10);mv=true}}draw();return mv});
  A.k.cv.addEventListener("pointerdown",e=>{const q=A.k.ptr(e),pl=pa();for(let i=0;i<3;i++)if(Math.abs(q.x-pl.X(i+0.5))<44){drag=i;A.k.cv.setPointerCapture(e.pointerId);mv(q)}});
  function mv(q){z[drag]=Math.round(Math.max(-1,Math.min(4,pa().iY(q.y)))*10)/10;upd();lp.start()}
  A.k.cv.addEventListener("pointermove",e=>{const q=A.k.ptr(e);if(drag>=0)mv(q);else{const pl=pa();A.k.cv.style.cursor=[0,1,2].some(i=>Math.abs(q.x-pl.X(i+0.5))<44)?"ns-resize":"default"}});
  A.k.cv.addEventListener("pointerup",()=>{drag=-1;lp.kick()});
  const row=C.ctlRow(host);const g=C.group(row,"Probar");C.button(g,"Ticket de la Tabla 8",()=>{z=[2,1,0.1];upd();lp.start()});C.button(g,"Sumar 1 a todas",()=>{z=z.map(v=>Math.min(4,Math.round((v+1)*10)/10));upd();lp.start()});C.button(g,"Restar 1 a todas",()=>{z=z.map(v=>Math.max(-1,Math.round((v-1)*10)/10));upd();lp.start()});C.button(g,"Igualar",()=>{const m=Math.round(z.reduce((a,b)=>a+b,0)/3*10)/10;z=[m,m,m];upd();lp.start()});
  const rd=C.readout(host);function upd(){const p=probs(z),e=z.map(Math.exp);rd.innerHTML=`Exponenciales: ${e.map(v=>num(v,2)).join(", ")} (suma ${num(e.reduce((a,b)=>a+b,0),2)}). Probabilidades: <b>${p.map(v=>num(v*100,1)+" %").join(" · ")}</b>. Por cada punto de diferencia, la probabilidad se multiplica por e ≈ 2.72: facturación / incidencia = ${num(p[0]/p[1],2)}.`}
  C.hint(host,"Arrastra las barras de puntuación hacia arriba o hacia abajo.");api.onTheme(()=>lp.kick());upd();lp.start();
});

// =====================================================================
// Figura 18 · perceptrón multicapa (a) y red con ReLU que resuelve XOR (b)
// =====================================================================
C.define("mlp-xor",function(host,opts,api){
  const [A,B]=C.panels(host,[{W:540,H:330,sub:"(a) Perceptrón multicapa (3 – 4 – 4 – 1)"},{W:480,H:330,sub:"(b) Red con ReLU que resuelve XOR"}]);
  let fw=0,x=[1,0],t=0;
  function drawA(){const k=A.k,c=k.c,P=api.pal();k.clear();const L=[3,4,4,1],xs=[50,190,330,460];const pos=L.map((n,l)=>[...Array(n)].map((_,i)=>({x:xs[l],y:150+(i-(n-1)/2)*56})));
    for(let l=0;l<3;l++)pos[l].forEach(p=>pos[l+1].forEach(q=>{const on=fw>l&&fw<l+1.6;c.strokeStyle=on?rgba(P.orange,.55):P.lgray;c.lineWidth=on?1.6:1;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(q.x,q.y);c.stroke();
      if(fw>l&&fw<l+1){const u=fw-l;c.fillStyle=P.orange;c.beginPath();c.arc(p.x+(q.x-p.x)*u,p.y+(q.y-p.y)*u,2.6,0,7);c.fill()}}));
    pos.forEach((col,l)=>col.forEach(p=>{const lit=fw>=l&&fw<l+1;const face=l===0?P.node:(l===3?P.green:P.red);c.save();if(lit){c.shadowColor=P.orange;c.shadowBlur=16}node(c,p.x,p.y,17,face,l===0?P.blue:face,"");c.restore()}));
    c.fillStyle=P.text;c.font=`13px ${F.ui}`;c.textAlign="center";[["Capa de","entrada"],["Capa","oculta 1"],["Capa","oculta 2"],["Capa de","salida"]].forEach((l,i)=>{c.fillText(l[0],xs[i],22);c.fillText(l[1],xs[i],38)});
    c.fillStyle=P.red;c.font=`italic 13px ${F.ui}`;["W(1), b(1)","W(2), b(2)","W(3), b(3)"].forEach((l,i)=>{const xm=(xs[i]+xs[i+1])/2;c.fillStyle=P.bg;c.fillRect(xm-36,252,72,18);c.fillStyle=P.red;c.fillText(l,xm,266)});
    c.fillStyle=P.text;c.font=`italic 15px Georgia,serif`;c.fillText("ŷ",460,182);arrow(c,30,292,520,292,P.blue,2,10);c.fillStyle=P.blue;c.font=`13px ${F.ui}`;c.fillText("Propagación hacia delante",275,316)}
  const relu=v=>Math.max(0,v);
  function drawB(){const k=B.k,c=k.c,P=api.pal();k.clear();const h1=relu(x[0]+x[1]),h2=relu(x[0]+x[1]-1),z=4*h1-8*h2-2,y=sig(z);
    const N={x1:{x:60,y:110},x2:{x:60,y:240},h1:{x:220,y:110},h2:{x:220,y:240},o:{x:390,y:175}};
    [["x1","h1","1"],["x2","h1","1"],["x1","h2","1"],["x2","h2","1"],["h1","o","4"],["h2","o","−8"]].forEach(([a,b,l],i)=>{const A_=N[a],B_=N[b];arrow(c,A_.x+26,A_.y+(B_.y-A_.y)*0.13,B_.x-28,B_.y-(B_.y-A_.y)*0.13,P.gray,1.6,10);
      const tt=i<4?(i===1||i===2?0.32:0.42):0.45;c.fillStyle=P.bg;const px=A_.x+(B_.x-A_.x)*tt,py=A_.y+(B_.y-A_.y)*tt;c.fillRect(px-10,py-9,20,17);c.fillStyle=P.red;c.font=`600 14px ${F.ui}`;c.textAlign="center";c.fillText(l,px,py+5)});
    node(c,N.x1.x,N.x1.y,26,P.node,P.blue,"x₁",{tc:P.text,italic:true,serif:true,fs:17});node(c,N.x2.x,N.x2.y,26,P.node,P.blue,"x₂",{tc:P.text,italic:true,serif:true,fs:17});
    node(c,N.h1.x,N.h1.y,27,P.red,P.red,"h₁",{italic:true,serif:true,fs:17});node(c,N.h2.x,N.h2.y,27,P.red,P.red,"h₂",{italic:true,serif:true,fs:17});node(c,N.o.x,N.o.y,28,P.green,P.green,"ŷ",{italic:true,serif:true,fs:18});
    c.fillStyle=P.text;c.font=`12.5px ${F.ui}`;c.textAlign="center";c.fillText("ReLU   b = 0",220,66);c.fillText("ReLU   b = −1",220,290);c.fillText("sigmoide",390,128);c.fillText("b = −2",390,144);c.fillText("Entradas",60,62);c.fillText("Salida",390,222);
    c.font=`700 12.5px ${F.mono}`;c.fillStyle=P.blue;c.fillText("= "+x[0],60,152);c.fillText("= "+x[1],60,282);c.fillStyle=P.red;c.fillText("= "+h1,264,98);c.fillText("= "+h2,264,262);c.fillStyle=P.green;c.fillText("ŷ = "+num(y,2),390,246);
    c.fillStyle=y>.5?P.red:P.muted;c.font=`700 13px ${F.ui}`;c.fillText(y>.5?"¡Alerta!":"Sin alerta",390,268)}
  const lp=C.loop(api,dt=>{fw+=dt*0.9;if(fw>4.2)fw=0;drawA();drawB();return true});
  B.k.cv.addEventListener("click",e=>{const q=B.k.ptr(e);if(Math.hypot(q.x-60,q.y-110)<30)x[0]=1-x[0];else if(Math.hypot(q.x-60,q.y-240)<30)x[1]=1-x[1];else return;upd();setC(x.join(""))});
  B.k.cv.addEventListener("pointermove",e=>{const q=B.k.ptr(e);B.k.cv.style.cursor=(Math.hypot(q.x-60,q.y-110)<30||Math.hypot(q.x-60,q.y-240)<30)?"pointer":"default"});
  const row=C.ctlRow(host);const g=C.group(row,"Caso en (b)");const setC=C.seg(g,[["00","(0, 0)"],["01","(0, 1)"],["10","(1, 0)"],["11","(1, 1)"]],kk=>{x=[+kk[0],+kk[1]];setC(kk);upd()});
  const rd=C.readout(host);function upd(){const h1=relu(x[0]+x[1]),h2=relu(x[0]+x[1]-1),z=4*h1-8*h2-2;rd.innerHTML=`Caso (${x[0]}, ${x[1]}): h₁ = ReLU(${x[0]} + ${x[1]}) = ${h1}, h₂ = ReLU(${x[0]} + ${x[1]} − 1) = ${h2}, z = 4·${h1} − 8·${h2} − 2 = ${num(z,0)} y <b>ŷ = σ(${num(z,0)}) ≈ ${num(sig(z),2)}</b>.`}
  setC("10");upd();api.onTheme(()=>lp.kick());lp.start();
});

// =====================================================================
// Figura 19 · espacio de las entradas y espacio de la capa oculta
// =====================================================================
C.define("espacio-oculto",function(host,opts,api){
  const [A,B]=C.panels(host,[{W:480,H:340,sub:"(a) Espacio original: no separable"},{W:500,H:340,sub:"(b) Espacio de la capa oculta: separable"}]);
  const PT=[[0,0,0],[0,1,1],[1,0,1],[1,1,0]];const relu=v=>Math.max(0,v);const H=(a,b)=>[relu(a+b),relu(a+b-1)];let u=1,anim=false,hov=-1;
  const pa=()=>new C.Plot(A.k,[56,40,460,290],{xr:[-0.4,1.5],yr:[-0.4,1.5]}),pb=()=>new C.Plot(B.k,[56,24,484,290],{xr:[-0.4,2.6],yr:[-0.5,1.6]});
  function drawA(){const k=A.k,c=k.c,P=api.pal();k.clear();const p=pa();p.axes({xt:[0,1],yt:[0,1],xl:"x₁",yl:"x₂",grid:false,ylgap:30});
    PT.forEach(([a,b,cl],i)=>{p.dot(a,b,{color:cl?P.red:P.blue,r:hov===i?12:10,stroke:"#fff",sw:2});p.text(`(${a}, ${b})`,a+0.07,b+0.09,{color:P.cap})});
    p.text("Ninguna recta separa\nrojos de azules",0.55,-0.25,{align:"center",color:P.cap});C.legend(c,[{type:"dot",color:P.blue,label:"Sin descuadre (y = 0)"},{type:"dot",color:P.red,label:"Descuadre (y = 1)"}],60,16,{row:true,fs:12})}
  function drawB(){const k=B.k,c=k.c,P=api.pal();k.clear();const p=pb();const e=ease(u);
    p.clip();const L=h=>0.5*h-0.25;c.globalAlpha=e;c.fillStyle=P.fillb;c.beginPath();c.moveTo(p.X(-1),p.Y(L(-1)));c.lineTo(p.X(3),p.Y(L(3)));c.lineTo(p.X(3),p.Y(3));c.lineTo(p.X(-1),p.Y(3));c.fill();
    c.fillStyle=P.fillr;c.beginPath();c.moveTo(p.X(-1),p.Y(L(-1)));c.lineTo(p.X(3),p.Y(L(3)));c.lineTo(p.X(3),p.Y(-3));c.lineTo(p.X(-1),p.Y(-3));c.fill();
    p.line([-1,3],[L(-1),L(3)],{color:P.ink,w:2.2});c.globalAlpha=1;p.unclip();
    p.axes({xt:[0,1,2],yt:[0,1],xl:"h₁",yl:"h₂",grid:false,ylgap:30});
    PT.forEach(([a,b,cl],i)=>{const h=H(a,b);const x=a+(h[0]-a)*e,y=b+(h[1]-b)*e;p.dot(x,y,{color:cl?P.red:P.blue,r:hov===i?12:10,stroke:"#fff",sw:2})});
    if(e>0.95){p.text("(0, 0)",0.08,0.1,{color:P.cap});p.text("(0, 1) y (1, 0)\ncaen aquí",1.08,0.1,{color:P.cap});p.text("(1, 1)",1.75,1.12,{color:P.cap});
      p.text("Frontera: 4h₁ − 8h₂ − 2 = 0",0.3,1.3,{color:P.ink});p.text("z > 0: alerta",1.6,-0.38,{color:P.red});p.text("z < 0: sin alerta",-0.3,1.42,{color:P.blue})}
    else{c.fillStyle=P.muted;c.font=`600 12px ${F.ui}`;c.textAlign="left";c.fillText("Transformando: (x₁, x₂) → (h₁, h₂)",70,40)}}
  const lp=C.loop(api,dt=>{if(anim){u=Math.min(1,u+dt*0.6);if(u>=1)anim=false}drawA();drawB();return anim});
  function hit(k,pf,coords){const q=k.ptr(event);const p=pf();let best=-1,bd=22;coords.forEach((xy,i)=>{const d=Math.hypot(q.x-p.X(xy[0]),q.y-p.Y(xy[1]));if(d<bd){bd=d;best=i}});return best}
  A.k.cv.addEventListener("pointermove",e=>{const q=A.k.ptr(e),p=pa();let best=-1;PT.forEach(([a,b],i)=>{if(Math.hypot(q.x-p.X(a),q.y-p.Y(b))<22)best=i});if(best!==hov){hov=best;upd();lp.kick()}});
  B.k.cv.addEventListener("pointermove",e=>{const q=B.k.ptr(e),p=pb();let best=-1;PT.forEach(([a,b],i)=>{const h=H(a,b);if(Math.hypot(q.x-p.X(h[0]),q.y-p.Y(h[1]))<22)best=i});if(best!==hov){hov=best;upd();lp.kick()}});
  [A,B].forEach(Q=>Q.k.cv.addEventListener("pointerleave",()=>{hov=-1;upd();lp.kick()}));
  const row=C.ctlRow(host);const g=C.group(row);C.button(g,"▶ Ver la transformación",()=>{u=0;anim=true;lp.start()},{primary:true});
  const rd=C.readout(host);function upd(){if(hov<0){rd.innerHTML="La capa oculta lleva cada caso a un punto nuevo (h₁, h₂). Los dos descuadres caen en el mismo punto, (1, 0), y una sola recta los separa del resto.";return}const [a,b,cl]=PT[hov],h=H(a,b),z=4*h[0]-8*h[1]-2;rd.innerHTML=`(${a}, ${b}) → (h₁, h₂) = (${h[0]}, ${h[1]}) → z = ${num(z,0)} → ${z>0?"<b>alerta</b>":"sin alerta"} (${cl?"hay":"no hay"} descuadre).`}
  C.hint(host,"Pasa el ratón por un caso para ver adónde lo lleva la capa oculta.");upd();api.onTheme(()=>lp.kick());lp.kick();
});

// =====================================================================
// Figura 21 · aproximación de la curva de demanda con k neuronas ReLU
// =====================================================================
C.define("aprox-universal",function(host,opts,api){
  const dem=t=>30+45*Math.exp(-(((t-9)/2.2)**2))+60*Math.exp(-(((t-19)/2.6)**2))+8*Math.sin(t/3);
  const ks=[3,12];const PS=C.panels(host,[{W:500,H:320,sub:"(a) 3 neuronas: aproximación tosca"},{W:500,H:320,sub:"(b) 12 neuronas: casi superpuesta"}]);let anim=-1;
  const lab=k=>k<=4?"aproximación tosca":k<=9?"sigue los picos con tramos visibles":"casi superpuesta";
  function approx(k,t){const kn=[...Array(k+1)].map((_,i)=>24*i/k);let i=Math.min(k-1,Math.floor(t/24*k));const a=kn[i],b=kn[i+1];return dem(a)+(dem(b)-dem(a))*(t-a)/(b-a)}
  function rmse(k){let s=0;for(let i=0;i<=480;i++){const t=24*i/480;s+=(approx(k,t)-dem(t))**2}return Math.sqrt(s/481)}
  function draw(){const P=api.pal();PS.forEach((Q,j)=>{const k=ks[j];Q.k.clear();const p=new C.Plot(Q.k,[62,16,486,262],{xr:[0,24],yr:[20,95]});p.axes({xt:[0,6,12,18,24],yt:[30,40,50,60,70,80,90],xl:"Hora del día",yl:j?null:"Demanda",ylgap:40});
    p.fn(dem,{color:P.gray,w:6,alpha:.55});p.fn(t=>approx(k,t),{color:P.red,w:2.4,n:600});for(let i=1;i<k;i++){const t=24*i/k;p.dot(t,dem(t),{color:P.red,r:4})}
    C.legend(Q.k.c,[{color:P.gray,w:5,label:"Función real"},{color:P.red,label:`Red con ${k} neuronas ReLU`}],74,30,{lh:19,fs:12.5});Q.p._sub.textContent=`(${"ab"[j]}) ${k} neurona${k>1?"s":""}: ${lab(k)}`})}
  const lp=C.loop(api,dt=>{if(anim>=0){anim+=dt*3;ks[1]=Math.min(20,1+Math.floor(anim));sl2.set(ks[1]);if(ks[1]>=20)anim=-1;upd()}draw();return anim>=0});
  const row=C.ctlRow(host);const sl1=C.slider(row,"Neuronas (a)",1,24,1,3,v=>{ks[0]=v;upd();draw()});const sl2=C.slider(row,"Neuronas (b)",1,24,1,12,v=>{ks[1]=v;upd();draw()});
  const g=C.group(row);C.button(g,"▶ De 1 a 20 neuronas en (b)",()=>{anim=0;lp.start()});
  const rd=C.readout(host);function upd(){rd.innerHTML=`Cada neurona aporta un «codo», así que con k neuronas la red construye una poligonal de k tramos. Error medio: <b>${num(rmse(ks[0]),1)}</b> con ${ks[0]} neurona${ks[0]>1?"s":""} y <b>${num(rmse(ks[1]),1)}</b> con ${ks[1]}.`}
  upd();api.onTheme(draw);draw();
});
})();
