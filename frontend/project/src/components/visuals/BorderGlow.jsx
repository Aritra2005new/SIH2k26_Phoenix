import { useRef, useCallback, useEffect } from 'react';
import './BorderGlow.css';

function parseHSL(value) {
  const match = value.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}
function buildGlowVars(glowColor, intensity) {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const values = [100,60,50,40,30,20,10]; const keys = ['', '-60','-50','-40','-30','-20','-10'];
  return Object.fromEntries(values.map((v,i)=>[`--glow-color${keys[i]}`,`hsl(${base} / ${Math.min(v*intensity,100)}%)`]));
}
const positions=['80% 55%','69% 34%','8% 6%','41% 38%','86% 85%','82% 18%','51% 4%'];
const keys=['--gradient-one','--gradient-two','--gradient-three','--gradient-four','--gradient-five','--gradient-six','--gradient-seven'];
const map=[0,1,2,0,1,2,1];
function buildGradientVars(colors){
  const vars={};
  for(let i=0;i<7;i++){const c=colors[Math.min(map[i],colors.length-1)];vars[keys[i]]=`radial-gradient(at ${positions[i]}, ${c} 0px, transparent 50%)`;}
  vars['--gradient-base']=`linear-gradient(${colors[0]} 0 100%)`;
  return vars;
}
const easeOut=x=>1-Math.pow(1-x,3); const easeIn=x=>x*x*x;
function animateValue({start=0,end=100,duration=1000,delay=0,ease=easeOut,onUpdate,onEnd}){
  const t0=performance.now()+delay;
  function tick(){const elapsed=performance.now()-t0;const t=Math.min(Math.max(elapsed/duration,0),1);onUpdate(start+(end-start)*ease(t));if(t<1)requestAnimationFrame(tick);else onEnd?.();}
  setTimeout(()=>requestAnimationFrame(tick),delay);
}

export default function BorderGlow({children,className='',edgeSensitivity=30,glowColor='40 80 80',backgroundColor='#120F17',borderRadius=28,glowRadius=40,glowIntensity=1,coneSpread=25,animated=false,colors=['#c084fc','#f472b6','#38bdf8'],fillOpacity=.5}){
  const cardRef=useRef(null);
  const center=useCallback(el=>{const {width,height}=el.getBoundingClientRect();return [width/2,height/2];},[]);
  const proximity=useCallback((el,x,y)=>{const [cx,cy]=center(el);const dx=x-cx,dy=y-cy;const kx=dx?cx/Math.abs(dx):Infinity,ky=dy?cy/Math.abs(dy):Infinity;return Math.min(Math.max(1/Math.min(kx,ky),0),1);},[center]);
  const angle=useCallback((el,x,y)=>{const [cx,cy]=center(el);const radians=Math.atan2(y-cy,x-cx);let deg=radians*180/Math.PI+90;if(deg<0)deg+=360;return deg;},[center]);
  const handleMove=useCallback(e=>{const card=cardRef.current;if(!card)return;const r=card.getBoundingClientRect();const x=e.clientX-r.left,y=e.clientY-r.top;card.style.setProperty('--edge-proximity',(proximity(card,x,y)*100).toFixed(3));card.style.setProperty('--cursor-angle',`${angle(card,x,y).toFixed(3)}deg`);},[proximity,angle]);
  useEffect(()=>{if(!animated||!cardRef.current)return;const card=cardRef.current;card.classList.add('sweep-active');const a0=110,a1=465;animateValue({duration:500,onUpdate:v=>card.style.setProperty('--edge-proximity',v)});animateValue({ease:easeIn,duration:1500,end:50,onUpdate:v=>card.style.setProperty('--cursor-angle',`${(a1-a0)*(v/100)+a0}deg`)});animateValue({ease:easeOut,delay:1500,duration:2250,start:50,end:100,onUpdate:v=>card.style.setProperty('--cursor-angle',`${(a1-a0)*(v/100)+a0}deg`)});animateValue({ease:easeIn,delay:2500,duration:1500,start:100,end:0,onUpdate:v=>card.style.setProperty('--edge-proximity',v),onEnd:()=>card.classList.remove('sweep-active')});},[animated]);
  return <div ref={cardRef} onPointerMove={handleMove} className={`border-glow-card ${className}`} style={{'--card-bg':backgroundColor,'--edge-sensitivity':edgeSensitivity,'--border-radius':`${borderRadius}px`,'--glow-padding':`${glowRadius}px`,'--cone-spread':coneSpread,'--fill-opacity':fillOpacity,...buildGlowVars(glowColor,glowIntensity),...buildGradientVars(colors)}}><span className="edge-light"/><div className="border-glow-inner">{children}</div></div>;
}
