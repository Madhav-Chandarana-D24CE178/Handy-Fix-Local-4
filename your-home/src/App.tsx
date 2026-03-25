import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useApp } from "./contexts/AppContext";
import Navbar from "@/components/landing/Navbar";

import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import ServiceDetailPage from "./pages/ServiceDetailPage.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import ProviderProfilePage from "./pages/ProviderProfilePage.tsx";
import BookingFormPage from "./pages/BookingFormPage.tsx";
import BookingSuccessPage from "./pages/BookingSuccessPage.tsx";
import MyBookingsPage from "./pages/MyBookingsPage.tsx";
import MessagesPage from "./pages/MessagesPage.tsx";
import TrackingPage from "./pages/TrackingPage.tsx";
import PaymentPage from "./pages/PaymentPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import NotificationsPage from "./pages/NotificationsPage.tsx";
import PriceEstimatorPage from "./pages/PriceEstimatorPage.tsx";
import SubscriptionPage from "./pages/SubscriptionPage.tsx";
import ReferralPage from "./pages/ReferralPage.tsx";
import ServicesPage from "./pages/ServicesPage.tsx";
import EmergencyPage from "./pages/EmergencyPage.tsx";

const appRoutes = [
  { path: "/", element: <Index /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/search", element: <SearchPage /> },
  { path: "/price-estimator", element: <PriceEstimatorPage /> },
  { path: "/service/:id", element: <ServiceDetailPage /> },
  { path: "/provider/:id", element: <ProviderProfilePage /> },
  { path: "/home", element: <HomePage /> },
  { path: "/booking-form", element: <BookingFormPage /> },
  { path: "/booking-success", element: <BookingSuccessPage /> },
  { path: "/my-bookings", element: <MyBookingsPage /> },
  { path: "/messages", element: <MessagesPage /> },
  { path: "/tracking", element: <TrackingPage /> },
  { path: "/payment", element: <PaymentPage /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/notifications", element: <NotificationsPage /> },
  { path: "/services", element: <ServicesPage /> },
  { path: "/emergency", element: <EmergencyPage /> },
  { path: "/subscription", element: <SubscriptionPage /> },
  { path: "/referral", element: <ReferralPage /> },
  { path: "*", element: <NotFound /> },
];

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          {appRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
