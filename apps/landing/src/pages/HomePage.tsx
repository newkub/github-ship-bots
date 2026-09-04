import CTA from "../components/CTA";
import DashboardPreview from "../components/DashboardPreview";
import FeatureGrid from "../components/FeatureGrid";
import FeatureSpotlight from "../components/FeatureSpotlight";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Integrations from "../components/Integrations";
import PageFooter from "../components/PageFooter";
import Stats from "../components/Stats";
import UseCases from "../components/UseCases";

export default function HomePage() {
  return (
    <>
      <Hero />
      <DashboardPreview />
      <FeatureGrid />
      <FeatureSpotlight />
      <HowItWorks />
      <Stats />
      <UseCases />
      <Integrations />
      <CTA />
      <PageFooter current="/" />
    </>
  );
}
