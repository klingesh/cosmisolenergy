import {requireAdmin} from '@/lib/auth/require-admin';import {AdminNav} from '@/components/admin/AdminNav';import {BlogEditor} from '@/components/admin/BlogEditor';
export default async function NewBlogPage(){await requireAdmin();return <><AdminNav/><section><p className="eyebrow">New article</p><h1>Create a blog post</h1><BlogEditor/></section></>}
