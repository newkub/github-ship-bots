import CommandCards from "../components/CommandCards";
import PageFooter from "../components/PageFooter";
import PageIntro from "../components/PageIntro";
import VisualBlock from "../components/VisualBlock";

export default function CommandsPage() {
  return (
    <>
      <PageIntro
        title="Commands"
        subtitle="Vote from anywhere with a simple comment. The bot reads the command and advances the card."
        bullets={[
          "/approve queues the card for implementation.",
          "/reject closes the card and records the reason.",
          "/ship triggers deployment when the card is ready.",
        ]}
      >
        <VisualBlock variant="commands" />
      </PageIntro>
      <CommandCards />
      <PageFooter current="/commands" />
    </>
  );
}
