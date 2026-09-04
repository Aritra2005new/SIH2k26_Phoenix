import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import './GradientWaves.css';

const hexToRgb = hex => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? [parseInt(m[1],16)/255, parseInt(m[2],16)/255, parseInt(m[3],16)/255] : [1,1,1];
};
const vertex = `#version 300 es\nin vec2 position;\nvoid main(){gl_Position=vec4(position,0.0,1.0);}`;
const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution; uniform float iTime; uniform float uSpeed; uniform float uAmplitude;
uniform float uWaveScale; uniform float uWaveRatio; uniform float uSwell; uniform float uTurbulence;
uniform float uBrightness; uniform float uOpacity; uniform vec2 uMouse; uniform vec3 uHorizonColor;
uniform vec3 uWaveColor; uniform vec3 uCrestColor; out vec4 fragColor;
float hash21(vec2 p){vec3 p3=fract(vec3(p.xyx)*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}
float field(vec2 p,float t){float a=sin(p.x*uWaveScale+t*uSpeed)*uAmplitude;float b=sin(p.y*uWaveScale*uWaveRatio-t*uSpeed*.7)*uAmplitude;float c=sin((p.x+p.y)*.75+t*.55)*uSwell*.025;float d=cos((p.x-p.y)*.5-t*.4)*uTurbulence*.018;return a+b+c+d;}
void main(){vec2 uv=gl_FragCoord.xy/iResolution.xy;vec2 p=(uv-.5);p.x*=iResolution.x/iResolution.y;p+= (uMouse-.5)*.16;float t=iTime;float f=field(p*3.2,t);float glow=exp(-abs(f)*.42);vec3 col=mix(uHorizonColor,uWaveColor,clamp(.5+.5*sin(f*.45+t*.25),0.,1.));col=mix(col,uCrestColor,glow*.48);col*=uBrightness;float grain=(hash21(gl_FragCoord.xy+mod(iTime,64.)*11.)-.5)*.025;col+=grain;float alpha=clamp(.34+glow*.62,0.,1.)*uOpacity;fragColor=vec4(col*alpha,alpha);}`;

export default function GradientWaves({ horizonColor='#12051f', waveColor='#7c3aed', crestColor='#f5d0fe', speed=.35, amplitude=1.8, waveScale=.7, waveRatio=1.1, swell=30, turbulence=18, brightness=.72, opacity=.72, className='' }) {
  const ref=useRef(null); const mouse=useRef([.5,.5]); const target=useRef([.5,.5]);
  useEffect(()=>{
    const el=ref.current; if(!el) return;
    let renderer, gl, mesh, program, raf=0;
    try {
      renderer=new Renderer({webgl:2,alpha:true,premultipliedAlpha:true,antialias:false,dpr:Math.min(devicePixelRatio||1,2)});
      gl=renderer.gl; gl.clearColor(0,0,0,0); el.appendChild(gl.canvas);
      program=new Program(gl,{vertex,fragment,uniforms:{iTime:{value:0},iResolution:{value:new Float32Array([1,1])},uSpeed:{value:speed},uAmplitude:{value:amplitude},uWaveScale:{value:waveScale},uWaveRatio:{value:waveRatio},uSwell:{value:swell},uTurbulence:{value:turbulence},uBrightness:{value:brightness},uOpacity:{value:opacity},uMouse:{value:new Float32Array([.5,.5])},uHorizonColor:{value:new Float32Array(hexToRgb(horizonColor))},uWaveColor:{value:new Float32Array(hexToRgb(waveColor))},uCrestColor:{value:new Float32Array(hexToRgb(crestColor))}}});
      mesh=new Mesh(gl,{geometry:new Triangle(gl),program});
      const resize=()=>{const r=el.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height));program.uniforms.iResolution.value[0]=gl.drawingBufferWidth;program.uniforms.iResolution.value[1]=gl.drawingBufferHeight;};
      const move=e=>{const r=el.getBoundingClientRect();target.current=[(e.clientX-r.left)/r.width,1-(e.clientY-r.top)/r.height];};
      const leave=()=>{target.current=[.5,.5];};
      const ro=new ResizeObserver(resize); ro.observe(el); resize(); el.addEventListener('pointermove',move); el.addEventListener('pointerleave',leave);
      const start=performance.now(); const loop=t=>{program.uniforms.iTime.value=(t-start)/1000;mouse.current[0]+=(target.current[0]-mouse.current[0])*.035;mouse.current[1]+=(target.current[1]-mouse.current[1])*.035;program.uniforms.uMouse.value.set(mouse.current);renderer.render({scene:mesh});raf=requestAnimationFrame(loop);}; raf=requestAnimationFrame(loop);
      return()=>{cancelAnimationFrame(raf);ro.disconnect();el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave);if(gl)gl.getExtension('WEBGL_lose_context')?.loseContext();if(gl?.canvas?.parentNode===el)el.removeChild(gl.canvas);};
    } catch { return undefined; }
  },[amplitude,brightness,crestColor,horizonColor,opacity,speed,swell,turbulence,waveColor,waveRatio,waveScale]);
  return <div ref={ref} className={`gradient-waves-container ${className}`.trim()} aria-hidden="true"/>;
}
