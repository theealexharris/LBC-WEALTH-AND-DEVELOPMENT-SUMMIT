import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CredibilityStrip from "@/components/CredibilityStrip";
import TransformationSection from "@/components/TransformationSection";
import SummitPillars from "@/components/SummitPillars";
import AudienceSection from "@/components/AudienceSection";
import SpeakerGrid from "@/components/SpeakerGrid";
import ExperienceSection from "@/components/ExperienceSection";
import AgendaTabs from "@/components/AgendaTabs";
import VIPSection from "@/components/VIPSection";
import OutcomesSection from "@/components/OutcomesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import TicketSection from "@/components/TicketSection";
import VenueSection from "@/components/VenueSection";
import SponsorSection from "@/components/SponsorSection";
import FAQSection from "@/components/FAQSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import RegistrationModal from "@/components/RegistrationModal";

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTicketType, setModalTicketType] = useState<"general" | "vip">("general");

  const openModal = (type: "general" | "vip") => {
    setModalTicketType(type);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  return (
    <>
      <Header onOpenModal={openModal} />

      <main>
        <Hero onOpenModal={openModal} />
        <CredibilityStrip />
        <TransformationSection onOpenModal={openModal} />
        <SummitPillars />
        <AudienceSection onOpenModal={openModal} />
        <SpeakerGrid />
        <ExperienceSection onOpenModal={openModal} />
        <AgendaTabs />
        <VIPSection onOpenModal={openModal} />
        <OutcomesSection onOpenModal={openModal} />
        <TestimonialsSection />
        <TicketSection onOpenModal={openModal} />
        <VenueSection />
        <SponsorSection />
        <FAQSection />
        <FinalCTA onOpenModal={openModal} />
      </main>

      <Footer />

      <RegistrationModal
        open={modalOpen}
        ticketType={modalTicketType}
        onClose={closeModal}
      />
    </>
  );
}
