import Link from 'next/link';
export function BlogCard({post}:{post:any}){return <article className="content-card"><p className="eyebrow">{post.category}</p><h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2><p>{post.excerpt}</p><Link href={`/blog/${post.slug}`}>Read article →</Link></article>}
