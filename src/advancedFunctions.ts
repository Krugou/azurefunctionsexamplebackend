import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { User } from './models/types.js';
import { successResponse, errorResponse, validateRequiredFields, generateId } from './utils/helpers.js';

/**
 * Advanced HTTP Function - User Management API
 * Demonstrates best practices with utilities and models
 */

// In-memory storage (use database in production)
const users = new Map<string, User>();

/**
 * Get all users or a specific user by ID
 * GET /api/users or GET /api/users/{id}
 */
async function getUsers(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log('GET users request received');

  const userId = request.params.id;

  if (userId) {
    const user = users.get(userId);
    if (!user) {
      return errorResponse('User not found', 404);
    }
    return successResponse(user);
  }

  // Return all users
  return successResponse(Array.from(users.values()));
}

/**
 * Create a new user
 * POST /api/users
 */
async function createUser(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log('POST user request received');

  try {
    const body = await request.json() as Partial<User>;

    // Validate required fields
    const validationError = validateRequiredFields(body, ['name', 'email']);
    if (validationError) {
      return errorResponse(validationError, 400);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email || '')) {
      return errorResponse('Invalid email format', 400);
    }

    // Create new user
    const newUser: User = {
      id: generateId('user'),
      name: body.name!,
      email: body.email!,
      createdAt: new Date()
    };

    users.set(newUser.id, newUser);
    context.log(`User created: ${newUser.id}`);

    return successResponse(newUser, 201);
  } catch (error) {
    context.error('Error creating user:', error);
    return errorResponse('Invalid request body', 400);
  }
}

/**
 * Update an existing user
 * PUT /api/users/{id}
 */
async function updateUser(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log('PUT user request received');

  const userId = request.params.id;
  if (!userId) {
    return errorResponse('User ID is required', 400);
  }

  const existingUser = users.get(userId);
  if (!existingUser) {
    return errorResponse('User not found', 404);
  }

  try {
    const body = await request.json() as Partial<User>;

    // Update user
    const updatedUser: User = {
      ...existingUser,
      name: body.name || existingUser.name,
      email: body.email || existingUser.email,
      updatedAt: new Date()
    };

    users.set(userId, updatedUser);
    context.log(`User updated: ${userId}`);

    return successResponse(updatedUser);
  } catch (error) {
    context.error('Error updating user:', error);
    return errorResponse('Invalid request body', 400);
  }
}

/**
 * Delete a user
 * DELETE /api/users/{id}
 */
async function deleteUser(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log('DELETE user request received');

  const userId = request.params.id;
  if (!userId) {
    return errorResponse('User ID is required', 400);
  }

  if (!users.has(userId)) {
    return errorResponse('User not found', 404);
  }

  users.delete(userId);
  context.log(`User deleted: ${userId}`);

  return successResponse({ message: 'User deleted successfully', id: userId });
}

/**
 * Handle all user operations
 */
async function userHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const method = request.method;

  switch (method) {
    case 'GET':
      return getUsers(request, context);
    case 'POST':
      return createUser(request, context);
    case 'PUT':
      return updateUser(request, context);
    case 'DELETE':
      return deleteUser(request, context);
    default:
      return errorResponse('Method not allowed', 405);
  }
}

// Register the user management API
app.http('users', {
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  authLevel: 'anonymous',
  route: 'users/{id?}',
  handler: userHandler
});
