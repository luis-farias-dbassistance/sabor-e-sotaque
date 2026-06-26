const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, QueryCommand, ScanCommand, BatchWriteCommand } = require('@aws-sdk/lib-dynamodb');
const { CognitoIdentityProviderClient, InitiateAuthCommand, SignUpCommand, ConfirmSignUpCommand, AdminConfirmSignUpCommand, ListUsersCommand } = require('@aws-sdk/client-cognito-identity-provider');

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const cognito = new CognitoIdentityProviderClient({});

const USERS_TABLE = process.env.USERS_TABLE;
const PROGRESS_TABLE = process.env.PROGRESS_TABLE;
const LESSONS_TABLE = process.env.LESSONS_TABLE;
const USER_POOL_ID = process.env.USER_POOL_ID;
const CLIENT_ID = process.env.CLIENT_ID;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': CORS_ORIGIN,
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    },
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  const { requestContext, body: rawBody } = event;
  const method = requestContext?.http?.method || event.httpMethod;
  const path = requestContext?.http?.path || event.path;
  const body = rawBody ? JSON.parse(rawBody) : {};

  try {
    // ==================== AUTH ====================
    if (path === '/api/auth/signup' && method === 'POST') {
      const { email, password, name } = body;
      // Register in Cognito
      await cognito.send(new SignUpCommand({
        ClientId: CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [{ Name: 'name', Value: name || email }],
      }));

      // Auto-confirm user (for simplicity in MVP)
      await cognito.send(new AdminConfirmSignUpCommand({
        UserPoolId: USER_POOL_ID,
        Username: email,
      }));

      // Create DynamoDB profile
      const userId = `user_${Date.now()}`;
      await ddb.send(new PutCommand({
        TableName: USERS_TABLE,
        Item: {
          userId,
          email,
          name: name || email,
          points: 0,
          rank: 'Ayudante',
          streakDays: 0,
          completedLessons: 0,
          lastActivityAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
      }));

      return response(201, { message: 'Usuario creado', userId });
    }

    if (path === '/api/auth/login' && method === 'POST') {
      const { email, password } = body;
      const auth = await cognito.send(new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: CLIENT_ID,
        AuthParameters: { USERNAME: email, PASSWORD: password },
      }));

      // Get user profile from DynamoDB
      const users = await ddb.send(new QueryCommand({
        TableName: USERS_TABLE,
        IndexName: 'email-index',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: { ':email': email },
      }));
      
      let user = users.Items?.[0];

      // Auto-create DynamoDB profile for existing Cognito users (e.g. created via CLI)
      if (!user) {
        const userId = `user_${Date.now()}`;
        user = {
          userId,
          email,
          name: email.split('@')[0],
          points: 0,
          rank: 'Ayudante',
          streakDays: 0,
          completedLessons: 0,
          lastActivityAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };
        await ddb.send(new PutCommand({
          TableName: USERS_TABLE,
          Item: user,
        }));
      }

      return response(200, {
        token: auth.AuthenticationResult.IdToken,
        refreshToken: auth.AuthenticationResult.RefreshToken,
        user,
      });
    }

    // ==================== PROGRESS ====================
    if (path === '/api/progress' && method === 'POST') {
      const { userId, lessonId, moduleId, score } = body;
      
      await ddb.send(new PutCommand({
        TableName: PROGRESS_TABLE,
        Item: {
          userId,
          lessonId,
          moduleId,
          score,
          completed: score >= 70,
          completedAt: new Date().toISOString(),
        },
      }));

      // Update user stats
      if (score >= 70) {
        await ddb.send(new UpdateCommand({
          TableName: USERS_TABLE,
          Key: { userId },
          UpdateExpression: 'SET points = points + :pts, completedLessons = completedLessons + :one, lastActivityAt = :now',
          ExpressionAttributeValues: {
            ':pts': 50,
            ':one': 1,
            ':now': new Date().toISOString(),
          },
        }));
      }

      return response(200, { message: 'Progreso guardado' });
    }

    if (path.startsWith('/api/progress/') && method === 'GET') {
      const userId = path.split('/api/progress/')[1];
      const result = await ddb.send(new QueryCommand({
        TableName: PROGRESS_TABLE,
        KeyConditionExpression: 'userId = :uid',
        ExpressionAttributeValues: { ':uid': userId },
      }));
      return response(200, { progress: result.Items || [] });
    }

    // ==================== MODULES & LESSONS ====================
    if (path === '/api/modules' && method === 'GET') {
      const result = await ddb.send(new ScanCommand({ TableName: LESSONS_TABLE }));
      
      // Group by module
      const modules = {};
      for (const item of result.Items || []) {
        if (!modules[item.moduleId]) {
          modules[item.moduleId] = { id: item.moduleId, title: item.moduleTitle, subtitle: item.moduleSubtitle, lessons: [] };
        }
        modules[item.moduleId].lessons.push(item);
      }
      
      return response(200, { modules });
    }

    if (path === '/api/lessons' && method === 'POST') {
      const { moduleId, moduleTitle, moduleSubtitle, phrase_pt, phrase_es, context, imageUrl } = body;
      const lessonId = `${moduleId}-${Date.now()}`;

      await ddb.send(new PutCommand({
        TableName: LESSONS_TABLE,
        Item: {
          moduleId,
          lessonId,
          moduleTitle: moduleTitle || '',
          moduleSubtitle: moduleSubtitle || '',
          phrase_pt,
          phrase_es,
          context,
          imageUrl: imageUrl || '/images/hospitalidad.avif',
          createdAt: new Date().toISOString(),
        },
      }));

      return response(201, { message: 'Lección creada', lessonId });
    }

    // ==================== ANALYTICS ====================
    if (path === '/api/analytics' && method === 'GET') {
      // Get all users
      const usersResult = await ddb.send(new ScanCommand({ TableName: USERS_TABLE }));
      const users = usersResult.Items || [];

      // Get all progress
      const progressResult = await ddb.send(new ScanCommand({ TableName: PROGRESS_TABLE }));
      const progress = progressResult.Items || [];

      // Calculate stats
      const totalUsers = users.length;
      const completedToday = progress.filter(p => {
        const d = new Date(p.completedAt);
        const today = new Date();
        return d.toDateString() === today.toDateString();
      }).length;

      const avgAccuracy = progress.length > 0
        ? Math.round(progress.reduce((sum, p) => sum + (p.score || 0), 0) / progress.length)
        : 0;

      // Per-user stats
      const teamStats = users.map(u => {
        const userProgress = progress.filter(p => p.userId === u.userId);
        const completed = userProgress.filter(p => p.completed).length;
        const avgScore = userProgress.length > 0
          ? Math.round(userProgress.reduce((s, p) => s + (p.score || 0), 0) / userProgress.length)
          : 0;

        return {
          id: u.userId,
          name: u.name,
          rank: u.rank || 'Ayudante',
          completion: Math.round((completed / 40) * 100),
          accuracy: avgScore,
          streak: u.streakDays || 0,
          avatar: (u.name || 'NN').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        };
      });

      // Per-module progress
      const moduleProgress = {};
      for (const p of progress) {
        if (!moduleProgress[p.moduleId]) moduleProgress[p.moduleId] = { total: 0, completed: 0 };
        moduleProgress[p.moduleId].total++;
        if (p.completed) moduleProgress[p.moduleId].completed++;
      }

      return response(200, {
        totalUsers,
        completedToday,
        avgAccuracy,
        retentionRate: 92, // Simplified for MVP
        teamStats,
        moduleProgress,
      });
    }

    // ==================== HEALTH ====================
    if (path === '/api/health') {
      return response(200, { status: 'ok', timestamp: new Date().toISOString() });
    }

    return response(404, { error: 'Ruta no encontrada' });

  } catch (err) {
    console.error('API Error:', err);
    return response(500, { error: err.message });
  }
};
