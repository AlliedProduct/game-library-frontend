import apiClient from "./client";

export interface AuthUser {
  id: number;
  email: string;
  username?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export async function signIn(
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await apiClient.post("/api/v1/auth/sign_in", {
    email,
    password,
  });
  return res.data as AuthResponse;
}

export async function signUp(
  email: string,
  password: string,
  passwordConfirmation: string,
  username: string
): Promise<AuthResponse> {
  const res = await apiClient.post("/api/v1/auth/sign_up", {
    user: {
      email,
      password,
      password_confirmation: passwordConfirmation,
      username,
    },
  });
  return res.data as AuthResponse;
}

export async function signOut(): Promise<void> {
  await apiClient.delete("/api/v1/auth/sign_out");
}

export async function fetchMe(): Promise<AuthUser> {
  const res = await apiClient.get("/api/v1/auth/me");
  return res.data as AuthUser;
}
