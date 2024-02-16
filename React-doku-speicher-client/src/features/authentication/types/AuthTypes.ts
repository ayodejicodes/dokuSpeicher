export interface UserCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
}

export interface RegistrationData {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
}

export interface RegistrationResponse {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  message?: string;
}
