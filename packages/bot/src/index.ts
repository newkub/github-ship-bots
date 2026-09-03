import { Probot } from "probot";
import { issuesHandler } from "./handlers/issues";
import { pullRequestHandler } from "./handlers/pull-request";
import { installationHandler } from "./handlers/installation";
import type { ShipFeedWebhooks } from "./types";

export default (app: Probot) => {
  const webhooks = app as unknown as ShipFeedWebhooks;
  installationHandler(webhooks);
  issuesHandler(webhooks);
  pullRequestHandler(webhooks);

  app.on("ping", async () => {
    app.log.info("github-ship-bots is alive");
  });
};
