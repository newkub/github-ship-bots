import Ecosystem from "../components/Ecosystem";
import FeatureGrid from "../components/FeatureGrid";
import PageFooter from "../components/PageFooter";
import PageIntro from "../components/PageIntro";
import VisualBlock from "../components/VisualBlock";

export default function FeaturesPage() {
  return (
    <>
      <PageIntro
        title="Features"
        subtitle="ship-feed combines speed, intelligence, and safety into a single card-driven workflow."
        bullets={[
          "Fast: cards are created, scored, and queued in seconds.",
          "Smart: auto scoring, evidence, and learning improve every cycle.",
          "Safe: approval chains, security guardrails, and rollback traces protect production.",
        ]}
      >
        <VisualBlock variant="features" />
      </PageIntro>
      <FeatureGrid />
      <Ecosystem />
      <PageFooter current="/features" />
    </>
  );
}
