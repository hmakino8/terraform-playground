import { useState } from "react";
import { Separator } from "@/user/components/ui/Separator";
import { useScreen } from "@/user/hooks/useScreen";
import { SelectButton } from "../ui/SelectButton";
import { useReservation } from "@/user/hooks/useReservation";
import { Cart } from "@/user/providers/ReservationContext";
import { cartApi } from "@/user/api/cartApi";

export const SelectedProductScreen = () => {
  const { selectedProduct } = useReservation();
  const [count, setCount] = useState(1);
  const { setActiveScreenCheckAuth } = useScreen();
  const [size, setSize] = useState("M");

  const ProductMenuButton = () => {
    return (
      <div className="flex flex-col mx-auto w-2/3 h-2/3">
        <img
          src={`/images/${selectedProduct?.image}`}
          alt={selectedProduct?.name ?? ""}
          className="object-cover rounded-md"
        />
        <p className="pt-2">{selectedProduct?.name ?? ""}</p>
        {size === "M" && (
          <p>{`¥${Math.floor(selectedProduct?.price_m ?? 0)}`}</p>
        )}
        {size === "S" && (
          <p>{`¥${Math.floor(selectedProduct?.price_s ?? 0)}`}</p>
        )}
        {size === "L" && (
          <p>{`¥${Math.floor(selectedProduct?.price_l ?? 0)}`}</p>
        )}
      </div>
    );
  };

  const Counter = () => {
    return (
      <div className="flex justify-between">
        <div>
          <p className="font-bold text-[16px]">数量</p>
          {count}
        </div>
        <div className="flex my-2 gap-4">
          <button
            className="flex items-center justify-center disabled:opacity-50 w-5 h-5 border border-blue-500 text-blue-500 rounded-full"
            onClick={() => setCount(count - 1)}
            disabled={count === 1}
          >
            <span className="material-symbols-outlined">remove</span>
          </button>
          <button
            className="flex items-center justify-center disabled:opacity-50 w-5 h-5 border border-blue-500 text-blue-500 rounded-full"
            onClick={() => setCount(count + 1)}
            disabled={false}
          >
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
      </div>
    );
  };

  const SelectSizeButton = () => {
    return (
      <div className="flex justify-start items-center my-2 mx-auto text-white">
        <SelectButton
          isSelected={size === "S"}
          setIsSelected={() => setSize("S")}
          size="S"
          btnText="Small"
          location="left"
          disabled={false}
        />
        <SelectButton
          isSelected={size === "M"}
          setIsSelected={() => setSize("M")}
          size="S"
          btnText="Medium"
          location="center"
          disabled={false}
        />
        <SelectButton
          isSelected={size === "L"}
          setIsSelected={() => setSize("L")}
          size="S"
          btnText="Large"
          location="right"
          disabled={false}
        />
      </div>
    );
  };

  const handleClick = async () => {
    try {
      const selectedProductInfo: Cart = {
        product: selectedProduct ?? {
          id: 0,
          name: "",
          image: "",
          price_s: 0,
          price_m: 0,
          price_l: 0,
        },
        size: size,
        quantity: count,
      };
      await cartApi.addToCart(selectedProductInfo);
      setActiveScreenCheckAuth("Reservation");
    } catch (error) {
      console.error("カートに追加できませんでした", error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center text-start">
        <ProductMenuButton />
      </div>
      <Separator />
      <SelectSizeButton />
      <Separator />
      <Counter />
      <Separator />
      <div className="flex justify-end">
        <button className="btn-green-wide-fixed" onClick={handleClick}>
          カートに入れる
        </button>
      </div>
    </div>
  );
};
