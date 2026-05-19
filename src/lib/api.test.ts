/**
 * Tests for the API client module
 * Tests auth flows, progress persistence, analytics, and offline fallbacks
 */

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Import after mocks
import { signup, login, logout, getUser, isAuthenticated, saveProgress, getProgress, getAnalytics, createLesson } from '@/lib/api';

function mockSuccessResponse(data: any) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => data,
  });
}

function mockErrorResponse(status: number, error: string) {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status,
    json: async () => ({ error }),
  });
}

function mockNetworkError() {
  mockFetch.mockRejectedValueOnce(new Error('Network error'));
}

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

// ==================== AUTH ====================
describe('Auth — signup', () => {
  test('should call /api/auth/signup with correct payload', async () => {
    mockSuccessResponse({ message: 'Usuario creado', userId: 'user_123' });

    const result = await signup('test@test.com', 'pass123', 'Juan Pérez');

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/auth/signup',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'test@test.com', password: 'pass123', name: 'Juan Pérez' }),
      })
    );
    expect(result.userId).toBe('user_123');
  });

  test('should throw on API error', async () => {
    mockErrorResponse(409, 'Email ya registrado');
    await expect(signup('dup@test.com', 'pass', 'Test')).rejects.toThrow('Email ya registrado');
  });
});

describe('Auth — login', () => {
  test('should store token and user in localStorage on success', async () => {
    const mockUser = { userId: 'u1', name: 'Juan', email: 'j@test.com' };
    mockSuccessResponse({ token: 'jwt-token-123', refreshToken: 'refresh-xyz', user: mockUser });

    await login('j@test.com', 'pass123');

    expect(localStorage.getItem('ss_token')).toBe('jwt-token-123');
    expect(JSON.parse(localStorage.getItem('ss_user')!)).toEqual(mockUser);
  });
});

describe('Auth — logout', () => {
  test('should remove token and user from localStorage', () => {
    localStorage.setItem('ss_token', 'some-token');
    localStorage.setItem('ss_user', '{}');
    
    logout();
    
    expect(localStorage.getItem('ss_token')).toBeNull();
    expect(localStorage.getItem('ss_user')).toBeNull();
  });
});

describe('Auth — getUser', () => {
  test('should return parsed user from localStorage', () => {
    const user = { name: 'Test', email: 'test@test.com' };
    localStorage.setItem('ss_user', JSON.stringify(user));
    expect(getUser()).toEqual(user);
  });

  test('should return null when no user stored', () => {
    expect(getUser()).toBeNull();
  });
});

describe('Auth — isAuthenticated', () => {
  test('should return true when token exists', () => {
    localStorage.setItem('ss_token', 'some-token');
    expect(isAuthenticated()).toBe(true);
  });

  test('should return false when no token', () => {
    expect(isAuthenticated()).toBe(false);
  });
});

// ==================== PROGRESS ====================
describe('Progress — saveProgress', () => {
  test('should POST to /api/progress on success', async () => {
    mockSuccessResponse({ message: 'Progreso guardado' });

    await saveProgress('user1', 'lesson-1-1', '1', 85);

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/progress',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ userId: 'user1', lessonId: 'lesson-1-1', moduleId: '1', score: 85 }),
      })
    );
  });

  test('should fallback to localStorage when API fails', async () => {
    mockNetworkError();

    const result = await saveProgress('user1', 'lesson-1-1', '1', 90);

    expect(result.message).toContain('offline');
  });
});

describe('Progress — getProgress', () => {
  test('should return progress array on success', async () => {
    const mockProgress = [{ lessonId: '1-1', completed: true }];
    mockSuccessResponse({ progress: mockProgress });

    const result = await getProgress('user1');
    expect(result.progress).toEqual(mockProgress);
  });

  test('should return empty progress on API failure', async () => {
    mockNetworkError();
    const result = await getProgress('user1');
    expect(result.progress).toEqual([]);
  });
});

// ==================== ANALYTICS ====================
describe('Analytics — getAnalytics', () => {
  test('should return analytics data on success', async () => {
    const mockData = { totalUsers: 24, avgAccuracy: 81, teamStats: [] };
    mockSuccessResponse(mockData);

    const result = await getAnalytics();
    expect(result.totalUsers).toBe(24);
  });

  test('should return zeroed fallback data on API failure', async () => {
    mockNetworkError();

    const result = await getAnalytics();
    expect(result.totalUsers).toBe(0);
    expect(result.avgAccuracy).toBe(0);
    expect(result.teamStats).toEqual([]);
  });
});

// ==================== LESSONS ====================
describe('Lessons — createLesson', () => {
  test('should POST to /api/lessons with full payload', async () => {
    mockSuccessResponse({ message: 'Lección creada', lessonId: '1-new' });

    await createLesson({
      moduleId: '1',
      moduleTitle: 'Hospitalidad',
      moduleSubtitle: 'Bienvenida',
      phrase_pt: 'Olá, como vai?',
      phrase_es: 'Hola, ¿cómo estás?',
      context: 'Saludo informal.',
    });

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/lessons',
      expect.objectContaining({ method: 'POST' })
    );
  });
});
