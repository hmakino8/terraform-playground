import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import jaLocale from "@fullcalendar/core/locales/ja";
import { DateSelectArg } from "@fullcalendar/core";
import Holidays from "date-holidays";
import { useCalendar } from "@/user/hooks/useCalendar";
import { useUIState } from "@/user/hooks/useUIState";
import { useReservation } from "@/user/hooks/useReservation";
import { format } from "date-fns";
import { reservationApi, Reservation } from "@/user/api/reservationApi";

export const Calendar = () => {
  const { setSelectedDate, ValidReservationTime } = useCalendar();
  const { handleModalOpen } = useUIState();
  const { selectedSeat } = useReservation();
  const today = new Date();
  const oneMonthLater = new Date();
  const now = new Date();
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const fetchReservations = async () => {
      const reservations = await reservationApi.getReservations();
      setReservations(reservations);
      console.log(reservations);
    };
    fetchReservations();
  }, []);

  type Slot = {
    date: Date;
    start_time: string; // "10:00"形式
    end_time: string; // "11:00"形式
    seat_id: number;
  };

  type CalendarData = {
    slots: Slot[];
  };

  // const calendarData = {
  //   slots: [
  //     {
  //       date: new Date("2025-01-22"),
  //       start_time: "10:00",
  //       end_time: "12:00",
  //       seat_id: selectedSeat,
  //     },
  //     {
  //       date: new Date("2025-01-24"),
  //       start_time: "14:00",
  //       end_time: "15:30",
  //       seat_id: selectedSeat,
  //     },
  //   ],
  // };

  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

  const selectAllow = (selectInfo: { start: Date }) => {
    const startDate = new Date(selectInfo.start);
    return startDate >= today && startDate <= oneMonthLater;
  };

  const businessHours = {
    startTime: "09:00",
    endTime: "17:00",
    daysOfWeek: [1, 2, 3, 4, 5],
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    if (ValidReservationTime(selectInfo)) {
      setSelectedDate(selectInfo);
    } else {
      selectInfo?.view.calendar.unselect();
      handleModalOpen("予約時間は最大2時間です。", 1);
    }
  };

  const headerToolbar = {
    left: "prev,next",
    center: "title",
    right: "",
  };

  const slotLabelFormat = {
    hour: "numeric" as const,
    minute: "2-digit" as const,
    meridiem: false,
    hour12: false,
  };

  const titleFormat: { year: "numeric"; month: "long" } = {
    year: "numeric",
    month: "long",
  };

  const eventAllow = (dropInfo: { start: Date }) => {
    const startDate = new Date(dropInfo.start!);
    return startDate >= today && startDate <= oneMonthLater;
  };

  const dayHeaderContent = ({ date }: { date: Date }) => {
    const checkHoliday = (date: Date) => {
      const hd = new Holidays("JP");
      return hd.isHoliday(date);
    };

    const day = new Intl.DateTimeFormat("ja-JP", {
      day: "numeric",
    }).format(date);

    const weekday = new Intl.DateTimeFormat("ja-JP", {
      weekday: "short",
    }).format(date);

    let colorClass = "";
    if (weekday === "土") {
      colorClass = "text-blue-500";
    } else if (weekday === "日" || checkHoliday(date)) {
      colorClass = "text-red-500";
    }

    return (
      <div className="custom-header">
        <div className="header-date">{day.replace("日", "")}</div>
        <div className={`header-weekday ${colorClass}`}>{weekday}</div>
      </div>
    );
  };

  const convertToEvents = (reservations: Reservation[]) => {
    const events = [];

    for (const reservation of reservations) {
      if (reservation.seat === selectedSeat) {
        events.push({
          start: `${format(reservation.reservation_date, "yyyy-MM-dd")}T${
            reservation.reservation_time_start
          }`,
          end: `${format(reservation.reservation_date, "yyyy-MM-dd")}T${
            reservation.reservation_time_end
          }`,
          backgroundColor: "#6b7280",
        });
      }
    }

    return events;
  };

  return (
    <div className="mx-auto relative">
      <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        locale={jaLocale}
        slotMinTime="09:00:00"
        slotMaxTime="17:00:00"
        allDaySlot={false}
        businessHours={businessHours}
        events={convertToEvents(reservations)}
        headerToolbar={headerToolbar}
        height="auto"
        slotDuration="00:30:00"
        selectable={true}
        selectConstraint={businessHours}
        selectOverlap={false}
        initialDate={now}
        stickyHeaderDates={false}
        slotLabelFormat={slotLabelFormat}
        titleFormat={titleFormat}
        dayHeaderContent={dayHeaderContent}
        selectMinDistance={0}
        select={handleDateSelect}
        selectMirror={true}
        selectAllow={selectAllow}
        eventAllow={eventAllow}
      />
    </div>
  );
};
