'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';

export function RichTextEditor({ initial, onChange }: { initial?: object; onChange(value: object): void }) {
  const editor = useEditor({ extensions:[StarterKit.configure({heading:{levels:[2,3,4]}}),Link.configure({openOnClick:false,protocols:['http','https','mailto','tel']}),Image.configure({allowBase64:false})],content:initial??{type:'doc',content:[{type:'paragraph'}]},immediatelyRender:false,onUpdate:({editor})=>onChange(editor.getJSON()) });
  const editLink = () => { const href = window.prompt('Link URL', editor?.getAttributes('link').href ?? 'https://'); if (href === null) return; if (!href.trim()) editor?.chain().focus().unsetLink().run(); else editor?.chain().focus().extendMarkRange('link').setLink({ href }).run(); };
  const addImage = () => { const src = window.prompt('Image URL'); if (!src) return; const alt = window.prompt('Image alt text'); if (!alt?.trim()) return; editor?.chain().focus().setImage({ src, alt }).run(); };
  return <div className="editor"><div className="editor__tools" role="toolbar" aria-label="Text formatting"><button type="button" onClick={()=>editor?.chain().focus().toggleBold().run()}>Bold</button><button type="button" onClick={()=>editor?.chain().focus().toggleBulletList().run()}>Bulleted list</button><button type="button" onClick={()=>editor?.chain().focus().toggleOrderedList().run()}>Numbered list</button><button type="button" onClick={()=>editor?.chain().focus().toggleBlockquote().run()}>Quote</button><button type="button" onClick={()=>editor?.chain().focus().toggleHeading({level:2}).run()}>Heading</button><button type="button" onClick={editLink}>Link</button><button type="button" onClick={addImage}>Inline image</button></div><EditorContent editor={editor}/></div>;
}
