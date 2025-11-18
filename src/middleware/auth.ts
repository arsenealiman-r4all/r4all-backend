import { Context, Next } from 'hono';
import type { Bindings } from '../types';
import { getSession, getUserById, getSessionIdFromCookie } from '../utils/auth';

export async function authMiddleware(c: Context<{ Bindings: Bindings }>, next: Next) {
  const sessionId = getSessionIdFromCookie(c);
  
  if (!sessionId) {
    return c.json({ error: 'Non authentifié' }, 401);
  }
  
  const session = await getSession(c, sessionId);
  
  if (!session) {
    return c.json({ error: 'Session invalide ou expirée' }, 401);
  }
  
  const user = await getUserById(c, session.user_id);
  
  if (!user) {
    return c.json({ error: 'Utilisateur non trouvé' }, 401);
  }
  
  // Store user in context
  c.set('user', user);
  
  await next();
}
