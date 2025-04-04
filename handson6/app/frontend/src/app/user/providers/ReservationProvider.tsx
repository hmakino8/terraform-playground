import { useState } from "react";
import { ReservationContext } from "./ReservationContext";
import { Product } from "@/user/api/productApi";
import { Cart } from "@/user/providers/ReservationContext";
import { cartApi } from "@/user/api/cartApi";
import { ReservationData } from "@/user/api/reservationApi";

export const ReservationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedSeat, setSelectedSeat] = useState<number>(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [reservationData, setReservationData] =
    useState<ReservationData | null>(null);
  const [cart, setCart] = useState<Cart[]>([]);
  const { deleteCartItem } = cartApi;
  const [cartItemsDetails, setCartItemsDetails] = useState<
    Array<{
      product_name: string;
      size: string;
      quantity: number;
      price: number;
    }>
  >([]);

  const handleDeleteCartItem = async (cartItemId: number | undefined) => {
    try {
      await deleteCartItem(cartItemId);
      setCart(cart.filter((item) => item.id !== cartItemId));
    } catch (error) {
      console.error("カートアイテムの削除に失敗しました", error);
    }
  };

  // useEffect(() => {
  // useEffect(() => {
  //   const fetchCartItems = async () => {
  //     const cartItems = await cartApi.getCartItems();
  //     setCart(cartItems);
  //   };
  //   fetchCartItems();
  // }, []);

  // const updateCart = async (newCartItem: Cart) => {
  //   try {
  //     await cartApi.addToCart(newCartItem);
  //     const updatedCart = await cartApi.getCartItems();
  //     setCart(updatedCart);
  //   } catch (error) {
  //     console.error("カートの更新に失敗しました", error);
  //   }
  // };

  return (
    <ReservationContext.Provider
      value={{
        selectedSeat,
        setSelectedSeat,
        selectedProduct,
        setSelectedProduct,
        reservationData,
        setReservationData,
        cart,
        setCart,
        handleDeleteCartItem,
        cartItemsDetails,
        setCartItemsDetails,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};
