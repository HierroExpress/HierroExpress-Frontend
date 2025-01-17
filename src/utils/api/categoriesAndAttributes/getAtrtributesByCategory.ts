import axios from "axios";
import { baseURL } from "../env";

export const getAtrtributesByCategory = async ({
  categoryId,
}: {
  categoryId: number;
}) => {
  try {
    const response = await axios.get(
      `${baseURL}/products/attributesByCategoryId/${categoryId}`
    );

    return response.data;
  } catch (error) {
    console.error("Error al obtener producto:", error);
    throw error;
  }
};
