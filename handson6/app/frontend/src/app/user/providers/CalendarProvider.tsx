import { useState, useEffect } from "react";
import { CalendarContext } from "./CalendarContext";
import { DateSelectArg } from "@fullcalendar/core";

export const CalendarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [reservationTime, setReservationTime] = useState<string | null>(null);
  const startDate = selectedDate?.start?.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const startTime = selectedDate?.start?.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTime = selectedDate?.end?.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });

  useEffect(() => {
    setReservationTime(
      selectedDate ? `${startDate} ${startTime} ~ ${endTime}` : ""
    );
  }, [selectedDate]);

  const ValidReservationTime = (selectedDate: DateSelectArg): boolean => {
    return (
      Math.abs(selectedDate.end.getTime() - selectedDate.start.getTime()) <=
      2 * 60 * 60 * 1000
    );
  };

  return (
    <CalendarContext.Provider
      value={{
        isCalendarOpen,
        setIsCalendarOpen,
        selectedDate,
        setSelectedDate,
        reservationTime,
        setReservationTime,
        ValidReservationTime,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};
