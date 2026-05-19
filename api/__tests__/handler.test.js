/**
 * Tests for Lambda API handler
 * Mocks DynamoDB and Cognito SDK calls
 */

// ==================== MOCKS ====================
const mockSend = jest.fn();
jest.mock('@aws-sdk/client-dynamodb', () => ({
  DynamoDBClient: jest.fn().mockImplementation(() => ({})),
}));
jest.mock('@aws-sdk/lib-dynamodb', () => ({
  DynamoDBDocumentClient: { from: jest.fn(() => ({ send: mockSend })) },
  GetCommand: jest.fn().mockImplementation((params) => ({ ...params, _type: 'Get' })),
  PutCommand: jest.fn().mockImplementation((params) => ({ ...params, _type: 'Put' })),
  UpdateCommand: jest.fn().mockImplementation((params) => ({ ...params, _type: 'Update' })),
  QueryCommand: jest.fn().mockImplementation((params) => ({ ...params, _type: 'Query' })),
  ScanCommand: jest.fn().mockImplementation((params) => ({ ...params, _type: 'Scan' })),
  BatchWriteCommand: jest.fn(),
}));

const mockCognitoSend = jest.fn();
jest.mock('@aws-sdk/client-cognito-identity-provider', () => ({
  CognitoIdentityProviderClient: jest.fn().mockImplementation(() => ({ send: mockCognitoSend })),
  InitiateAuthCommand: jest.fn().mockImplementation((p) => ({ ...p, _cmd: 'InitiateAuth' })),
  SignUpCommand: jest.fn().mockImplementation((p) => ({ ...p, _cmd: 'SignUp' })),
  ConfirmSignUpCommand: jest.fn(),
  AdminConfirmSignUpCommand: jest.fn().mockImplementation((p) => ({ ...p, _cmd: 'AdminConfirm' })),
  ListUsersCommand: jest.fn(),
}));

// Set env vars before importing
process.env.USERS_TABLE = 'SaborSotaque-Users';
process.env.PROGRESS_TABLE = 'SaborSotaque-Progress';
process.env.LESSONS_TABLE = 'SaborSotaque-Lessons';
process.env.USER_POOL_ID = 'us-east-1_TestPool';
process.env.CLIENT_ID = 'test-client-id';
process.env.CORS_ORIGIN = 'https://test.cloudfront.net';

const { handler } = require('../index');

// Helper to create API Gateway v2 events
function createEvent(method, path, body = null) {
  return {
    requestContext: {
      http: { method, path },
    },
    body: body ? JSON.stringify(body) : null,
  };
}

function parseResponse(result) {
  return {
    ...result,
    parsedBody: JSON.parse(result.body),
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

// ==================== RESPONSE FORMAT ====================
describe('Response format', () => {
  test('should include CORS headers in all responses', async () => {
    const result = await handler(createEvent('GET', '/api/health'));
    expect(result.headers['Access-Control-Allow-Origin']).toBe('https://test.cloudfront.net');
    expect(result.headers['Content-Type']).toBe('application/json');
    expect(result.headers['Access-Control-Allow-Methods']).toContain('GET');
  });

  test('should return JSON stringified body', async () => {
    const result = await handler(createEvent('GET', '/api/health'));
    expect(typeof result.body).toBe('string');
    const parsed = JSON.parse(result.body);
    expect(parsed.status).toBe('ok');
  });
});

// ==================== HEALTH ====================
describe('GET /api/health', () => {
  test('should return 200 with status ok', async () => {
    const result = await handler(createEvent('GET', '/api/health'));
    const { parsedBody } = parseResponse(result);
    
    expect(result.statusCode).toBe(200);
    expect(parsedBody.status).toBe('ok');
    expect(parsedBody.timestamp).toBeTruthy();
  });
});

// ==================== AUTH ====================
describe('POST /api/auth/signup', () => {
  test('should register user in Cognito and DynamoDB', async () => {
    mockCognitoSend.mockResolvedValueOnce({}); // SignUp
    mockCognitoSend.mockResolvedValueOnce({}); // AdminConfirmSignUp
    mockSend.mockResolvedValueOnce({});         // PutCommand

    const result = await handler(createEvent('POST', '/api/auth/signup', {
      email: 'test@test.com',
      password: 'pass123',
      name: 'Test User',
    }));

    const { parsedBody } = parseResponse(result);
    expect(result.statusCode).toBe(201);
    expect(parsedBody.message).toBe('Usuario creado');
    expect(parsedBody.userId).toMatch(/^user_\d+$/);
    
    // Cognito should be called twice (SignUp + AdminConfirm)
    expect(mockCognitoSend).toHaveBeenCalledTimes(2);
    // DynamoDB should be called once (PutCommand)
    expect(mockSend).toHaveBeenCalledTimes(1);
  });
});

describe('POST /api/auth/login', () => {
  test('should return token and user profile', async () => {
    mockCognitoSend.mockResolvedValueOnce({
      AuthenticationResult: {
        IdToken: 'jwt-test-token',
        RefreshToken: 'refresh-test',
      },
    });
    mockSend.mockResolvedValueOnce({
      Items: [{ userId: 'u1', name: 'Juan', email: 'j@test.com' }],
    });

    const result = await handler(createEvent('POST', '/api/auth/login', {
      email: 'j@test.com',
      password: 'pass',
    }));

    const { parsedBody } = parseResponse(result);
    expect(result.statusCode).toBe(200);
    expect(parsedBody.token).toBe('jwt-test-token');
    expect(parsedBody.user.name).toBe('Juan');
  });
});

// ==================== PROGRESS ====================
describe('POST /api/progress', () => {
  test('should save progress and award points for score >= 70', async () => {
    mockSend.mockResolvedValueOnce({}); // PutCommand (progress)
    mockSend.mockResolvedValueOnce({}); // UpdateCommand (user stats)

    const result = await handler(createEvent('POST', '/api/progress', {
      userId: 'user1',
      lessonId: '1-1',
      moduleId: '1',
      score: 85,
    }));

    const { parsedBody } = parseResponse(result);
    expect(result.statusCode).toBe(200);
    expect(parsedBody.message).toBe('Progreso guardado');
    // Should call Put (progress) + Update (user stats)
    expect(mockSend).toHaveBeenCalledTimes(2);
  });

  test('should NOT award points for score < 70', async () => {
    mockSend.mockResolvedValueOnce({}); // PutCommand only

    await handler(createEvent('POST', '/api/progress', {
      userId: 'user1',
      lessonId: '1-1',
      moduleId: '1',
      score: 50,
    }));

    // Only PutCommand, no UpdateCommand
    expect(mockSend).toHaveBeenCalledTimes(1);
  });
});

describe('GET /api/progress/:userId', () => {
  test('should return progress for a user', async () => {
    mockSend.mockResolvedValueOnce({
      Items: [
        { lessonId: '1-1', completed: true, score: 90 },
        { lessonId: '1-2', completed: false, score: 60 },
      ],
    });

    const result = await handler(createEvent('GET', '/api/progress/user1'));
    const { parsedBody } = parseResponse(result);

    expect(result.statusCode).toBe(200);
    expect(parsedBody.progress).toHaveLength(2);
    expect(parsedBody.progress[0].completed).toBe(true);
  });

  test('should return empty array for user with no progress', async () => {
    mockSend.mockResolvedValueOnce({ Items: [] });

    const result = await handler(createEvent('GET', '/api/progress/newuser'));
    const { parsedBody } = parseResponse(result);

    expect(parsedBody.progress).toEqual([]);
  });
});

// ==================== LESSONS ====================
describe('POST /api/lessons', () => {
  test('should create a new lesson with auto-generated ID', async () => {
    mockSend.mockResolvedValueOnce({});

    const result = await handler(createEvent('POST', '/api/lessons', {
      moduleId: '1',
      moduleTitle: 'Hospitalidad',
      phrase_pt: 'Olá amigos',
      phrase_es: 'Hola amigos',
      context: 'Saludo',
    }));

    const { parsedBody } = parseResponse(result);
    expect(result.statusCode).toBe(201);
    expect(parsedBody.lessonId).toMatch(/^1-\d+$/);
  });
});

describe('GET /api/modules', () => {
  test('should group lessons by module', async () => {
    mockSend.mockResolvedValueOnce({
      Items: [
        { moduleId: '1', lessonId: '1-1', moduleTitle: 'Hospitalidad', phrase_pt: 'Olá' },
        { moduleId: '1', lessonId: '1-2', moduleTitle: 'Hospitalidad', phrase_pt: 'Tchau' },
        { moduleId: '2', lessonId: '2-1', moduleTitle: 'Parrilla', phrase_pt: 'Carne' },
      ],
    });

    const result = await handler(createEvent('GET', '/api/modules'));
    const { parsedBody } = parseResponse(result);

    expect(Object.keys(parsedBody.modules)).toHaveLength(2);
    expect(parsedBody.modules['1'].lessons).toHaveLength(2);
    expect(parsedBody.modules['2'].lessons).toHaveLength(1);
  });
});

// ==================== ANALYTICS ====================
describe('GET /api/analytics', () => {
  test('should calculate team stats correctly', async () => {
    mockSend
      .mockResolvedValueOnce({
        Items: [
          { userId: 'u1', name: 'Cristian', rank: 'Garçom Pro', streakDays: 5 },
          { userId: 'u2', name: 'Valentina', rank: 'Ayudante', streakDays: 2 },
        ],
      })
      .mockResolvedValueOnce({
        Items: [
          { userId: 'u1', lessonId: '1-1', moduleId: '1', score: 90, completed: true, completedAt: new Date().toISOString() },
          { userId: 'u1', lessonId: '1-2', moduleId: '1', score: 80, completed: true, completedAt: new Date().toISOString() },
          { userId: 'u2', lessonId: '1-1', moduleId: '1', score: 60, completed: false, completedAt: new Date().toISOString() },
        ],
      });

    const result = await handler(createEvent('GET', '/api/analytics'));
    const { parsedBody } = parseResponse(result);

    expect(parsedBody.totalUsers).toBe(2);
    expect(parsedBody.avgAccuracy).toBe(77); // (90+80+60)/3 = 76.67 → 77
    expect(parsedBody.teamStats).toHaveLength(2);
    
    const cristian = parsedBody.teamStats.find(s => s.name === 'Cristian');
    expect(cristian.accuracy).toBe(85); // (90+80)/2
    expect(cristian.avatar).toBe('C'); // Single name = single initial
    expect(cristian.streak).toBe(5);
  });

  test('should handle empty database gracefully', async () => {
    mockSend
      .mockResolvedValueOnce({ Items: [] })
      .mockResolvedValueOnce({ Items: [] });

    const result = await handler(createEvent('GET', '/api/analytics'));
    const { parsedBody } = parseResponse(result);

    expect(parsedBody.totalUsers).toBe(0);
    expect(parsedBody.avgAccuracy).toBe(0);
    expect(parsedBody.teamStats).toEqual([]);
  });
});

// ==================== 404 ====================
describe('Unknown routes', () => {
  test('should return 404 for unknown paths', async () => {
    const result = await handler(createEvent('GET', '/api/unknown'));
    expect(result.statusCode).toBe(404);
  });

  test('should return 404 for root path', async () => {
    const result = await handler(createEvent('GET', '/'));
    expect(result.statusCode).toBe(404);
  });
});

// ==================== ERROR HANDLING ====================
describe('Error handling', () => {
  test('should return 500 on DynamoDB failure', async () => {
    mockSend.mockRejectedValueOnce(new Error('DynamoDB throttled'));
    mockSend.mockRejectedValueOnce(new Error('DynamoDB throttled'));

    const result = await handler(createEvent('GET', '/api/analytics'));
    expect(result.statusCode).toBe(500);
    const { parsedBody } = parseResponse(result);
    expect(parsedBody.error).toContain('DynamoDB throttled');
  });

  test('should return 500 on Cognito failure', async () => {
    mockCognitoSend.mockRejectedValueOnce(new Error('Invalid password'));

    const result = await handler(createEvent('POST', '/api/auth/login', {
      email: 'test@test.com',
      password: 'wrong',
    }));

    expect(result.statusCode).toBe(500);
  });
});
