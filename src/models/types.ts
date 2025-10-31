/**
 * Example model/interface definitions
 */

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Item {
  id: string;
  name: string;
  description?: string;
  price?: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
