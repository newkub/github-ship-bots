import HowItWorks from "../components/HowItWorks";
import PageFooter from "../components/PageFooter";
import PageIntro from "../components/PageIntro";
import VisualBlock from "../components/VisualBlock";
import VisualDemo from "../components/VisualDemo";

export default function HowItWorksPage() {
  return (
    <>
      <PageIntro
        title="How it works"
        subtitle="Connect your repository, set rules, vote on cards, and let the bot ship the rest."
        bullets={[
          "Install the GitHub App and choose repositories.",
          "Comment /approve or /reject, or swipe on mobile.",
          "The bot implements, tests, gathers evidence, and deploys.",
        ]}
      >
        <VisualBlock variant="how-it-works" />
      </PageIntro>
      <HowItWorks />
      <VisualDemo />
      <PageFooter current="/how-it-works" />
    </>
  );
}
