import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type BookingStatus = "active" | "upcoming" | "completed";
type FilterStatus = "all" | BookingStatus;

type Booking = {
  id: string;
  service: string;
  date: string;
  time: string;
  address: string;
  status: BookingStatus;
  amount: number;
  paymentLabel: string;
  currentStep: number;
};

const BOOKING_STEPS = ["Booked", "Accepted", "On way", "Arrived", "Done"];

const BOOKINGS: Booking[] = [
  {
    id: "HF482931",
    service: "AC Repair",
    date: "23/3/2026",
    time: "2:30 PM",
    address: "12-B Sukhram Society",
    status: "active",
    amount: 450,
    paymentLabel: "PAID",
    currentStep: 2,
  },
  {
    id: "HF481020",
    service: "Plumber",
    date: "24/3/2026",
    time: "10:00 AM",
    address: "12-B Sukhram Society",
    status: "upcoming",
    amount: 300,
    paymentLabel: "PAID",
    currentStep: 1,
  },
  {
    id: "HF479854",
    service: "Electrical Work",
    date: "21/3/2026",
    time: "11:00 AM",
    address: "12-B Sukhram Society",
    status: "completed",
    amount: 520,
    paymentLabel: "PAID",
    currentStep: 4,
  },
];

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");

  const filteredBookings = useMemo(() => {
    if (activeFilter === "all") return BOOKINGS;
    return BOOKINGS.filter((b) => b.status === activeFilter);
  }, [activeFilter]);

  const countByStatus = (status: FilterStatus) => {
    if (status === "all") return BOOKINGS.length;
    return BOOKINGS.filter((b) => b.status === status).length;
  };

  return (
    <main className="min-h-screen w-full pt-24 pb-8 px-4" style={{ background: "#0f0f0f" }}>
      <section className="max-w-[1000px] mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h1 className="text-[32px] font-bold leading-tight" style={{ color: "#FFFFFF" }}>
              My Bookings
            </h1>
            <p className="text-sm mt-1" style={{ color: "#B0B0B0" }}>
              {BOOKINGS.length} total • {countByStatus("active")} active
            </p>
          </div>
        </header>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {[
            { key: "all", label: "All" },
            { key: "active", label: "Active" },
            { key: "upcoming", label: "Upcoming" },
            { key: "completed", label: "Completed" },
          ].map((filter) => {
            const key = filter.key as FilterStatus;
            const isActive = activeFilter === key;

            return (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(key)}
                className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap"
                style={{
                  background: isActive ? "#FFC107" : "#1a1a1a",
                  border: "1px solid #333333",
                  color: isActive ? "#1a1a1a" : "#FFFFFF",
                }}
              >
                {filter.label} ({countByStatus(key)})
              </button>
            );
          })}
        </div>

        <div className="space-y-6">
          {filteredBookings.map((booking) => (
            <article
              key={booking.id}
              className="rounded-xl p-6"
              style={{
                background: "#1a1a1a",
                border: "1px solid #333333",
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-[20px] font-semibold" style={{ color: "#FFFFFF" }}>
                    {booking.service}
                  </h2>
                  <p className="text-xs mt-1" style={{ color: "#B0B0B0" }}>
                    #{booking.id}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-[24px] font-bold" style={{ color: "#FFC107" }}>
                    Rs{booking.amount}
                  </div>
                  <span
                    className="inline-block mt-1 text-xs font-semibold px-2 py-1 rounded-full"
                    style={{ background: "#00E676", color: "#1a1a1a" }}
                  >
                    {booking.paymentLabel}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-5 text-sm" style={{ color: "#B0B0B0" }}>
                <span>Date {booking.date}</span>
                <span>Time {booking.time}</span>
                <span>Location {booking.address}</span>
              </div>

              <div className="mb-6">
                <div className="relative flex items-center justify-between">
                  <div
                    className="absolute left-0 right-0 top-3 h-[2px]"
                    style={{ background: "#333333", zIndex: 0 }}
                  />
                  <div
                    className="absolute left-0 top-3 h-[2px]"
                    style={{
                      width: `${(booking.currentStep / (BOOKING_STEPS.length - 1)) * 100}%`,
                      background: "#FFC107",
                      zIndex: 1,
                    }}
                  />

                  {BOOKING_STEPS.map((step, index) => {
                    const isActive = index <= booking.currentStep;
                    return (
                      <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                        <span
                          className="w-6 h-6 rounded-full border"
                          style={{
                            background: isActive ? "#FFC107" : "#0f0f0f",
                            borderColor: isActive ? "#FFC107" : "#FFFFFF",
                          }}
                        />
                        <span className="text-[11px]" style={{ color: "#B0B0B0" }}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                className="w-full h-11 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, #FFC107 0%, #FFB300 100%)",
                  color: "#1a1a1a",
                }}
                onClick={() => navigate("/tracking")}
              >
                Track Live -&gt;
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default MyBookingsPage;
