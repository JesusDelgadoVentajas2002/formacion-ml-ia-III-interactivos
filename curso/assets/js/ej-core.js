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

const api={rng,gauss,sig,ACT,MLP,xorData,moons,CURVE,CX,fitKnots,J1,dJ1,descend1,RAV,ravJ,ravG,optimize,reached,gradProfile};
if(typeof module!=="undefined")module.exports=api;else G.EJCore=api;
})(typeof window!=="undefined"?window:globalThis);
