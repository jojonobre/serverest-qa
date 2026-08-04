export interface UserPayload {
  nome?: string;
  email?: string;
  password?: string;
  administrador?: string;
}

export interface LoginPayload {
  email?: string;
  password?: string;
}