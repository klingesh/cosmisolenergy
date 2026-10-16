'use client';
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createTestimonial, deleteTestimonial, updateTestimonial } from '@/lib/content/testimonial-actions';
import { MediaUploader } from './MediaUploader';
import { useUnsavedChanges } from './useUnsavedChanges';
const blank={customerName:'',attribution:'',quote:'',photoUrl:null,photoAlt:null,projectId:null,featured:false,displayOrder:0,consentConfirmed:false,status:'draft'};

export function TestimonialEditor({testimonial}:{testimonial?:any}){
  const router=useRouter();const[v,setV]=useState(testimonial??blank);const[msg,setMsg]=useState('');const[dirty,setDirty]=useState(false);
  const change=(next:any)=>{setV(next);setDirty(true)};useUnsavedChanges(dirty);
  async function submit(event:FormEvent){event.preventDefault();try{const saved=testimonial?.id?await updateTestimonial(testimonial.id,v):await createTestimonial(v);if(!saved.ok){setMsg(saved.error);return}setDirty(false);setMsg('Saved.');if(!testimonial?.id)router.replace(`/admin/testimonials/${saved.id}`)}catch(error){setMsg(error instanceof Error?error.message:'Unable to save.')}}
  async function remove(){if(testimonial?.id&&confirm('Delete this testimonial permanently?')){await deleteTestimonial(testimonial.id,true);router.push('/admin/testimonials')}}
  return <form className="content-editor" onSubmit={submit}><label>Customer display name<input required minLength={2} value={v.customerName} onChange={e=>change({...v,customerName:e.target.value})}/></label><label>Role, company or property type<input value={v.attribution??''} onChange={e=>change({...v,attribution:e.target.value})}/></label><label>Testimonial quote<textarea required minLength={20} value={v.quote} onChange={e=>change({...v,quote:e.target.value})}/></label><label>Customer photo URL<input value={v.photoUrl??''} onChange={e=>change({...v,photoUrl:e.target.value||null})}/><MediaUploader path="testimonials" onUploaded={url=>change({...v,photoUrl:url})}/></label><label>Photo alt text<input value={v.photoAlt??''} onChange={e=>change({...v,photoAlt:e.target.value||null})}/></label><label>Display order<input type="number" min="0" value={v.displayOrder} onChange={e=>change({...v,displayOrder:Number(e.target.value)})}/></label><label><input type="checkbox" checked={v.featured} onChange={e=>change({...v,featured:e.target.checked})}/> Featured</label><label><input type="checkbox" checked={v.consentConfirmed} onChange={e=>change({...v,consentConfirmed:e.target.checked})}/> Customer consent confirmed</label><label>Status<select value={v.status} onChange={e=>change({...v,status:e.target.value})}><option value="draft">Draft</option><option value="published">Published</option></select></label><div className="editor-actions"><button className="button">Save testimonial</button>{testimonial?.id&&<><Link href={`/admin/testimonials/${testimonial.id}/preview`} target="_blank">Preview</Link><button type="button" onClick={remove}>Delete</button></>}</div><p aria-live="polite">{msg}</p></form>;
}
