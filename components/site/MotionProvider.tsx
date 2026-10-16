'use client';
import { useEffect } from 'react';
export function MotionProvider(){useEffect(()=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;let cancelled=false;import('animejs').then(({animate,stagger})=>{if(cancelled)return;animate('.reveal',{opacity:[0,1],translateY:[22,0],delay:stagger(70),duration:650,ease:'out(3)'})});return()=>{cancelled=true}},[]);return null}
