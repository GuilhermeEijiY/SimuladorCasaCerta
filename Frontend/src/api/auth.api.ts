import { api } from "./client";

interface AuthResponse {
  token: string;
  user: { id: string; name: string; email: string };
}

export async function registerUser(name: string, email: string, password: string) {
  const { data } = await api.post<AuthResponse>("/auth/register", { name, email, password });
  return data;
}

export async function loginUser(email: string, password: string) {
  const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
  return data;
}

export async function getMe() {
  const { data } = await api.get<{ id: string; name: string; email: string }>("/auth/me");
  return data;
}
