import { apiClient } from "./commonApi";

export type Reservation = {
  id: number;
  user: number;
  reservation_date: string;
  reservation_time_start: string;
  reservation_time_end: string;
  seat: number;
};

export type ReservationData = {
  cart_items: number[];
  is_takein: boolean;
  is_pre_order: boolean;
  reservation_date: string;
  reservation_time_start: string;
  reservation_time_end: string;
  seat: number;
};

export const reservationApi = {
  createReservation: async (
    reservationData: ReservationData
  ): Promise<Reservation> => {
    const csrfResponse = await apiClient.get("/get-csrf-token/");
    const { csrfToken } = csrfResponse.data;

    const response = await apiClient.post(
      "/reservations/create/",
      reservationData,
      {
        headers: {
          "X-CSRFToken": csrfToken,
        },
      }
    );
    return response.data;
  },

  getReservations: async (): Promise<Reservation[]> => {
    const response = await apiClient.get("/reservations/");
    return response.data;
  },
};
