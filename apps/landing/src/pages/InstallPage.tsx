import CTA from "../components/CTA";
import PageFooter from "../components/PageFooter";
import PageIntro from "../components/PageIntro";
import VisualBlock from "../components/VisualBlock";

export default function InstallPage() {
  return (
    <>
      <PageIntro
        title="Install ship-feed"
        subtitle="Start shipping with approval-first automation on your repositories."
        bullets={[
          "Install the GitHub App and choose repositories.",
          "Open the dashboard to manage cards and rules.",
          "Comment or swipe to approve; the bot handles the rest.",
        ]}
      >
        <VisualBlock variant="install" />
      </PageIntro>
      <CTA />
      <PageFooter current="/install" />
    </>
  );
}
