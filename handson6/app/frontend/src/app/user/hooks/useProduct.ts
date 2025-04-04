import { useEffect, useState } from "react";
import { productApi, Product } from "@/user/api/productApi";
import { cartApi } from "@/user/api/cartApi";

export const useProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await productApi.getProducts();
      setProducts(products);
    };

    fetchProducts();
  }, []);

  return { products };
};
