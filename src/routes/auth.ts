import { Hono } from 'hono';
import type { Bindings } from '../types';
import { 
  hashPassword, 
  verifyPassword, 
  createSession, 
  deleteSession, 
  getUserByEmail,
  getSessionIdFromCookie,
  getSession,
  getUserById
} from '../utils/auth';

const auth = new Hono<{ Bindings: Bindings }>();

// Login
auth.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: 'Email et mot de passe requis' }, 400);
    }
    
    const user = await getUserByEmail(c, email);
    
    if (!user) {
      return c.json({ error: 'Email ou mot de passe incorrect' }, 401);
    }
    
    const isValid = await verifyPassword(password, user.password);
    
    if (!isValid) {
      return c.json({ error: 'Email ou mot de passe incorrect' }, 401);
    }
    
    const sessionId = await createSession(c, user.id);
    
    // Détecter si on est en HTTPS ou HTTP
    const protocol = c.req.header('x-forwarded-proto') || 'http';
    const isSecure = protocol === 'https';
    const secureFlag = isSecure ? 'Secure; ' : '';
    
    return c.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      session_id: sessionId
    }, 200, {
      'Set-Cookie': `session_id=${sessionId}; HttpOnly; ${secureFlag}SameSite=Lax; Max-Age=${24 * 60 * 60}; Path=/`
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Erreur lors de la connexion' }, 500);
  }
});

// Logout
auth.post('/logout', async (c) => {
  try {
    const sessionId = getSessionIdFromCookie(c);
    
    if (sessionId) {
      await deleteSession(c, sessionId);
    }
    
    const protocol = c.req.header('x-forwarded-proto') || 'http';
    const isSecure = protocol === 'https';
    const secureFlag = isSecure ? 'Secure; ' : '';
    
    return c.json({ success: true }, 200, {
      'Set-Cookie': `session_id=; HttpOnly; ${secureFlag}SameSite=Lax; Max-Age=0; Path=/`
    });
  } catch (error) {
    console.error('Logout error:', error);
    return c.json({ error: 'Erreur lors de la déconnexion' }, 500);
  }
});

// Check session
auth.get('/check', async (c) => {
  try {
    const sessionId = getSessionIdFromCookie(c);
    
    if (!sessionId) {
      return c.json({ authenticated: false }, 200);
    }
    
    const session = await getSession(c, sessionId);
    
    if (!session) {
      return c.json({ authenticated: false }, 200);
    }
    
    const user = await getUserById(c, session.user_id);
    
    if (!user) {
      return c.json({ authenticated: false }, 200);
    }
    
    return c.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Check session error:', error);
    return c.json({ authenticated: false }, 200);
  }
});

// Register (protected - only admins can create users)
auth.post('/register', async (c) => {
  try {
    const { email, password, name, role } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: 'Email, mot de passe et nom requis' }, 400);
    }
    
    // Check if user already exists
    const existingUser = await getUserByEmail(c, email);
    
    if (existingUser) {
      return c.json({ error: 'Cet email est déjà utilisé' }, 400);
    }
    
    const hashedPassword = await hashPassword(password);
    
    const result = await c.env.DB.prepare(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)'
    ).bind(email, hashedPassword, name, role || 'admin').run();
    
    return c.json({
      success: true,
      user: {
        id: result.meta.last_row_id,
        email,
        name,
        role: role || 'admin'
      }
    }, 201);
  } catch (error) {
    console.error('Register error:', error);
    return c.json({ error: 'Erreur lors de la création du compte' }, 500);
  }
});

export default auth;
