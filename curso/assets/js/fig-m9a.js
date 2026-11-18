/* Figuras interactivas del Módulo 9 (1) — qué es el deep learning: lugar en la IA, quién diseña las variables, representaciones y cantidad de datos */
(function(){"use strict";
const C=Curso,{num,numT,F,rgba,arrow,rrect,ease,thou}=C;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
// paneles lado a lado con la misma altura
const panels=(h,specs)=>C.panels(h,specs.map(s=>Object.assign({flex:`${s.W} 1 ${Math.round(s.W*0.55)}px`},s)));
function txt(c,t,x,y,o={}){c.font=o.font||`${o.w||400} ${o.fs||13}px ${F.ui}`;c.fillStyle=o.color;c.textAlign=o.align||"center";c.textBaseline=o.base||"middle";
  const ls=String(t).split("\n"),lh=o.lh||(o.fs||13)*1.3;ls.forEach((l,i)=>c.fillText(l,x,y+(i-(ls.length-1)/2)*lh));c.textBaseline="alphabetic"}
function box(c,x,y,w,h,fill,stroke,o={}){rrect(c,x,y,w,h,o.r||6);c.fillStyle=fill;c.fill();c.lineWidth=o.lw||2;c.strokeStyle=stroke;if(o.dash)c.setLineDash(o.dash);c.stroke();c.setLineDash([])}

// =====================================================================
// Figura 46 · el deep learning dentro de la IA y número de capas
// =====================================================================
C.define("dl-lugar",function(host,opts,api){
  const [A,B]=panels(host,[{W:520,H:400,sub:"(a) El deep learning dentro de la IA",aria:"Círculos anidados: inteligencia artificial, aprendizaje automático, redes neuronales y deep learning."},{W:520,H:400,sub:"(b) Número de capas de algunas redes conocidas",aria:"Barras con el número de capas con pesos de seis redes."}]);
  const R=[{t:"Inteligencia artificial",ex:"Reglas\nescritas\na mano",cx:262,cy:205,rx:248,ry:186,col:"gray",fill:"shade",ty:42,ex0:[62,190],
      d:"Cualquier sistema que realiza tareas que parecen requerir inteligencia. Incluye los sistemas de reglas escritas a mano, que no aprenden de los datos."},
    {t:"Aprendizaje automático",ex:"Regresión,\nárboles,\nrandom\nforest",cx:290,cy:220,rx:186,ry:152,col:"blue2",fill:"fillb",ty:92,ex0:[152,215],
      d:"Modelos que aprenden de los datos, como la regresión, los árboles o el random forest de las Partes I y II."},
    {t:"Redes neuronales",ex:"Perceptrón,\nred de\ndígitos\n(Módulo 7)",cx:330,cy:236,rx:136,ry:116,col:"blue",fill:"fillb",ty:146,ex0:[247,232],
      d:"Modelos formados por neuronas organizadas en capas, como el perceptrón o la red 64-32-10 de dígitos del Módulo 7."},
    {t:"Deep learning",ex:"Muchas capas:\nvisión, voz,\ntexto, IA\ngenerativa",cx:363,cy:262,rx:80,ry:66,col:"red",fill:"fillr",ty:228,ex0:[363,272],
      d:"Redes con muchas capas que aprenden sus propias variables a partir de datos brutos: visión, voz, texto e IA generativa."}];
  const N=[{n:"Red de dígitos\n(Módulo 7)",v:2,col:"blue2",p:2410,d:"La red 64-32-10 del Módulo 7: una capa oculta y la de salida."},
    {n:"LeNet-5\n(1998)",v:5,p:6e4,d:"La red convolucional de LeCun para leer cheques."},
    {n:"AlexNet\n(2012)",v:8,p:6.1e7,d:"La red que ganó ImageNet en 2012 y desencadenó el deep learning."},
    {n:"VGG-19\n(2014)",v:19,p:1.44e8,d:"Muchas capas convolucionales pequeñas apiladas."},
    {n:"GoogLeNet\n(2014)",v:22,p:6.8e6,d:"Más profunda que VGG, pero con muchos menos parámetros."},
    {n:"ResNet-152\n(2015)",v:152,col:"red",p:6e7,d:"Las conexiones residuales permiten entrenar 152 capas (apartado 4.1 del Módulo 8)."}];
  let selR=3,hovR=null,hovB=null,logS=true,grow=0,sc=1;// sc: 1 = escala logarítmica, 0 = lineal (animado)
  const pb=()=>new C.Plot(B.k,[72,26,504,322],{xr:[-0.5,5.5],yr:[0,1]});
  const yv=v=>{const l=Math.log10(Math.max(v,1))/Math.log10(400),li=v/170;return sc*l+(1-sc)*li};
  function inR(r,p){return((p.x-r.cx)/r.rx)**2+((p.y-r.cy)/r.ry)**2<=1}
  function drawA(){const k=A.k,c=k.c,P=api.pal();k.clear();const act=hovR!==null?hovR:selR;
    R.forEach((r,i)=>{const on=i===act,inner=i<=act;c.beginPath();c.ellipse(r.cx,r.cy,r.rx,r.ry,0,0,7);c.fillStyle=i===0?P.shade:i===3?P.fillr:i===2?C.mix(P.fillb,P.blue3,0.35):P.fillb;c.globalAlpha=inner?1:0.55;c.fill();c.globalAlpha=1;
      c.lineWidth=on?3.6:2;c.strokeStyle=P[r.col];if(on){c.save();c.shadowColor=P[r.col];c.shadowBlur=12;c.stroke();c.restore()}else c.stroke()});
    R.forEach((r,i)=>{const on=i===act;txt(c,r.t,i===3?r.cx:r.cx-(i===0?10:i===1?0:0),r.ty,{w:700,fs:i===3?16:15.5,color:i===3?P.red:P.text});
      txt(c,r.ex,r.ex0[0],r.ex0[1],{fs:12.5,color:on?P.text:P.muted,lh:15.5,w:on?600:400})})}
  function drawB(){const k=B.k,c=k.c,P=api.pal();k.clear();const pl=pb();
    const ticks=sc>0.5?[1,10,100]:[0,25,50,75,100,125,150];pl.axes({yt:[],xt:[]});
    c.font=`12.5px ${F.ui}`;c.fillStyle=P.tick;c.textAlign="right";c.textBaseline="middle";ticks.forEach(v=>{const y=pl.Y(yv(Math.max(v,sc>0.5?1:0)));c.strokeStyle=P.grid;c.lineWidth=1;c.beginPath();c.moveTo(pl.x0,y);c.lineTo(pl.x1,y);c.stroke();c.strokeStyle=P.axis;c.beginPath();c.moveTo(pl.x0-4,y);c.lineTo(pl.x0,y);c.stroke();c.fillText(String(v),pl.x0-7,y)});
    if(sc>0.5)[2,3,4,5,6,7,8,9,20,30,40,50,60,70,80,90,200,300].forEach(v=>{const y=pl.Y(yv(v));if(y<pl.y0)return;c.strokeStyle=P.axis;c.beginPath();c.moveTo(pl.x0-2.5,y);c.lineTo(pl.x0,y);c.stroke()});
    c.save();c.translate(22,(pl.y0+pl.y1)/2);c.rotate(-Math.PI/2);txt(c,sc>0.5?"Capas con pesos (escala logarítmica)":"Capas con pesos (escala lineal)",0,0,{fs:13.5,color:P.axis});c.restore();
    N.forEach((b,i)=>{const x=pl.X(i),h=yv(b.v)*ease(clamp(grow*1.6-i*0.12,0,1));const y=pl.Y(h),on=hovB===i;c.fillStyle=P[b.col||"blue"];c.globalAlpha=hovB===null||on?1:0.55;c.fillRect(x-28,y,56,pl.y1-y);c.globalAlpha=1;
      if(on){c.strokeStyle=P.ink;c.lineWidth=1.6;c.strokeRect(x-28,y,56,pl.y1-y)}
      txt(c,String(b.v),x,y-11,{w:700,fs:14.5,color:P.text});txt(c,b.n,x,pl.y1+24,{fs:12,color:P.text,lh:15})})}
  function draw(){drawA();drawB()}
  const lp=C.loop(api,dt=>{let more=false;if(grow<1){grow=Math.min(1,grow+dt*0.9);more=true}const tg=logS?1:0;if(Math.abs(sc-tg)>1e-3){sc+=(tg-sc)*Math.min(1,dt*6);more=true}else sc=tg;draw();return more});
  A.k.cv.addEventListener("pointermove",e=>{const p=A.k.ptr(e);let h=null;for(let i=R.length-1;i>=0;i--)if(inR(R[i],p)){h=i;break}if(h!==hovR){hovR=h;A.k.cv.style.cursor=h!==null?"pointer":"default";upd();draw()}});
  A.k.cv.addEventListener("pointerleave",()=>{hovR=null;upd();draw()});
  A.k.cv.addEventListener("click",e=>{const p=A.k.ptr(e);for(let i=R.length-1;i>=0;i--)if(inR(R[i],p)){selR=i;break}upd();draw()});
  B.k.cv.addEventListener("pointermove",e=>{const p=B.k.ptr(e),pl=pb();let h=null;N.forEach((b,i)=>{if(Math.abs(p.x-pl.X(i))<34&&p.y>pl.y0-10&&p.y<pl.y1+40)h=i});if(h!==hovB){hovB=h;B.k.cv.style.cursor=h!==null?"pointer":"default";upd();draw()}});
  B.k.cv.addEventListener("pointerleave",()=>{hovB=null;upd();draw()});
  const row=C.ctlRow(host);const g=C.group(row,"Nivel");const setL=C.seg(g,R.map((r,i)=>[i,r.t]),v=>{selR=+v;setL(v);upd();draw()});
  const g2=C.group(row,"Escala de (b)");const setS=C.seg(g2,[["log","Logarítmica"],["lin","Lineal"]],v=>{logS=v==="log";setS(v);upd();lp.start()});
  const rd=C.readout(host);
  function upd(){if(hovB!==null){const b=N[hovB];rd.innerHTML=`<b>${b.n.replace("\n"," ")}</b>: ${b.v} capas con pesos y unos ${b.p<1e6?thou(b.p):numT(b.p/1e6,1)+" millones de"} parámetros. ${b.d}`;return}
    const r=R[hovR!==null?hovR:selR];rd.innerHTML=`<b>${r.t}.</b> ${r.d}`+(logS?" En (b), la escala logarítmica permite ver a la vez 2 y 152 capas.":" En (b), con escala lineal, las primeras redes casi no se ven al lado de ResNet-152.")}
  setL(3);setS("log");upd();api.onTheme(draw);lp.start();
});

// =====================================================================
// Figura 47 · quién diseña las variables
// =====================================================================
C.define("quien-variables",function(host,opts,api){
  const [A,B]=panels(host,[{W:500,H:290,sub:"(a) Las variables las diseña el analista"},{W:540,H:290,sub:"(b) Las variables las aprende la red"}]);
  const EX={fraude:{a:["Datos\nbrutos\n(operaciones\nde la tarjeta)","Ingeniería de\nvariables\n(a mano: ratios,\nmedias, recuentos)","Modelo\n(árbol,\nregresión)","Predicción:\n¿fraude?"],
      b:["Datos\nbrutos\n(secuencia de\noperaciones)","Capa 1\nimportes,\nhoras","Capa 2\nhábitos","Capa 3\nanomalías","Capa de\nsalida"],
      d:["La lista de operaciones tal cual: fecha, importe, comercio y país de cada pago.","El analista calcula variables como el importe medio de los últimos 30 días, el número de países distintos en una semana o la hora habitual de compra. Si una pista no se convierte en variable, el modelo nunca la verá.","El modelo solo ve las variables preparadas.","Probabilidad de que la operación sea fraude."],
      e:["La red recibe la secuencia de operaciones del cliente sin preparar.","Las primeras capas combinan rasgos simples: importes, horas, comercios.","Las capas intermedias reconocen hábitos del cliente.","Las últimas capas detectan lo que se sale de lo habitual.","La salida da la probabilidad de fraude."]},
    imagen:{a:["Datos\nbrutos\n(píxeles de\nla imagen)","Ingeniería de\nvariables\n(a mano: tinta,\nsimetría…)","Modelo\n(árbol,\nregresión)","Predicción:\n¿qué dígito?"],
      b:["Datos\nbrutos\n(píxeles)","Capa 1\nbordes,\ntrazos","Capa 2\nformas,\ncurvas","Capa 3\npartes del\ndígito","Capa de\nsalida"],
      d:["Los 64 píxeles de la imagen de un dígito.","El analista decide qué medir: la tinta total, la simetría, la tinta en cada cuadrante… El ejercicio 11 del laboratorio muestra que así es difícil separar un 3 de un 8.","El modelo solo ve las variables preparadas.","El dígito más probable."],
      e:["La red recibe los 64 píxeles sin preparar.","Las primeras capas detectan bordes y trazos.","Las intermedias combinan los bordes en formas.","Las últimas reconocen las partes que distinguen cada dígito (Figura 48b).","La salida softmax da la probabilidad de cada dígito."]}};
  let ex="fraude",sel=null,t=0;
  const LA=[[10,92],[122,128],[275,88],[388,100]],LB=[[8,86],[118,70],[198,70],[278,70],[384,78]];const Y0=88,H=104;
  function boxesA(){return LA.map(([x,w],i)=>({x,y:i===1?Y0-12:Y0,w,h:i===1?H+24:H}))}
  function boxesB(){return LB.map(([x,w],i)=>({x,y:i>=1&&i<=3?Y0-4:Y0,w,h:i>=1&&i<=3?H+8:H}))}
  function flow(c,P,bs,ph,col){for(let i=0;i<bs.length-1;i++){const a=bs[i],b=bs[i+1];const x0=a.x+a.w,x1=b.x,y=Y0+H/2;arrow(c,x0+2,y,x1-2,y,P.ink,2,9);
      const u=(ph+i*0.0)%1;c.fillStyle=col;c.beginPath();c.arc(x0+4+(x1-x0-12)*u,y,3.6,0,7);c.fill()}}
  function drawA(){const k=A.k,c=k.c,P=api.pal();k.clear();const E=EX[ex];txt(c,"Enfoque clásico",250,34,{w:700,fs:16,color:P.text});
    const bs=boxesA();const st=[[P.shade,P.gray],[P.fillr,P.red],[P.fillb,P.blue],[P.fillb,P.blue]];
    bs.forEach((b,i)=>{const on=sel&&sel[0]==="a"&&sel[1]===i;box(c,b.x,b.y,b.w,b.h,st[i][0],st[i][1],{lw:on?3.4:2});txt(c,E.a[i],b.x+b.w/2,b.y+b.h/2,{fs:12.5,color:P.text,lh:15.5,w:on?600:400})});
    flow(c,P,bs,(t*0.45)%1,P.red);txt(c,"Lo diseña una persona experta:\nel modelo solo ve lo que se le prepara",186,244,{font:`italic 12.5px ${F.ui}`,color:P.red,lh:16})}
  function drawB(){const k=B.k,c=k.c,P=api.pal();k.clear();const E=EX[ex];txt(c,"Deep learning",250,34,{w:700,fs:16,color:P.text});
    const bs=boxesB();box(c,108,Y0-20,262,H+40,"rgba(0,0,0,0)",P.green,{dash:[6,4],lw:2,r:8});
    bs.forEach((b,i)=>{const on=sel&&sel[0]==="b"&&sel[1]===i;const s=i===0?[P.shade,P.gray]:i===4?[P.fillb,P.blue]:[P.fillg,P.green];
      // la capa activa se enciende al pasar la señal
      const glow=i>=1&&i<=3?0.5+0.5*Math.sin(t*3-i*1.1):0;box(c,b.x,b.y,b.w,b.h,i>=1&&i<=3?C.mix(P.fillg,P.green3,glow*0.6):s[0],s[1],{lw:on?3.4:2});txt(c,E.b[i],b.x+b.w/2,b.y+b.h/2,{fs:12.5,color:P.text,lh:15.5,w:on?600:400})});
    flow(c,P,bs,(t*0.45)%1,P.green);const last=bs[4];arrow(c,last.x+last.w+2,Y0+H/2,last.x+last.w+30,Y0+H/2,P.ink,2,9);
    c.save();c.translate(last.x+last.w+46,Y0+H/2);c.rotate(-Math.PI/2);txt(c,"Predicción",0,0,{fs:13,color:P.text});c.restore();
    txt(c,"La red aprende sus propias variables,\nde las más simples a las más abstractas",239,250,{font:`italic 12.5px ${F.ui}`,color:P.green,lh:16})}
  function draw(){drawA();drawB()}
  function hit(bs,p){return bs.findIndex(b=>p.x>=b.x&&p.x<=b.x+b.w&&p.y>=b.y&&p.y<=b.y+b.h)}
  [[A,"a",boxesA],[B,"b",boxesB]].forEach(([K,s,bf])=>{K.k.cv.addEventListener("pointermove",e=>{K.k.cv.style.cursor=hit(bf(),K.k.ptr(e))>=0?"pointer":"default"});
    K.k.cv.addEventListener("click",e=>{const i=hit(bf(),K.k.ptr(e));if(i>=0){sel=[s,i];upd();draw()}})});
  const lp=C.loop(api,dt=>{t+=dt;draw();return true});
  const row=C.ctlRow(host);const setE=C.seg(C.group(row,"Ejemplo"),[["fraude","Fraude con tarjetas"],["imagen","Imagen de un dígito"]],v=>{ex=v;setE(v);upd();draw()});
  const rd=C.readout(host);C.hint(host,"Pulsa cualquier caja para ver qué hace en cada enfoque.");
  function upd(){const E=EX[ex];if(!sel){rd.innerHTML="En (a) el trabajo de decidir qué mirar lo hace una persona; en (b), las capas ocultas de la red. Pulsa una caja.";return}
    const [s,i]=sel;rd.innerHTML=s==="a"?`<b>Enfoque clásico · ${E.a[i].split("\n")[0]} ${i===1?"de variables":""}.</b> ${E.d[i]}`:`<b>Deep learning · ${E.b[i].replace(/\n/g," ")}.</b> ${E.e[i]}`}
  setE("fraude");upd();api.onTheme(draw);lp.start();
});

// =====================================================================
// Figura 48 · píxeles frente a la capa oculta (PCA, datos reales)
// =====================================================================
C.define("pca-digitos",function(host,opts,api){
  const D=window.DATA_M9.f48,n=D.n,img=Uint8Array.from(atob(D.img),ch=>ch.charCodeAt(0));
  const DG=[3,5,8,9],COL={3:"blue",5:"red",8:"green",9:"ocre"},SH={3:"o",5:"s",8:"t",9:"d"};
  const [A,B]=panels(host,[{W:510,H:420,sub:"(a) Los 64 píxeles originales"},{W:510,H:420,sub:"(b) Las 32 neuronas de la capa oculta"}]);
  const rng=(Z,i)=>{let lo=1e9,hi=-1e9;for(let q=0;q<n;q++){lo=Math.min(lo,Z[2*q+i]);hi=Math.max(hi,Z[2*q+i])}const m=(hi-lo)*0.05;return[lo-m,hi+m]};
  const SP=[{Z:D.P,acc:75,k:A.k},{Z:D.H,acc:85,k:B.k}];SP.forEach(s=>{s.xr=rng(s.Z,0);s.yr=rng(s.Z,1);s.pl=()=>new C.Plot(s.k,[40,14,496,372],{xr:s.xr,yr:s.yr})});
  let on={3:true,5:true,8:true,9:true},hov=null,mouse=null;
  function mark(c,x,y,d,r,col,alpha){c.globalAlpha=alpha;c.fillStyle=col;c.beginPath();const s=SH[d];
    if(s==="o")c.arc(x,y,r,0,7);else if(s==="s")c.rect(x-r*.85,y-r*.85,r*1.7,r*1.7);else if(s==="t"){c.moveTo(x,y-r*1.1);c.lineTo(x+r,y+r*.75);c.lineTo(x-r,y+r*.75);c.closePath()}else{c.moveTo(x,y-r*1.15);c.lineTo(x+r,y);c.lineTo(x,y+r*1.15);c.lineTo(x-r,y);c.closePath()}c.fill();c.globalAlpha=1}
  function nn(si,i){const Z=SP[si].Z;let b=-1,bd=1e18;for(let q=0;q<n;q++){if(q===i||!on[D.y[q]])continue;const d=(Z[2*q]-Z[2*i])**2+(Z[2*q+1]-Z[2*i+1])**2;if(d<bd){bd=d;b=q}}return b}
  function thumb(c,P,i,x,y,s){c.fillStyle=P.bg;c.strokeStyle=P.lgray;c.lineWidth=1;rrect(c,x-4,y-4,8*s+8,8*s+8,5);c.fill();c.stroke();
    for(let r=0;r<8;r++)for(let q=0;q<8;q++){const v=img[i*64+r*8+q]/16;const g=api.theme==="dark"?Math.round(16+v*230):Math.round(255-v*235);c.fillStyle=`rgb(${g},${g},${g})`;c.fillRect(x+q*s,y+r*s,s,s)}}
  function drawS(si){const s=SP[si],k=s.k,c=k.c,P=api.pal();k.clear();const pl=s.pl();pl.axes({xt:[],yt:[],xl:"Componente principal 1",yl:"Componente principal 2",xlgap:20,ylgap:18,grid:false});
    pl.clip();for(let q=0;q<n;q++){const d=D.y[q];if(!on[d])continue;mark(c,pl.X(s.Z[2*q]),pl.Y(s.Z[2*q+1]),d,3.4,P[COL[d]],hov===null?0.62:0.25)}
    if(hov!==null){const d=D.y[hov];const x=pl.X(s.Z[2*hov]),y=pl.Y(s.Z[2*hov+1]);const j=nn(si,hov);
      if(j>=0){const xj=pl.X(s.Z[2*j]),yj=pl.Y(s.Z[2*j+1]);c.strokeStyle=P.ink;c.setLineDash([3,3]);c.lineWidth=1.3;c.beginPath();c.moveTo(x,y);c.lineTo(xj,yj);c.stroke();c.setLineDash([]);mark(c,xj,yj,D.y[j],5,P[COL[D.y[j]]],1);c.strokeStyle=P.ink;c.lineWidth=1.2;c.beginPath();c.arc(xj,yj,8,0,7);c.stroke()}
      mark(c,x,y,d,6.5,P[COL[d]],1);c.strokeStyle=P.ink;c.lineWidth=2;c.beginPath();c.arc(x,y,11,0,7);c.stroke()}
    pl.unclip();
    c.font=`13px ${F.ui}`;const lab=`Acierto con 2 coordenadas: ${s.acc} %`;const w=c.measureText(lab).width+18;c.fillStyle=rgba(P.bg,.92);c.strokeStyle=P.gray;c.lineWidth=1.2;rrect(c,48,22,w,26,6);c.fill();c.stroke();txt(c,lab,48+w/2,35,{fs:13,color:P.text});
    if(si===1){const x0=380,y0=274;c.fillStyle=rgba(P.bg,.92);c.strokeStyle=P.lgray;rrect(c,x0,y0,108,92,6);c.fill();c.stroke();DG.forEach((d,i)=>{mark(c,x0+16,y0+15+i*21,d,5,P[COL[d]],on[d]?1:0.25);txt(c,"Dígito "+d,x0+30,y0+15+i*21,{align:"left",fs:12.5,color:on[d]?P.text:P.muted})})}
    if(hov!==null&&mouse&&mouse.si===si){const x=clamp(mouse.x+14,8,k.W-84),y=clamp(mouse.y-90,8,k.H-90);thumb(c,P,hov,x,y,9)}}
  function draw(){drawS(0);drawS(1)}
  SP.forEach((s,si)=>{s.k.cv.addEventListener("pointermove",e=>{const p=s.k.ptr(e),pl=s.pl();let b=null,bd=100;for(let q=0;q<n;q++){if(!on[D.y[q]])continue;const d=(pl.X(s.Z[2*q])-p.x)**2+(pl.Y(s.Z[2*q+1])-p.y)**2;if(d<bd){bd=d;b=q}}
      mouse={x:p.x,y:p.y,si};if(b!==hov){hov=b;s.k.cv.style.cursor=b!==null?"pointer":"default";upd()}draw()});
    s.k.cv.addEventListener("pointerleave",()=>{hov=null;mouse=null;upd();draw()})});
  const row=C.ctlRow(host);const g=C.group(row,"Mostrar");DG.forEach(d=>C.toggle(g,"Dígito "+d,true,v=>{on[d]=v;hov=null;upd();draw()}));
  const rd=C.readout(host);
  function upd(){if(hov===null){rd.innerHTML=`${n} imágenes reales de 3, 5, 8 y 9. Pasa el ratón por un punto para ver la imagen y su vecino más próximo en cada representación: es lo que mira el clasificador de <i>k</i> vecinos.`;return}
    const d=D.y[hov],a=nn(0,hov),b=nn(1,hov);const ok=j=>j>=0&&D.y[j]===d;
    rd.innerHTML=`Imagen de un <b>${d}</b>. Su vecino más próximo con los píxeles es un <b style="color:var(--${ok(a)?"green":"red"})">${a>=0?D.y[a]:"–"}</b>; con la capa oculta, un <b style="color:var(--${ok(b)?"green":"red"})">${b>=0?D.y[b]:"–"}</b>.`}
  upd();api.onTheme(draw);draw();
});

// =====================================================================
// Figura 49 · rendimiento según la cantidad de datos y enfoque recomendado
// =====================================================================
C.define("datos-enfoque",function(host,opts,api){
  const [A,B]=panels(host,[{W:520,H:400,sub:"(a) Rendimiento según la cantidad de datos (esquema)"},{W:520,H:400,sub:"(b) Qué enfoque conviene en cada caso (orientativo)"}]);
  const s=z=>1/(1+Math.exp(-z));
  const M=[{t:"Modelo clásico (árboles, regresión)",col:"gray",f:x=>0.12+0.64*s((x-0.27)/0.075)},{t:"Red pequeña",col:"blue2",f:x=>0.06+0.76*s((x-0.37)/0.085)},
    {t:"Red mediana",col:"blue",f:x=>0.04+0.86*s((x-0.47)/0.1)},{t:"Red profunda grande",col:"red",f:x=>0.02+0.92*s((x-0.6)/0.13)}];
  let X=0.15,tab=false,hov=null,anim=-1;
  const pa=()=>new C.Plot(A.k,[36,14,508,346],{xr:[0,1],yr:[0,1.12]});
  const Q=[{t:"Ajustar un modelo\npreentrenado",ex:"Ej.: clasificar 500\nfotos de averías",col:"green",fill:"fillg",d:"Pocos datos propios, pero de tipo imagen, texto o audio: se parte de un modelo preentrenado y se ajusta (aprendizaje por transferencia)."},
    {t:"Deep learning\n(entrenar o ajustar)",ex:"Ej.: transcribir miles\nde horas de llamadas",col:"red",fill:"fillr",d:"Muchos datos de imagen, texto o audio: el terreno del deep learning, entrenando una red o ajustando una grande."},
    {t:"Modelo clásico\n(árboles, boosting)",ex:"Ej.: scoring con\nunos miles de clientes",col:"text",fill:"shade",d:"Una tabla con pocos datos: el modelo clásico suele ganar y es más fácil de explicar."},
    {t:"Probar ambos y\ncomparar en validación",ex:"Ej.: millones de\ntransacciones",col:"blue",fill:"fillb",d:"Una tabla muy grande: una red puede igualar o superar al modelo clásico, pero hay que comprobarlo en validación."}];
  const QB={x0:48,y0:14,x1:508,y1:346};
  function quad(){return(tab?2:0)+(X>=0.5?1:0)}
  function drawA(){const k=A.k,c=k.c,P=api.pal();k.clear();const pl=pa();pl.vspan(0,0.26,rgba(P.blue2,api.theme==="dark"?.12:.13));pl.vspan(0.72,1,rgba(P.red,api.theme==="dark"?.12:.1));
    pl.axes({xt:[],yt:[],grid:false,xl:"Cantidad de datos de entrenamiento",yl:"Rendimiento",xlgap:22,ylgap:16});
    txt(c,"Pocos datos:\nel clásico\nsuele ganar",pl.X(0.13),48,{fs:12.5,color:P.blue,lh:16});txt(c,"Muchos datos:\ngana la red\nmás grande",pl.X(0.86),48,{fs:12.5,color:P.red,lh:16});
    const best=M.reduce((b,m,i)=>m.f(X)>M[b].f(X)?i:b,0);
    M.forEach((m,i)=>{pl.fn(m.f,{color:P[m.col],w:hov===i||best===i?3.6:2.6,alpha:hov===null||hov===i?1:0.35})});
    pl.vline(X,{color:P.ink,dash:[4,3],w:1.4,top:112});M.forEach((m,i)=>pl.dot(X,m.f(X),{color:P[m.col],r:i===best?6.5:4.5,stroke:P.bg,sw:1.5}));
    const lx=pl.X(X)>300?60:290;c.fillStyle=rgba(P.bg,.92);c.strokeStyle=P.lgray;c.lineWidth=1;rrect(c,lx-6,252,218,86,6);c.fill();c.stroke();
    C.legend(c,M.map(m=>({color:P[m.col],label:m.t,w:3})),lx+2,266,{lh:20,fs:11.5})}
  function drawB(){const k=B.k,c=k.c,P=api.pal();k.clear();const {x0,y0,x1,y1}=QB,xm=(x0+x1)/2,ym=(y0+y1)/2,cur=quad();
    [[x0,y0],[xm,y0],[x0,ym],[xm,ym]].forEach(([x,y],i)=>{const q=Q[i],on=i===cur;c.fillStyle=P[q.fill];c.globalAlpha=on?1:0.55;c.fillRect(x+1.5,y+1.5,xm-x0-3,ym-y0-3);c.globalAlpha=1;
      if(on){c.strokeStyle=P[q.col];c.lineWidth=3;c.strokeRect(x+3,y+3,xm-x0-6,ym-y0-6)}
      txt(c,q.t,x+(xm-x0)/2,y+(ym-y0)/2-24,{fs:13,color:q.col==="text"?P.text:P[q.col],lh:17,w:on?700:400});txt(c,q.ex,x+(xm-x0)/2,y+(ym-y0)/2+26,{fs:12.5,color:q.col==="text"?P.text:P[q.col],lh:17})});
    c.strokeStyle=P.axis;c.lineWidth=1.1;c.strokeRect(x0,y0,x1-x0,y1-y0);
    txt(c,"Volumen de datos etiquetados  →",(x0+x1)/2,y1+20,{fs:13.5,color:P.axis});txt(c,"pocos",x0+20,y1+20,{fs:11.5,color:P.muted});txt(c,"muchos",x1-24,y1+20,{fs:11.5,color:P.muted});
    c.save();c.translate(20,(y0+y1)/2);c.rotate(-Math.PI/2);txt(c,"Datos tabulares  →  imágenes, texto, audio",0,0,{fs:13,color:P.axis});c.restore();
    const px=x0+12+(x1-x0-24)*X,py=tab?y1-16:ym-16;c.fillStyle=P.ink;c.beginPath();c.arc(px,py,7,0,7);c.fill();c.strokeStyle=P.bg;c.lineWidth=2;c.stroke();txt(c,"tu proyecto",px+(X>0.8?-14:14),py,{align:X>0.8?"right":"left",fs:12,w:700,color:P.ink})}
  function draw(){drawA();drawB()}
  const lp=C.loop(api,dt=>{if(anim>=0){anim+=dt/5;X=Math.min(1,anim);sl.set(Math.round(X*100));upd();if(anim>=1)anim=-1}draw();return anim>=0});
  A.k.cv.addEventListener("pointermove",e=>{const p=A.k.ptr(e),pl=pa();if(!pl.inside(p)){if(hov!==null){hov=null;draw()}return}const x=pl.iX(p.x);let b=null,bd=14;M.forEach((m,i)=>{const d=Math.abs(pl.Y(m.f(x))-p.y);if(d<bd){bd=d;b=i}});if(b!==hov){hov=b;draw()}});
  A.k.cv.addEventListener("pointerleave",()=>{hov=null;draw()});
  A.k.cv.addEventListener("click",e=>{const p=A.k.ptr(e),pl=pa();if(pl.inside(p)){X=clamp(pl.iX(p.x),0,1);sl.set(Math.round(X*100));anim=-1;upd();draw()}});
  const row=C.ctlRow(host);const sl=C.slider(row,"Cantidad de datos",0,100,1,15,v=>{X=v/100;anim=-1;upd();draw()},v=>v<26?"pocos":v<50?"algunos":v<72?"bastantes":"muchos");
  C.button(C.group(row),"▶ Aumentar los datos",()=>{anim=0;lp.start()},{primary:true});
  const setT=C.seg(C.group(row,"Tipo de dato"),[["img","Imágenes, texto, audio"],["tab","Tabla"]],v=>{tab=v==="tab";setT(v);upd();draw()});
  const rd=C.readout(host);
  function upd(){const r=M.map((m,i)=>[i,m.f(X)]).sort((a,b)=>b[1]-a[1]);const q=Q[quad()];
    rd.innerHTML=`Con esta cantidad de datos rinde más: <b style="color:var(--${["muted","blue2","blue","red"][r[0][0]]})">${M[r[0][0]].t}</b>, seguido de ${M[r[1][0]].t.toLowerCase()}. Recomendación en (b): <b>${q.t.replace("\n"," ")}</b>. ${q.d}`}
  setT("img");upd();api.onTheme(draw);draw();
});
})();
