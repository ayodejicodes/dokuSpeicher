import {
  AuthResponse,
  RegistrationData,
  RegistrationResponse,
  UserCredentials,
} from "..";
import { http } from "../../../lib/axios/http";

const register = async (
  data: RegistrationData
): Promise<RegistrationResponse> => {
  const response = await http.post("/api/auth/register", data);
  return response.data;
};

const login = async (credentials: UserCredentials): Promise<AuthResponse> => {
  const response = await http.post("/api/auth/login", credentials);
  return response.data;
};

export { register, login };
