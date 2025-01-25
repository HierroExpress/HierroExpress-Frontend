import axios from "axios";
import { baseURL } from "../env";
import { FilterDefault, FilterType } from "./filtertType";

export const getProducts = async ({ filter }: { filter: FilterDefault }) => {
  try {
    // Realizamos la solicitud con axios, pasando los parámetros
    const response = await axios.get(`${baseURL}/products/filter`, { filter });

    return response.data; // Devolvemos los datos de la respuesta
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error; // Lanzamos el error para que el consumidor de la función lo maneje.
  }
};
