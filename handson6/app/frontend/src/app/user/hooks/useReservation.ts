import { useContext, useState, useEffect } from "react";
import { ReservationContext, Cart } from "@/user/providers/ReservationContext";
import { cartApi } from "@/user/api/cartApi";

export const useReservation = () => {
  const context = useContext(ReservationContext);

  if (context === undefined) {
    throw new Error(
      "useReservation must be used within an ReservationProvider"
    );
  }

  useEffect(() => {
    const fetchCartItems = async () => {
      const cartItems = await cartApi.getCartItems();
      context.setCart(cartItems);
    };
    fetchCartItems();
  }, []);

  return context;
};
