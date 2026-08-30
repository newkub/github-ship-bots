import About from "./components/About";
import AppStatus from "./components/AppStatus";
import CTA from "./components/CTA";
import CommandTable from "./components/CommandTable";
import FeatureGrid from "./components/FeatureGrid";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";

export default function App() {
  return (
    <div class="min-h-screen bg-zinc-950 text-zinc-50 font-sans antialiased">
      <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />
        <About />
        <FeatureGrid />
        <HowItWorks />
        <CommandTable />
        <AppStatus />
        <CTA />
        <Footer />
      </main>
    </div>
  );
}
