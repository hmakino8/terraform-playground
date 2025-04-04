import { useContext } from "react";
import { CalendarContext } from "@/user/providers/CalendarContext";

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error("useCalendar must be used within an CalendarProvider");
  }
  return context;
};
