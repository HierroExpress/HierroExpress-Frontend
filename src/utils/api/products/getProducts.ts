import axios from "axios";
import { baseURL } from "../env";
import { FilterType } from "./filtertType";

export const getProducts = async ({ filter }: { filter: FilterType }) => {
  try {
    // Creamos un objeto para almacenar los parámetros que se enviarán
    const params: any = {};

    // Solo agregamos a 'params' los parámetros que están presentes en 'filter'
    if (filter.filter !== undefined) params.filter = filter.filter;
    if (filter.search !== undefined) params.search = filter.search;
    if (filter.min !== undefined) params.min = filter.min;
    if (filter.max !== undefined) params.max = filter.max;
    if (filter.start) params.start = filter.start;
    if (filter.page !== undefined) params.page = filter.page;
    if (filter.limit !== undefined) params.limit = filter.limit;

    // Realizamos la solicitud con axios, pasando los parámetros
    const response = await axios.get(`${baseURL}/products/filter`, { params });

    return response.data; // Devolvemos los datos de la respuesta
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error; // Lanzamos el error para que el consumidor de la función lo maneje.
  }
};
