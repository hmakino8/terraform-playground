import { apiClient } from "./commonApi";

export type Product = {
  id: number;
  name: string;
  image: string;
  price_s: number;
  price_m: number;
  price_l: number;
  category: string;
};

export const productApi = {
  getProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get("/products/");
    return response.data;
  },
};
