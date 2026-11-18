/* Laboratorio de ejercicios · núcleo numérico (sin DOM; también se prueba en node) */
(function(G){"use strict";
function rng(seed){let s=seed>>>0||1;return()=>{s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;return s/4294967296}}
function gauss(r){return()=>{let u=0;while(u===0)u=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*r())}}
const sig=z=>1/(1+Math.exp(-z));
const ACT={
  lineal:[z=>z,()=>1],
  sigmoide:[sig,(z,a)=>a*(1-a)],
  tanh:[z=>Math.tanh(z),(z,a)=>1-a*a],
  relu:[z=>z>0?z:0,z=>z>0?1:0]};

// ---------------------------------------------------------------- red densa con salida sigmoide, Adam, L2 y dropout
function MLP(sizes,act,seed,o={}){const r=rng(seed),g=gauss(r),A=ACT[act],L=sizes.length-1;const W=[],B=[];
  for(let l=0;l<L;l++){const fi=sizes[l],fo=sizes[l+1];const sd=(act==="relu"?Math.sqrt(2/fi):Math.sqrt(1/fi))*(l===L-1?0.5:1);W.push(Float64Array.from({length:fi*fo},()=>g()*sd));B.push(new Float64Array(fo))}
  const zeros=a=>a.map(w=>new Float64Array(w.length));const mW=zeros(W),vW=zeros(W),mB=zeros(B),vB=zeros(B);let t=0;
  // pasada hacia delante; mask: máscaras de dropout por capa oculta
  function fwd(x,mask){const as=[x],zs=[];for(let l=0;l<L;l++){const fi=sizes[l],fo=sizes[l+1],a=as[l],z=new Float64Array(fo),h=new Float64Array(fo);
      for(let j=0;j<fo;j++){let s=B[l][j];const off=j*fi;for(let i=0;i<fi;i++)s+=W[l][off+i]*a[i];z[j]=s;h[j]=l===L-1?sig(s):A[0](s)*(mask?mask[l][j]:1)}zs.push(z);as.push(h)}return{as,zs}}
  function prob(x){return fwd(x).as[L][0]}
  function epoch(X,Y,lr,l2=0,drop=0){const n=Y.length,gW=zeros(W),gB=zeros(B);const keep=1-drop;
    for(let k=0;k<n;k++){const mask=drop>0?sizes.slice(1,-1).map(s=>Float64Array.from({length:s},()=>r()<keep?1/keep:0)):null;
      const {as,zs}=fwd([X[2*k],X[2*k+1]],mask);let d=new Float64Array([(as[L][0]-Y[k])/n]);
      for(let l=L-1;l>=0;l--){const fi=sizes[l],fo=sizes[l+1],dn=new Float64Array(fi);
        for(let j=0;j<fo;j++){const dj=d[j];if(dj===0)continue;gB[l][j]+=dj;const off=j*fi;for(let i=0;i<fi;i++){gW[l][off+i]+=dj*as[l][i];dn[i]+=dj*W[l][off+i]}}
        if(l>0)for(let i=0;i<fi;i++)dn[i]*=A[1](zs[l-1][i],as[l][i]/(mask?(mask[l-1][i]||1):1))*(mask?mask[l-1][i]:1);d=dn}}
    if(l2>0)for(let l=0;l<L;l++)for(let i=0;i<W[l].length;i++)gW[l][i]+=2*l2*W[l][i];
    t++;const b1=.9,b2=.999,c1=1-b1**t,c2=1-b2**t;
    const up=(P,Gr,M,V)=>{for(let i=0;i<P.length;i++){M[i]=b1*M[i]+(1-b1)*Gr[i];V[i]=b2*V[i]+(1-b2)*Gr[i]*Gr[i];P[i]-=lr*(M[i]/c1)/(Math.sqrt(V[i]/c2)+1e-8)}};
    for(let l=0;l<L;l++){up(W[l],gW[l],mW[l],vW[l]);up(B[l],gB[l],mB[l],vB[l])}}
  function evalSet(X,Y){let loss=0,ok=0;const n=Y.length;for(let k=0;k<n;k++){const p=Math.min(1-1e-7,Math.max(1e-7,prob([X[2*k],X[2*k+1]])));loss-=Y[k]*Math.log(p)+(1-Y[k])*Math.log(1-p);if((p>.5)===(Y[k]>.5))ok++}return{loss:loss/n,acc:ok/n}}
  function snap(){return{W:W.map(w=>Float64Array.from(w)),B:B.map(b=>Float64Array.from(b))}}
  function load(s){s.W.forEach((w,l)=>W[l].set(w));s.B.forEach((b,l)=>B[l].set(b))}
  return{sizes,W,B,fwd,prob,epoch,evalSet,snap,load,get t(){return t}}}

// ---------------------------------------------------------------- conjuntos de datos
// XOR con ruido: cuatro nubes en las esquinas
function xorData(n,seed,sd=0.16){const r=rng(seed),g=gauss(r);const X=new Float64Array(2*n),Y=new Float64Array(n);
  for(let i=0;i<n;i++){const a=i%2,b=(i>>1)%2;X[2*i]=(a?1:-1)*0.6+g()*sd;X[2*i+1]=(b?1:-1)*0.6+g()*sd;Y[i]=a^b}return{X,Y,n}}
// dos lunas con ruido y una fracción de etiquetas cambiadas
function moons(n,noise,flip,seed){const r=rng(seed),g=gauss(r);const X=new Float64Array(2*n),Y=new Float64Array(n);
  for(let i=0;i<n;i++){const c=i%2,t=Math.PI*r();let x,y;if(c===0){x=Math.cos(t);y=Math.sin(t)}else{x=1-Math.cos(t);y=0.5-Math.sin(t)}
    x+=g()*noise;y+=g()*noise;X[2*i]=(x-0.5)/1.1;X[2*i+1]=(y-0.25)/0.85;Y[i]=r()<flip?1-c:c}return{X,Y,n}}

// ---------------------------------------------------------------- M7-4 · suma de codos ReLU ajustada por mínimos cuadrados
const g2=(x,m,s)=>Math.exp(-(((x-m)/s)**2));
const CURVE=x=>0.9+0.5*g2(x,8.5,1.6)+1.1*g2(x,20,2.2)+0.25*g2(x,14,2.5);   // consumo eléctrico (kW) frente a la hora
const CX=Array.from({length:97},(_,i)=>i*0.25);
function fitKnots(knots){const K=knots.length,m=K+2;const Phi=CX.map(x=>[1,x,...knots.map(c=>Math.max(0,x-c))]);
  const A=Array.from({length:m},()=>new Float64Array(m)),b=new Float64Array(m);
  Phi.forEach((p,i)=>{const y=CURVE(CX[i]);for(let a=0;a<m;a++){b[a]+=p[a]*y;for(let c=0;c<m;c++)A[a][c]+=p[a]*p[c]}});
  for(let a=0;a<m;a++)A[a][a]+=1e-6;
  // eliminación gaussiana
  const M=A.map((r,i)=>[...r,b[i]]);for(let i=0;i<m;i++){let p=i;for(let k=i+1;k<m;k++)if(Math.abs(M[k][i])>Math.abs(M[p][i]))p=k;[M[i],M[p]]=[M[p],M[i]];
    for(let k=i+1;k<m;k++){const f=M[k][i]/M[i][i];for(let c=i;c<=m;c++)M[k][c]-=f*M[i][c]}}
  const coef=new Float64Array(m);for(let i=m-1;i>=0;i--){let s=M[i][m];for(let c=i+1;c<m;c++)s-=M[i][c]*coef[c];coef[i]=s/M[i][i]}
  const f=x=>coef[0]+coef[1]*x+knots.reduce((s,c,k)=>s+coef[k+2]*Math.max(0,x-c),0);
  let e=0;CX.forEach(x=>{e+=(f(x)-CURVE(x))**2});return{coef,f,rmse:Math.sqrt(e/CX.length)}}

// ---------------------------------------------------------------- M8-2 · curva de coste con un mínimo local y uno global
const J1=w=>0.05*w**4-0.55*w**2+0.42*w+2.2, dJ1=w=>0.2*w**3-1.1*w+0.42;
function descend1(w0,eta,steps=40){const ws=[w0];let w=w0;for(let i=0;i<steps;i++){w=w-eta*dJ1(w);ws.push(w);if(!isFinite(w)||Math.abs(w)>50)break}return ws}

// ---------------------------------------------------------------- M8-3 · barranco alargado y optimizadores
const RAV={a:1,b:60,rot:0.12};
function ravJ(x,y){const c=Math.cos(RAV.rot),s=Math.sin(RAV.rot),u=c*x+s*y,v=-s*x+c*y;return 0.5*(RAV.a*u*u+RAV.b*v*v)}
function ravG(x,y){const c=Math.cos(RAV.rot),s=Math.sin(RAV.rot),u=c*x+s*y,v=-s*x+c*y;const gu=RAV.a*u,gv=RAV.b*v;return[c*gu-s*gv,s*gu+c*gv]}
function optimize(kind,eta,start,steps=120){let [x,y]=start;const P=[[x,y]];let mx=0,my=0,vx=0,vy=0;
  for(let t=1;t<=steps;t++){const [gx,gy]=ravG(x,y);
    if(kind==="sgd"){x-=eta*gx;y-=eta*gy}
    else if(kind==="momentum"){mx=0.9*mx+gx;my=0.9*my+gy;x-=eta*mx;y-=eta*my}
    else if(kind==="rmsprop"){vx=0.9*vx+0.1*gx*gx;vy=0.9*vy+0.1*gy*gy;x-=eta*gx/(Math.sqrt(vx)+1e-8);y-=eta*gy/(Math.sqrt(vy)+1e-8)}
    else{mx=0.9*mx+0.1*gx;my=0.9*my+0.1*gy;vx=0.999*vx+0.001*gx*gx;vy=0.999*vy+0.001*gy*gy;const mh=1-0.9**t,vh=1-0.999**t;x-=eta*(mx/mh)/(Math.sqrt(vx/vh)+1e-8);y-=eta*(my/mh)/(Math.sqrt(vy/vh)+1e-8)}
    P.push([x,y]);if(!isFinite(x)||Math.abs(x)+Math.abs(y)>1e3)break}
  return P}
function reached(P,tol=0.01){for(let i=0;i<P.length;i++)if(ravJ(P[i][0],P[i][1])<tol)return i;return -1}

// ---------------------------------------------------------------- M8-4 · tamaño del error que llega a cada capa de una red profunda
function gradProfile(act,init,res,layers=10,width=32,batch=64,seed=7){const r=rng(seed),g=gauss(r),A=ACT[act];
  const sc={pequena:0.5,glorot:1,he:Math.SQRT2,grande:Math.SQRT2*1.5}[init];
  const Ws=[];for(let l=0;l<layers;l++)Ws.push(Float64Array.from({length:width*width},()=>g()*sc/Math.sqrt(width)));
  const out=new Float64Array(layers);
  for(let s=0;s<batch;s++){let h=Float64Array.from({length:width},()=>g());const H=[h],Z=[];
    for(let l=0;l<layers;l++){const z=new Float64Array(width),a=new Float64Array(width);for(let j=0;j<width;j++){let t=0;const o=j*width;for(let i=0;i<width;i++)t+=Ws[l][o+i]*h[i];z[j]=t;a[j]=A[0](t)}
      if(res&&l%2===1)for(let j=0;j<width;j++)a[j]+=H[l-1][j];Z.push(z);H.push(a);h=a}
    let d=Float64Array.from({length:width},()=>g()),pend=null;
    for(let l=layers-1;l>=0;l--){if(res&&l%2===1)pend=d;   // el atajo del bloque (l−1, l) lleva este error intacto a su entrada
      const dz=new Float64Array(width);for(let j=0;j<width;j++)dz[j]=d[j]*A[1](Z[l][j],A[0](Z[l][j]));
      const dn=new Float64Array(width);for(let j=0;j<width;j++){const o=j*width;for(let i=0;i<width;i++)dn[i]+=Ws[l][o+i]*dz[j]}
      let m=0;for(let j=0;j<width;j++)m+=dz[j]*dz[j];out[l]+=Math.sqrt(m/width)/batch;
      d=dn;if(pend&&l%2===0){for(let j=0;j<width;j++)d[j]+=pend[j];pend=null}}}
  return Array.from(out)}

// ================================================================ Módulo 9
// ---------------------------------------------------------------- ej. 11 · variables de los dígitos y k vecinos
// variables «a mano» de una imagen 8 × 8 (valores 0–16), sin normalizar
const FEATS={
  tinta:{t:"Tinta total",f:x=>{let s=0;for(let i=0;i<64;i++)s+=x[i];return s}},
  arriba:{t:"Arriba − abajo",f:x=>{let s=0;for(let i=0;i<64;i++)s+=i<32?x[i]:-x[i];return s}},
  izq:{t:"Izquierda − derecha",f:x=>{let s=0;for(let i=0;i<64;i++)s+=(i%8)<4?x[i]:-x[i];return s}},
  centro:{t:"Tinta en el centro",f:x=>{let s=0;for(let r=2;r<6;r++)for(let q=2;q<6;q++)s+=x[r*8+q];return s}},
  supizq:{t:"Cuadrante superior izquierdo",f:x=>{let s=0;for(let r=0;r<4;r++)for(let q=0;q<4;q++)s+=x[r*8+q];return s}},
  simetria:{t:"Simetría izquierda-derecha",f:x=>{let s=0;for(let r=0;r<8;r++)for(let q=0;q<4;q++)s+=Math.abs(x[r*8+q]-x[r*8+7-q]);return -s}}};
function zscore(v){const n=v.length;let m=0;for(const a of v)m+=a/n;let sd=0;for(const a of v)sd+=(a-m)**2/n;sd=Math.sqrt(sd)||1;return v.map(a=>(a-m)/sd)}
// 5 particiones estratificadas, en orden, como StratifiedKFold(5) sin barajar
function strat5(y){const fold=new Array(y.length);[...new Set(y)].forEach(c=>{const ix=[];y.forEach((v,i)=>{if(v===c)ix.push(i)});const m=ix.length,sz=Array(5).fill(Math.floor(m/5));for(let i=0;i<m%5;i++)sz[i]++;let p=0;sz.forEach((s,f)=>{for(let t=0;t<s;t++)fold[ix[p++]]=f})});return fold}
// acierto de k vecinos (k = 5) con validación cruzada en 5 partes y dos coordenadas tipificadas
function knn2(a,b,y,fold,k=5){a=zscore(a);b=zscore(b);const n=y.length;let ok=0;const d=new Float64Array(n);
  for(let i=0;i<n;i++){const best=[];for(let j=0;j<n;j++){if(fold[j]===fold[i])continue;const dd=(a[i]-a[j])**2+(b[i]-b[j])**2;if(best.length<k||dd<best[best.length-1][0]){best.push([dd,y[j]]);best.sort((p,q)=>p[0]-q[0]);if(best.length>k)best.pop()}}
    const cnt={};let bl=null,bc=-1;for(const q of best){cnt[q[1]]=(cnt[q[1]]||0)+1;if(cnt[q[1]]>bc){bc=cnt[q[1]];bl=q[1]}}if(bl===y[i])ok++}return ok/n}

// ---------------------------------------------------------------- ej. 12 · cuántos datos y qué enfoque (curvas orientativas)
// n: ejemplos etiquetados; acierto esperado de cada enfoque según el tipo de proyecto
const lg=z=>1/(1+Math.exp(-z));
const PROJ={
  fotos:{label:2,approach:{clasico:n=>0.50+0.24*(1-Math.exp(-n/600)),pequena:n=>0.30+0.58*lg((Math.log10(n)-3.7)/0.3),
      profunda:n=>0.25+0.72*lg((Math.log10(n)-4.6)/0.32),preentrenado:n=>0.40+0.55*(1-Math.exp(-n/450))},
    train:{clasico:0,pequena:200,profunda:4000,preentrenado:300}},
  scoring:{label:0.5,approach:{clasico:n=>0.62+0.27*(1-Math.exp(-n/1500)),pequena:n=>0.55+0.32*lg((Math.log10(n)-3.6)/0.35),
      profunda:n=>0.50+0.37*lg((Math.log10(n)-4.3)/0.35),preentrenado:n=>0.50+0.32*lg((Math.log10(n)-3.8)/0.35)},
    train:{clasico:0,pequena:200,profunda:4000,preentrenado:300}}};
function projOutcome(p,a,n){const P=PROJ[p];return{acc:P.approach[a](n),cost:Math.round(n*P.label+P.train[a])}}

// ---------------------------------------------------------------- ej. 13 · bucle de entrenamiento con fallos
// tres nubes de puntos (3 clases)
function blobs3(n,seed){const r=rng(seed),g=gauss(r);const X=new Float64Array(2*n),Y=new Int8Array(n);
  for(let i=0;i<n;i++){const c=i%3,a=Math.PI/2+c*2*Math.PI/3;X[2*i]=1.3*Math.cos(a)+g()*0.42;X[2*i+1]=1.3*Math.sin(a)+g()*0.42;Y[i]=c}return{X,Y,n}}
// red 2-16-3 con ReLU, Adam y entropía cruzada (CrossEntropyLoss); cfg: zero (llama a zero_grad), order ("ok" o "step-first"),
// soft (softmax añadida al final del modelo), lr, epochs, batch
function loopTrain(cfg){const o=Object.assign({opt:"sgd",zero:true,order:"ok",soft:false,lr:0.01,epochs:30,batch:20,seed:3},cfg);
  const r=rng(o.seed),g=gauss(r);const H=16;const tr=blobs3(240,11),va=blobs3(150,29);
  const P={W1:Float64Array.from({length:2*H},()=>(r()*2-1)/Math.sqrt(2)),b1:Float64Array.from({length:H},()=>(r()*2-1)/Math.sqrt(2)),W2:Float64Array.from({length:H*3},()=>(r()*2-1)/Math.sqrt(H)),b2:Float64Array.from({length:3},()=>(r()*2-1)/Math.sqrt(H))};
  const K=Object.keys(P),Gr={},M={},V={};K.forEach(k=>{Gr[k]=null;M[k]=new Float64Array(P[k].length);V[k]=new Float64Array(P[k].length)});let t=0;
  function fwd(x0,x1){const h=new Float64Array(H);for(let j=0;j<H;j++){const s=P.W1[j*2]*x0+P.W1[j*2+1]*x1+P.b1[j];h[j]=s>0?s:0}
    const z=new Float64Array(3);for(let c=0;c<3;c++){let s=P.b2[c];for(let j=0;j<H;j++)s+=P.W2[c*H+j]*h[j];z[c]=s}
    let out=z;if(o.soft){const m=Math.max(...z);const e=z.map(v=>Math.exp(v-m));const S=e[0]+e[1]+e[2];out=e.map(v=>v/S)}
    const m=Math.max(...out);const e=out.map(v=>Math.exp(v-m));const S=e[0]+e[1]+e[2];return{h,z,out,p:e.map(v=>v/S)}}
  function backward(xs,ys){const add={};K.forEach(k=>add[k]=new Float64Array(P[k].length));let L=0;const n=ys.length;
    for(let q=0;q<n;q++){const x0=xs[2*q],x1=xs[2*q+1],y=ys[q];const f=fwd(x0,x1);L-=Math.log(Math.max(f.p[y],1e-12))/n;
      let dout=f.p.map((v,c)=>(v-(c===y?1:0))/n);let dz=dout;if(o.soft){const s=f.out;const dot=dout[0]*s[0]+dout[1]*s[1]+dout[2]*s[2];dz=s.map((v,c)=>v*(dout[c]-dot))}
      for(let c=0;c<3;c++){add.b2[c]+=dz[c];for(let j=0;j<H;j++)add.W2[c*H+j]+=dz[c]*f.h[j]}
      for(let j=0;j<H;j++){if(f.h[j]<=0)continue;let dh=0;for(let c=0;c<3;c++)dh+=P.W2[c*H+j]*dz[c];add.b1[j]+=dh;add.W1[j*2]+=dh*x0;add.W1[j*2+1]+=dh*x1}}
    K.forEach(k=>{if(Gr[k]===null)Gr[k]=add[k];else for(let i=0;i<add[k].length;i++)Gr[k][i]+=add[k][i]});return L}
  function step(){if(o.opt==="sgd"){K.forEach(k=>{const G2=Gr[k];if(G2===null)return;const p=P[k];for(let i=0;i<p.length;i++)p[i]-=o.lr*G2[i]});return}t++;const b1=.9,b2=.999,c1=1-b1**t,c2=1-b2**t;K.forEach(k=>{const G2=Gr[k];if(G2===null)return;const p=P[k],m=M[k],v=V[k];for(let i=0;i<p.length;i++){m[i]=b1*m[i]+(1-b1)*G2[i];v[i]=b2*v[i]+(1-b2)*G2[i]*G2[i];p[i]-=o.lr*(m[i]/c1)/(Math.sqrt(v[i]/c2)+1e-8)}})}
  function evalSet(D){let L=0,ok=0;for(let q=0;q<D.n;q++){const f=fwd(D.X[2*q],D.X[2*q+1]);L-=Math.log(Math.max(f.p[D.Y[q]],1e-12));if(f.p.indexOf(Math.max(...f.p))===D.Y[q])ok++}return{loss:L/D.n,acc:ok/D.n}}
  const idx=Array.from({length:tr.n},(_,i)=>i),hist=[];let diverged=false;
  for(let e=0;e<o.epochs;e++){for(let i=idx.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[idx[i],idx[j]]=[idx[j],idx[i]]}
    for(let s=0;s<idx.length;s+=o.batch){const b=idx.slice(s,s+o.batch);const xs=new Float64Array(2*b.length),ys=b.map(i=>tr.Y[i]);b.forEach((i,q)=>{xs[2*q]=tr.X[2*i];xs[2*q+1]=tr.X[2*i+1]});
      if(o.zero)K.forEach(k=>Gr[k]=null);
      if(o.order==="step-first"){step();backward(xs,ys)}else{backward(xs,ys);step()}}
    const ev=evalSet(va);if(!isFinite(ev.loss)){diverged=true;ev.loss=9}hist.push(ev.loss)}
  const fin=evalSet(va);return{hist,loss:isFinite(fin.loss)?fin.loss:9,acc:fin.acc,diverged,prob:(x0,x1)=>fwd(x0,x1).p,val:va,train:tr}}

const api={rng,gauss,sig,ACT,MLP,xorData,moons,CURVE,CX,fitKnots,J1,dJ1,descend1,RAV,ravJ,ravG,optimize,reached,gradProfile,FEATS,zscore,strat5,knn2,PROJ,projOutcome,blobs3,loopTrain};
if(typeof module!=="undefined")module.exports=api;else G.EJCore=api;
})(typeof window!=="undefined"?window:globalThis);
