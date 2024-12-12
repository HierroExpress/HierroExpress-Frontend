import axios from "axios";
import { baseURL } from "../env";

export interface LoginPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  NIN: string;
}

export const postRegister = async (payload: LoginPayload) => {
  const response = await axios.post(`${baseURL}/auth/register`, payload);
  return response.data;
};
