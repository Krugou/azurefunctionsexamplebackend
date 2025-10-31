import { HttpResponseInit } from '@azure/functions';
import { ApiResponse } from '../models/types.js';

/**
 * Utility functions for Azure Functions
 */

/**
 * Create a standardized success response
 */
export function successResponse<T>(data: T, status = 200): HttpResponseInit {
  const response: ApiResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString()
  };

  return {
    status,
    jsonBody: response
  };
}

/**
 * Create a standardized error response
 */
export function errorResponse(
  error: string,
  status = 400
): HttpResponseInit {
  const response: ApiResponse<never> = {
    success: false,
    error,
    timestamp: new Date().toISOString()
  };

  return {
    status,
    jsonBody: response
  };
}

/**
 * Validate required fields in an object
 */
export function validateRequiredFields<T extends Record<string, unknown>>(
  obj: T,
  requiredFields: (keyof T)[]
): string | null {
  for (const field of requiredFields) {
    if (obj[field] === undefined || obj[field] === null || obj[field] === '') {
      return `Missing required field: ${String(field)}`;
    }
  }
  return null;
}

/**
 * Generate a random ID
 */
export function generateId(prefix?: string): string {
  const random = Math.random().toString(36).substring(2, 15);
  const timestamp = Date.now().toString(36);
  const id = `${random}${timestamp}`;
  return prefix ? `${prefix}_${id}` : id;
}

/**
 * Sleep/delay utility for testing or rate limiting
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
