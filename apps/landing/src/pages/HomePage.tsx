import DashboardPreview from "../components/DashboardPreview";
import Hero from "../components/Hero";
import PageFooter from "../components/PageFooter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <DashboardPreview />
      <PageFooter current="/" />
    </>
  );
}
