import axios from "axios";
import { baseURL } from "../env";

export const getCategorieById = async (id: number) => {
  try {
    const response = await axios.get(`${baseURL}/category/${id}`);

    return response.data;
  } catch (error) {
    console.error("Error al obtener producto:", error);
    throw error;
  }
};
