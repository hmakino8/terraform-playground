import { createContext } from "react";
import { Product } from "@/user/api/productApi";
import { ReservationData } from "@/user/api/reservationApi";

export interface Cart {
  id?: number;
  product: {
    id: number;
    name: string;
    image: string;
    price_s: number;
    price_m: number;
    price_l: number;
  };
  size: string;
  quantity: number;
}

type ReservationContextType = {
  selectedSeat: number;
  setSelectedSeat: (seat: number) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  cart: Cart[];
  setCart: (cart: Cart[]) => void;
  handleDeleteCartItem: (cartItemId: number | undefined) => void;
  reservationData: ReservationData | null;
  setReservationData: (reservationData: ReservationData | null) => void;
  cartItemsDetails: Array<{
    product_name: string;
    size: string;
    quantity: number;
    price: number;
  }>;
  setCartItemsDetails: (
    cartItemsDetails: Array<{
      product_name: string;
      size: string;
      quantity: number;
      price: number;
    }>
  ) => void;
};

export const ReservationContext = createContext<
  ReservationContextType | undefined
>(undefined);
