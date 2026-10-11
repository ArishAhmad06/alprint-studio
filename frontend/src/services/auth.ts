// ============================================
// Alprint — Auth Service
// TODO: Replace mock implementations with real API calls
// Base URL: process.env.VITE_API_URL || 'http://localhost:5000/api/v1'
// ============================================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: 'customer' | 'admin';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SignupPayload {
  email: string;
  password: string;
  name: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface OTPPayload {
  email: string;
  code: string;
}

// TODO: Replace with POST ${API_URL}/auth/signup
export async function signup(_payload: SignupPayload): Promise<{ message: string }> {
  await new Promise((r) => setTimeout(r, 500));
  // TODO: Real implementation
  return { message: 'Signup successful. Please verify your email with the OTP sent.' };
}

// TODO: Replace with POST ${API_URL}/auth/verify-otp
export async function verifyOTP(_payload: OTPPayload): Promise<AuthTokens> {
  await new Promise((r) => setTimeout(r, 500));
  // TODO: Real implementation
  return { accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token' };
}

// TODO: Replace with POST ${API_URL}/auth/login
export async function login(_payload: LoginPayload): Promise<AuthTokens & { user: AuthUser }> {
  await new Promise((r) => setTimeout(r, 500));
  // TODO: Real implementation
  return {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    user: { id: 'user-1', email: _payload.email, name: 'Demo User', role: 'customer' },
  };
}

// TODO: Replace with POST ${API_URL}/auth/otp-login
export async function otpLogin(_email: string): Promise<{ message: string }> {
  await new Promise((r) => setTimeout(r, 500));
  return { message: 'OTP sent to your email.' };
}

// TODO: Replace with POST ${API_URL}/auth/refresh
export async function refreshToken(_refreshToken: string): Promise<AuthTokens> {
  await new Promise((r) => setTimeout(r, 300));
  return { accessToken: 'mock-refreshed-token', refreshToken: 'mock-new-refresh-token' };
}

// TODO: Replace with POST ${API_URL}/auth/logout
export async function logout(): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  localStorage.removeItem('alprint_tokens');
  localStorage.removeItem('alprint_user');
}

export function getStoredUser(): AuthUser | null {
  try {
    const data = localStorage.getItem('alprint_user');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function getStoredTokens(): AuthTokens | null {
  try {
    const data = localStorage.getItem('alprint_tokens');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function storeAuth(tokens: AuthTokens, user: AuthUser): void {
  localStorage.setItem('alprint_tokens', JSON.stringify(tokens));
  localStorage.setItem('alprint_user', JSON.stringify(user));
}
