'use client';
import { useActionState } from 'react';
import { loginAction, type LoginState } from '@/app/admin/actions';
const initial:LoginState={error:null};
export function LoginForm(){const[state,action,pending]=useActionState(loginAction,initial);return <form action={action} className="admin-form"><label>Email<input name="email" type="email" autoComplete="username" required /></label><label>Password<input name="password" type="password" autoComplete="current-password" required /></label>{state.error&&<p role="alert">{state.error}</p>}<button className="button" disabled={pending}>{pending?'Signing in…':'Sign in'}</button></form>}
