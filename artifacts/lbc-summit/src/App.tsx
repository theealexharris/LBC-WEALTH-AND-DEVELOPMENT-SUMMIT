import { Switch, Route, useLocation } from "wouter";
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
import TicketSection from "@/components/TicketSection";
import VenueSection from "@/components/VenueSection";
import SponsorSection from "@/components/SponsorSection";
import FAQSection from "@/components/FAQSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import RegisterPage from "@/pages/RegisterPage";
import SuccessPage from "@/pages/SuccessPage";
import AdminPage from "@/pages/AdminPage";

function LandingPage() {
  const [, navigate] = useLocation();
  const openModal = (_type: "general" | "vip" | "young_adult") => navigate("/register");

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
        <TicketSection onOpenModal={openModal} />
        <VenueSection />
        <SponsorSection />
        <FAQSection />
        <FinalCTA onOpenModal={openModal} />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Switch>
      <Route path="/register/success" component={SuccessPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/admin" component={AdminPage} />
      <Route component={LandingPage} />
    </Switch>
  );
}
