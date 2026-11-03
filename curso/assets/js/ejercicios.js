/* Laboratorio · ejercicios interactivos de los módulos 7 y 8, con corrección al final */
(function(){"use strict";
const C=Curso,K=EJCore,{num,numT,F,rgba,arrow,rrect,node,mix}=C;
const sig=K.sig,clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),pct=v=>Math.round(v*100)+" %";
function hexrgb(h){if(h.startsWith("rgb"))return h.match(/\d+/g).slice(0,3).map(Number);const n=parseInt(h.slice(1),16);return[n>>16,(n>>8)&255,n&255]}
// paneles lado a lado con la misma altura: cada uno crece en proporción a su ancho lógico
const panels=(h,specs)=>C.panels(h,specs.map(s=>Object.assign({flex:`${s.W} 1 ${Math.round(s.W*0.55)}px`},s)));
const ORDER=["m7-1","m7-2","m7-3","m7-4","m7-5","m8-1","m8-2","m8-3","m8-4","m8-5"];

// ============================================================ registro y corrección
const EJ={};
function reg(id,host,o){const e=Object.assign({id,touched:false,seen:false},o);EJ[id]=e;
  e.touch=()=>{if(e.touched)return;e.touched=true;updBar()};
  const b=host.querySelector(".badge");if(b)b.textContent="Ejercicio";return e}
function updBar(){const n=ORDER.filter(id=>EJ[id]&&EJ[id].touched).length;const d=document.getElementById("ejDone");if(d)d.innerHTML=`<b>${n}</b> de 10 ejercicios empezados`;
  ORDER.forEach(id=>{const a=document.querySelector(`.toc a[href="#ej-${id}"]`);if(a)a.classList.toggle("done",!!(EJ[id]&&EJ[id].touched))})}
const it=(p,m,t)=>({p,m,t});
const f1=v=>numT(Math.round(v*10)/10,1);
function verdict(s){return s>=9.5?"Perfecto":s>=8?"Muy bien":s>=5?"Bien, pero se puede mejorar":s>0?"Todavía no":"Sin puntos"}
function renderFb(id,res){const sec=document.querySelector(`[data-ej="${id}"]`);if(!sec)return;const fb=sec.querySelector(".ej-fb");const s=res.score;
  fb.hidden=false;fb.className="ej-fb "+(s>=8?"ok":s>=5?"mid":"bad");
  fb.innerHTML=`<div class="fb-head"><span class="fb-score">${f1(s)}<small> / 10</small></span><span class="fb-msg">${verdict(s)}${EJ[id]&&EJ[id].seen?' <em>· has visto la solución</em>':""}</span></div>
    <ul class="fb-items">${res.items.map(i=>`<li class="${i.p>=i.m-1e-9?"ok":i.p>0?"mid":"bad"}"><span class="pts">${f1(i.p)} / ${f1(i.m)}</span><span class="txt">${i.t}</span></li>`).join("")}</ul>
    ${res.sol?`<div class="fb-sol"><button class="w-btn" type="button">Ver la solución</button><div class="sol" hidden><b>Solución.</b> ${res.sol}</div></div>`:""}`;
  const b=fb.querySelector(".fb-sol button");if(b)b.addEventListener("click",()=>{fb.querySelector(".sol").hidden=false;b.remove();const e=EJ[id];if(e&&e.solve){e.seen=true;e.solve();e.touch()}})}
function gradeAll(){if(window.__bootAll)window.__bootAll();
  const rows=ORDER.map(id=>{const e=EJ[id];let res;
    if(!e)res={items:[it(0,10,"El ejercicio no se ha podido cargar.")]};
    else{const g=e.grade();res=e.touched?g:{items:[it(0,10,"No has empezado este ejercicio.")],sol:g.sol}}
    res.score=clamp(res.items.reduce((s,i)=>s+i.p,0),0,10);renderFb(id,res);return{id,res}});
  const nota=rows.reduce((s,r)=>s+r.res.score,0)/rows.length;showModal(nota,rows)}
function showModal(nota,rows){const m=document.getElementById("ejModal");if(!m)return;
  const title=id=>{const h=document.getElementById("ej-"+id);return h?h.textContent.replace("#",""):id};
  const cls=nota>=8?"ok":nota>=5?"mid":"bad";
  m.querySelector(".ej-dialog").innerHTML=`<button class="iconbtn close" type="button" aria-label="Cerrar">✕</button>
    <p class="kicker">Resultado del laboratorio</p>
    <div class="nota ${cls}"><span>${f1(nota)}</span><small>/ 10</small></div>
    <p class="nota-msg">${nota>=9?"¡Excelente! Dominas los fundamentos y el entrenamiento de redes.":nota>=7?"Muy buen trabajo. Repasa los ejercicios marcados en naranja o rojo.":nota>=5?"Aprobado. Abre la corrección de cada ejercicio para ver qué falló.":"Hay que repasar. Cada ejercicio explica qué faltó y enlaza al apartado del curso."}</p>
    <ol class="rows">${rows.map(r=>{const s=r.res.score,c=s>=8?"ok":s>=5?"mid":"bad";return`<li class="${c}"><a href="#ej-${r.id}">${title(r.id)}</a><span class="bar"><i style="width:${s*10}%"></i></span><b>${f1(s)}</b></li>`}).join("")}</ol>
    <p class="w-hint">Pulsa un ejercicio para ver su corrección detallada. Puedes cambiar tus respuestas y volver a corregir.</p>`;
  m.hidden=false;document.body.classList.add("modal");
  const close=()=>{m.hidden=true;document.body.classList.remove("modal")};
  m.querySelector(".close").onclick=close;m.onclick=e=>{if(e.target===m)close()};m.querySelectorAll(".rows a").forEach(a=>a.addEventListener("click",close))}
function initPage(){const g=document.getElementById("ejGrade");if(g)g.addEventListener("click",gradeAll);
  const r=document.getElementById("ejReset");if(r)r.addEventListener("click",()=>{if(confirm("¿Empezar de nuevo? Se borrarán todas tus respuestas."))location.reload()});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){const m=document.getElementById("ejModal");if(m&&!m.hidden){m.hidden=true;document.body.classList.remove("modal")}}});updBar()}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initPage);else initPage();

// ============================================================ utilidades de dibujo
// red por capas: sizes, caja, valores de activación (0–1) y pesos opcionales
function drawNet(c,P,o){const {sizes,x0,x1,y0,y1}=o,L=sizes.length,r=o.r||13;
  const xs=sizes.map((_,l)=>x0+(x1-x0)*l/Math.max(1,L-1));
  const pos=sizes.map((n,l)=>{const sp=n>1?Math.min(o.sp||44,(y1-y0)/(n-1)):0;return Array.from({length:n},(_,i)=>({x:xs[l],y:(y0+y1)/2+(i-(n-1)/2)*sp}))});
  for(let l=0;l<L-1;l++)pos[l].forEach((p,i)=>pos[l+1].forEach((q,j)=>{const w=o.w?o.w(l,i,j):null;
    if(w===null){c.strokeStyle=P.lgray;c.lineWidth=1}else{c.strokeStyle=rgba(w>=0?P.blue:P.red,clamp(0.25+Math.abs(w)*0.35,0.25,0.9));c.lineWidth=clamp(0.5+Math.abs(w)*1.1,0.5,4.5)}
    c.beginPath();c.moveTo(p.x,p.y);c.lineTo(q.x,q.y);c.stroke()}));
  pos.forEach((col,l)=>col.forEach((p,i)=>{const v=o.vals?clamp(o.vals[l][i],0,1):0;const col_=l===0?P.blue:l===L-1?P.green:P.orange;
    c.save();if(v>0.6){c.shadowColor=col_;c.shadowBlur=14*v}node(c,p.x,p.y,r,mix(P.node,col_,0.12+0.88*v),col_,"");c.restore()}));
  return pos}
// mapa de probabilidad con contorno 0.5 dentro de un Plot
function probMap(pl,fn,nx,ny,P){const c=pl.c,img=document.createElement("canvas");img.width=nx;img.height=ny;const ic=img.getContext("2d"),d=ic.createImageData(nx,ny);
  const bg=hexrgb(P.bg),cb=hexrgb(P.fillb),cr=hexrgb(P.fillr),deep=[hexrgb(P.blue),hexrgb(P.red)];const V=new Float64Array(nx*ny);
  for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const x=pl.xr[0]+(pl.xr[1]-pl.xr[0])*(i+.5)/nx,y=pl.yr[1]-(pl.yr[1]-pl.yr[0])*(j+.5)/ny;const p=fn(x,y);V[j*nx+i]=p;
    const t=Math.min(1,Math.abs(p-.5)*2.2),hi=p>.5,base=hi?cr:cb,dd=hi?deep[1]:deep[0];const o=4*(j*nx+i);
    for(let k=0;k<3;k++){const v=bg[k]+(base[k]-bg[k])*Math.min(1,t*1.6)+(dd[k]-base[k])*Math.max(0,t-0.6)*0.35;d.data[o+k]=v}d.data[o+3]=255}
  ic.putImageData(d,0,0);c.imageSmoothingEnabled=true;c.drawImage(img,pl.x0,pl.y0,pl.x1-pl.x0,pl.y1-pl.y0);
  // contorno 0.5 (cuadrados en marcha)
  const cw=(pl.x1-pl.x0)/nx,ch=(pl.y1-pl.y0)/ny,X=i=>pl.x0+(i+.5)*cw,Y=j=>pl.y0+(j+.5)*ch;c.strokeStyle=P.ink;c.lineWidth=1.8;c.beginPath();
  for(let j=0;j<ny-1;j++)for(let i=0;i<nx-1;i++){const a=V[j*nx+i]-.5,b=V[j*nx+i+1]-.5,e=V[(j+1)*nx+i+1]-.5,f=V[(j+1)*nx+i]-.5;const pts=[];
    if((a>0)!==(b>0))pts.push([X(i)+cw*a/(a-b),Y(j)]);if((b>0)!==(e>0))pts.push([X(i+1),Y(j)+ch*b/(b-e)]);if((f>0)!==(e>0))pts.push([X(i)+cw*f/(f-e),Y(j+1)]);if((a>0)!==(f>0))pts.push([X(i),Y(j)+ch*a/(a-f)]);
    if(pts.length>=2){c.moveTo(pts[0][0],pts[0][1]);c.lineTo(pts[1][0],pts[1][1])}if(pts.length===4){c.moveTo(pts[2][0],pts[2][1]);c.lineTo(pts[3][0],pts[3][1])}}
  c.stroke()}
function heatCached(cache,key,k,pl,fn,nx,ny){const ck=key+C.theme;if(!cache[ck]){const off=document.createElement("canvas");off.width=nx;off.height=ny;const oc=off.getContext("2d"),d=oc.createImageData(nx,ny);
    const V=new Float64Array(nx*ny);let lo=1e9,hi=-1e9;for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const v=fn(pl.xr[0]+(pl.xr[1]-pl.xr[0])*(i+.5)/nx,pl.yr[1]-(pl.yr[1]-pl.yr[0])*(j+.5)/ny);V[j*nx+i]=v;lo=Math.min(lo,v);hi=Math.max(hi,v)}
    for(let q=0;q<V.length;q++){const t=(V[q]-lo)/(hi-lo||1);const col=C.cmap(0.95-0.85*Math.pow(t,0.7));for(let k2=0;k2<3;k2++)d.data[4*q+k2]=col[k2];d.data[4*q+3]=255}
    oc.putImageData(d,0,0);cache[ck]=off}
  k.c.imageSmoothingEnabled=true;k.c.drawImage(cache[ck],pl.x0,pl.y0,pl.x1-pl.x0,pl.y1-pl.y0)}
function label(c,t,x,y,o={}){c.font=o.font||`${o.w||400} ${o.fs||13}px ${F.ui}`;c.fillStyle=o.color;c.textAlign=o.align||"center";c.textBaseline=o.base||"alphabetic";c.fillText(t,x,y);c.textBaseline="alphabetic"}
function pill(c,t,x,y,bg,fg,o={}){c.font=`${o.w||600} ${o.fs||12}px ${F.ui}`;const w=c.measureText(t).width+16;const X=o.align==="right"?x-w:o.align==="center"?x-w/2:x;c.fillStyle=bg;rrect(c,X,y-11,w,22,11);c.fill();c.fillStyle=fg;c.textAlign="left";c.textBaseline="middle";c.fillText(t,X+8,y+0.5);c.textBaseline="alphabetic";return w}

// =====================================================================
// M7 · 1 · Enciende la neurona
// =====================================================================
C.define("ej-m7-1",function(host,opts,api){
  const MAILS=[{s:"¡Gana un iPhone gratis!",x:[1,1,0],y:1},{s:"Acta de la reunión del lunes",x:[0,0,1],y:0},{s:"Factura del proveedor (con enlace)",x:[1,0,1],y:0},{s:"Oferta exclusiva solo hoy",x:[0,1,0],y:1}];
  const FEAT=["x₁ enlace sospechoso","x₂ palabras de oferta","x₃ remitente conocido"],CHIP=["enlace","oferta","contacto"];
  const ACTS={escalon:["Escalón",z=>z>=0?1:0,[-0.15,1.15]],sigmoide:["Sigmoide",sig,[-0.15,1.15]],tanh:["Tanh",Math.tanh,[-1.15,1.15]],relu:["ReLU",z=>Math.max(0,z),[-0.6,6]]};
  const st={w:[1,1,1],b:0,act:"escalon",sel:0};let t=0;
  const [A]=C.panels(host,[{W:1040,H:390,aria:"Neurona de un filtro de spam con cuatro correos de prueba, sus tres entradas, pesos, sesgo, función de activación y salida."}]);const k=A.k,c=k.c;
  const out=m=>{const z=st.w[0]*m.x[0]+st.w[1]*m.x[1]+st.w[2]*m.x[2]+st.b;return{z,y:ACTS[st.act][1](z)}};
  const IN=[110,200,290].map(y=>({x:452,y})),S={x:640,y:200};
  function draw(){const P=api.pal();k.clear();
    MAILS.forEach((m,i)=>{const y=18+i*92,on=i===st.sel,o=out(m),spam=o.y>0.5;
      c.fillStyle=on?P.fillb:P.bg2;rrect(c,12,y,330,80,12);c.fill();c.strokeStyle=on?P.blue:P.lgray;c.lineWidth=on?2:1;rrect(c,12,y,330,80,12);c.stroke();
      label(c,m.s,26,y+23,{align:"left",w:600,fs:14,color:P.text});
      let xx=26;m.x.forEach((v,j)=>{xx+=pill(c,CHIP[j],xx,y+44,v?rgba(P.blue,.2):P.shade,v?P.blue:P.muted,{fs:11.5})+6});
      label(c,m.y?"Es spam":"Es legítimo",330,y+48,{align:"right",w:700,fs:12,color:m.y?P.red:P.green});
      c.fillStyle=P.shade;rrect(c,26,y+60,170,8,4);c.fill();c.fillStyle=spam?P.red:P.blue;rrect(c,26,y+60,Math.max(4,170*clamp(o.y,0,1)),8,4);c.fill();
      label(c,`${num(o.y,2)} → ${spam?"spam":"legítimo"}`,330,y+68,{align:"right",w:700,fs:12,color:spam?P.red:P.blue})});
    label(c,"Pulsa un correo para verlo pasar por la neurona",176,392-8,{fs:11.5,color:P.muted});
    const m=MAILS[st.sel],o=out(m);
    // conexiones con su peso
    IN.forEach((p,j)=>{const w=st.w[j],v=m.x[j];c.strokeStyle=rgba(w>=0?P.blue:P.red,v?0.85:0.25);c.lineWidth=1.2+Math.abs(w)*1.1;c.beginPath();c.moveTo(p.x+22,p.y);c.lineTo(S.x-36,S.y+(p.y-S.y)*0.25);c.stroke();
      if(v&&w!==0)for(let q=0;q<3;q++){const u=(t*0.7+q/3)%1;c.fillStyle=w>=0?P.blue:P.red;c.beginPath();c.arc(p.x+22+(S.x-36-p.x-22)*u,p.y+(S.y+(p.y-S.y)*0.25-p.y)*u,3.2,0,7);c.fill()}
      const mx=(p.x+S.x)/2-6,my=(p.y+S.y)/2+(p.y-S.y)*0.12;c.fillStyle=P.bg;rrect(c,mx-30,my-12,60,22,6);c.fill();label(c,`w${"₁₂₃"[j]} = ${numT(w,1)}`,mx,my+4,{w:700,fs:12.5,color:w>=0?P.blue:P.red});
      node(c,p.x,p.y,21,v?P.blue:P.node,P.blue,String(v),{tc:v?"#fff":P.text,fs:15});label(c,FEAT[j],p.x,p.y-29,{fs:11.5,color:P.muted})});
    arrow(c,S.x,70,S.x,S.y-40,P.ocre,1.8,9);label(c,`sesgo b = ${numT(st.b,1)}`,S.x,62,{w:700,fs:12.5,color:P.ocre});
    node(c,S.x,S.y,34,P.node,P.ink,"Σ",{tc:P.text,fs:22});label(c,`z = ${num(o.z,1)}`,S.x,S.y+56,{font:`700 14px ${F.mono}`,color:P.text});
    arrow(c,S.x+36,S.y,716,S.y,P.gray,1.8,9);
    const pl=new C.Plot(k,[730,120,880,280],{xr:[-6,6],yr:ACTS[st.act][2]});c.fillStyle=P.bg2;c.fillRect(730,120,150,160);pl.hline(0,{color:P.lgray});pl.vline(0,{color:P.lgray});
    pl.clip();pl.fn(ACTS[st.act][1],{color:P.orange,w:2.6});pl.unclip();const zc=clamp(o.z,-6,6);pl.dot(zc,clamp(o.y,ACTS[st.act][2][0],ACTS[st.act][2][1]),{r:6,color:P.ink,stroke:P.bg,sw:2});
    c.strokeStyle=P.lgray;c.lineWidth=1;c.strokeRect(730,120,150,160);label(c,ACTS[st.act][0],805,110,{w:700,fs:13.5,color:P.text});label(c,"f(z)",805,298,{fs:12,color:P.muted});
    arrow(c,884,S.y,930,S.y,P.gray,1.8,9);const spam=o.y>0.5,lv=clamp(o.y,0,1);
    c.save();if(lv>0.5){c.shadowColor=P.red;c.shadowBlur=26*lv}node(c,980,S.y,38,mix(P.node,spam?P.red:P.green,0.25+0.75*(spam?lv:1-lv)),spam?P.red:P.green,num(o.y,2),{fs:16,tc:(spam?lv:1-lv)>0.55?"#fff":P.text});c.restore();
    label(c,"Salida",980,S.y-50,{w:700,fs:13,color:P.text});label(c,spam?"SPAM":"legítimo",980,S.y+60,{w:800,fs:14,color:spam?P.red:P.green});label(c,"spam si salida > 0.5",980,S.y+80,{fs:11.5,color:P.muted})}
  const lp=C.loop(api,dt=>{t+=dt;draw();return true});
  k.cv.addEventListener("click",e=>{const q=k.ptr(e);if(q.x<345){const i=Math.floor((q.y-18)/92);if(i>=0&&i<4){st.sel=i;ex.touch();upd()}}});
  const r1=C.ctlRow(host);const setA=C.seg(C.group(r1,"Activación"),Object.entries(ACTS).map(([kk,v])=>[kk,v[0]]),v=>{st.act=v;setA(v);ex.touch();upd()});
  const r2=C.ctlRow(host);const sl=[0,1,2].map(j=>C.slider(r2,`w${"₁₂₃"[j]}`,-5,5,0.5,st.w[j],v=>{st.w[j]=v;ex.touch();upd()},v=>numT(v,1)));
  const slb=C.slider(r2,"b",-5,5,0.5,st.b,v=>{st.b=v;ex.touch();upd()},v=>numT(v,1));
  const rd=C.readout(host);
  function upd(){const m=MAILS[st.sel],o=out(m);rd.innerHTML=`«${m.s}»: z = ${m.x.map((v,j)=>`${numT(st.w[j],1)}·${v}`).join(" + ")} ${st.b<0?"−":"+"} ${numT(Math.abs(st.b),1)} = <b>${num(o.z,1)}</b> → ${ACTS[st.act][0]}(${num(o.z,1)}) = <b>${num(o.y,2)}</b>`;draw()}
  function sync(){sl.forEach((s,j)=>s.set(st.w[j]));slb.set(st.b);setA(st.act);upd()}
  const ex=reg("m7-1",host,{
    grade(){const items=[];const ok=MAILS.map(m=>(out(m).y>0.5)===(m.y===1));const n=ok.filter(Boolean).length;
      items.push(it(1.5*n,6,`Clasificas bien <b>${n} de 4</b> correos.`+(n<4?` Fallan: ${MAILS.filter((m,i)=>!ok[i]).map(m=>"«"+m.s+"»").join(", ")}. Un peso positivo empuja hacia spam y uno negativo hacia legítimo; el sesgo mueve el umbral de toda la neurona.`:" Cada rasgo empuja en el sentido correcto.")));
      const A_={sigmoide:[2,"<b>Sigmoide:</b> la salida es una probabilidad entre 0 y 1, justo lo que necesita un filtro de spam (Módulo 7, apartado 3.1)."],
        escalon:[1,"<b>Escalón:</b> clasifica, pero solo responde 0 o 1 y su pendiente es 0 en todas partes, así que la red no podría aprender con descenso por gradiente. Para una probabilidad se usa la <b>sigmoide</b>."],
        tanh:[0.5,"<b>Tanh</b> da valores entre −1 y 1, que no se pueden leer como probabilidad. Para una salida binaria se usa la <b>sigmoide</b>."],
        relu:[0,"<b>ReLU</b> no está acotada por arriba (puede dar 3, 5, 10…): no es una probabilidad. Se reserva para las capas ocultas; aquí tocaba la <b>sigmoide</b>."]}[st.act];
      items.push(it(A_[0],2,A_[1]));
      if(st.act==="sigmoide"){const sure=MAILS.filter(m=>{const y=out(m).y;return m.y?y>0.8:y<0.2}).length;
        items.push(it(sure===4?2:sure>=3?1:0,2,sure===4?"Los cuatro correos se deciden con <b>seguridad</b> (probabilidad por encima de 0.8 o por debajo de 0.2).":`Solo ${sure} de 4 correos tienen una probabilidad clara (> 0.8 o < 0.2). Con pesos más grandes, <i>z</i> se aleja de 0 y la sigmoide da respuestas más seguras.`))}
      else items.push(it(0,2,"La seguridad de la respuesta se mide como probabilidad, y eso solo lo da la sigmoide."));
      return{items,sol:"sigmoide con w₁ = 2, w₂ = 3, w₃ = −4 y b = −0.5. Los dos correos de spam dan z = 4.5 y 2.5 (probabilidad 0.99 y 0.92) y los legítimos z = −4.5 y −2.5 (0.01 y 0.08). El remitente conocido necesita un peso negativo grande: tiene que pesar más que un enlace sospechoso."}},
    solve(){st.w=[2,3,-4];st.b=-0.5;st.act="sigmoide";sync()}});
  setA(st.act);upd();api.onTheme(draw);lp.start();
});

// =====================================================================
// M7 · 2 · Construye una red que resuelva XOR
// =====================================================================
C.define("ej-m7-2",function(host,opts,api){
  const D=K.xorData(80,11);const st={L:0,n:3,act:"relu",seed:1};let net,ep=0,run=false,ev,probe=[0.6,-0.6];const MAXEP=300;
  const [A,B]=panels(host,[{W:540,H:360,sub:"(a) Tu red"},{W:460,H:360,sub:"(b) Lo que decide sobre los datos"}]);
  const hid=()=>Array(st.L).fill(st.n),params=()=>{const s=[2,...hid(),1];let p=0;for(let l=0;l<s.length-1;l++)p+=(s[l]+1)*s[l+1];return p};
  function build(){net=K.MLP([2,...hid(),1],st.act,st.seed);ep=0;ev=net.evalSet(D.X,D.Y);run=false;btn.textContent="▶ Entrenar"}
  const pb=()=>new C.Plot(B.k,[40,14,446,330],{xr:[-1.45,1.45],yr:[-1.45,1.45]});
  function drawA(){const k=A.k,c=k.c,P=api.pal();k.clear();const sizes=[2,...hid(),1];const f=net.fwd(probe);
    const norm=(v,l)=>l===0?(v+1.45)/2.9:l===sizes.length-1?v:st.act==="sigmoide"?v:st.act==="tanh"?(v+1)/2:st.act==="relu"?Math.min(1,v/1.5):sig(v);
    const vals=f.as.map((a,l)=>Array.from(a,v=>norm(v,l)));
    const pos=drawNet(c,P,{sizes,x0:70,x1:470,y0:70,y1:290,vals,r:15,sp:40,w:(l,i,j)=>net.W[l][j*sizes[l]+i]});
    label(c,"Entradas",70,36,{w:700,color:P.text});label(c,"Salida",470,36,{w:700,color:P.text});
    hid().forEach((_,l)=>label(c,`Oculta ${l+1}`,pos[l+1][0].x,36,{w:700,color:P.orange}));
    if(!st.L)label(c,"Sin capas ocultas: perceptrón",270,36,{fs:12.5,color:P.muted});
    label(c,"x₁",pos[0][0].x-26,pos[0][0].y+5,{fs:14,font:`italic 15px Georgia,serif`,color:P.text});label(c,"x₂",pos[0][1].x-26,pos[0][1].y+5,{font:`italic 15px Georgia,serif`,color:P.text});
    label(c,num(f.as[sizes.length-1][0],2),pos[sizes.length-1][0].x,pos[sizes.length-1][0].y+36,{font:`700 13px ${F.mono}`,color:P.green});
    label(c,`${params()} parámetros · activación ${({lineal:"lineal",sigmoide:"sigmoide",tanh:"tanh",relu:"ReLU"})[st.act]}`,270,334,{fs:13,color:P.muted});
    label(c,"Grosor de cada conexión = tamaño del peso (azul +, rojo −)",270,352,{fs:11.5,color:P.muted})}
  function drawB(){const k=B.k,c=k.c,P=api.pal();k.clear();const pl=pb();probMap(pl,(x,y)=>net.prob([x,y]),46,46,P);
    for(let i=0;i<D.n;i++)pl.dot(D.X[2*i],D.X[2*i+1],{r:4.6,color:D.Y[i]?P.red:P.blue,stroke:P.bg,sw:1.4});
    c.strokeStyle=P.ink;c.lineWidth=1.6;const px=pl.X(probe[0]),py=pl.Y(probe[1]);c.beginPath();c.arc(px,py,9,0,7);c.moveTo(px-14,py);c.lineTo(px+14,py);c.moveTo(px,py-14);c.lineTo(px,py+14);c.stroke();
    c.strokeStyle=P.lgray;c.lineWidth=1;c.strokeRect(pl.x0,pl.y0,pl.x1-pl.x0,pl.y1-pl.y0);
    C.legend(c,[{type:"dot",color:P.red,label:"Descuadre"},{type:"dot",color:P.blue,label:"Cuadra"}],60,348,{row:true,fs:12})}
  function draw(){drawA();drawB();rd.innerHTML=`Época <b>${ep}</b> · precisión <b>${pct(ev.acc)}</b> · coste ${num(ev.loss,3)}`+(ep===0?" · <span class=\"muted\">pulsa «Entrenar»</span>":"")}
  const lp=C.loop(api,()=>{if(!run)return false;for(let i=0;i<3&&ep<MAXEP;i++){net.epoch(D.X,D.Y,0.05);ep++}ev=net.evalSet(D.X,D.Y);if(ep>=MAXEP){run=false;btn.textContent="▶ Entrenar"}draw();return run});
  const mv=e=>{const q=B.k.ptr(e),pl=pb();if(!pl.inside(q))return;probe=[pl.iX(q.x),pl.iY(q.y)];drawA();drawB()};B.k.cv.addEventListener("pointermove",mv);B.k.cv.addEventListener("click",mv);
  const r1=C.ctlRow(host);const setL=C.seg(C.group(r1,"Capas ocultas"),[[0,"0"],[1,"1"],[2,"2"],[3,"3"]],v=>{st.L=+v;setL(v);ex.touch();build();draw()});
  const sn=C.slider(r1,"Neuronas por capa",1,8,1,st.n,v=>{st.n=v;ex.touch();build();draw()});
  const r2=C.ctlRow(host);const setAct=C.seg(C.group(r2,"Activación"),[["lineal","Lineal"],["sigmoide","Sigmoide"],["tanh","Tanh"],["relu","ReLU"]],v=>{st.act=v;setAct(v);ex.touch();build();draw()});
  const g=C.group(r2);const btn=C.button(g,"▶ Entrenar",()=>{ex.touch();if(run){run=false;btn.textContent="▶ Entrenar";return}if(ep>=MAXEP){build()}run=true;btn.textContent="❚❚ Pausa";lp.start()},{primary:true});
  C.button(g,"Nuevos pesos iniciales",()=>{st.seed++;ex.touch();build();draw()});
  const rd=C.readout(host);C.hint(host,"Mueve el ratón sobre (b) para ver cómo se activa cada neurona con ese punto.");
  const ex=reg("m7-2",host,{
    grade(){const items=[],acc=ev.acc,nH=st.L*st.n;
      items.push(it(acc>=0.95?6:acc>=0.85?3:0,6,ep===0?"No has entrenado la red: sin entrenar, sus pesos son aleatorios.":`Tu red acierta el <b>${pct(acc)}</b> de los casos tras ${ep} épocas`+(acc>=0.95?".":" (objetivo: 95 %).")));
      if(st.L===0)items.push(it(0,2,"<b>Sin capa oculta</b> la red es un perceptrón: solo traza una recta, y ninguna recta separa los descuadres de XOR (Módulo 7, apartado 2.2)."));
      else if(st.act==="lineal")items.push(it(0,2,"Con activación <b>lineal</b>, todas las capas se reducen a una sola transformación lineal: la frontera sigue siendo una recta. Hace falta una activación no lineal (apartado 3)."));
      else items.push(it(2,2,`Diseño correcto: ${st.L} capa${st.L>1?"s":""} oculta${st.L>1?"s":""} con activación no lineal. Cada neurona oculta traza una recta y la salida las combina.`));
      if(acc>=0.95&&st.L>0)items.push(it(nH<=4?2:nH<=8?1:0,2,nH<=4?`Red compacta: ${nH} neuronas ocultas bastan.`:`Funciona, pero usas ${nH} neuronas ocultas. XOR se resuelve con 2–4: una red más pequeña es más rápida y generaliza mejor.`));
      else items.push(it(0,2,"El punto por tamaño solo cuenta cuando la red resuelve el problema."));
      return{items,sol:"una capa oculta con 3 neuronas tanh (también valen 2–4 neuronas ReLU o sigmoide, según el arranque). Cada neurona oculta traza una recta y la salida combina esas rectas para aislar las dos esquinas de descuadre (Módulo 7, apartado 4.1)."}},
    solve(){st.L=1;st.n=3;st.act="tanh";st.seed=1;setL(1);sn.set(3);setAct("tanh");build();run=true;btn.textContent="❚❚ Pausa";lp.start()}});
  setL(st.L);setAct(st.act);build();draw();api.onTheme(draw);
});

// =====================================================================
// M7 · 3 · Elige la capa de salida
// =====================================================================
C.define("ej-m7-3",function(host,opts,api){
  const SC={spam:{t:"Filtro de spam",q:"¿Es spam este correo?",ex:["Asunto: «¡Gana un iPhone gratis!»","De: promo@premios-ya.biz"],cls:["Spam","Legítimo","(sin clase)"],z:[2.2,-0.4,0.9]},
    ticket:{t:"Clasificador de tickets",q:"¿A qué departamento va el ticket?",ex:["«No puedo entrar en la app","desde ayer, me da error 503»"],cls:["Facturación","Incidencia técnica","Consulta comercial"],z:[0.8,2.4,0.3]},
    precio:{t:"Tasador de viviendas",q:"¿Cuánto vale la vivienda? (miles de €)",ex:["95 m² · 3 habitaciones","2.ª planta · con ascensor"],cls:["Precio","(sin significado)","(sin significado)"],z:[312,40,-12]}};
  const AN={lineal:"Lineal",sigmoide:"Sigmoide",relu:"ReLU",softmax:"Softmax"};
  const st={cur:"spam",ch:{spam:{n:null,a:null},ticket:{n:null,a:null},precio:{n:null,a:null}}};let t=0;
  const [A]=C.panels(host,[{W:1040,H:340,aria:"Red con su capa de salida elegida y los valores que produce."}]);const k=A.k,c=k.c;
  function outs(sc,ch){const n=ch.n||1,z=SC[sc].z.slice(0,n);if(!ch.a)return null;
    if(ch.a==="softmax"){const m=Math.max(...z),e=z.map(v=>Math.exp(v-m)),s=e.reduce((a,b)=>a+b,0);return e.map(v=>v/s)}
    return z.map(v=>ch.a==="lineal"?v:ch.a==="relu"?Math.max(0,v):sig(v))}
  function draw(){const P=api.pal();k.clear();const S=SC[st.cur],ch=st.ch[st.cur],n=ch.n||1,o=outs(st.cur,ch);
    c.fillStyle=P.bg2;rrect(c,14,40,270,250,14);c.fill();c.strokeStyle=P.lgray;c.lineWidth=1;rrect(c,14,40,270,250,14);c.stroke();
    label(c,S.t,30,72,{align:"left",w:800,fs:16,font:`800 17px ${F.head}`,color:P.text});label(c,S.q,30,98,{align:"left",fs:13,color:P.muted});
    c.fillStyle=P.bg;rrect(c,30,120,238,70,10);c.fill();S.ex.forEach((l,i)=>label(c,l,42,148+i*22,{align:"left",fs:13,color:P.text}));
    label(c,"Entrada → capas ocultas → ?",30,270,{align:"left",fs:12,color:P.muted});
    const hx=380,ox=590,hy=[100,150,200,250];arrow(c,288,175,350,175,P.gray,1.8,9);
    const oy=Array.from({length:n},(_,i)=>175+(i-(n-1)/2)*70);
    hy.forEach(y=>oy.forEach(y2=>{c.strokeStyle=P.lgray;c.lineWidth=1;c.beginPath();c.moveTo(hx,y);c.lineTo(ox,y2);c.stroke();const u=(t*0.6+y/400)%1;c.fillStyle=rgba(P.orange,.8);c.beginPath();c.arc(hx+(ox-hx)*u,y+(y2-y)*u,2.4,0,7);c.fill()}));
    hy.forEach((y,i)=>node(c,hx,y,14,mix(P.node,P.orange,0.3+0.6*((Math.sin(t*2+i)+1)/2)),P.orange,""));label(c,"Capa oculta",hx,72,{w:700,color:P.orange});
    label(c,ch.a?`Salida · ${AN[ch.a]}`:"Salida · elige la activación",ox,72,{w:700,color:ch.a?P.green:P.muted});
    oy.forEach((y,i)=>{const v=o?o[i]:null;if(ch.n){node(c,ox,y,22,v===null?P.node:mix(P.node,P.green,clamp(Math.abs(v),0,1)*0.8+0.15),P.green,"",{})}else{c.setLineDash([4,4]);c.strokeStyle=P.gray;c.lineWidth=2;c.beginPath();c.arc(ox,y,22,0,7);c.stroke();c.setLineDash([]);label(c,"?",ox,y+6,{w:700,fs:18,color:P.muted})}});
    // valores
    const bx=680,bw=200;oy.forEach((y,i)=>{label(c,S.cls[i],bx,y-12,{align:"left",w:600,fs:13,color:P.text});c.fillStyle=P.shade;rrect(c,bx,y-2,bw,12,6);c.fill();
      if(o){const v=o[i],mx=Math.max(1,...o.map(Math.abs)),w=bw*clamp(Math.abs(v)/(ch.a==="lineal"||ch.a==="relu"?mx:1),0,1);c.fillStyle=v<0?P.red:P.green;rrect(c,bx,y-2,Math.max(3,w),12,6);c.fill();
        label(c,st.cur==="precio"&&i===0&&(ch.a==="lineal"||ch.a==="relu")?`${numT(v,0)} mil €`:num(v,v>100?0:2),bx+bw+12,y+9,{align:"left",font:`700 14px ${F.mono}`,color:P.text})}});
    let msg="Elige cuántas neuronas tiene la capa de salida y su activación.";
    if(o){const s=o.reduce((a,b)=>a+b,0);msg=ch.a==="softmax"?(n===1?"Con una sola neurona, softmax siempre devuelve 1.00.":`Probabilidades que compiten entre sí: suman ${num(s,2)}.`):ch.a==="sigmoide"?(n===1?"Un valor entre 0 y 1.":`Cada salida va de 0 a 1 por separado: suman ${num(s,2)}.`):ch.a==="relu"?"Valores sin límite por arriba y nunca negativos.":"Valores sin límite: pueden ser cualquier número."}
    label(c,msg,bx,315,{align:"left",fs:12.5,color:P.muted})}
  const lp=C.loop(api,dt=>{t+=dt;draw();return true});
  const r1=C.ctlRow(host);const setC=C.seg(C.group(r1,"Caso"),[["spam","1 · Spam"],["ticket","2 · Tickets"],["precio","3 · Precio"]],v=>{st.cur=v;setC(v);syncCh();draw()});
  const r2=C.ctlRow(host);const setN=C.seg(C.group(r2,"Neuronas de salida"),[[1,"1"],[2,"2"],[3,"3"]],v=>{st.ch[st.cur].n=+v;ex.touch();syncCh();draw()});
  const setAc=C.seg(C.group(r2,"Activación de salida"),Object.entries(AN),v=>{st.ch[st.cur].a=v;ex.touch();syncCh();draw()});
  const rd=C.readout(host);
  function syncCh(){const ch=st.ch[st.cur];setN(ch.n===null?"":ch.n);setAc(ch.a||"");const done=Object.values(st.ch).filter(x=>x.n&&x.a).length;rd.innerHTML=`Casos respondidos: <b>${done} de 3</b>. Cambia de caso con los botones de arriba.`}
  const ex=reg("m7-3",host,{
    grade(){const T=10/3,items=[];const ch=st.ch;
      {const {n,a}=ch.spam;let p=0,t_;if(n===1&&a==="sigmoide"){p=T;t_="1 neurona con <b>sigmoide</b>: da directamente la probabilidad de spam."}
        else if(n===2&&a==="softmax"){p=T;t_="2 neuronas con <b>softmax</b>: equivale a una sigmoide; también es correcto."}
        else{p=(n===1||n===2?T*0.4:0)+(a==="sigmoide"?T*0.3:0);t_=`Elegiste ${n||"?"} neurona${n>1?"s":""} con ${a?AN[a]:"?"}. Para dos clases basta <b>1 neurona sigmoide</b> (o 2 con softmax).`+(a==="softmax"&&n===1?" Con una sola neurona, softmax siempre da 1: no informa de nada.":"")+(a==="lineal"||a==="relu"?" Una salida sin acotar no es una probabilidad.":"")}
        items.push(it(p,T,"<b>Spam.</b> "+t_))}
      {const {n,a}=ch.ticket;const pn=n===3?T*0.4:0,pa=a==="softmax"?T*0.6:a==="sigmoide"?T*0.2:0;
        items.push(it(pn+pa,T,"<b>Tickets.</b> "+(n===3&&a==="softmax"?"3 neuronas con <b>softmax</b>: una probabilidad por departamento y todas suman 1 (Módulo 7, apartado 3.5).":`Elegiste ${n||"?"} neurona${n>1?"s":""} con ${a?AN[a]:"?"}. Hay 3 departamentos excluyentes: hacen falta <b>3 neuronas con softmax</b>.`+(a==="sigmoide"?" Con sigmoides, cada clase se evalúa por separado y las probabilidades no suman 1; eso sirve cuando un caso puede tener varias etiquetas a la vez.":"")))) }
      {const {n,a}=ch.precio;const pn=n===1?T*0.4:0,pa=a==="lineal"?T*0.6:a==="relu"?T*0.4:0;
        items.push(it(pn+pa,T,"<b>Precio.</b> "+(n===1&&a==="lineal"?"1 neurona <b>lineal</b>: el precio es un número que puede tomar cualquier valor (Módulo 7, apartado 5.2).":`Elegiste ${n||"?"} neurona${n>1?"s":""} con ${a?AN[a]:"?"}. Para predecir un número se usa <b>1 neurona lineal</b>.`+(a==="sigmoide"||a==="softmax"?" Sigmoide y softmax aplastan la salida entre 0 y 1: nunca podría dar 312 000 €.":a==="relu"?" ReLU funciona porque el precio no es negativo, pero lo estándar es la salida lineal.":"")))) }
      return{items,sol:"spam: 1 neurona sigmoide (o 2 con softmax). Tickets: 3 neuronas con softmax, una por departamento. Precio: 1 neurona lineal, porque el resultado es un número sin límites."}},
    solve(){st.ch={spam:{n:1,a:"sigmoide"},ticket:{n:3,a:"softmax"},precio:{n:1,a:"lineal"}};syncCh();draw()}});
  setC("spam");syncCh();api.onTheme(draw);lp.start();
});

// =====================================================================
// M7 · 4 · Aproxima la curva con neuronas ReLU
// =====================================================================
C.define("ej-m7-4",function(host,opts,api){
  const st={knots:[8,16],sel:-1};let fit=K.fitKnots(st.knots),drag=-1;const GOAL=0.045,MAXK=12;
  const [A]=C.panels(host,[{W:1040,H:420,aria:"Curva de consumo eléctrico y aproximación con una suma de neuronas ReLU cuyos codos se pueden arrastrar."}]);const k=A.k,c=k.c;
  const pl=()=>new C.Plot(k,[70,24,1010,320],{xr:[0,24],yr:[0.4,2.4]});const LANE=356;
  function refit(){st.knots.sort((a,b)=>a-b);fit=K.fitKnots(st.knots)}
  function draw(){const P=api.pal();k.clear();const p=pl();p.axes({xt:[0,3,6,9,12,15,18,21,24],yt:[0.5,1,1.5,2],xl:"",yl:"Consumo (kW)",xlab:v=>v+" h",ylgap:46});
    const xs=K.CX,ty=xs.map(K.CURVE),fy=xs.map(fit.f);
    p.clip();c.fillStyle=rgba(P.red,.14);c.beginPath();xs.forEach((x,i)=>{i?c.lineTo(p.X(x),p.Y(ty[i])):c.moveTo(p.X(x),p.Y(ty[i]))});for(let i=xs.length-1;i>=0;i--)c.lineTo(p.X(xs[i]),p.Y(fy[i]));c.fill();
    p.line(xs,ty,{color:P.gray,w:3.2,dash:[7,5]});p.line(xs,fy,{color:P.orange,w:3});p.unclip();
    st.knots.forEach((kn,i)=>{const x=p.X(kn);c.strokeStyle=rgba(P.orange,.45);c.setLineDash([3,4]);c.lineWidth=1;c.beginPath();c.moveTo(x,p.y0);c.lineTo(x,LANE-12);c.stroke();c.setLineDash([]);
      p.dot(kn,fit.f(kn),{r:5,color:P.orange,stroke:P.bg,sw:2});
      c.fillStyle=i===st.sel||i===drag?P.blue:P.orange;c.beginPath();c.moveTo(x,LANE-12);c.lineTo(x-10,LANE+6);c.lineTo(x+10,LANE+6);c.closePath();c.fill();
      label(c,numT(kn,2)+" h",x,LANE+22,{fs:11,color:P.muted})});
    c.strokeStyle=P.lgray;c.lineWidth=1;c.beginPath();c.moveTo(70,LANE+6);c.lineTo(1010,LANE+6);c.stroke();
    label(c,"Codos de las neuronas: arrástralos · pulsa en la gráfica para añadir uno",540,410,{fs:12,color:P.muted});
    C.legend(c,[{color:P.gray,dash:[7,5],label:"Consumo real"},{color:P.orange,label:"Salida de tu red"}],90,40,{row:true,fs:12.5});
    // indicador de error
    const gx=760,gy=34,gw=230;c.fillStyle=P.bg;rrect(c,gx-10,gy-14,gw+20,48,10);c.fill();label(c,`Error (RMSE): ${num(fit.rmse,3)} kW`,gx,gy+2,{align:"left",w:700,fs:13,color:P.text});
    const sc=v=>gw*clamp(v/0.25,0,1);c.fillStyle=P.shade;rrect(c,gx,gy+12,gw,9,4);c.fill();c.fillStyle=fit.rmse<=GOAL?P.green:P.orange;rrect(c,gx,gy+12,Math.max(3,sc(fit.rmse)),9,4);c.fill();
    c.strokeStyle=P.ink;c.lineWidth=2;c.beginPath();c.moveTo(gx+sc(GOAL),gy+8);c.lineTo(gx+sc(GOAL),gy+25);c.stroke();label(c,"objetivo",gx+sc(GOAL),gy+36,{fs:10.5,color:P.muted})}
  function hit(q){const p=pl();let b=-1,bd=14;st.knots.forEach((kn,i)=>{const d=Math.abs(p.X(kn)-q.x);if(d<bd&&q.y>p.y0){bd=d;b=i}});return b}
  k.cv.addEventListener("pointerdown",e=>{const q=k.ptr(e),p=pl();const h=hit(q);if(h>=0&&(q.y>LANE-30||Math.abs(p.Y(fit.f(st.knots[h]))-q.y)<20)){drag=h;st.sel=h;k.cv.setPointerCapture(e.pointerId);ex.touch();draw();return}
    if(p.inside(q)&&st.knots.length<MAXK){st.knots.push(Math.round(p.iX(q.x)*4)/4);refit();st.sel=st.knots.indexOf(Math.round(p.iX(q.x)*4)/4);ex.touch();upd()}});
  k.cv.addEventListener("pointermove",e=>{const q=k.ptr(e);if(drag<0){k.cv.style.cursor=hit(q)>=0?"ew-resize":"crosshair";return}const p=pl();const v=clamp(Math.round(p.iX(q.x)*4)/4,0.25,23.75);st.knots[drag]=v;fit=K.fitKnots([...st.knots].sort((a,b)=>a-b));upd(true)});
  const end=()=>{if(drag<0)return;const v=st.knots[drag];refit();st.sel=st.knots.indexOf(v);drag=-1;upd()};k.cv.addEventListener("pointerup",end);k.cv.addEventListener("pointercancel",end);
  const r=C.ctlRow(host),g=C.group(r,"Neuronas");
  C.button(g,"+ Añadir neurona",()=>{if(st.knots.length>=MAXK)return;let bx=12,be=-1;K.CX.forEach(x=>{const e=Math.abs(fit.f(x)-K.CURVE(x));if(e>be&&!st.knots.includes(x)){be=e;bx=x}});st.knots.push(bx);refit();st.sel=st.knots.indexOf(bx);ex.touch();upd()},{primary:true});
  C.button(g,"− Quitar la seleccionada",()=>{if(!st.knots.length)return;st.knots.splice(st.sel>=0?st.sel:st.knots.length-1,1);st.sel=-1;refit();ex.touch();upd()});
  C.button(g,"Repartir por igual",()=>{const n=st.knots.length;st.knots=Array.from({length:n},(_,i)=>Math.round(24*(i+1)/(n+1)*4)/4);refit();ex.touch();upd()});
  const rd=C.readout(host);
  function upd(noFit){if(!noFit)refit();rd.innerHTML=`<b>${st.knots.length}</b> neurona${st.knots.length===1?"":"s"} ReLU · error <b>${num(fit.rmse,3)} kW</b> · objetivo: error ≤ ${GOAL} kW con 6 neuronas o menos`;draw()}
  const ex=reg("m7-4",host,{
    grade(){const e=fit.rmse,n=st.knots.length,items=[];
      items.push(it(e<=GOAL?6:e<=0.07?3:0,6,`El error de tu red es <b>${num(e,3)} kW</b>`+(e<=GOAL?", dentro del objetivo.":` (objetivo: ${GOAL} kW). La curva tiene dos subidas y bajadas: hace falta un codo en cada cambio de dirección.`)));
      items.push(e<=GOAL?it(n<=6?4:n<=8?2:0,4,n<=6?`Solo usas <b>${n} neuronas</b>: cada codo está donde la curva cambia de pendiente.`:`Usas ${n} neuronas. Con los codos bien colocados (justo donde la curva gira) bastan 6.`):it(0,4,"El punto por número de neuronas solo cuenta cuando el error está dentro del objetivo."));
      return{items,sol:"6 neuronas con los codos en torno a las 6 h, 8.5 h, 10.5 h, 17 h, 19.75 h y 23 h (error ≈ 0.036 kW). Cada neurona ReLU aporta un cambio de pendiente: se colocan donde empieza la subida de la mañana, en el pico, al final de la bajada y alrededor del pico de la tarde. Repartirlas por igual necesita unas 10 (Módulo 7, apartado 4.1)."}},
    solve(){st.knots=[6,8.5,10.5,17,19.75,23];st.sel=-1;upd()}});
  upd();api.onTheme(draw);
});

// =====================================================================
// M7 · 5 · El tipo de capa de cada aplicación
// =====================================================================
C.define("ej-m7-5",function(host,opts,api){
  const CASES={credito:{t:"Riesgo de crédito",d:"Tabla: una fila por cliente, 12 columnas",in:12,ok:"densa"},ocr:{t:"Lectura de documentos (OCR)",d:"Imagen de 28 × 28 píxeles",in:784,ok:"conv"},audio:{t:"Comandos de voz",d:"1 s de audio: 100 tramos de 40 valores",in:4000,ok:"rec"}};
  const LT={densa:"Densa",conv:"Convolucional",rec:"Recurrente"};
  const st={cur:"credito",ch:{credito:null,ocr:null,audio:null}};let t=0;
  const [A]=C.panels(host,[{W:1040,H:360,aria:"Datos de cada aplicación y cómo los procesa el tipo de capa elegido."}]);const k=A.k,c=k.c;
  const SEVEN=["..........","..######..","..######..",".......##.","......##..",".....##...","....##....","....##....","...##.....","...##....."];
  function params(cs,ty){const n=CASES[cs].in;return ty==="densa"?n*64+64:ty==="conv"?3*3*32+32:(cs==="audio"?40:cs==="ocr"?28:1)*64+64*64+64}
  function drawData(P,cs,win){const x0=30,y0=60,w=300,h=240;c.fillStyle=P.bg2;rrect(c,x0-14,y0-34,w+28,h+52,14);c.fill();label(c,CASES[cs].d,x0+w/2,y0-12,{fs:12.5,color:P.muted});
    if(cs==="credito"){const cols=["Ingresos","Deuda","Edad","Antig.","Impagos","Ahorro"];
      cols.forEach((cn,j)=>{label(c,cn,x0+25+j*50,y0+16,{fs:11,w:700,color:P.text})});
      for(let i=0;i<7;i++)cols.forEach((_,j)=>{const on=win&&win.row===i;c.fillStyle=on?rgba(P.orange,.25):(i%2?P.bg:P.bg2);c.fillRect(x0+j*50,y0+26+i*28,50,28);label(c,String(TABLE[(i*6+j)%TABLE.length]),x0+25+j*50,y0+45+i*28,{font:`12px ${F.mono}`,color:P.text})});
      if(win&&win.col!==undefined){c.strokeStyle=P.orange;c.lineWidth=2.4;c.strokeRect(x0+win.col*50,y0+26+win.row*28,150,28*3)}}
    else if(cs==="ocr"){const s=22;const ox=x0+40,oy=y0+10;SEVEN.forEach((row,i)=>[...row].forEach((ch,j)=>{c.fillStyle=ch==="#"?P.ink:P.bg;c.fillRect(ox+j*s,oy+i*s,s-1,s-1)}));
      if(win){c.strokeStyle=P.orange;c.lineWidth=3;if(win.full)c.strokeRect(ox,oy+win.row*s,10*s,s);else c.strokeRect(ox+win.col*s,oy+win.row*s,3*s,3*s)}}
    else{const mid=y0+h/2;c.strokeStyle=P.blue;c.lineWidth=1.6;c.beginPath();for(let i=0;i<=300;i++){const x=i/300,a=Math.exp(-(((x-0.3)/0.12)**2))+0.8*Math.exp(-(((x-0.68)/0.1)**2));const y=mid-80*a*Math.sin(i*0.9)*Math.sin(i*0.13+1);i?c.lineTo(x0+x*w,y):c.moveTo(x0+x*w,y)}c.stroke();
      for(let i=1;i<10;i++){c.strokeStyle=P.lgray;c.lineWidth=1;c.beginPath();c.moveTo(x0+i*w/10,mid+95);c.lineTo(x0+i*w/10,mid+105);c.stroke()}
      if(win){c.fillStyle=rgba(P.orange,.25);c.fillRect(x0+win.seg*w/10,y0+20,w/10,h-30);c.strokeStyle=P.orange;c.lineWidth=2;c.strokeRect(x0+win.seg*w/10,y0+20,w/10,h-30)}}}
  const TABLE=[42,18,35,7,0,12,28,31,52,3,2,5,65,9,44,15,0,40,23,27,29,1,1,2,51,14,38,10,0,22,36,22,47,6,1,9,58,11,61,20,0,33];
  function draw(){const P=api.pal();k.clear();const cs=st.cur,ty=st.ch[cs];
    let win=null;const ph=(t*0.5)%1;
    if(ty==="conv")win=cs==="credito"?{row:Math.floor(ph*5),col:Math.floor((ph*20)%4)}:cs==="ocr"?{row:Math.floor(ph*8),col:Math.floor((ph*64)%8)}:{seg:Math.floor(ph*10)};
    else if(ty==="rec")win=cs==="credito"?{row:Math.floor(ph*7)}:cs==="ocr"?{row:Math.floor(ph*10),full:true}:{seg:Math.floor(ph*10)};
    drawData(P,cs,win);
    const X=400;label(c,ty?`Capa ${LT[ty]}`:"Elige el tipo de capa",X+150,40,{w:800,font:`800 17px ${F.head}`,color:ty?P.orange:P.muted});
    if(ty==="densa"){const ins=Array.from({length:9},(_,i)=>({x:X+30,y:80+i*25})),hs=Array.from({length:5},(_,i)=>({x:X+260,y:110+i*40}));
      ins.forEach(p=>hs.forEach(q=>{c.strokeStyle=rgba(P.blue,.22);c.lineWidth=1;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(q.x,q.y);c.stroke()}));
      ins.forEach((p,i)=>{if(i===4){label(c,"⋮",p.x,p.y+5,{fs:16,color:P.muted});return}node(c,p.x,p.y,7,mix(P.node,P.blue,0.5+0.5*Math.sin(t*3+i)),P.blue,"")});
      hs.forEach((q,i)=>node(c,q.x,q.y,13,mix(P.node,P.orange,0.4+0.4*Math.sin(t*2+i)),P.orange,""));
      label(c,`${CASES[cs].in} entradas en fila`,X+30,320,{fs:12,color:P.muted});label(c,"cada neurona ve todo",X+260,320,{fs:12,color:P.muted})}
    else if(ty==="conv"){const s=16;c.strokeStyle=P.orange;c.lineWidth=2;for(let i=0;i<3;i++)for(let j=0;j<3;j++){c.fillStyle=rgba(P.orange,0.15+0.25*((i+j)%2));c.fillRect(X+20+j*s,150+i*s,s-1,s-1)}
      label(c,"filtro 3 × 3",X+44,220,{fs:12,color:P.muted});arrow(c,X+80,174,X+130,174,P.gray,1.8,9);
      const n=8,fs=18;for(let i=0;i<n;i++)for(let j=0;j<n;j++){const idx=i*n+j,cur=Math.floor(ph*64);c.fillStyle=idx<=cur?mix(P.node,P.orange,0.25+0.6*Math.abs(Math.sin(idx*1.7))):P.shade;c.fillRect(X+140+j*fs,100+i*fs,fs-2,fs-2)}
      label(c,"mapa de rasgos",X+212,270,{fs:12,color:P.muted});label(c,"el mismo filtro recorre los datos buscando patrones locales",X+150,320,{fs:12,color:P.muted})}
    else if(ty==="rec"){const cx=X+170,cy=170;c.fillStyle=mix(P.node,P.orange,0.25+0.2*Math.sin(t*4));rrect(c,cx-60,cy-36,120,72,14);c.fill();c.strokeStyle=P.orange;c.lineWidth=2.4;rrect(c,cx-60,cy-36,120,72,14);c.stroke();
      label(c,"celda",cx,cy+5,{w:700,fs:15,color:P.text});
      c.strokeStyle=P.orange;c.lineWidth=2;c.beginPath();c.arc(cx,cy-36,30,Math.PI,0);c.stroke();arrow(c,cx+29,cy-40,cx+30,cy-33,P.orange,2,9);label(c,"memoria h",cx,cy-74,{fs:12,color:P.orange});
      for(let i=0;i<6;i++){const u=((ph*6)+i)%6;const x=X+20+u*48;c.fillStyle=i===0?P.orange:rgba(P.blue,.5);rrect(c,x-14,cy+80,28,22,5);c.fill()}
      arrow(c,cx,cy+78,cx,cy+40,P.gray,1.8,9);label(c,"lee los datos en orden, paso a paso, y recuerda lo anterior",X+150,320,{fs:12,color:P.muted})}
    if(ty){const bx=820;c.fillStyle=P.bg2;rrect(c,bx-10,96,226,150,12);c.fill();label(c,"Parámetros de la capa",bx+4,124,{align:"left",fs:12.5,color:P.muted});
      label(c,C.thou(params(cs,ty)),bx+4,160,{align:"left",font:`800 28px ${F.head}`,color:P.text});label(c,"(64 neuronas o 32 filtros)",bx+4,184,{align:"left",fs:11.5,color:P.muted});
      const lab={densa:"mira todos los datos a la vez",conv:"mira trozos pequeños y vecinos",rec:"mira los datos uno tras otro"}[ty];label(c,lab,bx+4,214,{align:"left",fs:12.5,color:P.text})}}
  const lp=C.loop(api,dt=>{t+=dt;draw();return true});
  const r1=C.ctlRow(host);const setC=C.seg(C.group(r1,"Aplicación"),Object.entries(CASES).map(([kk,v],i)=>[kk,`${i+1} · ${v.t}`]),v=>{st.cur=v;setC(v);setT(st.ch[v]||"");upd()});
  const r2=C.ctlRow(host);const setT=C.seg(C.group(r2,"Tipo de capa"),Object.entries(LT),v=>{st.ch[st.cur]=v;setT(v);ex.touch();upd()});
  const rd=C.readout(host);function upd(){const n=Object.values(st.ch).filter(Boolean).length;rd.innerHTML=`Aplicaciones respondidas: <b>${n} de 3</b>.`;draw()}
  const ex=reg("m7-5",host,{
    grade(){const T=10/3,ch=st.ch,items=[];
      const cr=ch.credito;items.push(it(cr==="densa"?T:0,T,"<b>Riesgo de crédito.</b> "+(cr==="densa"?"Capa <b>densa</b>: son datos tabulares sin orden ni vecindad; cada neurona combina todas las columnas.":`Elegiste ${cr?LT[cr]:"nada"}. En una tabla, que dos columnas estén juntas no significa nada y no hay orden temporal: lo adecuado es una capa <b>densa</b> (Módulo 7, apartado 4.2).`)));
      const oc=ch.ocr;items.push(it(oc==="conv"?T:oc==="densa"?T*0.3:0,T,"<b>OCR.</b> "+(oc==="conv"?"Capa <b>convolucional</b>: un filtro pequeño recorre la imagen, reconoce trazos locales y reutiliza los mismos 320 parámetros en toda ella.":`Elegiste ${oc?LT[oc]:"nada"}. En una imagen importan los píxeles vecinos: la capa <b>convolucional</b> lo aprovecha con muy pocos parámetros.`+(oc==="densa"?" Una densa necesita 50 240 parámetros y pierde la forma de la imagen al ponerla en fila.":"")+" (apartado 5.3)")));
      const au=ch.audio;items.push(it(au==="rec"?T:au==="conv"?T*0.6:0,T,"<b>Comandos de voz.</b> "+(au==="rec"?"Capa <b>recurrente</b>: lee el audio tramo a tramo y su memoria conserva lo que ya ha oído.":au==="conv"?"Las convoluciones también se usan con audio, pero la capa pensada para secuencias en el tiempo es la <b>recurrente</b> (apartado 5.4).":`Elegiste ${au?LT[au]:"nada"}. El audio es una secuencia en el tiempo: lo natural es una capa <b>recurrente</b> (apartado 5.4).`)));
      return{items,sol:"riesgo de crédito → densa (datos de tabla); OCR → convolucional (imagen, patrones locales); comandos de voz → recurrente (secuencia en el tiempo)."}},
    solve(){st.ch={credito:"densa",ocr:"conv",audio:"rec"};setT(st.ch[st.cur]);upd()}});
  setC("credito");upd();api.onTheme(draw);lp.start();
});

// =====================================================================
// M8 · 1 · Minimiza el coste a mano
// =====================================================================
C.define("ej-m8-1",function(host,opts,api){
  const r=K.rng(21),g=K.gauss(r),n=18,X=[],Y=[];for(let i=0;i<n;i++){const x=45+105*r();X.push(x);Y.push(1.9*x+35+g()*18)}
  const mx=X.reduce((a,b)=>a+b)/n,my=Y.reduce((a,b)=>a+b)/n;let sxy=0,sxx=0;for(let i=0;i<n;i++){sxy+=(X[i]-mx)*(Y[i]-my);sxx+=(X[i]-mx)**2}
  const WS=sxy/sxx,BS=my-WS*mx;const J=(w,b)=>{let s=0;for(let i=0;i<n;i++)s+=(Y[i]-w*X[i]-b)**2;return s/n};const JMIN=J(WS,BS);
  const st={w:0.6,b:150,q:null,squares:true};const trail=[[st.w,st.b]];const cache={};
  const [A,B]=panels(host,[{W:520,H:380,sub:"(a) Tu recta sobre los datos"},{W:480,H:380,sub:"(b) Dónde estás en el paisaje de coste"}]);
  const pa=()=>new C.Plot(A.k,[62,20,500,320],{xr:[40,160],yr:[0,400]}),pb=()=>new C.Plot(B.k,[62,20,460,320],{xr:[0,4],yr:[-100,200]});
  function drawA(){const k=A.k,c=k.c,P=api.pal();k.clear();const p=pa();p.axes({xt:[40,70,100,130,160],yt:[0,100,200,300,400],xl:"Superficie (m²)",yl:"Precio (miles de €)"});
    p.clip();if(st.squares)for(let i=0;i<n;i++){const yh=st.w*X[i]+st.b,px=p.X(X[i]),py=p.Y(Y[i]),ph=p.Y(yh),s=Math.abs(py-ph);c.fillStyle=rgba(P.red,.13);c.strokeStyle=rgba(P.red,.5);c.lineWidth=1;c.fillRect(px,Math.min(py,ph),s,s);c.strokeRect(px,Math.min(py,ph),s,s)}
    p.fn(x=>st.w*x+st.b,{color:P.orange,w:3});p.unclip();
    for(let i=0;i<n;i++)p.dot(X[i],Y[i],{r:5,color:P.blue,stroke:P.bg,sw:1.5});
    c.fillStyle=rgba(P.bg,.85);rrect(c,72,26,228,26,8);c.fill();label(c,`precio = ${num(st.w,2)} · m² ${st.b<0?"−":"+"} ${num(Math.abs(st.b),0)}`,82,44,{align:"left",font:`700 13px ${F.mono}`,color:P.text})}
  function drawB(){const k=B.k,c=k.c,P=api.pal();k.clear();const p=pb();heatCached(cache,"j",k,p,(w,b)=>Math.log(J(w,b)),70,60);
    p.axes({xt:[0,1,2,3,4],yt:[-100,0,100,200],xl:"Pendiente w",yl:"Sesgo b",grid:false});
    c.strokeStyle=rgba(P.white,.85);c.lineWidth=2;c.beginPath();trail.forEach(([w,b],i)=>{i?c.lineTo(p.X(w),p.Y(b)):c.moveTo(p.X(w),p.Y(b))});c.stroke();
    const ww=st.w,bb=st.b;let gw=0,gb=0;for(let i=0;i<n;i++){const e=Y[i]-ww*X[i]-bb;gw+=-2*X[i]*e/n;gb+=-2*e/n}
    const du=-gw*4,dv=-gb*300,L=Math.hypot(du,dv)||1;const px=p.X(ww),py=p.Y(bb);if(L>1e-6)arrow(c,px,py,px+du/L*44*(p.x1-p.x0)/398,py-dv/L*44*(p.y1-p.y0)/300,P.white,2.2,10);
    p.dot(ww,bb,{r:7,color:P.orange,stroke:"#fff",sw:2});
    const cur=J(ww,bb);c.fillStyle=rgba("#000000",.45);rrect(c,p.x1-170,p.y0+8,162,44,8);c.fill();label(c,"Coste (MSE)",p.x1-160,p.y0+25,{align:"left",fs:12,color:"#fff"});label(c,C.thou(cur),p.x1-160,p.y0+45,{align:"left",font:`800 17px ${F.mono}`,color:"#fff"});}
  function draw(){drawA();drawB()}
  function setWB(w,b){st.w=clamp(w,0,4);st.b=clamp(b,-100,200);const l=trail[trail.length-1];if(Math.hypot((st.w-l[0])*100,(st.b-l[1])*1.33)>3)trail.push([st.w,st.b]);if(trail.length>400)trail.shift();sw.set(st.w);sb.set(st.b);ex.touch();draw()}
  let dragging=false;const pm=e=>{const q=B.k.ptr(e),p=pb();if(!p.inside(q))return;setWB(p.iX(q.x),p.iY(q.y))};
  B.k.cv.addEventListener("pointerdown",e=>{dragging=true;B.k.cv.setPointerCapture(e.pointerId);pm(e)});B.k.cv.addEventListener("pointermove",e=>{if(dragging)pm(e)});B.k.cv.addEventListener("pointerup",()=>dragging=false);B.k.cv.style.cursor="crosshair";
  const r1=C.ctlRow(host);const sw=C.slider(r1,"Pendiente w",0,4,0.01,st.w,v=>setWB(v,st.b),v=>num(v,2));const sb=C.slider(r1,"Sesgo b",-100,200,1,st.b,v=>setWB(st.w,v),v=>num(v,0));
  C.toggle(C.group(r1),"Ver los cuadrados del error",true,v=>{st.squares=v;drawA()});
  C.hint(host,"Arrastra el punto naranja sobre el mapa (b) o usa los deslizadores. La flecha blanca apunta hacia donde el coste baja más deprisa.");
  const r2=C.ctlRow(host);r2.classList.add("ej-q");r2.appendChild(C.el("span",{class:"q"},"Pregunta: si en vez del precio quisieras predecir <b>la probabilidad de que un correo sea spam</b>, ¿qué función de coste usarías?"));
  const QO=[["mse","Error cuadrático medio (MSE)"],["ce","Entropía cruzada"],["mae","Error absoluto medio"]];const setQ=C.seg(C.group(r2),QO,v=>{st.q=v;setQ(v);ex.touch()});
  const ex=reg("m8-1",host,{
    grade(){const items=[],ratio=J(st.w,st.b)/JMIN;
      items.push(it(ratio<=1.05?7:ratio<=1.25?4:ratio<=2?2:0,7,`Tu coste es <b>${C.thou(J(st.w,st.b))}</b> y el mínimo posible es ${C.thou(JMIN)} (${ratio<1.005?"lo has clavado":numT(ratio,2)+" veces el mínimo"}).`+(ratio>1.05?" Sigue la flecha: apunta en la dirección en la que el coste baja más deprisa. El valle es largo y estrecho porque w y b se compensan entre sí (Módulo 8, apartado 3.1).":"")));
      items.push(it(st.q==="ce"?3:0,3,st.q==="ce"?"<b>Entropía cruzada</b>: es el coste para probabilidades y castiga mucho las predicciones seguras pero equivocadas (Módulo 8, apartado 1).":`${st.q?"Elegiste «"+QO.find(o=>o[0]===st.q)[1]+"». ":"No has respondido. "}Para probabilidades se usa la <b>entropía cruzada</b>: MSE y error absoluto son para predecir números (Módulo 8, apartado 1).`));
      return{items,sol:`la mejor recta es precio ≈ ${num(WS,2)} · m² ${BS<0?"−":"+"} ${num(Math.abs(BS),0)}, con coste ${C.thou(JMIN)}: el fondo del valle en (b). Para probabilidades, entropía cruzada.`}},
    solve(){st.q="ce";setQ("ce");setWB(WS,BS)}});
  draw();api.onTheme(draw);
});

// =====================================================================
// M8 · 2 · Pilota el descenso por gradiente
// =====================================================================
C.define("ej-m8-2",function(host,opts,api){
  const WG=-2.517,WL=2.123,STEPS=20;const st={w0:3.2,eta:0.05};let run=null,s=0,playing=false,dragging=false;
  const [A,B]=panels(host,[{W:640,H:380,sub:"(a) La curva de coste y tu descenso"},{W:380,H:380,sub:"(b) Coste en cada paso"}]);
  const pa=()=>new C.Plot(A.k,[56,20,620,320],{xr:[-4,4],yr:[-0.8,5.4]}),pb=()=>new C.Plot(B.k,[54,20,364,320],{xr:[0,STEPS],yr:[-0.8,5.4]});
  function drawA(){const k=A.k,c=k.c,P=api.pal();k.clear();const p=pa();p.axes({xt:[-4,-2,0,2,4],yt:[0,2,4],xl:"Peso w",yl:"Coste J(w)"});
    p.clip();p.fn(K.J1,{color:P.blue,w:3});
    [[WG,"mínimo global"],[WL,"mínimo local"]].forEach(([w,l])=>{p.vline(w,{color:P.lgray,dash:[3,4]});p.text(l,w,K.J1(w)-0.45,{align:"center",fs:12,color:P.muted})});
    let cw=st.w0;
    if(run){const ws=run.ws,i=Math.min(Math.floor(s),ws.length-1),f=s-i;
      for(let j=0;j<i&&j<ws.length-1;j++){c.strokeStyle=rgba(P.orange,.55);c.lineWidth=1.6;c.setLineDash([4,3]);c.beginPath();c.moveTo(p.X(ws[j]),p.Y(K.J1(ws[j])));
        const mx=(p.X(ws[j])+p.X(ws[j+1]))/2,my=Math.min(p.Y(K.J1(ws[j])),p.Y(K.J1(ws[j+1])))-24;c.quadraticCurveTo(mx,my,p.X(ws[j+1]),p.Y(K.J1(ws[j+1])));c.stroke();c.setLineDash([]);p.dot(ws[j],K.J1(ws[j]),{r:3.5,color:P.orange})}
      if(i<ws.length-1){const a=ws[i],b=ws[i+1],x=a+(b-a)*f,ya=p.Y(K.J1(a)),yb=p.Y(K.J1(b));const yy=ya+(yb-ya)*f-Math.sin(Math.PI*f)*Math.min(60,24+Math.abs(p.X(b)-p.X(a))*0.3);
        c.fillStyle=P.orange;c.beginPath();c.arc(p.X(x),yy,9,0,7);c.fill();cw=null}
      else cw=ws[ws.length-1]}
    if(cw!==null&&isFinite(cw)&&Math.abs(cw)<4.2){const y=K.J1(cw),d=K.dJ1(cw);c.strokeStyle=P.ink;c.lineWidth=1.4;c.setLineDash([5,4]);c.beginPath();c.moveTo(p.X(cw-0.7),p.Y(y-0.7*d));c.lineTo(p.X(cw+0.7),p.Y(y+0.7*d));c.stroke();c.setLineDash([]);
      p.dot(cw,y,{r:9,color:P.orange,stroke:P.bg,sw:2});p.text(`pendiente ${num(d,2)}`,cw,y+0.55,{align:"center",fs:12,color:P.text})}
    p.unclip();if(run&&run.out&&s>=run.ws.length-1)label(c,"La bola se ha salido de la gráfica",338,50,{w:700,fs:14,color:P.red});
    label(c,run?"":"Arrastra la bola para elegir el punto de partida",338,356,{fs:12,color:P.muted})}
  function drawB(){const k=B.k,c=k.c,P=api.pal();k.clear();const p=pb();p.axes({xt:[0,5,10,15,20],yt:[0,2,4],xl:"Paso",yl:"Coste"});
    p.hline(K.J1(WG),{color:P.green,dash:[5,4]});p.text("mínimo global",STEPS-0.3,K.J1(WG)+0.2,{align:"right",fs:11.5,color:P.green});p.hline(K.J1(WL),{color:P.gray,dash:[3,4]});p.text("mínimo local",STEPS-0.3,K.J1(WL)+0.2,{align:"right",fs:11.5,color:P.muted});
    if(run){const n=Math.min(Math.floor(s)+1,run.ws.length);const xs=[],ys=[];for(let i=0;i<n;i++){xs.push(i);ys.push(clamp(K.J1(run.ws[i]),-1,6))}p.clip();p.line(xs,ys,{color:P.orange,w:2.4});xs.forEach((x,i)=>p.dot(x,ys[i],{r:3.2,color:P.orange}));p.unclip()}}
  function draw(){drawA();drawB();if(run){const i=Math.min(Math.floor(s),run.ws.length-1),w=run.ws[i];rd.innerHTML=`Paso <b>${i}</b> de ${STEPS} · w = <b>${isFinite(w)?num(w,3):"∞"}</b> · coste ${isFinite(w)?num(K.J1(w),3):"∞"} · η = ${numT(run.eta,2)}`}else rd.innerHTML=`Punto de partida w₀ = <b>${num(st.w0,2)}</b> · η = <b>${numT(st.eta,2)}</b> · pulsa «Lanzar»`}
  function launch(){const ws=K.descend1(st.w0,st.eta,STEPS);const out=ws.some(w=>!isFinite(w)||Math.abs(w)>4.2);run={w0:st.w0,eta:st.eta,ws,out};s=0;playing=true;ex.touch();lp.start()}
  const lp=C.loop(api,dt=>{if(!playing)return false;s+=dt*3.2;if(s>=run.ws.length-1){s=run.ws.length-1;playing=false}draw();return playing});
  const mv=e=>{const q=A.k.ptr(e),p=pa();st.w0=clamp(Math.round(p.iX(q.x)*10)/10,-3.8,3.8);s0.set(st.w0);run=null;playing=false;ex.touch();draw()};
  A.k.cv.addEventListener("pointerdown",e=>{const q=A.k.ptr(e),p=pa();if(!p.inside(q))return;dragging=true;A.k.cv.setPointerCapture(e.pointerId);mv(e)});A.k.cv.addEventListener("pointermove",e=>{if(dragging)mv(e)});A.k.cv.addEventListener("pointerup",()=>dragging=false);
  const r1=C.ctlRow(host);const se=C.slider(r1,"Tasa de aprendizaje η",0.01,1,0.01,st.eta,v=>{st.eta=v;run=null;playing=false;ex.touch();draw()},v=>numT(v,2));
  const s0=C.slider(r1,"Partida w₀",-3.8,3.8,0.1,st.w0,v=>{st.w0=v;run=null;playing=false;ex.touch();draw()},v=>num(v,1));
  const g=C.group(r1);C.button(g,"▶ Lanzar",launch,{primary:true});C.button(g,"Reiniciar",()=>{run=null;playing=false;draw()});
  const rd=C.readout(host);
  const ex=reg("m8-2",host,{
    grade(){const items=[];if(!run)return{items:[it(0,10,"No has lanzado el descenso con tu configuración actual.")],sol:SOL};
      const ws=run.ws,end=ws[ws.length-1];const atG=isFinite(end)&&Math.abs(end-WG)<0.05,atL=isFinite(end)&&Math.abs(end-WL)<0.05;
      items.push(it(atG?5:(atL||(!run.out&&isFinite(end)))?1:0,5,atG?"La bola acaba en el <b>mínimo global</b>.":run.out?`Con η = ${numT(run.eta,2)} los pasos son tan grandes que la bola <b>se sale</b>: el descenso diverge.`:atL?"La bola se queda <b>atrapada en el mínimo local</b>: el gradiente solo ve la pendiente del punto en el que está. Prueba a salir desde el otro lado de la curva.":`En ${STEPS} pasos la bola no llega a ningún mínimo: η = ${numT(run.eta,2)} es demasiado pequeña.`));
      let reach=-1;for(let i=0;i<ws.length;i++){if(ws.slice(i).every(w=>Math.abs(w-WG)<0.05)){reach=i;break}}
      items.push(it(reach>=0&&reach<=12?3:reach>=0?1:0,3,reach>=0?`Llega al mínimo en <b>${reach} pasos</b>`+(reach<=12?".":" (objetivo: 12 o menos). Una η algo mayor avanza más deprisa."):"No llega al mínimo global, así que no cuenta la rapidez."));
      let flips=0,prev=0;for(let i=1;i<ws.length;i++){const d=ws[i]-ws[i-1];if(Math.abs(d)<1e-3||!isFinite(d))continue;if(prev&&Math.sign(d)!==Math.sign(prev))flips++;prev=d}
      items.push(it(!run.out&&flips<=1?2:0,2,run.out?"Sin control: la bola se escapa.":flips<=1?"Descenso <b>limpio</b>, sin rebotar de un lado al otro del valle.":`La bola <b>rebota</b> ${flips} veces de un lado al otro: η es demasiado grande para la curvatura del valle (Módulo 8, apartado 3.1).`));
      return{items,sol:SOL}},
    solve(){st.w0=-3.5;st.eta=0.25;se.set(0.25);s0.set(-3.5);launch()}});
  const SOL="salir desde la izquierda (por ejemplo w₀ = −3.5) con η ≈ 0.2–0.3: la bola baja directa al mínimo global en 3–5 pasos sin rebotar. Desde la derecha cae en el mínimo local; con η por encima de ~0.7 rebota o se escapa; con η muy pequeña no llega en 20 pasos.";
  draw();api.onTheme(draw);
});

// =====================================================================
// M8 · 3 · Carrera de optimizadores en un barranco
// =====================================================================
C.define("ej-m8-3",function(host,opts,api){
  const START=[-2.8,0.9],ETAS=[0.005,0.01,0.02,0.03,0.05,0.1,0.15,0.2,0.3,0.5],MAX=120,GOAL=0.02,LIM=40;
  const ON={sgd:"SGD",momentum:"Momentum",adam:"Adam"};const st={kind:"sgd",ei:3,cmp:false,q:null};let run=null,s=0,playing=false;const cache={};
  const [A,B]=panels(host,[{W:620,H:380,sub:"(a) El barranco visto desde arriba"},{W:400,H:380,sub:"(b) Coste en cada paso (escala logarítmica)"}]);
  const pa=()=>new C.Plot(A.k,[20,16,604,330],{xr:[-3.2,1.1],yr:[-1.3,1.3]}),pb=()=>new C.Plot(B.k,[58,20,384,320],{xr:[0,MAX],yr:[1e-3,200],ylog:true});
  const traj=(kind,eta)=>K.optimize(kind,eta,START,MAX);
  function path(c,p,P_,col,w,n){c.strokeStyle=col;c.lineWidth=w;c.lineJoin="round";c.beginPath();for(let i=0;i<n&&i<P_.length;i++){const [x,y]=P_[i];const X=p.X(clamp(x,-10,10)),Y=p.Y(clamp(y,-10,10));i?c.lineTo(X,Y):c.moveTo(X,Y)}c.stroke()}
  const COL=P=>({sgd:P.red,momentum:P.orange,adam:P.green});
  function drawA(){const k=A.k,c=k.c,P=api.pal();k.clear();const p=pa();heatCached(cache,"r",k,p,(x,y)=>Math.log(K.ravJ(x,y)+0.01),90,56);
    p.clip();if(st.cmp)Object.keys(ON).filter(o=>o!==st.kind).forEach(o=>path(c,p,traj(o,ETAS[st.ei]),rgba(COL(P)[o],.55),1.6,MAX+1));
    if(run){const n=Math.floor(s)+1;path(c,p,run.P,"#fff",4.5,n);path(c,p,run.P,COL(P)[run.kind],2.4,n);for(let i=0;i<n&&i<run.P.length;i+=1){const [x,y]=run.P[i];if(Math.abs(x)<5&&Math.abs(y)<5){c.fillStyle=COL(P)[run.kind];c.beginPath();c.arc(p.X(x),p.Y(y),2.2,0,7);c.fill()}}}
    p.unclip();c.fillStyle="#fff";c.beginPath();c.arc(p.X(START[0]),p.Y(START[1]),7,0,7);c.fill();c.strokeStyle=P.ink;c.lineWidth=2;c.stroke();
    c.fillStyle=P.ocre;c.font=`800 20px ${F.ui}`;c.textAlign="center";c.textBaseline="middle";c.fillText("★",p.X(0),p.Y(0));c.textBaseline="alphabetic";
    pill(c,"salida",p.X(START[0]),p.Y(START[1])-20,"rgba(0,0,0,.55)","#fff",{align:"center"});pill(c,"mínimo",p.X(0),p.Y(0)+26,"rgba(0,0,0,.55)","#fff",{align:"center"});
    if(st.cmp)C.legend(c,Object.keys(ON).map(o=>({color:COL(P)[o],label:ON[o]})),34,352,{row:true,fs:12});else label(c,"Activa «Comparar» para ver a los otros optimizadores con la misma η",312,356,{fs:12,color:P.muted})}
  function drawB(){const k=B.k,c=k.c,P=api.pal();k.clear();const p=pb();p.axes({xt:[0,20,40,60,80,100,120],yt:[1e-3,1e-2,1e-1,1,10,100],ylab:v=>C.sci(v,0),xl:"Paso",yl:"Coste",ylgap:48});
    p.hline(GOAL,{color:P.green,dash:[5,4]});p.text("meta",MAX-2,GOAL*1.6,{align:"right",fs:11.5,color:P.green});p.vline(LIM,{color:P.ink,dash:[3,4]});p.text("40 pasos",LIM+2,120,{fs:11.5,color:P.text});
    const curve=(P_,col,w,n)=>{const xs=[],ys=[];for(let i=0;i<n&&i<P_.length;i++){xs.push(i);ys.push(clamp(K.ravJ(...P_[i]),1e-3,1e6))}p.clip();p.line(xs,ys,{color:col,w});p.unclip()};
    if(st.cmp)Object.keys(ON).filter(o=>o!==st.kind).forEach(o=>curve(traj(o,ETAS[st.ei]),rgba(COL(P)[o],.5),1.4,MAX+1));
    if(run)curve(run.P,COL(P)[run.kind],2.6,Math.floor(s)+1)}
  function draw(){drawA();drawB();if(run){const i=Math.min(Math.floor(s),run.P.length-1),j=K.ravJ(...run.P[i]);const hit=K.reached(run.P,GOAL);
      rd.innerHTML=`${ON[run.kind]} · η = ${numT(run.eta,3)} · paso <b>${i}</b> · coste <b>${isFinite(j)&&j<1e6?C.sci(j,2):"∞"}</b>`+(hit>=0&&i>=hit?` · meta alcanzada en el paso <b>${hit}</b>`:"")}
    else rd.innerHTML=`${ON[st.kind]} · η = <b>${numT(ETAS[st.ei],3)}</b> · objetivo: coste &lt; ${GOAL} en ${LIM} pasos o menos`}
  function launch(){run={kind:st.kind,eta:ETAS[st.ei],P:traj(st.kind,ETAS[st.ei])};s=0;playing=true;ex.touch();lp.start()}
  const lp=C.loop(api,dt=>{if(!playing)return false;s+=dt*32;if(s>=run.P.length-1){s=run.P.length-1;playing=false}draw();return playing});
  const r1=C.ctlRow(host);const setK=C.seg(C.group(r1,"Optimizador"),Object.entries(ON),v=>{st.kind=v;setK(v);run=null;ex.touch();draw()});
  const sEi=C.slider(r1,"Tasa de aprendizaje η",0,ETAS.length-1,1,st.ei,v=>{st.ei=v;run=null;ex.touch();draw()},v=>numT(ETAS[v],3));
  const g=C.group(r1);C.button(g,"▶ Lanzar",launch,{primary:true});C.toggle(g,"Comparar",false,v=>{st.cmp=v;draw()});
  const rd=C.readout(host);
  const r2=C.ctlRow(host);r2.classList.add("ej-q");r2.appendChild(C.el("span",{class:"q"},"Pregunta: ¿por qué el descenso simple (SGD) zigzaguea en este barranco?"));
  const QO=[["pend","La pendiente es mucho mayor entre las paredes que a lo largo del fondo"],["azar","La tasa de aprendizaje cambia al azar en cada paso"],["meseta","El mínimo está en una zona plana"]];const setQ=C.seg(C.group(r2),QO,v=>{st.q=v;setQ(v);ex.touch()});
  const ex=reg("m8-3",host,{
    grade(){const items=[];if(!run)items.push(it(0,6,"No has lanzado ninguna carrera con tu configuración actual."));
      else{const h=K.reached(run.P,GOAL),div=!run.P.every(([x,y])=>isFinite(x)&&Math.abs(x)+Math.abs(y)<50);
        items.push(it(div?0:h>=0&&h<=LIM?6:h>=0&&h<=80?3:h>=0?1:0,6,div?`Con η = ${numT(run.eta,3)}, ${ON[run.kind]} <b>diverge</b>: cada paso entre las paredes es mayor que el anterior y se sale del barranco.`:h<0?`${ON[run.kind]} con η = ${numT(run.eta,3)} no llega a la meta en ${MAX} pasos.`:`${ON[run.kind]} llega a la meta en <b>${h} pasos</b>`+(h<=LIM?".":` (objetivo: ${LIM}).`)));
        items.push(it(run.kind==="sgd"?0:2,2,run.kind==="sgd"?"<b>SGD</b> no puede ganar aquí: si η es grande diverge entre las paredes y si es pequeña avanza muy despacio por el fondo. <b>Momentum</b> acumula velocidad en la dirección que se repite y <b>Adam</b> adapta el paso de cada peso (Módulo 8, apartado 3).":`<b>${ON[run.kind]}</b> ${run.kind==="adam"?"adapta el tamaño del paso de cada peso: avanza a lo largo del fondo aunque la pendiente sea pequeña":"acumula velocidad en la dirección que se repite y amortigua el zigzag"}.`))}
      items.push(it(st.q==="pend"?2:0,2,st.q==="pend"?"Exacto: el gradiente apunta casi hacia la pared, no hacia el mínimo, y SGD rebota de una pared a otra.":"La respuesta es que <b>la pendiente es mucho mayor entre las paredes que a lo largo del fondo</b>: el gradiente apunta casi hacia la pared y SGD rebota."));
      return{items,sol:"Momentum con η = 0.02 (unos 14 pasos) o Adam con η = 0.3 (unos 36). SGD nunca baja de 80 pasos: con η ≥ 0.05 diverge y con η menor avanza muy despacio por el fondo del barranco."}},
    solve(){st.kind="momentum";st.ei=2;st.q="pend";setK("momentum");setQ("pend");sEi.set(2);launch()}});
  setK(st.kind);draw();api.onTheme(()=>{draw()});
});

// =====================================================================
// M8 · 4 · Rescata la red profunda
// =====================================================================
C.define("ej-m8-4",function(host,opts,api){
  const NL=10;const st={act:"sigmoide",init:"glorot",res:false,q:null};let t=0,prof=null;const memo={};
  const AN={sigmoide:"Sigmoide",tanh:"Tanh",relu:"ReLU"},IN={pequena:"Pequeños",glorot:"Glorot",he:"He",grande:"Grandes"};
  const [A]=C.panels(host,[{W:1040,H:400,aria:"Red de 10 capas: el error viaja de la salida a la entrada y su tamaño en cada capa se muestra con el pulso y con barras."}]);const k=A.k,c=k.c;
  function compute(){const key=st.act+st.init+st.res;if(!memo[key])memo[key]=K.gradProfile(st.act,st.init,st.res);const p=memo[key];prof=p.map(v=>v/p[NL-1])}
  const LX=i=>110+i*84,NY=[80,125,170];
  function draw(){const P=api.pal();k.clear();
    if(st.res)for(let l=1;l<NL;l+=2){const x0=LX(l-1)-42,x1=LX(l)+20;c.strokeStyle=rgba(P.green,.8);c.lineWidth=2.2;c.beginPath();c.moveTo(x0,NY[0]-18);c.bezierCurveTo(x0,30,x1,30,x1,NY[0]-18);c.stroke();arrow(c,x1-1,NY[0]-24,x1,NY[0]-16,P.green,2,8)}
    for(let l=0;l<NL-1;l++)NY.forEach(a=>NY.forEach(b=>{c.strokeStyle=P.lgray;c.lineWidth=0.8;c.beginPath();c.moveTo(LX(l),a);c.lineTo(LX(l+1),b);c.stroke()}));
    NY.forEach(y=>{c.strokeStyle=P.lgray;c.beginPath();c.moveTo(40,125);c.lineTo(LX(0),y);c.moveTo(LX(NL-1),y);c.lineTo(990,125);c.stroke()});
    node(c,40,125,16,P.node,P.blue,"x",{tc:P.text,italic:true,serif:true});node(c,990,125,18,P.red,P.red,"E",{fs:14});label(c,"error",990,160,{fs:12,color:P.red});
    // pulso: viaja de la salida a la entrada
    const ph=(t/3.2)%1,px=990-(990-40)*ph;const li=clamp((px-110)/84,0,NL-1);const i0=Math.floor(li),f=li-i0,lg=v=>Math.log10(Math.max(v,1e-12));
    const gv=Math.pow(10,lg(prof[i0])*(1-f)+lg(prof[Math.min(NL-1,i0+1)])*f);const rad=clamp(5+3.2*(lg(gv)+6),1.5,30);
    for(let l=0;l<NL;l++)NY.forEach(y=>{const v=prof[l],on=Math.abs(px-LX(l))<30;node(c,LX(l),y,12,on?mix(P.node,P.red,clamp(0.3+0.12*(lg(v)+5),0.05,1)):P.node,P.blue,"")});
    if(px>30){c.save();c.fillStyle=rgba(P.red,.35);c.shadowColor=P.red;c.shadowBlur=18;c.beginPath();c.arc(px,125,rad,0,7);c.fill();c.restore();c.fillStyle=P.red;c.beginPath();c.arc(px,125,Math.max(1.2,rad*0.45),0,7);c.fill()}
    // barras en escala logarítmica
    const by=345,bh=130,yv=v=>by-bh*clamp((lg(v)+7)/9,0,1);c.fillStyle=rgba(P.green,.13);c.fillRect(70,yv(5),900,yv(0.2)-yv(5));label(c,"zona sana",968,yv(5)-4,{align:"right",fs:11,color:P.green});
    [1e-6,1e-4,1e-2,1,100].forEach(v=>{c.strokeStyle=P.grid;c.lineWidth=1;c.beginPath();c.moveTo(70,yv(v));c.lineTo(970,yv(v));c.stroke();label(c,C.sci(v,0),64,yv(v)+4,{align:"right",fs:10.5,color:P.muted})});
    for(let l=0;l<NL;l++){const v=prof[l],x=LX(l),y=yv(v),bad=v<0.2||v>5;c.fillStyle=bad?(v>5?P.ocre:P.red):P.green;rrect(c,x-15,y,30,Math.max(2,by-y),4);c.fill();
      label(c,C.sci(v,1),x,y-6,{fs:10.5,w:700,color:P.text});label(c,`capa ${l+1}`,x,by+16,{fs:11,color:P.muted})}
    label(c,"Tamaño del error que llega a cada capa, relativo a la capa 10",520,395,{fs:12,color:P.muted})}
  const lp=C.loop(api,dt=>{t+=dt;draw();return true});
  const r1=C.ctlRow(host);const setA=C.seg(C.group(r1,"Activación"),Object.entries(AN),v=>{st.act=v;setA(v);ex.touch();compute();upd()});
  const setI=C.seg(C.group(r1,"Pesos iniciales"),Object.entries(IN),v=>{st.init=v;setI(v);ex.touch();compute();upd()});
  C.toggle(C.group(r1,"Atajos residuales"),"Activados",false,v=>{st.res=v;ex.touch();compute();upd()});
  const rd=C.readout(host);
  const r2=C.ctlRow(host);r2.classList.add("ej-q");r2.appendChild(C.el("span",{class:"q"},"Pregunta: ¿qué problema tenía la red tal como empezaba (sigmoide, Glorot, sin atajos)?"));
  const QO=[["van","El gradiente se desvanece"],["exp","El gradiente explota"],["sob","Sobreajuste"]];const setQ=C.seg(C.group(r2),QO,v=>{st.q=v;setQ(v);ex.touch()});
  function upd(){rd.innerHTML=`${AN[st.act]} · pesos ${IN[st.init].toLowerCase()} · ${st.res?"con":"sin"} atajos → a la capa 1 le llega <b>${C.sci(prof[0],1)}</b> veces el error de la capa 10`;draw()}
  const ex=reg("m8-4",host,{
    grade(){const r=prof[0],items=[];const ok=r>=0.2&&r<=5,near=r>=0.02&&r<=50;
      items.push(it(ok?7:near?3:0,7,`A la primera capa le llega <b>${C.sci(r,1)}</b> veces el error de la última`+(ok?": el error atraviesa la red sin apagarse ni crecer, así que todas las capas aprenden.":r<0.2?". Sigue <b>desvaneciéndose</b>: "+(st.act==="sigmoide"&&!st.res?"la pendiente de la sigmoide vale como mucho 0.25 y se multiplica en cada capa.":"cambia la activación o la escala de los pesos, o añade atajos residuales."):". Ahora <b>explota</b>: los pesos son demasiado grandes y el error se multiplica en cada capa.")+" (Módulo 8, apartado 4.1)"));
      items.push(it(st.q==="van"?3:0,3,st.q==="van"?"Correcto: era un caso de <b>gradiente que se desvanece</b> (2 × 10⁻⁶).":"La red de partida sufría <b>gradiente que se desvanece</b>: a la capa 1 le llegaba unas 2 millonésimas del error."));
      return{items,sol:"ReLU con inicialización de He (≈ 0.87): la pendiente de ReLU es 1 en la zona activa y He fija la escala de los pesos para que la señal se mantenga. También funcionan tanh con Glorot o He, o añadir atajos residuales, que dan al error un camino que no se multiplica."}},
    solve(){st.act="relu";st.init="he";st.q="van";setA("relu");setI("he");setQ("van");compute();upd()}});
  setA(st.act);setI(st.init);compute();upd();api.onTheme(draw);lp.start();
});

// =====================================================================
// M8 · 5 · Frena el sobreajuste
// =====================================================================
C.define("ej-m8-5",function(host,opts,api){
  const Tr=K.moons(50,0.22,0.08,5),Va=K.moons(300,0.22,0.08,99);const DR=[0,0.2,0.5],LS=[0,0.001,0.003,0.01,0.03];
  const st={d:0,l:0,E:400};let net,ep=0,run=false,hist=[],evT={acc:0,loss:0},evV={acc:0,loss:0};
  const [A,B]=panels(host,[{W:470,H:370,sub:"(a) Frontera aprendida"},{W:540,H:370,sub:"(b) Coste de entrenamiento y de validación"}]);
  const pa=()=>new C.Plot(A.k,[16,12,454,330],{xr:[-1.45,1.45],yr:[-1.35,1.35]});
  function build(){net=K.MLP([2,32,32,1],"relu",4);ep=0;hist=[];run=false;evT=net.evalSet(Tr.X,Tr.Y);evV=net.evalSet(Va.X,Va.Y);btn.textContent="▶ Entrenar"}
  function drawA(){const k=A.k,c=k.c,P=api.pal();k.clear();const p=pa();probMap(p,(x,y)=>net.prob([x,y]),44,44,P);
    p.clip();for(let i=0;i<Va.n;i++)p.dot(Va.X[2*i],Va.X[2*i+1],{r:2.2,color:rgba(Va.Y[i]?P.red:P.blue,.55)});
    for(let i=0;i<Tr.n;i++)p.dot(Tr.X[2*i],Tr.X[2*i+1],{r:5.5,color:Tr.Y[i]?P.red:P.blue,stroke:P.bg,sw:1.6});p.unclip();
    c.strokeStyle=P.lgray;c.lineWidth=1;c.strokeRect(p.x0,p.y0,p.x1-p.x0,p.y1-p.y0);
    label(c,"● entrenamiento (50)   · validación (300)",235,356,{fs:12,color:P.muted})}
  function drawB(){const k=B.k,c=k.c,P=api.pal();k.clear();const p=new C.Plot(k,[56,16,520,316],{xr:[0,st.E],yr:[0,2]});
    p.axes({xt:C.niceTicks(0,st.E,5),yt:[0,0.5,1,1.5,2],xl:"Época",yl:"Coste"});
    if(hist.length){p.clip();p.line(hist.map(h=>h[0]),hist.map(h=>h[1]),{color:P.blue,w:2.4});p.line(hist.map(h=>h[0]),hist.map(h=>Math.min(h[2],2.2)),{color:P.red,w:2.4});
      let bi=0;hist.forEach((h,i)=>{if(h[2]<hist[bi][2])bi=i});p.vline(hist[bi][0],{color:P.green,dash:[4,4]});p.text("menor coste de validación",hist[bi][0]+4,1.9,{fs:11.5,color:P.green});p.unclip()}
    else label(c,"Pulsa «Entrenar»",288,170,{fs:14,color:P.muted});
    C.legend(c,[{color:P.blue,label:"Entrenamiento"},{color:P.red,label:"Validación"}],300,52,{row:true,fs:12.5})}
  function draw(){drawA();drawB();rd.innerHTML=`Época <b>${ep}</b> de ${st.E} · precisión en entrenamiento <b>${pct(evT.acc)}</b> · en validación <b>${pct(evV.acc)}</b>`}
  let fr=0;const lp=C.loop(api,()=>{if(!run)return false;for(let i=0;i<5&&ep<st.E;i++){net.epoch(Tr.X,Tr.Y,0.02,LS[st.l],DR[st.d]);ep++}evT=net.evalSet(Tr.X,Tr.Y);evV=net.evalSet(Va.X,Va.Y);hist.push([ep,evT.loss,evV.loss]);
    if(ep>=st.E){run=false;btn.textContent="▶ Entrenar"}if(++fr%2===0||!run)drawA();drawB();rd.innerHTML=`Época <b>${ep}</b> de ${st.E} · precisión en entrenamiento <b>${pct(evT.acc)}</b> · en validación <b>${pct(evV.acc)}</b>`;return run});
  const reset=()=>{ex.touch();build();draw()};
  const r1=C.ctlRow(host);const setD=C.seg(C.group(r1,"Dropout"),DR.map((v,i)=>[i,v?pct(v):"No"]),v=>{st.d=+v;setD(v);reset()});
  const setL=C.seg(C.group(r1,"L2 (λ)"),LS.map((v,i)=>[i,v?String(v):"No"]),v=>{st.l=+v;setL(v);reset()});
  const r2=C.ctlRow(host);const sE=C.slider(r2,"Épocas",50,500,50,st.E,v=>{st.E=v;reset()});
  const g=C.group(r2);const btn=C.button(g,"▶ Entrenar",()=>{ex.touch();if(run){run=false;btn.textContent="▶ Entrenar";return}if(ep>=st.E)build();run=true;btn.textContent="❚❚ Pausa";lp.start()},{primary:true});
  const rd=C.readout(host);C.hint(host,"Cualquier cambio reinicia la red: vuelve a pulsar «Entrenar». Se corrige la red tal como quede al final.");
  const ex=reg("m8-5",host,{
    grade(){if(ep===0)return{items:[it(0,10,"No has entrenado la red con la configuración actual.")],sol:SOL};
      const tr=evT.acc,va=evV.acc,gap=tr-va,items=[];
      items.push(it(va>=0.84?6:va>=0.8?3:0,6,`En validación aciertas el <b>${pct(va)}</b>`+(va>=0.84?": la red generaliza a datos que no ha visto.":" (objetivo: 84 %). La red memoriza el ruido de los 50 puntos de entrenamiento.")));
      items.push(it(gap<=0.08?2:0,2,gap<=0.08?`La diferencia entre entrenamiento (${pct(tr)}) y validación (${pct(va)}) es pequeña: no hay sobreajuste.`:`Entrenamiento ${pct(tr)} frente a validación ${pct(va)}: una diferencia de ${Math.round(gap*100)} puntos es la firma del <b>sobreajuste</b>. Dropout, L2 o menos épocas la reducen (Módulo 8, apartado 4.2).`));
      items.push(it(tr>=0.8?2:0,2,tr>=0.8?"Sin pasarte de regularización: la red sigue aprendiendo bien el patrón.":`En entrenamiento solo aciertas el ${pct(tr)}: con tanta regularización la red se queda corta (<b>subajuste</b>).`));
      return{items,sol:SOL}},
    solve(){st.d=1;st.l=2;st.E=300;setD(1);setL(2);sE.set(300);build();run=true;btn.textContent="❚❚ Pausa";lp.start()}});
  const SOL="dropout del 20 % con L2 λ = 0.003 durante 300 épocas (≈ 88 % tanto en entrenamiento como en validación). También valen dropout del 50 % con unas 150–250 épocas, o L2 λ = 0.01. Sin regularización la red llega al 100 % en entrenamiento y baja al 74 % en validación.";
  setD(0);setL(0);build();draw();api.onTheme(draw);
});
})();
