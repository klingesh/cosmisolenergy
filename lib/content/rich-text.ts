export type RichNode={type:string;text?:string;attrs?:Record<string,unknown>;marks?:Array<{type:string;attrs?:Record<string,unknown>}>;content?:RichNode[]};
const nodes=new Set(['doc','paragraph','heading','bulletList','orderedList','listItem','blockquote','image','hardBreak','text']);
const marks=new Set(['bold','italic','link']);
function visit(node:RichNode){if(!nodes.has(node.type))throw new Error(`Unsupported rich-text node: ${node.type}`);if(node.type==='heading'&&![2,3,4].includes(Number(node.attrs?.level)))throw new Error('Unsupported heading level');if(node.type==='image'){const src=String(node.attrs?.src??'');const alt=String(node.attrs?.alt??'');if(!src||!alt)throw new Error('Images require a source and alt text')}for(const mark of node.marks??[]){if(!marks.has(mark.type))throw new Error(`Unsupported rich-text mark: ${mark.type}`);if(mark.type==='link'){const href=String(mark.attrs?.href??'');if(!/^(https?:\/\/|\/|mailto:|tel:)/i.test(href))throw new Error('Link uses an unsafe protocol')}}for(const child of node.content??[])visit(child)}
export function sanitizeRichText(input:unknown):RichNode{if(!input||typeof input!=='object')throw new Error('Rich text must be a document');const doc=structuredClone(input) as RichNode;if(doc.type!=='doc')throw new Error('Rich text must start with a document');visit(doc);return doc}

export function hasMeaningfulRichText(input: unknown): input is RichNode {
  if (!input || typeof input !== 'object') return false;
  const node = input as RichNode;
  if (node.type === 'text' && Boolean(node.text?.trim())) return true;
  if (node.type === 'image' && Boolean(String(node.attrs?.src ?? '').trim())) return true;
  return Array.isArray(node.content) && node.content.some(hasMeaningfulRichText);
}
