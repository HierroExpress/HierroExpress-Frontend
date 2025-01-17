import axios from "axios";
import { baseURL } from "../env";

export const filterProductsByCategoryAndAttributes = async ({
  categoryId,
  attributes,
}: {
  categoryId: number;
  attributes: { attributeId: number; value: string }[];
}) => {
  const attributeParams = attributes.map((attribute) => {
    return `${attribute.attributeId}:${attribute.value}`;
  });
  const attributeString = attributeParams.join(",");
  try {
    const response = await axios.get(
      `${baseURL}/products/filterByCategoryIdAndAtributes?categoryId=${categoryId}&attributes=${attributeString}`
    );

    return response.data;
  } catch (error) {
    console.error("Error al obtener producto:", error);
    throw error;
  }
};
