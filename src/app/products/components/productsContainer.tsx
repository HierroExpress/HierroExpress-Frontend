"use client";
import { useEffect, useState } from "react";
import { ProductList } from "../types";
import { ProductCard } from "./productCard";
import { getProducts } from "@/utils/api/products/getProducts";
import { FilterType } from "@/utils/api/products/filtertType";

export const ProductsContainer = () => {
  const [productList, setProductList] = useState<ProductList>([]);
  const [filter, setFilter] = useState<FilterType>({
    page: 1,
    limit: 5,
  });

  const getProductsFiltered = async () => {
    const response = await getProducts({ filter });
    console.log("esta es la respuesta de get products", response);
    setProductList(response);
  };

  useEffect(() => {
    getProductsFiltered();
  }, [filter]); // Cambiar dependencia a `filter`.

  return (
    <div className="flex flex-row flex-wrap justify-center">
      {productList.length > 0 ? (
        productList.map((product) => (
          <ProductCard key={product.id} productInfo={product} />
        ))
      ) : (
        <p>Cargando productos...</p>
      )}
    </div>
  );
};
