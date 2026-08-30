import About from "./components/About";
import CTA from "./components/CTA";
import CommandCards from "./components/CommandCards";
import FeatureGrid from "./components/FeatureGrid";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Layout from "./components/Layout";

export default function App() {
  return (
    <Layout>
      <section id="home">
        <Hero />
      </section>
      <div class="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
        <section id="about">
          <About />
        </section>
        <section id="features">
          <FeatureGrid />
        </section>
        <section id="how-it-works">
          <HowItWorks />
        </section>
        <section id="commands">
          <CommandCards />
        </section>
        <section id="install">
          <CTA />
        </section>
        <Footer />
      </div>
    </Layout>
  );
}
