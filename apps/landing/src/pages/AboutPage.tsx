import About from "../components/About";
import PageFooter from "../components/PageFooter";
import PageIntro from "../components/PageIntro";
import Pipeline from "../components/Pipeline";
import VisualBlock from "../components/VisualBlock";

export default function AboutPage() {
  return (
    <>
      <PageIntro
        title="What is ship-feed?"
        subtitle="Every idea, issue, pull request, merge, and release becomes a card. Humans approve or reject. The system handles implementation, tests, evidence, shipping, and continuous learning."
        bullets={[
          "Ideas turn into scored cards with impact, risk, and effect metrics.",
          "Approval chains, evidence, and learning weights keep decisions safe.",
          "The bot executes the pipeline while you stay in control.",
        ]}
      >
        <VisualBlock variant="about" />
      </PageIntro>
      <About />
      <Pipeline />
      <PageFooter current="/about" />
    </>
  );
}
