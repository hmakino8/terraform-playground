"use client";

import { ScreenHub } from "./components/layout/ScreenHub";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { AuthProvider } from "./providers/AuthProvider";
import { ScreenProvider } from "./providers/ScreenProvider";
import { UIStateProvider } from "./providers/UIStateProvider";
import { CalendarProvider } from "./providers/CalendarProvider";
import { ReservationProvider } from "./providers/ReservationProvider";

export default function UserPage() {
  return (
    <AuthProvider>
      <UIStateProvider>
        <CalendarProvider>
          <ReservationProvider>
            <ScreenProvider>
              <Header />
              <ScreenHub />
              <Footer />
            </ScreenProvider>
          </ReservationProvider>
        </CalendarProvider>
      </UIStateProvider>
    </AuthProvider>
  );
}
