import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { publicSupabaseEnv } from './env';
import type { Database } from '@/types/database';

export async function updateSession(request: NextRequest) {
  const protectedAdmin = request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login';
  let response = NextResponse.next({ request });
  let environment;
  try { environment = publicSupabaseEnv(); } catch {
    if (protectedAdmin) { const login=request.nextUrl.clone(); login.pathname='/admin/login'; return NextResponse.redirect(login); }
    return response;
  }
  const { url, anonKey } = environment;
  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (items) => {
        items.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        items.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (protectedAdmin && !user) {
    const login = request.nextUrl.clone();
    login.pathname = '/admin/login';
    login.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  return response;
}
