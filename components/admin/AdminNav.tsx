import Link from 'next/link';
import { logoutAction } from '@/app/admin/actions';
export function AdminNav(){return <nav className="admin-nav" aria-label="Administration"><Link href="/admin">Dashboard</Link><Link href="/admin/blog">Blog</Link><Link href="/admin/projects">Projects</Link><Link href="/admin/testimonials">Testimonials</Link><form action={logoutAction}><button type="submit">Sign out</button></form></nav>}
