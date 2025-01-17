import axios from "axios";
import { baseURL } from "../env";

export const getAllCategories = async () => {
  try {
      const response = await axios.get(`${baseURL}/category`);

    return response.data;
  } catch (error) {
    console.error("Error al obtener producto:", error);
    throw error;
  }
};
