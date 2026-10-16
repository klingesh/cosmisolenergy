import { describe, expect, it } from 'vitest';
import { blogInputSchema } from '@/lib/content/blog-schema';
const valid={title:'Choosing rooftop solar',slug:'choosing-rooftop-solar',excerpt:'A practical guide for homeowners.',coverImageUrl:'/images/cover.webp',coverImageAlt:'Solar panels on a home',body:{type:'doc',content:[{type:'paragraph',content:[{type:'text',text:'Start with your bill.'}]}]},category:'Residential',authorName:'Cosmisol',status:'draft',featured:false,seoTitle:null,seoDescription:null,socialImageUrl:null};
describe('blogInputSchema',()=>{
  it('accepts valid structured article input',()=>expect(blogInputSchema.parse(valid).slug).toBe(valid.slug));
  it.each(['','Unsafe Slug','../escape'])('rejects unsafe slug %s',(slug)=>expect(()=>blogInputSchema.parse({...valid,slug})).toThrow());
  it('requires cover alt text',()=>expect(()=>blogInputSchema.parse({...valid,coverImageAlt:''})).toThrow(/alt/i));
  it('limits metadata lengths',()=>expect(()=>blogInputSchema.parse({...valid,seoDescription:'x'.repeat(161)})).toThrow());
});

