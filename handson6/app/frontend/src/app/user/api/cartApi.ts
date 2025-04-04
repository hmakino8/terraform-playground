import { apiClient } from "./commonApi";
import { Cart } from "@/user/providers/ReservationContext";

export const cartApi = {
  addToCart: async (cartItem: Cart) => {
    const csrfResponse = await apiClient.get("/get-csrf-token/");
    const { csrfToken } = csrfResponse.data;

    const response = await apiClient.post("/cart/add/", cartItem, {
      headers: {
        "X-CSRFToken": csrfToken,
      },
    });
    console.log("response", response);
    return response.data;
  },

  getCartItems: async () => {
    const response = await apiClient.get("/cart/");
    return response.data;
  },

  deleteCartItem: async (cartItemId: number | undefined) => {
    const csrfResponse = await apiClient.get("/get-csrf-token/");
    const { csrfToken } = csrfResponse.data;

    await apiClient.delete(`/cart/${cartItemId}/delete/`, {
      headers: {
        "X-CSRFToken": csrfToken,
      },
    });
  },

  clearCart: async () => {
    const csrfResponse = await apiClient.get("/get-csrf-token/");
    const { csrfToken } = csrfResponse.data;

    await apiClient.delete("/cart/clear/", {
      headers: {
        "X-CSRFToken": csrfToken,
      },
    });
  },
};
