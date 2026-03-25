import { useEffect } from "react";
import Preloader from "@/components/landing/Preloader";
import HeroSection from "@/components/landing/HeroSection";
import TrustStats from "@/components/landing/TrustStats";
import ServicesGrid from "@/components/landing/ServicesGrid";
import TrendingStrip from "@/components/landing/TrendingStrip";
import PromoBanners from "@/components/landing/PromoBanners";
import HowItWorks from "@/components/landing/HowItWorks";
import WhyHandyFix from "@/components/landing/WhyHandyFix";
import ForUsers from "@/components/landing/ForUsers";
import ForProviders from "@/components/landing/ForProviders";
import Testimonials from "@/components/landing/Testimonials";
import AppDownload from "@/components/landing/AppDownload";
import Footer from "@/components/landing/Footer";
import { LocationModal } from "@/components/shared/LocationModal";

const Index = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    // Slight delay to let preloader clear
    const timeout = setTimeout(() => {
      document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => {
        observer.observe(el);
      });
    }, 200);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="font-body">
      <Preloader />
      <HeroSection />
      <TrustStats />
      <ServicesGrid />
      <TrendingStrip />
      <PromoBanners />
      <HowItWorks />
      <WhyHandyFix />
      <ForUsers />
      <ForProviders />
      <Testimonials />
      <AppDownload />
      <Footer />
      <LocationModal />
    </div>
  );
};

export default Index;
