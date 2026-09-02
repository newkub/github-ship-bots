import About from "./components/About";
import CTA from "./components/CTA";
import CommandCards from "./components/CommandCards";
import DashboardPreview from "./components/DashboardPreview";
import Ecosystem from "./components/Ecosystem";
import FeatureGrid from "./components/FeatureGrid";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Layout from "./components/Layout";
import Pipeline from "./components/Pipeline";
import Section from "./components/Section";
import VisualDemo from "./components/VisualDemo";

export default function App() {
  return (
    <Layout>
      <section id="home" class="w-full">
        <Hero />
      </section>
      <Section id="preview" class="w-full">
        <DashboardPreview />
      </Section>
      <Section id="about" class="w-full">
        <About />
      </Section>
      <Section id="pipeline" class="w-full">
        <Pipeline />
      </Section>
      <Section id="features" class="w-full">
        <FeatureGrid />
      </Section>
      <Section id="ecosystem" class="w-full">
        <Ecosystem />
      </Section>
      <Section id="how-it-works" class="w-full">
        <HowItWorks />
      </Section>
      <Section id="demo" class="w-full">
        <VisualDemo />
      </Section>
      <Section id="commands" class="w-full">
        <CommandCards />
      </Section>
      <Section id="install" class="w-full">
        <CTA />
      </Section>
      <Footer />
    </Layout>
  );
}
