/* Figuras interactivas del Módulo 8 (1) — coste, retropropagación y optimización */
(function(){"use strict";
const C=Curso,{num,numT,F,rgba,arrow,rrect,node,ease,thou,sup}=C;
const sig=z=>1/(1+Math.exp(-z));
// ---------------------------------------------------------------- mapa de calor con curvas de nivel (zonas oscuras = coste bajo)
function heatMap(fn,xr,yr,nx,ny,o={}){const V=new Float64Array(nx*ny);let lo=1e9,hi=-1e9;
  for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const x=xr[0]+(xr[1]-xr[0])*i/(nx-1),y=yr[0]+(yr[1]-yr[0])*j/(ny-1);let v=fn(x,y);if(o.log)v=Math.log(v-o.min+o.eps);V[j*nx+i]=v;if(v<lo)lo=v;if(v>hi)hi=v}
  return{V,nx,ny,lo,hi,xr,yr}}
function drawHeat(c,pl,H,levels=16){const P=C.pal();const {V,nx,ny,lo,hi}=H;const cv=document.createElement("canvas");cv.width=nx;cv.height=ny;const x=cv.getContext("2d");const im=x.createImageData(nx,ny);
  for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const t=(V[j*nx+i]-lo)/(hi-lo);const col=C.cmap(C.theme==="dark"?0.04+0.6*t:1-0.92*t);const o=4*((ny-1-j)*nx+i);im.data[o]=col[0];im.data[o+1]=col[1];im.data[o+2]=col[2];im.data[o+3]=255}
  x.putImageData(im,0,0);c.imageSmoothingEnabled=true;c.drawImage(cv,pl.x0,pl.y0,pl.x1-pl.x0,pl.y1-pl.y0);
  c.strokeStyle=C.theme==="dark"?"rgba(10,22,36,.55)":"rgba(255,255,255,.6)";c.lineWidth=0.8;const cw=(pl.x1-pl.x0)/(nx-1),ch=(pl.y1-pl.y0)/(ny-1);
  for(let l=1;l<levels;l++){const lev=lo+(hi-lo)*l/levels;c.beginPath();for(let j=0;j<ny-1;j++)for(let i=0;i<nx-1;i++){const a=V[j*nx+i],b=V[j*nx+i+1],cc=V[(j+1)*nx+i+1],d=V[(j+1)*nx+i];const pts=[];const X0=pl.x0+i*cw,Y0=pl.y1-j*ch;
    const e=(v1,v2,x1,y1,x2,y2)=>{if((v1-lev)*(v2-lev)<0){const t=(lev-v1)/(v2-v1);pts.push([x1+(x2-x1)*t,y1+(y2-y1)*t])}};e(a,b,X0,Y0,X0+cw,Y0);e(b,cc,X0+cw,Y0,X0+cw,Y0-ch);e(cc,d,X0+cw,Y0-ch,X0,Y0-ch);e(d,a,X0,Y0-ch,X0,Y0);
    if(pts.length>=2){c.moveTo(pts[0][0],pts[0][1]);c.lineTo(pts[1][0],pts[1][1])}}c.stroke()}}
function star(c,x,y,r,fill,stroke){c.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;c.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}c.closePath();c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=1.2;c.stroke()}}

// =====================================================================
// Figura 28 · entropía cruzada frente a error cuadrático
// =====================================================================
C.define("perdidas",function(host,opts,api){
  const [A,B]=C.panels(host,[{W:500,H:330,sub:"(a) Pérdida de un correo legítimo (y = 0)"},{W:500,H:330,sub:"(b) Fuerza de la corrección"}]);let p=0.73,drag=null;
  const ce=q=>-Math.log(1-q),se=q=>q*q,gce=q=>q,gse=q=>2*q*q*(1-q);
  const pa=()=>new C.Plot(A.k,[56,16,486,272],{xr:[0,1],yr:[0,4.6]}),pb=()=>new C.Plot(B.k,[64,16,486,272],{xr:[0,1],yr:[0,1.05]});
  function draw(){const P=api.pal();
    {const k=A.k,c=k.c;k.clear();const pl=pa();pl.axes({xt:[0,0.2,0.4,0.6,0.8,1],yt:[0,1,2,3,4],xl:"Probabilidad de spam que da la red (ŷ)",yl:"Pérdida",ylgap:36});
      pl.fn(ce,{color:P.blue,w:2.6,to:0.995});pl.fn(se,{color:P.ocre,w:2.6,dash:[7,5]});
      [0.27,0.73].forEach(q=>{pl.line([q,q],[se(q),ce(q)],{color:P.lgray,w:1});pl.dot(q,ce(q),{color:P.blue,r:4.5});pl.dot(q,se(q),{color:P.ocre,r:4.5})});
      pl.text("ŷ = 0.73\nantes de\ncorregir",0.53,2.6,{color:P.cap,lh:15,fs:11.5});pl.text("ŷ = 0.27\ndespués de\ncorregir",0.07,1.6,{color:P.cap,lh:15,fs:11.5});
      pl.vline(p,{color:P.orange,dash:[3,3]});pl.dot(p,Math.min(4.6,ce(p)),{color:P.blue,r:8,stroke:P.bg,sw:2.5});pl.dot(p,se(p),{color:P.ocre,r:8,stroke:P.bg,sw:2.5});
      C.legend(c,[{color:P.blue,label:"Entropía cruzada  −ln(1 − ŷ)"},{color:P.ocre,dash:[7,5],label:"Error cuadrático  ŷ²"}],72,30,{lh:19})}
    {const k=B.k,c=k.c;k.clear();const pl=pb();pl.vspan(0.9,1,P.fillr);pl.axes({xt:[0,0.2,0.4,0.6,0.8,1],yt:[0,0.2,0.4,0.6,0.8,1],xl:"Probabilidad de spam que da la red (ŷ)",yl:"Señal de corrección que recibe z",ylgap:46});
      pl.text("error con\nmucha\nseguridad",0.95,0.62,{align:"center",color:P.red,lh:15,fs:11.5});pl.fn(gce,{color:P.blue,w:2.6});pl.fn(gse,{color:P.ocre,w:2.6,dash:[7,5]});
      pl.vline(p,{color:P.orange,dash:[3,3]});pl.dot(p,gce(p),{color:P.blue,r:8,stroke:P.bg,sw:2.5});pl.dot(p,gse(p),{color:P.ocre,r:8,stroke:P.bg,sw:2.5});
      C.legend(c,[{color:P.blue,label:"Entropía cruzada:  ŷ − y"},{color:P.ocre,dash:[7,5],label:"Error cuadrático:  2(ŷ − y)·ŷ(1 − ŷ)"}],80,30,{lh:19})}}
  [A,B].forEach((Q,i)=>{const pf=i?pb:pa;Q.k.cv.addEventListener("pointerdown",e=>{drag=Q;Q.k.cv.setPointerCapture(e.pointerId);mv(e)});Q.k.cv.addEventListener("pointermove",e=>{Q.k.cv.style.cursor="ew-resize";if(drag===Q)mv(e)});Q.k.cv.addEventListener("pointerup",()=>drag=null);
    function mv(e){p=Math.round(Math.max(0.01,Math.min(0.99,pf().iX(Q.k.ptr(e).x)))*100)/100;draw();upd()}});
  const row=C.ctlRow(host);const g=C.group(row,"Casos");[[0.73,"ŷ = 0.73"],[0.27,"ŷ = 0.27"],[0.98,"ŷ = 0.98 (muy seguro y equivocado)"]].forEach(([v,l])=>C.button(g,l,()=>{p=v;draw();upd()}));
  const rd=C.readout(host);function upd(){rd.innerHTML=`Con ŷ = ${num(p,2)}: pérdida <b>${num(ce(p),3)}</b> con entropía cruzada y <b>${num(se(p),3)}</b> con error cuadrático. La corrección que recibe la neurona es ${num(gce(p),2)} frente a ${num(gse(p),2)}${gse(p)>0.001?` (${num(gce(p)/gse(p),1)} veces más fuerte con entropía cruzada)`:""}.`}
  C.hint(host,"Arrastra sobre cualquiera de las dos gráficas para cambiar la probabilidad que da la red.");api.onTheme(draw);draw();upd();
});

// =====================================================================
// Figura 29 · un solo valle frente a muchos valles (soltar bolas)
// =====================================================================
C.define("paisajes",function(host,opts,api){
  const D=window.DATA_M8.logit;const X=D.X,Y=D.y,n=Y.length;
  const [A,B]=C.panels(host,[{W:500,H:370,sub:"(a) Regresión logística: un solo valle"},{W:500,H:370,sub:"(b) Red neuronal: varios valles (esquema)"}]);
  function costL(w1,w2){let s=0;for(let i=0;i<n;i++){let p=sig(X[2*i]*w1+X[2*i+1]*w2);p=Math.min(1-1e-9,Math.max(1e-9,p));s-=Y[i]*Math.log(p)+(1-Y[i])*Math.log(1-p)}return s/n}
  function gradL(w1,w2){let g1=0,g2=0;for(let i=0;i<n;i++){const e=sig(X[2*i]*w1+X[2*i+1]*w2)-Y[i];g1+=e*X[2*i];g2+=e*X[2*i+1]}return[g1/n,g2/n]}
  const gs=(x,y,mx,my,s,h)=>h*Math.exp(-((x-mx)**2+(y-my)**2)/(2*s*s));
  const Fr=(u,v)=>0.16*(u*u+v*v)-gs(u,v,-1.4,-1.2,0.6,2.2)-gs(u,v,1.5,1.2,0.55,1.6)-gs(u,v,1.5,-1.6,0.42,1.0);
  function gradF(u,v){const h=1e-4;return[(Fr(u+h,v)-Fr(u-h,v))/(2*h),(Fr(u,v+h)-Fr(u,v-h))/(2*h)]}
  const HA=heatMap(costL,[-3,6],[-6,3],90,90),HB=heatMap(Fr,[-3,3],[-3,3],120,120);
  // mínimos
  let mi=0;for(let i=1;i<HA.V.length;i++)if(HA.V[i]<HA.V[mi])mi=i;const minA=[-3+9*(mi%90)/89,-6+9*Math.floor(mi/90)/89];
  function findMin(x,y){for(let it=0;it<3000;it++){const g=gradF(x,y);x-=0.05*g[0];y-=0.05*g[1]}return[x,y]}
  const MB=[[findMin(-1.4,-1.2),"mínimo global","red"],[findMin(1.5,1.2),"mínimo local","ocre"],[findMin(1.5,-1.6),"mínimo local","ocre"]];
  // punto de silla entre los dos mínimos de la derecha y el global: el de menor gradiente en la zona central
  let sd=null,bg=1e9;for(let i=0;i<=80;i++)for(let j=0;j<=80;j++){const u=-0.6+1.6*i/80,v=-0.8+1.7*j/80;const g=gradF(u,v),m=Math.hypot(...g);if(m<bg){bg=m;sd=[u,v]}}
  let balls=[];let cache={};
  const pa=()=>new C.Plot(A.k,[56,16,486,312],{xr:[-3,6],yr:[-6,3]}),pb=()=>new C.Plot(B.k,[56,16,486,312],{xr:[-3,3],yr:[-3,3]});
  function base(k,pl,H,key){const P=api.pal();const ck=key+api.theme;if(!cache[ck]){const off=document.createElement("canvas");off.width=k.cv.width;off.height=k.cv.height;const oc=off.getContext("2d");const dpr=k.cv.width/k.W;oc.scale(dpr,dpr);
      drawHeat(oc,pl,H,18);cache[ck]=off}k.c.save();k.c.setTransform(1,0,0,1,0,0);k.c.drawImage(cache[ck],0,0);k.c.restore()}
  function draw(){const P=api.pal();
    {const k=A.k,c=k.c;k.clear();const pl=pa();base(k,pl,HA,"a");pl.axes({xt:[-2,0,2,4,6],yt:[-6,-4,-2,0,2],xl:"Peso w₁",yl:"Peso w₂",grid:false,ylgap:34});
      c.fillStyle=P.red;c.strokeStyle="#fff";c.lineWidth=1.5;c.beginPath();c.arc(pl.X(minA[0]),pl.Y(minA[1]),7,0,7);c.fill();c.stroke();pl.text("mínimo único",minA[0]+0.3,minA[1]+0.9,{color:"#fff",font:`700 13px ${F.ui}`})}
    {const k=B.k,c=k.c;k.clear();const pl=pb();base(k,pl,HB,"b");pl.axes({xt:[-3,-2,-1,0,1,2,3],yt:[-3,-2,-1,0,1,2,3],xl:"Peso w₁",yl:"Peso w₂",grid:false,ylgap:30});
      MB.forEach(([m,l,col])=>{c.fillStyle=P[col];c.strokeStyle="#fff";c.lineWidth=1.5;c.beginPath();c.arc(pl.X(m[0]),pl.Y(m[1]),7,0,7);c.fill();c.stroke();pl.text(l,m[0],m[1]+0.32,{color:"#fff",font:`700 12.5px ${F.ui}`,align:"center"})});
      c.fillStyle="#fff";c.strokeStyle=P.ink;c.lineWidth=1.2;c.font=`700 14px ${F.ui}`;c.textAlign="center";c.fillText("✕",pl.X(sd[0]),pl.Y(sd[1])+5);pl.text("punto de silla",sd[0],sd[1]+0.3,{color:"#fff",font:`700 12.5px ${F.ui}`,align:"center"})}
    balls.forEach(b=>{const k=b.w==="a"?A.k:B.k,pl=b.w==="a"?pa():pb(),c=k.c;c.strokeStyle=P.orange;c.lineWidth=2.4;c.beginPath();b.path.forEach((q,i)=>i?c.lineTo(pl.X(q[0]),pl.Y(q[1])):c.moveTo(pl.X(q[0]),pl.Y(q[1])));c.stroke();
      const q=b.path[b.path.length-1];c.fillStyle=P.orange;c.strokeStyle="#fff";c.lineWidth=2;c.beginPath();c.arc(pl.X(q[0]),pl.Y(q[1]),7,0,7);c.fill();c.stroke()})}
  const lp=C.loop(api,dt=>{let alive=false;balls.forEach(b=>{if(b.done)return;for(let s=0;s<3;s++){const q=b.path[b.path.length-1];const g=b.w==="a"?gradL(...q):gradF(...q);const eta=b.w==="a"?0.8:0.06;const nq=[q[0]-eta*g[0],q[1]-eta*g[1]];b.path.push(nq);if(Math.hypot(g[0],g[1])<2e-3||b.path.length>600){b.done=true;break}}if(!b.done)alive=true});draw();if(!alive)upd();return alive});
  [["a",A,pa],["b",B,pb]].forEach(([w,Q,pf])=>{Q.k.cv.addEventListener("click",e=>{const q=Q.k.ptr(e),pl=pf();if(!pl.inside(q))return;balls=balls.filter(b=>b.w!==w).concat([{w,path:[[pl.iX(q.x),pl.iY(q.y)]],done:false}]);lp.start();upd()});Q.k.cv.addEventListener("pointermove",()=>Q.k.cv.style.cursor="crosshair")});
  const row=C.ctlRow(host);const g=C.group(row);C.button(g,"Soltar bolas al azar",()=>{balls=[{w:"a",path:[[-2+Math.random()*7,-5+Math.random()*7]],done:false},{w:"b",path:[[-2.6+Math.random()*5.2,-2.6+Math.random()*5.2]],done:false}];lp.start();upd()},{primary:true});C.button(g,"Borrar",()=>{balls=[];draw();upd()});
  const rd=C.readout(host);
  function where(q){let best=null,bd=0.35;MB.forEach(([m,l])=>{const d=Math.hypot(q[0]-m[0],q[1]-m[1]);if(d<bd){bd=d;best=l}});return best}
  function upd(){const b=balls.find(x=>x.w==="b");let s="Pulsa sobre cualquiera de los dos mapas para soltar una bola: bajará siguiendo la pendiente. ";if(b&&b.done){const w=where(b.path[b.path.length-1]);s=`En el paisaje de la red, la bola ha terminado ${w==="mínimo global"?"en el <b>mínimo global</b>":w?"en un <b>mínimo local</b>: desde ahí ningún paso cuesta abajo lleva al global":"cerca del punto de silla, donde la pendiente es casi nula"}. `}
    const a=balls.find(x=>x.w==="a");if(a&&a.done)s+="En la regresión logística, cualquier punto de partida lleva al mismo mínimo.";rd.innerHTML=s}
  C.hint(host,"Pulsa en cualquier punto de los mapas: las zonas más oscuras indican un coste menor.");api.onTheme(()=>{draw()});draw();upd();
});

// =====================================================================
// Figura 31 · regla de la cadena (a) y coste de calcular los gradientes (b)
// =====================================================================
C.define("cadena",function(host,opts,api){
  const [A,B]=C.panels(host,[{W:600,H:330,sub:"(a) Regla de la cadena en la neurona del correo"},{W:420,H:330,sub:"(b) Coste de calcular los gradientes"}]);
  let w1=4,t=0,params=1e6;
  function vals(){const z=w1*1+3-2-4,y=sig(z),L=-Math.log(1-y),dz=1,dy=y*(1-y),dL=1/(1-y);return{z,y,L,dz,dy,dL,g:dL*dy*dz}}
  function drawA(){const k=A.k,c=k.c,P=api.pal();k.clear();const v=vals();const T=t%5;const fwd=Math.min(1,T/2),bwd=Math.max(0,Math.min(1,(T-2.4)/2));
    const xs=[60,215,370,525],lab=[`w₁ = ${num(w1,1)}`,`z = ${num(v.z,2)}`,`ŷ = ${num(v.y,2)}`,`L = ${num(v.L,2)}`];
    xs.forEach((x,i)=>{c.fillStyle=C.mix(P.bg,P.fillb,.9);c.strokeStyle=P.blue;c.lineWidth=1.6;rrect(c,x-50,140,100,40,10);c.fill();c.stroke();c.fillStyle=P.text;c.font=`600 14px ${F.mono}`;c.textAlign="center";c.fillText(lab[i],x,165)});
    const fw=["suma ponderada","sigmoide","entropía cruzada"],fw2=["z = Σwᵢxᵢ + b","ŷ = σ(z)","L = −ln(1 − ŷ)"];const bw=[[`∂z/∂w₁ = x₁`,`= 1`],[`∂ŷ/∂z = ŷ(1 − ŷ)`,`= ${num(v.dy,3)}`],[`∂L/∂ŷ = 1/(1 − ŷ)`,`= ${num(v.dL,2)}`]];
    for(let i=0;i<3;i++){const x0=xs[i]+52,x1=xs[i+1]-52,xm=(x0+x1)/2;
      c.strokeStyle=P.blue;c.lineWidth=2;c.beginPath();c.moveTo(x0,134);c.quadraticCurveTo(xm,92,x1,134);c.stroke();arrow(c,x1-8,128,x1,134,P.blue,2,9);c.fillStyle=P.blue;c.font=`12px ${F.ui}`;c.fillText(fw[i],xm,82);c.font=`11.5px ${F.mono}`;c.fillText(fw2[i],xm,98);
      c.strokeStyle=P.red;c.beginPath();c.moveTo(x1,186);c.quadraticCurveTo(xm,228,x0,186);c.stroke();arrow(c,x0+8,192,x0,186,P.red,2,9);c.fillStyle=P.red;c.font=`11.5px ${F.mono}`;c.fillText(bw[i][0],xm,242);c.font=`600 12px ${F.mono}`;c.fillText(bw[i][1],xm,257);
      const uf=fwd*3-i;if(uf>0&&uf<1){const tt=uf;const x=x0+(x1-x0)*tt,y=134-42*4*tt*(1-tt)*0.98;c.fillStyle=P.blue;c.beginPath();c.arc(x,y,5,0,7);c.fill()}
      const ub=bwd*3-(2-i);if(ub>0&&ub<1){const tt=ub;const x=x1+(x0-x1)*tt,y=186+42*4*tt*(1-tt)*0.98;c.fillStyle=P.red;c.beginPath();c.arc(x,y,5,0,7);c.fill()}}
    c.fillStyle=P.blue;c.font=`600 12px ${F.ui}`;c.textAlign="left";c.fillText("Hacia delante: se calculan los valores",10,24);c.fillStyle=P.red;c.fillText("Hacia atrás: se multiplican las pendientes locales",10,42);
    c.fillStyle=P.bg;c.strokeStyle=P.cap;c.lineWidth=1;rrect(c,110,276,380,40,8);c.fill();c.stroke();c.fillStyle=P.text;c.font=`600 14px ${F.mono}`;c.textAlign="center";c.fillText(`∂L/∂w₁ = ${num(v.dL,2)} × ${num(v.dy,3)} × 1 = ${num(v.g,2)}`,300,301)}
  const NETS=[["Red XOR",9],["Dígitos",2410],["784-128-10",101770],["Modelo de\n1000 millones",1e9]];
  const pb=()=>new C.Plot(B.k,[70,20,410,250],{xr:[-0.5,4.5],yr:[1,5e10],ylog:true});
  function drawB(){const k=B.k,c=k.c,P=api.pal();k.clear();const pl=pb();pl.axes({yt:[1,1e2,1e4,1e6,1e8,1e10],ylab:v=>"10"+sup(Math.round(Math.log10(v))),yl:"Pasadas por la red",ylgap:50});
    const all=NETS.concat([["Tu red",params]]);all.forEach(([l,np],i)=>{const x=pl.X(i);const w=24;c.fillStyle=i===4?P.orange:P.ocre;c.fillRect(x-w-1,pl.Y(np+1),w,pl.Y(1)-pl.Y(np+1));c.fillStyle=P.blue;c.fillRect(x+1,pl.Y(3),w,pl.Y(1)-pl.Y(3));
      c.fillStyle=P.text;c.font=`10.5px ${F.ui}`;c.textAlign="center";const ls=l.split("\n");ls.forEach((t,j)=>c.fillText(t,x,266+j*13));if(ls.length===1){c.fillStyle=P.muted;c.fillText("("+thou(np)+")",x,279)}});
    C.legend(c,[{type:"box",color:P.ocre,label:"Perturbar cada peso (una pasada por peso)"},{type:"box",color:P.blue,label:"Retropropagación (≈ 3 pasadas)"}],78,300,{lh:16,fs:11})}
  const lp=C.loop(api,dt=>{t+=dt;drawA();drawB();return true});
  const row=C.ctlRow(host);C.slider(row,"Peso w₁",-2,8,0.1,w1,v=>{w1=v;upd()},v=>num(v,1));C.slider(row,"Pesos de tu red (b)",1,10,0.1,6,v=>{params=Math.round(10**v);upd()},v=>"10"+sup(Math.round(v)));
  const rd=C.readout(host);function upd(){const v=vals();rd.innerHTML=`Con w₁ = ${num(w1,1)}: z = ${num(v.z,2)}, ŷ = ${num(v.y,3)} y L = ${num(v.L,3)}. Multiplicando las derivadas de cada eslabón, <b>∂L/∂w₁ = ${num(v.g,3)}</b>. En una red de ${thou(params)} pesos, perturbar cada peso costaría ${thou(params)} pasadas; la retropropagación, unas 3.`}
  upd();api.onTheme(()=>lp.kick());lp.start();
});

// =====================================================================
// Figura 32 · retropropagación en la red de conciliación
// =====================================================================
C.define("conciliacion-bp",function(host,opts,api){
  const [A,B]=C.panels(host,[{W:500,H:330,sub:"(a) Hacia delante: valores y pesos"},{W:500,H:330,sub:"(b) Hacia atrás: errores δ y gradientes"}]);
  let x=[1,1],t=0;const relu=v=>Math.max(0,v);
  function calc(){const y=x[0]^x[1];const z1=x[0]+x[1],z2=x[0]+x[1]-1,h1=relu(z1),h2=relu(z2),z=4*h1-8*h2-2,yh=sig(z);const L=-(y*Math.log(yh)+(1-y)*Math.log(1-yh));const d=yh-y;
    const d1=(z1>0?1:0)*4*d,d2=(z2>0?1:0)*(-8)*d;return{y,z1,z2,h1,h2,z,yh,L,d,d1,d2,g:{h1o:d*h1,h2o:d*h2,x1h1:d1*x[0],x2h1:d1*x[1],x1h2:d2*x[0],x2h2:d2*x[1]}}}
  const POS={x1:{x:60,y:96},x2:{x:60,y:246},h1:{x:250,y:96},h2:{x:250,y:246},y:{x:430,y:171}};
  function net(Q,mode,v){const k=Q.k,c=k.c,P=api.pal();k.clear();const col=mode==="f"?P.blue:P.red;const T=t%4;const prog=mode==="f"?Math.min(1,T/1.6):Math.max(0,Math.min(1,(T-1.8)/1.6));
    const E=[["x1","h1",mode==="f"?"1":num(v.g.x1h1,3)],["x2","h1",mode==="f"?"1":num(v.g.x2h1,3)],["x1","h2",mode==="f"?"1":num(v.g.x1h2,3)],["x2","h2",mode==="f"?"1":num(v.g.x2h2,3)],["h1","y",mode==="f"?"4":num(v.g.h1o,3)],["h2","y",mode==="f"?"−8":num(v.g.h2o,3)]];
    E.forEach(([a,b,l],i)=>{const A_=POS[a],B_=POS[b];const dx=B_.x-A_.x,dy=B_.y-A_.y,L=Math.hypot(dx,dy);const ax=A_.x+dx/L*28,ay=A_.y+dy/L*28,bx=B_.x-dx/L*28,by=B_.y-dy/L*28;
      if(mode==="f")arrow(c,ax,ay,bx,by,P.gray,1.6,10);else arrow(c,bx,by,ax,ay,rgba(P.red,.7),1.6,10);
      const layer=a.startsWith("x")?0:1;const u=mode==="f"?prog*2-layer:prog*2-(1-layer);if(u>0&&u<1){const px=mode==="f"?ax+(bx-ax)*u:bx+(ax-bx)*u,py=mode==="f"?ay+(by-ay)*u:by+(ay-by)*u;c.fillStyle=col;c.beginPath();c.arc(px,py,4.5,0,7);c.fill()}
      const cross=(a==="x1"&&b==="h2")||(a==="x2"&&b==="h1");const tt=cross?(a==="x1"?0.3:0.3):0.5;const px=A_.x+dx*tt,py=A_.y+dy*tt+(cross?(a==="x1"?-10:12):-10);c.font=`600 12px ${F.ui}`;const w=c.measureText(l).width+10;c.fillStyle=P.bg;c.fillRect(px-w/2,py-11,w,16);c.fillStyle=col;c.textAlign="center";c.fillText(l,px,py+2)});
    Object.entries(POS).forEach(([kk,p])=>{const lab={x1:"x₁",x2:"x₂",h1:"h₁",h2:"h₂",y:"ŷ"}[kk];if(kk.startsWith("x"))node(c,p.x,p.y,24,P.node,P.blue,lab,{tc:P.text,italic:true,serif:true,fs:16});else node(c,p.x,p.y,24,kk==="y"?P.green:P.red,kk==="y"?P.green:P.red,lab,{italic:true,serif:true,fs:16})});
    c.fillStyle=col;c.font=`12px ${F.ui}`;c.textAlign="center";
    if(mode==="f"){c.fillText(`x₁ = ${x[0]}`,60,56);c.fillText(`x₂ = ${x[1]}`,60,292);c.fillText(`z = ${num(v.z1,0)} → h₁ = ${num(v.h1,0)}`,250,56);c.fillText(`z = ${num(v.z2,0)} → h₂ = ${num(v.h2,0)}`,250,292);c.fillText(`z = ${num(v.z,0)} → ŷ = ${num(v.yh,2)}`,430,122);c.fillText(`L = ${num(v.L,3)}`,430,138)}
    else{c.fillText(`δ = ${num(4*v.d,3)} × ${v.z1>0?1:0} = ${num(v.d1,3)}`,250,56);c.fillText(`δ = ${num(-8*v.d,3)} × ${v.z2>0?1:0} = ${num(v.d2,3)}`,250,292);c.fillText(`δ = ŷ − y = ${num(v.d,3)}`,430,130)}}
  const lp=C.loop(api,dt=>{t+=dt;const v=calc();net(A,"f",v);net(B,"b",v);return true});
  const row=C.ctlRow(host);const g=C.group(row,"Caso");const setC=C.seg(g,[["00","(0, 0)"],["01","(0, 1)"],["10","(1, 0)"],["11","(1, 1)"]],kk=>{x=[+kk[0],+kk[1]];setC(kk);t=0;upd()});
  const rd=C.readout(host);function upd(){const v=calc();rd.innerHTML=`Caso (${x[0]}, ${x[1]}), respuesta correcta y = ${v.y}: la red da ŷ = ${num(v.yh,3)} y su pérdida es ${num(v.L,3)}. El error de la salida, δ = ${num(v.d,3)}, se reparte hacia atrás multiplicado por los pesos (4 y −8) y por la pendiente de ReLU: δ₁ = ${num(v.d1,3)} y δ₂ = ${num(v.d2,3)}. Cada gradiente es el δ de la neurona de destino por el valor que le llega.`}
  setC("11");upd();api.onTheme(()=>lp.kick());lp.start();
});

// =====================================================================
// Figura 33 · descenso por gradiente en J(w) = (w − 2)²
// =====================================================================
C.define("tasa-aprendizaje",function(host,opts,api){
  const [A,B]=C.panels(host,[{W:500,H:330,sub:"(a) Recorrido de los pesos"},{W:500,H:330,sub:"(b) Efecto de la tasa de aprendizaje"}]);
  const J=w=>(w-2)**2;const run=(eta,n)=>{const r=[-2];for(let i=0;i<n;i++)r.push(r[r.length-1]-eta*2*(r[r.length-1]-2));return r};
  let show={0.1:true,0.9:true,0.4:false,1.1:false},custom=null,steps=8,anim=-1;
  const pa=()=>new C.Plot(A.k,[56,16,486,272],{xr:[-2.6,6.6],yr:[-1.5,25]}),pb=()=>new C.Plot(B.k,[64,16,486,272],{xr:[-0.6,15.6],yr:[1e-10,1e4],ylog:true});
  function draw(){const P=api.pal();const cols={0.1:P.blue,0.4:P.green,0.9:P.ocre,1.1:P.red};const n=anim>=0?Math.floor(anim):steps;
    {const k=A.k,c=k.c;k.clear();const pl=pa();pl.axes({xt:[-2,0,2,4,6],yt:[0,5,10,15,20,25],xl:"Peso w",yl:"Coste J(w)",ylgap:38});pl.fn(J,{color:P.cap,w:2});
      Object.keys(show).filter(e=>show[e]).concat(custom!==null?["c"]:[]).forEach(e=>{const eta=e==="c"?custom:+e;const ws=run(eta,Math.max(0,n));const col=e==="c"?P.orange:cols[e];pl.clip();pl.line(ws,ws.map(J),{color:col,w:1.5,dash:+e===0.9?[6,4]:[]});pl.unclip();
        ws.forEach((w,i)=>{if(w<-2.6||w>6.6||J(w)>25)return;c.fillStyle=col;if(+e===0.9)c.fillRect(pl.X(w)-4.5,pl.Y(J(w))-4.5,9,9);else{c.beginPath();c.arc(pl.X(w),pl.Y(J(w)),4.5,0,7);c.fill()}})});
      pl.dot(-2,16,{color:P.red,r:7});pl.text("inicio\n(w = −2)",-2.5,12.3,{color:P.red});star(c,pl.X(2),pl.Y(0),10,P.green);pl.text("mínimo (w = 2)",2,-1.1,{align:"center",color:P.green,dy:14});
      const items=Object.keys(show).filter(e=>show[e]).map(e=>({color:cols[e],dash:+e===0.9?[6,4]:[],label:`η = ${e}${+e===0.1?": pasos cortos":+e===0.9?": zigzag":+e===0.4?": adecuada":": diverge"}`}));if(custom!==null)items.push({color:P.orange,label:`η = ${numT(custom,2)} (la tuya)`});C.legend(c,items,250,30,{lh:19,fs:12})}
    {const k=B.k,c=k.c;k.clear();const pl=pb();pl.axes({xt:[0,2,4,6,8,10,12,14],yt:[1e-10,1e-8,1e-6,1e-4,1e-2,1,1e2,1e4],ylab:v=>"10"+sup(Math.round(Math.log10(v))),xl:"Iteración",yl:"Coste J(w) (escala logarítmica)",ylgap:46});
      const lj=w=>Math.max(1e-14,J(w));[0.1,0.4,1.1].forEach(e=>{const ws=run(e,15);pl.clip();pl.line(ws.map((_,i)=>i),ws.map(lj),{color:cols[e],w:2.4,dash:e===1.1?[6,4]:[]});ws.forEach((w,i)=>pl.dot(i,lj(w),{color:cols[e],r:3}));pl.unclip()});
      if(custom!==null){const ws=run(custom,15);pl.clip();pl.line(ws.map((_,i)=>i),ws.map(lj),{color:P.orange,w:2.6});pl.unclip()}
      pl.text("diverge",14.6,2e2,{align:"right",color:P.red,fs:13});pl.text("converge\nmuy rápido",0.5,1e-7,{color:P.green,fs:13});
      if(anim>=0)pl.vline(Math.min(15,anim),{color:P.gray,dash:[3,3]});
      C.legend(c,[{color:P.blue,label:"η = 0.1 y 0.9 (coinciden)"},{color:P.green,label:"η = 0.4"},{color:P.red,dash:[6,4],label:"η = 1.1"}].concat(custom!==null?[{color:P.orange,label:`η = ${numT(custom,2)}`}]:[]),270,150,{lh:19,fs:12})}}
  const lp=C.loop(api,dt=>{if(anim>=0){anim+=dt*1.6;if(anim>steps+0.99)anim=-1}draw();return anim>=0});
  const row=C.ctlRow(host);const g=C.group(row,"Recorridos en (a)");[0.1,0.4,0.9,1.1].forEach(e=>C.toggle(g,"η = "+e,show[e],v=>{show[e]=v;draw()}));
  C.slider(row,"Tu tasa η",0,1.15,0.01,0.6,v=>{custom=v;draw();upd()},v=>numT(v,2));const g2=C.group(row);C.button(g2,"▶ Animar paso a paso",()=>{anim=0;lp.start()},{primary:true});
  const rd=C.readout(host);function upd(){const f=custom===null?null:1-2*custom;rd.innerHTML=custom===null?"Mueve «Tu tasa η» para añadir tu propio recorrido. Cada paso multiplica la distancia al mínimo por 1 − 2η.":`Con η = ${numT(custom,2)}, cada paso multiplica la distancia al mínimo por 1 − 2η = ${num(f,2)}: ${Math.abs(f)>1?"<b>diverge</b>, cada paso termina más lejos.":f<-0.5?"rebota de un lado a otro, en zigzag.":f<0?"se pasa un poco y llega deprisa.":f<0.5?"llega deprisa sin pasarse.":"avanza, pero con pasos demasiado cortos."}`}
  upd();api.onTheme(draw);draw();
});

// =====================================================================
// Figura 34 · optimizadores en un valle alargado
// =====================================================================
C.define("optimizadores",function(host,opts,api){
  const Ac=[0.02,4.0];const f=w=>0.5*(Ac[0]*w[0]*w[0]+Ac[1]*w[1]*w[1]);const gf=w=>[Ac[0]*w[0],Ac[1]*w[1]];let w0=[-9,1.6];const N=100;
  function runs(){const gd=[w0.slice()];for(let i=0;i<N;i++){const w=gd[i],g=gf(w);gd.push([w[0]-0.45*g[0],w[1]-0.45*g[1]])}
    const mo=[w0.slice()];let v=[0,0];for(let i=0;i<N;i++){const w=mo[i],g=gf(w);v=[0.9*v[0]+g[0],0.9*v[1]+g[1]];mo.push([w[0]-0.1*v[0],w[1]-0.1*v[1]])}
    const ad=[w0.slice()];let m=[0,0],s=[0,0];for(let t=1;t<=N;t++){const w=ad[t-1],g=gf(w);m=m.map((a,i)=>0.9*a+0.1*g[i]);s=s.map((a,i)=>0.999*a+0.001*g[i]*g[i]);ad.push(w.map((a,i)=>a-0.3*(m[i]/(1-0.9**t))/(Math.sqrt(s[i]/(1-0.999**t))+1e-8)))}
    return{gd,mo,ad}}
  let R=runs(),it=60,anim=-1,on={gd:true,mo:true,ad:true},drag=false;
  const [A,B]=C.panels(host,[{W:500,H:330,sub:"(a) Trayectorias en un valle alargado"},{W:500,H:330,sub:"(b) Evolución del coste"}]);
  const pa=()=>new C.Plot(A.k,[56,16,486,272],{xr:[-10,3],yr:[-2.2,2.2]}),pb=()=>new C.Plot(B.k,[64,16,486,272],{xr:[0,100],yr:[1e-5,20],ylog:true});
  const HV=heatMap((x,y)=>f([x,y]),[-10,3],[-2.2,2.2],130,60,{log:true,min:0,eps:0.004});let cache={};
  const NAMES={gd:["Descenso por gradiente","ocre"],mo:["Con momentum","blue"],ad:["Adam","green"]};
  function draw(){const P=api.pal();const n=anim>=0?Math.floor(anim):it;
    {const k=A.k,c=k.c;k.clear();const pl=pa();const ck=api.theme;if(!cache[ck]){const off=document.createElement("canvas");off.width=k.cv.width;off.height=k.cv.height;const oc=off.getContext("2d");oc.scale(k.cv.width/k.W,k.cv.width/k.W);drawHeat(oc,pl,HV,16);cache[ck]=off}
      c.save();c.setTransform(1,0,0,1,0,0);c.drawImage(cache[ck],0,0);c.restore();pl.axes({xt:[-10,-8,-6,-4,-2,0,2],yt:[-2,-1,0,1,2],xl:"Peso w₁",yl:"Peso w₂",grid:false,ylgap:30});
      pl.clip();Object.entries(on).forEach(([kk,v])=>{if(!v)return;const path=R[kk].slice(0,n+1);const col=P[NAMES[kk][1]];pl.line(path.map(q=>q[0]),path.map(q=>q[1]),{color:col,w:2});path.forEach(q=>pl.dot(q[0],q[1],{color:col,r:2.6}));const q=path[path.length-1];pl.dot(q[0],q[1],{color:col,r:6,stroke:"#fff",sw:2})});pl.unclip();
      star(c,pl.X(0),pl.Y(0),11,"#fff",P.ink);pl.dot(w0[0],w0[1],{color:P.red,r:7,stroke:"#fff",sw:2});pl.text("inicio",w0[0]+0.25,w0[1]+0.25,{color:P.ink,font:`700 12px ${F.ui}`});
      const it_=Object.entries(on).filter(([,v])=>v);if(it_.length){c.fillStyle=rgba(P.bg,.9);c.strokeStyle=P.lgray;c.lineWidth=1;rrect(c,312,268-it_.length*18,172,it_.length*18+2,5);c.fill();c.stroke();
        C.legend(c,it_.map(([kk])=>({color:P[NAMES[kk][1]],label:NAMES[kk][0]})),328,268-it_.length*18+10,{lh:18,fs:11.5})}}
    {const k=B.k,c=k.c;k.clear();const pl=pb();pl.axes({xt:[0,20,40,60,80,100],yt:[1e-4,1e-3,1e-2,1e-1,1,10],ylab:v=>"10"+sup(Math.round(Math.log10(v))),xl:"Iteración",yl:"Coste (escala logarítmica)",ylgap:46});
      Object.entries(on).forEach(([kk,v])=>{if(!v)return;const ys=R[kk].map(f);pl.clip();pl.line(ys.map((_,i)=>i),ys.map(y=>Math.max(1e-5,y)),{color:P[NAMES[kk][1]],w:2.4});pl.unclip();pl.dot(n,Math.max(1e-5,ys[n]),{color:P[NAMES[kk][1]],r:5,stroke:P.bg,sw:2})});pl.vline(n,{color:P.gray,dash:[3,3]});
      C.legend(c,Object.entries(on).filter(([,v])=>v).map(([kk])=>({color:P[NAMES[kk][1]],label:NAMES[kk][0]})),300,30,{lh:19,fs:12})}}
  const lp=C.loop(api,dt=>{if(anim>=0){anim+=dt*14;if(anim>=N){anim=-1;it=N;sl.set(N)}else sl.set(Math.floor(anim))}draw();upd();return anim>=0});
  A.k.cv.addEventListener("pointerdown",e=>{const q=A.k.ptr(e),pl=pa();if(Math.hypot(q.x-pl.X(w0[0]),q.y-pl.Y(w0[1]))<14){drag=true;A.k.cv.setPointerCapture(e.pointerId)}});
  A.k.cv.addEventListener("pointermove",e=>{const q=A.k.ptr(e),pl=pa();if(drag){w0=[Math.max(-9.8,Math.min(2.8,pl.iX(q.x))),Math.max(-2.1,Math.min(2.1,pl.iY(q.y)))];R=runs();draw();upd()}else A.k.cv.style.cursor=Math.hypot(q.x-pl.X(w0[0]),q.y-pl.Y(w0[1]))<14?"grab":"default"});
  A.k.cv.addEventListener("pointerup",()=>drag=false);
  const row=C.ctlRow(host);const sl=C.slider(row,"Iteración",0,N,1,it,v=>{it=v;anim=-1;draw();upd()});const g=C.group(row);C.button(g,"▶ Animar",()=>{anim=0;lp.start()},{primary:true});C.button(g,"Inicio del documento",()=>{w0=[-9,1.6];R=runs();draw();upd()});
  const g2=C.group(row,"Mostrar");Object.entries(NAMES).forEach(([kk,v])=>C.toggle(g2,v[0],true,x=>{on[kk]=x;draw()}));
  const rd=C.readout(host);function upd(){const n=anim>=0?Math.floor(anim):it;rd.innerHTML=`Iteración ${n}: coste ${Object.entries(on).filter(([,v])=>v).map(([kk])=>`${NAMES[kk][0].toLowerCase()} <b>${C.sci(f(R[kk][n]),1)}</b>`).join(" · ")}. El descenso básico (η = 0.45) rebota de pared a pared; momentum (η = 0.1, inercia 0.9) acumula el avance a lo largo del valle y Adam (0.3) ajusta el paso de cada peso.`}
  C.hint(host,"Arrastra el punto rojo de inicio o mueve la iteración.");api.onTheme(draw);draw();upd();
});
})();
