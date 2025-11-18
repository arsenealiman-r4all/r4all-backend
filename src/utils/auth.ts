import type { Context } from 'hono';
import type { Bindings, User, Session } from '../types';

// Simple hash function for demo (in production, use proper bcrypt)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

export function generateSessionId(): string {
  return crypto.randomUUID();
}

export async function createSession(c: Context<{ Bindings: Bindings }>, userId: number): Promise<string> {
  const sessionId = generateSessionId();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  await c.env.DB.prepare(
    'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)'
  ).bind(sessionId, userId, expiresAt.toISOString()).run();
  
  return sessionId;
}

export async function getSession(c: Context<{ Bindings: Bindings }>, sessionId: string): Promise<Session | null> {
  const result = await c.env.DB.prepare(
    'SELECT * FROM sessions WHERE id = ? AND expires_at > datetime("now")'
  ).bind(sessionId).first<Session>();
  
  return result;
}

export async function deleteSession(c: Context<{ Bindings: Bindings }>, sessionId: string): Promise<void> {
  await c.env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
}

export async function getUserById(c: Context<{ Bindings: Bindings }>, userId: number): Promise<User | null> {
  const result = await c.env.DB.prepare(
    'SELECT id, email, name, role, created_at FROM users WHERE id = ?'
  ).bind(userId).first<User>();
  
  return result;
}

export async function getUserByEmail(c: Context<{ Bindings: Bindings }>, email: string): Promise<any> {
  const result = await c.env.DB.prepare(
    'SELECT * FROM users WHERE email = ?'
  ).bind(email).first();
  
  return result;
}

export function getSessionIdFromCookie(c: Context): string | null {
  const cookie = c.req.header('Cookie');
  if (!cookie) return null;
  
  const match = cookie.match(/session_id=([^;]+)/);
  return match ? match[1] : null;
}
