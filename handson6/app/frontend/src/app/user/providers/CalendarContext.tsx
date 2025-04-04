import { createContext } from "react";
import { DateSelectArg } from "@fullcalendar/core";

type CalendarContextType = {
  selectedDate: DateSelectArg | null;
  reservationTime: string | null;
  setSelectedDate: (date: DateSelectArg | null) => void;
  isCalendarOpen: boolean;
  setIsCalendarOpen: (isCalendarOpen: boolean) => void;
  ValidReservationTime: (selectedDate: DateSelectArg) => boolean;
  setReservationTime: (reservationTime: string | null) => void;
};

export const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);
