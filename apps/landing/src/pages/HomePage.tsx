import DashboardPreview from "../components/DashboardPreview";
import FeatureGrid from "../components/FeatureGrid";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import PageFooter from "../components/PageFooter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <DashboardPreview />
      <FeatureGrid />
      <HowItWorks />
      <PageFooter current="/" />
    </>
  );
}
