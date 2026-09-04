import CTA from "../components/CTA";
import DashboardPreview from "../components/DashboardPreview";
import FeatureGrid from "../components/FeatureGrid";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Integrations from "../components/Integrations";
import PageFooter from "../components/PageFooter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <DashboardPreview />
      <FeatureGrid />
      <HowItWorks />
      <Integrations />
      <CTA />
      <PageFooter current="/" />
    </>
  );
}
