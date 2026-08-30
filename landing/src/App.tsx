import About from "./components/About";
import AppStatus from "./components/AppStatus";
import CTA from "./components/CTA";
import CommandTable from "./components/CommandTable";
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
          <CommandTable />
        </section>
        <section id="install">
          <CTA />
          <AppStatus />
        </section>
        <Footer />
      </div>
    </Layout>
  );
}
