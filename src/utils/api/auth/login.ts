import axios from "axios";
import { baseURL } from "../env";

export interface LoginPayload {
  email: string;
  password: string;
}

export const postLogin = async (payload: LoginPayload) => {
  const response = await axios.post(`${baseURL}/auth/signin`, payload);
  return response.data;
};
