import About from "./components/About";
import CTA from "./components/CTA";
import CommandCards from "./components/CommandCards";
import Ecosystem from "./components/Ecosystem";
import FeatureGrid from "./components/FeatureGrid";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Layout from "./components/Layout";
import Pipeline from "./components/Pipeline";
import VisualDemo from "./components/VisualDemo";

export default function App() {
  return (
    <Layout>
      <section id="home" class="w-full">
        <Hero />
      </section>
      <section id="about" class="w-full">
        <About />
      </section>
      <section id="pipeline" class="w-full">
        <Pipeline />
      </section>
      <section id="features" class="w-full">
        <FeatureGrid />
      </section>
      <section id="ecosystem" class="w-full">
        <Ecosystem />
      </section>
      <section id="how-it-works" class="w-full">
        <HowItWorks />
      </section>
      <section id="demo" class="w-full">
        <VisualDemo />
      </section>
      <section id="commands" class="w-full">
        <CommandCards />
      </section>
      <section id="install" class="w-full">
        <CTA />
      </section>
      <Footer />
    </Layout>
  );
}
