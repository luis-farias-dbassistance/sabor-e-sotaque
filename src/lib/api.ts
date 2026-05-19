// API client for Sabor & Sotaque backend
// Falls back to localStorage when API is unavailable

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

async function request(path: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('ss_token') : null;
  
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// ============= AUTH =============

export async function signup(email: string, password: string, name: string) {
  return request('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
}

export async function login(email: string, password: string) {
  const data = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (typeof window !== 'undefined') {
    localStorage.setItem('ss_token', data.token);
    localStorage.setItem('ss_user', JSON.stringify(data.user));
  }

  return data;
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('ss_token');
    localStorage.removeItem('ss_user');
  }
}

export function getUser() {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('ss_user');
  return stored ? JSON.parse(stored) : null;
}

export function isAuthenticated() {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('ss_token');
}

// ============= PROGRESS =============

export async function saveProgress(userId: string, lessonId: string, moduleId: string, score: number) {
  try {
    return await request('/api/progress', {
      method: 'POST',
      body: JSON.stringify({ userId, lessonId, moduleId, score }),
    });
  } catch {
    // Fallback: save locally if API unavailable
    const key = `module_${moduleId}_progress`;
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    if (!saved.includes(lessonId)) {
      saved.push(lessonId);
      localStorage.setItem(key, JSON.stringify(saved));
    }
    return { message: 'Guardado localmente (offline)' };
  }
}

export async function getProgress(userId: string) {
  try {
    return await request(`/api/progress/${userId}`);
  } catch {
    return { progress: [] };
  }
}

// ============= ANALYTICS =============

export async function getAnalytics() {
  try {
    return await request('/api/analytics');
  } catch {
    // Return simulated data as fallback
    return {
      totalUsers: 0,
      completedToday: 0,
      avgAccuracy: 0,
      retentionRate: 0,
      teamStats: [],
      moduleProgress: {},
    };
  }
}

// ============= LESSONS =============

export async function createLesson(data: {
  moduleId: string;
  moduleTitle: string;
  moduleSubtitle: string;
  phrase_pt: string;
  phrase_es: string;
  context: string;
  imageUrl?: string;
}) {
  return request('/api/lessons', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
