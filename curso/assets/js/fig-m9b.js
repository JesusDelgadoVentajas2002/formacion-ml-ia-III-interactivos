/* Figuras interactivas del Módulo 9 (2) — frameworks: capas de software, historia, grafos frente a ejecución inmediata, bucle de PyTorch, Keras frente a PyTorch y ecosistemas */
(function(){"use strict";
const C=Curso,{num,numT,F,rgba,arrow,rrect,ease}=C;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const panels=(h,specs)=>C.panels(h,specs.map(s=>Object.assign({flex:`${s.W} 1 ${Math.round(s.W*0.55)}px`},s)));
function txt(c,t,x,y,o={}){c.font=o.font||`${o.w||400} ${o.fs||13}px ${o.mono?F.mono:F.ui}`;c.fillStyle=o.color;c.textAlign=o.align||"center";c.textBaseline=o.base||"middle";
  const ls=String(t).split("\n"),lh=o.lh||(o.fs||13)*1.3;ls.forEach((l,i)=>c.fillText(l,x,y+(i-(ls.length-1)/2)*lh));c.textBaseline="alphabetic"}
function box(c,x,y,w,h,fill,stroke,o={}){rrect(c,x,y,w,h,o.r||6);c.fillStyle=fill;c.fill();c.lineWidth=o.lw||2;c.strokeStyle=stroke;if(o.dash)c.setLineDash(o.dash);c.stroke();c.setLineDash([])}

// =====================================================================
// Figura 50 · qué hay debajo de un framework e hitos de su historia
// =====================================================================
C.define("framework-pila",function(host,opts,api){
  const [A,B]=panels(host,[{W:450,H:470,sub:"(a) Qué hay debajo de un framework"},{W:590,H:470,sub:"(b) Hitos de los frameworks de deep learning"}]);
  const L=[{t:"Tu código",s:"modelo, datos, bucle de entrenamiento",c:"gray",f:"shade",call:"Escribes <code>salida = modelo(xb)</code>: una línea que no dice nada de cómo se multiplica."},
    {t:"API de alto nivel",s:"Keras · PyTorch Lightning · Hugging Face",c:"green",f:"fillg",call:"Cada capa <code>Dense</code> o <code>Linear</code> se traduce en una multiplicación de matrices, una suma y una activación."},
    {t:"Núcleo del framework",s:"tensores · gradientes automáticos · capas · optimizadores\nTensorFlow · PyTorch · JAX",c:"red",f:"fillr",call:"El núcleo opera con tensores y anota cada operación para poder calcular después los gradientes."},
    {t:"Compilador",s:"XLA · TorchInductor (torch.compile)",c:"blue",f:"fillb",call:"Si se ha pedido, el compilador funde varias operaciones en un solo cálculo para la GPU."},
    {t:"Librerías del fabricante",s:"CUDA, cuDNN (NVIDIA) · ROCm (AMD)",c:"blue",f:"fillb",call:"La librería del fabricante ejecuta la multiplicación con rutinas ajustadas a cada modelo de GPU."},
    {t:"Hardware",s:"CPU · GPU · TPU · NPU",c:"gray",f:"shade",call:"Miles de núcleos de la GPU hacen a la vez las multiplicaciones del lote."}];
  const E=[{y:2007.0,t:"Theano\n(Montreal)",k:"o",lv:1,d:"Una de las primeras librerías con gradientes automáticos, de la Universidad de Montreal."},
    {y:2013.0,t:"Caffe\n(Berkeley)",k:"o",lv:-1,d:"Framework de visión de la Universidad de Berkeley."},
    {y:2015.2,t:"Keras\n(marzo)",k:"k",lv:-1,d:"François Chollet publica Keras, que después se integrará en TensorFlow."},
    {y:2015.85,t:"TensorFlow\n(Google, nov.)",k:"tf",lv:1,d:"Google publica TensorFlow como código abierto, sucesor de su sistema interno DistBelief."},
    {y:2017.05,t:"PyTorch\n(Meta, enero)",k:"pt",lv:-2,d:"Meta (entonces Facebook) publica PyTorch, pensado para investigar con ejecución inmediata."},
    {y:2018.9,t:"JAX\n(Google)",k:"o",lv:-1,d:"Google publica JAX, muy usado en investigación a gran escala."},
    {y:2019.75,t:"TensorFlow 2.0:\nKeras y ejecución\ninmediata",k:"tf",lv:2,d:"TensorFlow adopta la ejecución inmediata y hace de Keras su forma oficial de construir modelos."},
    {y:2022.7,t:"PyTorch\nFoundation",k:"pt",lv:-1,d:"El gobierno de PyTorch pasa a una fundación independiente dentro de la Linux Foundation."},
    {y:2023.2,t:"PyTorch 2.0\n(torch.compile)",k:"pt",lv:1,d:"torch.compile captura el grafo y lo optimiza sin cambiar el código."},
    {y:2023.9,t:"Keras 3:\nmultibackend",k:"k",lv:-3,d:"El mismo código de Keras funciona sobre TensorFlow, JAX o PyTorch."},
    {y:2025.9,t:"Transformers v5:\nsolo PyTorch",k:"pt",lv:-2,d:"Hugging Face Transformers pasa a centrarse solo en PyTorch."},
    {y:2026.2,t:"TensorFlow 2.21:\nmodo\nmantenimiento",k:"tf",lv:3,d:"El núcleo de TensorFlow se centra en corregir errores y fallos de seguridad y en actualizar dependencias."}];
  const KC={o:"gray",tf:"blue",pt:"red",k:"green"},KN={o:"Otros",tf:"TensorFlow",pt:"PyTorch",k:"Keras"};
  let sel=0,step=-1,hovE=null,flt="all",t=0,intro=0;
  const LY=i=>22+i*72,LH=62;
  function drawA(){const k=A.k,c=k.c,P=api.pal();k.clear();
    L.forEach((l,i)=>{const on=i===sel||i===step;const y=LY(i);box(c,14,y,360,LH,P[l.f],P[l.c],{lw:on?3.4:2,r:8});
      txt(c,l.t,194,y+18,{w:700,fs:15,color:l.c==="gray"?P.text:P[l.c]});txt(c,l.s,194,y+(l.s.includes("\n")?44:42),{fs:12,color:P.text,lh:15})});
    arrow(c,404,LY(0)+8,404,LY(5)+LH,P.ink,1.8,9);c.save();c.translate(424,(LY(0)+LY(5)+LH)/2);c.rotate(Math.PI/2);txt(c,"cada capa oculta la complejidad de la de abajo",0,0,{fs:12.5,color:P.text});c.restore();
    if(step>=0){const y=LY(step)+LH/2,ph=(t*2)%1;c.fillStyle=P.orange;c.beginPath();c.arc(30,y,6+2*Math.sin(t*6),0,7);c.fill();
      if(step<5){c.strokeStyle=P.orange;c.lineWidth=2;c.setLineDash([4,3]);c.beginPath();c.moveTo(30,y);c.lineTo(30,y+72*ph);c.stroke();c.setLineDash([])}}}
  const X=y=>34+(y-2006)/(2027-2006)*520,YL=226,LV=v=>v>0?YL-40-(v-1)*58:YL+40+(-v-1)*68;
  function drawB(){const k=B.k,c=k.c,P=api.pal();k.clear();const prog=ease(Math.min(1,intro));
    c.strokeStyle=P.ink;c.lineWidth=2;c.beginPath();c.moveTo(X(2006),YL);c.lineTo(X(2006)+(X(2027)-X(2006))*prog,YL);c.stroke();
    for(let y=2006;y<=2026;y+=2){const x=X(y);if(x>X(2006)+(X(2027)-X(2006))*prog)break;c.strokeStyle=P.ink;c.lineWidth=1.2;c.beginPath();c.moveTo(x,YL-6);c.lineTo(x,YL+6);c.stroke();txt(c,String(y),x,YL+18,{fs:11.5,color:P.text})}
    E.forEach((e,i)=>{const x=X(e.y);if(x>X(2006)+(X(2027)-X(2006))*prog)return;const vis=flt==="all"||flt===e.k;const on=hovE===i;const col=P[KC[e.k]];c.globalAlpha=vis?1:0.18;
      const ly=LV(e.lv);c.strokeStyle=col;c.setLineDash([2,3]);c.lineWidth=1.3;c.beginPath();c.moveTo(x,YL);c.lineTo(x,e.lv>0?ly+(e.t.split("\n").length*7.5)+4:ly-(e.t.split("\n").length*7.5)-4);c.stroke();c.setLineDash([]);
      c.save();if(on){c.shadowColor=col;c.shadowBlur=14}c.fillStyle=col;c.beginPath();c.arc(x,YL,on?9:6.5,0,7);c.fill();c.restore();
      const xx=clamp(x,52,532);txt(c,e.t,xx,ly,{fs:12,w:e.k==="o"?400:700,color:e.k==="o"?P.text:col,lh:15});c.globalAlpha=1})}
  function draw(){drawA();drawB()}
  const lp=C.loop(api,dt=>{t+=dt;if(intro<1)intro+=dt*0.6;draw();return intro<1||step>=0});
  A.k.cv.addEventListener("pointermove",e=>{const p=A.k.ptr(e);A.k.cv.style.cursor=L.some((_,i)=>p.y>=LY(i)&&p.y<=LY(i)+LH&&p.x<380)?"pointer":"default"});
  A.k.cv.addEventListener("click",e=>{const p=A.k.ptr(e);L.forEach((_,i)=>{if(p.y>=LY(i)&&p.y<=LY(i)+LH&&p.x<380){sel=i;step=-1}});upd();draw()});
  function hitE(p){let b=null,bd=26;E.forEach((e,i)=>{if(!(flt==="all"||flt===e.k))return;const d=Math.abs(p.x-X(e.y));if(d<bd){bd=d;b=i}});return b}
  B.k.cv.addEventListener("pointermove",e=>{const h=hitE(B.k.ptr(e));if(h!==hovE){hovE=h;B.k.cv.style.cursor=h!==null?"pointer":"default";upd();draw()}});
  B.k.cv.addEventListener("pointerleave",()=>{hovE=null;upd();draw()});
  const row=C.ctlRow(host);const g=C.group(row,"(a)");const bStep=C.button(g,"▶ Seguir una llamada hacia abajo",()=>{step=step>=5?0:step+1;sel=step;bStep.textContent=step>=5?"↺ Empezar de nuevo":"▶ Bajar una capa";upd();lp.start()},{primary:true});
  const setF=C.seg(C.group(row,"(b) Mostrar"),[["all","Todos"],["tf","TensorFlow"],["pt","PyTorch"],["k","Keras"]],v=>{flt=v;setF(v);upd();draw()});
  const rd=C.readout(host);
  function upd(){if(hovE!==null){const e=E[hovE];rd.innerHTML=`<b>${Math.floor(e.y)} · ${e.t.replace(/\n/g," ")}</b> (${KN[e.k]}). ${e.d}`;return}
    if(step>=0){rd.innerHTML=`<b>${L[step].t}.</b> ${L[step].call}`;return}
    rd.innerHTML=`<b>${L[sel].t}</b> (${L[sel].s.replace("\n"," · ")}). Pulsa «Seguir una llamada» para bajar capa a capa con una línea de código, o pasa el ratón por los hitos de (b).`}
  setF("all");upd();api.onTheme(draw);lp.start();
});

// =====================================================================
// Figura 51 · definir y después ejecutar frente a ejecución inmediata
// =====================================================================
C.define("grafo-inmediata",function(host,opts,api){
  const [A,B]=panels(host,[{W:520,H:400,sub:"(a) Definir y después ejecutar (TensorFlow 1.x)"},{W:520,H:400,sub:"(b) Ejecución inmediata (PyTorch y TensorFlow 2)"}]);
  let sa=0,sb=0,bug=false,t=0;// sa: 0 grafo vacío, 1 grafo dibujado, 2 ejecutado · sb: líneas ejecutadas
  const LINES=[["h = x @ W","[0.8, −1.2, 2.1, …]"],["h = h + b","[0.9, −1.0, 2.3, …]"],["h = relu(h)","[0.9,  0.0, 2.3, …]"],["print(h.shape)","(32, 32)"]];
  const G=[{id:"x",t:"x\n(vacío)",x:20,y:56,w:68,h:46,k:"in"},{id:"W",t:"W",x:112,y:56,w:68,h:46,k:"p"},{id:"b",t:"b",x:204,y:56,w:68,h:46,k:"p"},
    {id:"mul",t:"×",x:66,y:146,w:68,h:46,k:"op",v:"[0.8, −1.2, …]"},{id:"add",t:"+",x:134,y:228,w:68,h:46,k:"op",v:"[0.9, −1.0, …]"},{id:"relu",t:"ReLU",x:126,y:310,w:84,h:46,k:"op",v:"[0.9, 0.0, …]"}];
  const EDG=[["x","mul"],["W","mul"],["mul","add"],["b","add"],["add","relu"]];const gi=id=>G.find(g=>g.id===id);
  function drawA(){const k=A.k,c=k.c,P=api.pal();k.clear();
    txt(c,"Paso 1: se dibuja el grafo",150,22,{w:700,fs:14,color:P.blue});txt(c,"Paso 2: se ejecuta con datos",410,22,{w:700,fs:14,color:P.blue});
    c.strokeStyle=P.lgray;c.setLineDash([5,4]);c.lineWidth=1.4;c.beginPath();c.moveTo(300,36);c.lineTo(300,392);c.stroke();c.setLineDash([]);
    const shown=sa>=1?G.length:0;EDG.forEach(([a,b])=>{if(!shown)return;const A1=gi(a),B1=gi(b);arrow(c,A1.x+A1.w/2,A1.y+A1.h,B1.x+B1.w/2,B1.y,P.ink,1.8,9)});
    G.slice(0,shown).forEach(g=>{const st=g.k==="in"?[P.shade,P.gray]:g.k==="p"?[P.fillb,P.blue2]:[P.fillr,P.red];const err=bug&&sa===2&&g.id==="mul";
      box(c,g.x,g.y,g.w,g.h,err?P.fillr:st[0],err?P.red:st[1],{lw:err?3.4:2,r:3});txt(c,sa===2&&g.id==="x"?"x\n(lote)":g.t,g.x+g.w/2,g.y+g.h/2,{fs:13,color:P.text,lh:16});
      if(sa===2&&g.v&&!bug)txt(c,g.v,g.x+g.w+8,g.y+g.h/2,{align:"left",fs:11.5,mono:true,color:P.green})});
    if(sa===0)txt(c,"Pulsa «Dibujar el grafo»",150,200,{fs:13,color:P.muted});
    if(sa===1)txt(c,"Todavía no se ha calculado nada",150,382,{font:`italic 13px ${F.ui}`,color:P.text});
    box(c,318,62,190,46,P.shade,P.gray,{r:3});txt(c,"sesion.run(grafo,\n{x: lote})",413,85,{fs:12,mono:true,color:P.text,lh:16});
    arrow(c,413,110,413,156,P.ink,1.8,9);const run=sa===2;box(c,330,160,166,58,run?(bug?P.fillr:P.fillb):P.bg,bug&&run?P.red:P.blue,{r:3,lw:run?2.6:1.6});
    txt(c,run?(bug?"Error al ejecutar:\nformas incompatibles":"El grafo completo se\ncalcula de una vez"):"(esperando datos)",413,189,{fs:12.5,color:bug&&run?P.red:P.text,lh:16,w:run?600:400});
    txt(c,"+ rápido y fácil de exportar\n− difícil de depurar: los errores\n   aparecen lejos del código",413,282,{fs:12.5,color:P.text,lh:18});
    if(bug&&run)txt(c,"¿En qué línea estaba el fallo?\nEl mensaje señala el nodo ×,\nno la línea que definió W",413,350,{fs:12,color:P.red,lh:16,font:`italic 12px ${F.ui}`})}
  function drawB(){const k=B.k,c=k.c,P=api.pal();k.clear();txt(c,"Cada línea se ejecuta al momento y devuelve números",260,22,{w:700,fs:14,color:P.blue});
    const stopAt=bug?1:LINES.length;
    LINES.forEach((l,i)=>{const y=52+i*62,on=i<sb,cur=i===sb-1;const err=bug&&i===0&&sb>=1;box(c,16,y,236,44,err?P.fillr:cur?P.fillb:P.bg2,err?P.red:cur?P.blue:P.gray,{r:3,lw:cur||err?2.6:1.6});
      txt(c,l[0],134,y+22,{fs:13.5,mono:true,color:i>=stopAt&&sb>stopAt-1&&bug?P.muted:P.text});
      if(on){arrow(c,258,y+22,300,y+22,P.ink,1.8,8);txt(c,err?"Error: formas (32, 64) y (32, 32)":l[1],308,y+22,{align:"left",fs:12.5,mono:true,color:err?P.red:i===3?P.red:P.green});
        if(i===3&&!err)txt(c,"← se puede inspeccionar",398,y+22,{align:"left",fs:12,mono:true,color:P.red})}});
    if(bug&&sb>=1)txt(c,"El error salta en la misma línea que lo provoca",260,300,{fs:12.5,w:600,color:P.red});
    // cinta en la que el framework anota cada operación
    const ops=["@","+","relu"].slice(0,Math.min(sb,bug?0:3));box(c,16,326,488,62,P.fillr,P.red,{r:8});
    txt(c,"Mientras tanto, el framework anota cada operación\npara poder recorrerla hacia atrás (perdida.backward(), Módulo 8)",260,344,{fs:12,color:P.red,lh:15});
    ops.forEach((o,i)=>{const x=200+i*44;c.fillStyle=P.red;rrect(c,x,366,38,18,9);c.fill();txt(c,o,x+19,375,{fs:11,mono:true,color:P.white})})}
  function draw(){drawA();drawB()}
  const r1=C.ctlRow(host);const ga=C.group(r1,"(a)");const bA=C.button(ga,"Dibujar el grafo",()=>{sa=sa>=2?0:sa+1;bA.textContent=sa===0?"Dibujar el grafo":sa===1?"▶ Ejecutar con datos":"↺ Volver a empezar";upd();draw()},{primary:true});
  const gb=C.group(r1,"(b)");const bB=C.button(gb,"▶ Ejecutar la línea siguiente",()=>{const max=bug?1:LINES.length;sb=sb>=max?0:sb+1;bB.textContent=sb>=max?"↺ Volver a empezar":"▶ Ejecutar la línea siguiente";upd();draw()},{primary:true});
  C.toggle(C.group(r1),"Con un error en la forma de W",false,v=>{bug=v;sb=0;bB.textContent="▶ Ejecutar la línea siguiente";upd();draw()});
  const rd=C.readout(host);
  function upd(){const a=["el grafo está vacío","el grafo describe las operaciones, pero no tiene datos ni ha calculado nada","el grafo se ha calculado entero de una vez"+(bug?", y el error aparece al final, lejos de la línea que lo causó":"")][sa];
    const b=sb===0?"no se ha ejecutado ninguna línea":bug?"la primera línea falla al momento y señala dónde está el problema":`se han ejecutado ${sb} de ${LINES.length} líneas, cada una con su resultado a la vista`;
    rd.innerHTML=`<b>(a)</b> ${a}. <b>(b)</b> ${b}.`}
  upd();api.onTheme(draw);draw();
});

// =====================================================================
// Complemento · el bucle de PyTorch, línea a línea, con la neurona del correo
// =====================================================================
C.define("bucle-pytorch",function(host,opts,api){
  const [A,B]=panels(host,[{W:440,H:330,sub:"Código"},{W:600,H:330,sub:"Estado de la neurona tras la línea resaltada"}]);
  const W0=[4,3,-2,-4],lr=0.5,sig=z=>1/(1+Math.exp(-z));
  const CODE=[["for paso in range(3):",0],["opt.zero_grad()",1],["salida = modelo(x)",1],["perdida = coste(salida, y)",1],["perdida.backward()",1],["opt.step()",1]];
  let zg=true,hist=[],pos=-1;// pos: índice en hist
  function build(){const H=[];let w=W0.slice(),g=[0,0,0,0],z=null,yh=null,L=null;for(let it=0;it<3;it++){
      if(zg){g=[0,0,0,0];H.push({ln:1,it,w:w.slice(),g:g.slice(),z,yh,L,msg:"Los gradientes vuelven a 0: no se mezclan con los del paso anterior."})}
      z=w[0]+w[1]+w[2]+w[3];yh=sig(z);H.push({ln:2,it,w:w.slice(),g:g.slice(),z,yh,L,msg:`Propagación hacia delante: z = ${num(z,2)} y la probabilidad de spam es ${num(yh,2)}.`});
      L=-Math.log(1-yh);H.push({ln:3,it,w:w.slice(),g:g.slice(),z,yh,L,msg:`El correo no era spam (y = 0): la pérdida es −ln(1 − ${num(yh,2)}) = ${num(L,2)}.`});
      g=g.map(v=>v+yh);H.push({ln:4,it,w:w.slice(),g:g.slice(),z,yh,L,msg:zg?`La retropropagación calcula cada gradiente: ŷ − y = ${num(yh,2)}, igual para los tres pesos y el sesgo porque las tres entradas valen 1.`:`Sin <code>zero_grad()</code>, el nuevo gradiente (${num(yh,2)}) se <b>suma</b> al que quedaba: ahora vale ${num(g[0],2)}.`});
      w=w.map((v,i)=>v-lr*g[i]);H.push({ln:5,it,w:w.slice(),g:g.slice(),z,yh,L,msg:`El optimizador resta tasa × gradiente (0.5 × ${num(g[0],2)}): cada parámetro baja ${num(lr*g[0],2)}.`})}
    return H}
  function draw(){const P=api.pal();const s=pos>=0?hist[pos]:null;
    {const k=A.k,c=k.c;k.clear();CODE.forEach(([l,ind],i)=>{const y=40+i*44,cur=s&&s.ln===i,dis=i===1&&!zg;
        if(cur){c.fillStyle=P.fillb;rrect(c,12,y-17,416,34,6);c.fill();c.strokeStyle=P.blue;c.lineWidth=2;rrect(c,12,y-17,416,34,6);c.stroke()}
        txt(c,(dis?"# ":"")+l,30+ind*30,y,{align:"left",fs:14,mono:true,color:dis?P.muted:i===0?P.blue:P.text})});
      txt(c,s?`Paso ${s.it+1} de 3`:"Pulsa «Línea siguiente»",220,306,{fs:13,w:600,color:P.muted})}
    {const k=B.k,c=k.c;k.clear();const w=s?s.w:W0,g=s?s.g:[0,0,0,0];
      const ins=["«Gratis»","Desconocido","Nombre"];const NX=330,NY=150;
      ins.forEach((t,i)=>{const y=60+i*90;C.node(c,40,y,17,P.fillb,P.blue,"1",{tc:P.text,fs:13});txt(c,t,40,y+30,{fs:11.5,color:P.muted});
        c.strokeStyle=rgba(w[i]>=0?P.blue:P.red,0.75);c.lineWidth=clamp(1+Math.abs(w[i])*0.8,1,6);c.beginPath();c.moveTo(58,y);c.lineTo(NX-30,NY);c.stroke();
        const mx=170,my=y+(NY-y)*((mx-58)/(NX-30-58));c.fillStyle=P.bg;rrect(c,mx-40,my-22,96,40,6);c.fill();txt(c,`w${"₁₂₃"[i]} = ${num(w[i],2)}`,mx+8,my-10,{fs:12.5,w:700,color:P.text});
        txt(c,`grad ${num(g[i],2)}`,mx+8,my+8,{fs:11.5,mono:true,color:g[i]?P.orange:P.muted})});
      const on=s&&s.ln>=2;C.node(c,NX,NY,30,on?C.mix(P.node,P.red,clamp(s.yh,0,1)*0.8):P.node,P.red,"σ",{tc:P.text,fs:16});
      txt(c,`b = ${num(w[3],2)}`,NX,NY+50,{fs:12.5,w:700,color:P.text});txt(c,`grad ${num(g[3],2)}`,NX,NY+68,{fs:11.5,mono:true,color:g[3]?P.orange:P.muted});
      const bx=410;c.fillStyle=P.bg2;rrect(c,bx,40,176,232,10);c.fill();
      const rows=[["z",s&&s.z!==null&&s.ln>=2?num(s.z,2):"–"],["ŷ (spam)",s&&s.yh!==null&&s.ln>=2?num(s.yh,2):"–"],["pérdida",s&&s.L!==null&&s.ln>=3?num(s.L,2):"–"],["gradiente",num(g[0],2)]];
      rows.forEach(([a,b],i)=>{txt(c,a,bx+14,74+i*52,{align:"left",fs:12.5,color:P.muted});txt(c,b,bx+162,74+i*52,{align:"right",font:`800 22px ${F.head}`,color:i===3&&g[0]>1?P.red:P.text})})}}
  const row=C.ctlRow(host);const g=C.group(row);
  const bN=C.button(g,"▶ Línea siguiente",()=>{if(pos>=hist.length-1)pos=-1;else pos++;bN.textContent=pos>=hist.length-1?"↺ Empezar de nuevo":"▶ Línea siguiente";upd();draw()},{primary:true});
  C.button(g,"Ir al final",()=>{pos=hist.length-1;bN.textContent="↺ Empezar de nuevo";upd();draw()});
  C.toggle(C.group(row),"Quitar opt.zero_grad()",false,v=>{zg=!v;hist=build();pos=-1;bN.textContent="▶ Línea siguiente";upd();draw()});
  const rd=C.readout(host);
  function upd(){const s=pos>=0?hist[pos]:null;if(!s){rd.innerHTML=`Neurona del correo: pesos 4, 3 y −2, sesgo −4, las tres entradas valen 1 y el correo no es spam. Optimizador: <code>SGD(lr=0.5)</code>.`+(zg?"":" <b>Sin zero_grad()</b>: mira qué pasa con los gradientes.");return}
    let m=`<b>${CODE[s.ln][0]}</b> → ${s.msg}`;if(s.ln===5&&s.it===0)m+=` La probabilidad de spam bajará al ${Math.round(sig(s.w.reduce((a,b)=>a+b))*100)} %, como en el Módulo 8.`;
    if(s.ln===5&&s.it===2)m+=zg?` Tras tres pasos, la probabilidad de spam es del ${Math.round(sig(s.w.reduce((a,b)=>a+b))*100)} %.`:` Los gradientes acumulados dan pasos cada vez más largos: la probabilidad acaba en el ${num(sig(s.w.reduce((a,b)=>a+b))*100,1)} %, pero la corrección ya no es la que pide la pérdida actual.`;
    rd.innerHTML=m}
  hist=build();upd();api.onTheme(draw);draw();
});

// =====================================================================
// Figura 52 · la misma red en Keras y en PyTorch
// =====================================================================
C.define("keras-pytorch",function(host,opts,api){
  const D=window.DATA_M9.f52;const [A,B]=panels(host,[{W:530,H:400,sub:"(a) Pérdida por época (media de 5 semillas)"},{W:510,H:400,sub:"(b) Acierto final según el framework"}]);
  let show={tr:true,va:true,band:true},hovE=null,hovP=null,third=true;
  const pa=()=>new C.Plot(A.k,[58,14,512,344],{xr:[1,30],yr:[0,2.4]}),pb=()=>new C.Plot(B.k,[58,14,496,330],{xr:[-0.5,2.5],yr:[94,100]});
  const ep=Array.from({length:30},(_,i)=>i+1);
  const G=[{k:"keras",t:"Keras\n(por defecto)",col:"blue"},{k:"torch",t:"PyTorch\n(por defecto)",col:"red"},{k:"torchK",t:"PyTorch con la\ninicialización de Keras",col:"ocre"}];
  const acc=k=>D.acc[k].map(v=>v/450*100),mean=a=>a.reduce((p,q)=>p+q)/a.length;const JIT=[-0.2,-0.1,0,0.1,0.2];
  function drawA(){const k=A.k,c=k.c,P=api.pal();k.clear();const pl=pa();pl.axes({xt:[5,10,15,20,25,30],yt:[0,0.5,1,1.5,2],fmty:v=>num(v,1),xl:"Época",yl:"Pérdida (entropía cruzada)",ylgap:44});
    [["keras","blue"],["torch","red"]].forEach(([f,cl])=>{const d=D[f],col=P[cl];
      if(show.band&&show.va){c.fillStyle=rgba(col,0.14);c.beginPath();ep.forEach((x,i)=>{const px=pl.X(x),py=pl.Y(d.val.hi[i]);i?c.lineTo(px,py):c.moveTo(px,py)});for(let i=29;i>=0;i--)c.lineTo(pl.X(ep[i]),pl.Y(d.val.lo[i]));c.closePath();c.fill()}
      if(show.va)pl.line(ep,d.val.mean,{color:col,w:2.8});if(show.tr)pl.line(ep,d.trl.mean,{color:col,w:2,dash:[5,4]})});
    if(hovE!==null){pl.vline(hovE,{color:P.gray,dash:[3,3]});const i=hovE-1;const L=[`Época ${hovE}`];
      if(show.va)L.push(`Validación: Keras ${num(D.keras.val.mean[i],3)} · PyTorch ${num(D.torch.val.mean[i],3)}`);if(show.tr)L.push(`Entrenamiento: Keras ${num(D.keras.trl.mean[i],3)} · PyTorch ${num(D.torch.trl.mean[i],3)}`);
      C.tip(c,pl.X(hovE),pl.Y(1.2),L,{W:k.W})}
    const it=[];if(show.va)it.push({color:P.blue,label:"Keras (TensorFlow): validación",w:3},{color:P.red,label:"PyTorch: validación",w:3});if(show.tr)it.push({color:P.blue,label:"Keras (TensorFlow): entrenamiento",dash:[5,4],w:2},{color:P.red,label:"PyTorch: entrenamiento",dash:[5,4],w:2});
    if(it.length){c.fillStyle=rgba(P.bg,.92);c.strokeStyle=P.lgray;c.lineWidth=1;rrect(c,250,22,256,it.length*20+12,6);c.fill();c.stroke();C.legend(c,it,258,38,{lh:20,fs:12})}}
  function drawB(){const k=B.k,c=k.c,P=api.pal();k.clear();const pl=pb();pl.axes({xt:[],yt:[94,95,96,97,98,99,100],fmty:v=>String(v),yl:"Acierto en los 450 dígitos de prueba (%)",ylgap:40});
    G.forEach((g,gi)=>{const col=P[g.col];const vis=gi<2||third;txt(c,g.t,pl.X(gi),pl.y1+24,{fs:12,color:vis?P.text:P.muted,lh:15});if(!vis)return;const a=acc(g.k),m=mean(a);
      c.strokeStyle=col;c.lineWidth=5;c.beginPath();c.moveTo(pl.X(gi-0.27),pl.Y(m));c.lineTo(pl.X(gi+0.27),pl.Y(m));c.stroke();txt(c,num(m,1)+" %",pl.X(gi+0.3),pl.Y(m),{align:"left",w:700,fs:14,color:P.text});
      a.forEach((v,j)=>{const on=hovP&&hovP[0]===gi&&hovP[1]===j;pl.dot(gi+JIT[j]*0.75,v,{color:col,r:on?8:6,stroke:P.bg,sw:1.5})})});
    txt(c,"Puntos: cada una de las 5 semillas\nRaya: media",pl.x1-4,44,{align:"right",fs:12,color:P.text,lh:16});
    if(hovP){const [gi,j]=hovP;const v=acc(G[gi].k)[j];C.tip(c,pl.X(gi+JIT[j]*0.75),pl.Y(v),[`${G[gi].t.replace("\n"," ")}`,`Semilla ${j+1}: ${num(v,1)} % (${D.acc[G[gi].k][j]} de 450)`],{W:k.W})}}
  function draw(){drawA();drawB()}
  A.k.cv.addEventListener("pointermove",e=>{const p=A.k.ptr(e),pl=pa();const h=pl.inside(p)?Math.round(clamp(pl.iX(p.x),1,30)):null;if(h!==hovE){hovE=h;draw()}});
  A.k.cv.addEventListener("pointerleave",()=>{hovE=null;draw()});
  B.k.cv.addEventListener("pointermove",e=>{const p=B.k.ptr(e),pl=pb();let b=null,bd=100;G.forEach((g,gi)=>{if(gi===2&&!third)return;acc(g.k).forEach((v,j)=>{const d=(pl.X(gi+JIT[j]*0.75)-p.x)**2+(pl.Y(v)-p.y)**2;if(d<bd){bd=d;b=[gi,j]}})});
    if(String(b)!==String(hovP)){hovP=b;B.k.cv.style.cursor=b?"pointer":"default";draw()}});
  B.k.cv.addEventListener("pointerleave",()=>{hovP=null;draw()});
  const row=C.ctlRow(host);const g=C.group(row,"(a) Mostrar");C.toggle(g,"Validación",true,v=>{show.va=v;draw()});C.toggle(g,"Entrenamiento",true,v=>{show.tr=v;draw()});C.toggle(g,"Variación entre semillas",true,v=>{show.band=v;draw()});
  C.toggle(C.group(row,"(b)"),"PyTorch con la inicialización de Keras",true,v=>{third=v;upd();draw()});
  const rd=C.readout(host);
  function upd(){const k=acc("keras"),p=acc("torch"),q=acc("torchK");const sp=a=>Math.max(...a)-Math.min(...a);
    rd.innerHTML=`Keras ${num(mean(k),1)} % frente a PyTorch ${num(mean(p),1)} %: <b>${num(mean(k)-mean(p),1)} puntos</b> de diferencia con los valores por defecto.`+(third?` Con la inicialización de Keras, PyTorch sube al ${num(mean(q),1)} %: quedan <b>${num(mean(k)-mean(q),1)} puntos</b>, menos que la variación entre semillas de cada framework (hasta ${num(Math.max(sp(k),sp(p),sp(q)),1)} puntos).`:" Activa la tercera columna para ver qué pasa si PyTorch empieza con los mismos pesos que Keras.")}
  upd();api.onTheme(draw);draw();
});

// =====================================================================
// Figura 53 · recorrido de un modelo en cada ecosistema
// =====================================================================
C.define("ecosistemas",function(host,opts,api){
  const [A]=C.panels(host,[{W:1040,H:450,aria:"Dos filas de cajas: el recorrido de un modelo en TensorFlow y en PyTorch, con los puentes entre ambos."}]);const k=A.k,c=k.c;
  const ST=["Datos","Modelo","Entrenamiento\ny seguimiento","Exportación","Servidor","Móvil, dispositivo\no navegador"];
  const TF=[["tf.data","Lee y prepara los datos por lotes de forma eficiente, sin cargarlos todos en memoria."],["Keras\n(Sequential,\nFunctional)","Define, entrena y evalúa modelos con pocas líneas."],["model.fit()\nTensorBoard","fit() ejecuta el entrenamiento; TensorBoard dibuja la pérdida y las métricas para detectar el sobreajuste."],["SavedModel","Guarda el modelo completo en un formato estándar para pasarlo a sistemas."],["TF Serving","Ofrece el modelo como un servicio en producción, por ejemplo para puntuar pagos en tiempo real."],["LiteRT\nTensorFlow.js","LiteRT (antes TensorFlow Lite) ejecuta modelos en móviles y dispositivos; TensorFlow.js, en el navegador."]];
  const PT=[["Dataset y\nDataLoader","Leen los datos y los reparten en lotes barajados (apartado 3.3 del Módulo 8)."],["nn.Module\nHugging Face","Se define la red en Python o se descarga un modelo preentrenado de Hugging Face."],["Bucle propio o\nLightning\nTensorBoard","El bucle de entrenamiento se escribe a mano o con PyTorch Lightning; TensorBoard también sirve."],["torch.export\nONNX","Exportan el modelo para ejecutarlo fuera de Python, por ejemplo en Java o C#."],["vLLM, Triton\nONNX Runtime","Sirven el modelo a muchos usuarios; vLLM está pensado para modelos de lenguaje."],["ExecuTorch\nLiteRT","Ejecutan el modelo en móviles y dispositivos sin conexión; LiteRT admite también modelos de PyTorch."]];
  const BR=[{a:[0,1],b:[1,1],f:0.5},{a:[1,3],b:[0,5],f:0.5},{a:[0,2],b:[1,2],f:0.5,two:true}];
  let hov=null,sel=null,bridges=true,run=-1,t=0;
  const BX=i=>150+i*150,BW=124,RY=[72,272],BH=100;
  function draw(){const P=api.pal();k.clear();
    ST.forEach((s,i)=>txt(c,s,BX(i)+BW/2,30,{w:700,fs:13.5,color:P.text,lh:16}));
    c.save();c.translate(52,RY[0]+BH/2);c.rotate(-Math.PI/2);txt(c,"TensorFlow\n+ Keras",0,0,{w:800,fs:15,color:P.blue,lh:19});c.restore();
    c.save();c.translate(52,RY[1]+BH/2);c.rotate(-Math.PI/2);txt(c,"PyTorch",0,0,{w:800,fs:15,color:P.red});c.restore();
    if(bridges){box(c,120,398,900,40,P.fillg,P.green,{r:10});txt(c,"Puentes entre ambos (flechas verdes): Keras 3 funciona sobre PyTorch · ONNX y LiteRT convierten modelos de PyTorch · TensorBoard vale para los dos",570,418,{fs:12.2,color:P.green})}
    [TF,PT].forEach((row,r)=>row.forEach((b,i)=>{const x=BX(i),y=RY[r];const on=hov&&hov[0]===r&&hov[1]===i||sel&&sel[0]===r&&sel[1]===i;const lit=run>=0&&Math.floor(run)===i;
      box(c,x,y,BW,BH,lit?C.mix(r?P.fillr:P.fillb,r?P.red:P.blue,0.3):r?P.fillr:P.fillb,r?P.red:P.blue,{lw:on?3.6:2,r:4});txt(c,b[0],x+BW/2,y+BH/2,{fs:13,color:P.text,lh:16.5,w:on?600:400});
      if(i<5){const ax=x+BW,ay=y+BH/2;arrow(c,ax+2,ay,ax+24,ay,P.ink,2,8)}}));
    if(run>=0){const i=Math.min(5,Math.floor(run)),u=run-i;[0,1].forEach(r=>{const x=BX(i)+BW/2+(i<5?u*150:0),y=RY[r]+(r?BH+12:-12);c.fillStyle=r?P.red:P.blue;c.beginPath();c.arc(x,y,5,0,7);c.fill()})}
    if(bridges)BR.forEach(br=>{const [ra,ia]=br.a,[rb,ib]=br.b;const x0=BX(ia)+BW*br.f,x1=BX(ib)+BW*br.f;const y0=ra?RY[1]:RY[0]+BH,y1=rb?RY[1]:RY[0]+BH,dir=Math.sign(y1-y0),m=(y0+y1)/2;
      c.strokeStyle=P.green;c.lineWidth=2.2;c.setLineDash([5,4]);c.beginPath();c.moveTo(x0,y0+(br.two?dir*10:0));c.bezierCurveTo(x0,m,x1,m,x1,y1-dir*10);c.stroke();c.setLineDash([]);
      arrow(c,x1,y1-dir*16,x1,y1-dir*1,P.green,2.2,9);if(br.two)arrow(c,x0,y0+dir*16,x0,y0+dir*1,P.green,2.2,9)})}
  function hit(p){for(let r=0;r<2;r++)for(let i=0;i<6;i++){const x=BX(i),y=RY[r];if(p.x>=x&&p.x<=x+BW&&p.y>=y&&p.y<=y+BH)return[r,i]}return null}
  k.cv.addEventListener("pointermove",e=>{const h=hit(k.ptr(e));if(String(h)!==String(hov)){hov=h;k.cv.style.cursor=h?"pointer":"default";upd();draw()}});
  k.cv.addEventListener("pointerleave",()=>{hov=null;upd();draw()});
  k.cv.addEventListener("click",e=>{const h=hit(k.ptr(e));if(h){sel=h;upd();draw()}});
  const lp=C.loop(api,dt=>{t+=dt;if(run>=0){run+=dt*0.8;if(run>=6){run=-1;upd();draw();return false}upd()}draw();return run>=0});
  const row=C.ctlRow(host);C.button(C.group(row),"▶ Recorrer los dos caminos",()=>{run=0;lp.start()},{primary:true});C.toggle(C.group(row),"Puentes",true,v=>{bridges=v;draw()});
  const rd=C.readout(host);
  function upd(){const h=hov||sel;if(run>=0){const i=Math.min(5,Math.floor(run));rd.innerHTML=`<b>${ST[i].replace("\n"," ")}.</b> TensorFlow: ${TF[i][0].replace(/\n/g," ")} · PyTorch: ${PT[i][0].replace(/\n/g," ")}.`;return}
    if(!h){rd.innerHTML="Pasa el ratón por una caja para ver para qué sirve, o pulsa «Recorrer» para seguir las dos columnas a la vez.";return}
    const [r,i]=h,b=(r?PT:TF)[i];rd.innerHTML=`<b>${r?"PyTorch":"TensorFlow"} · ${ST[i].replace("\n"," ")}: ${b[0].replace(/\n/g," ")}.</b> ${b[1]}`}
  upd();api.onTheme(draw);draw();
});
})();
