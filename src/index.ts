import { Probot } from "probot";
import { issuesHandler } from "./handlers/issues.ts";
import { pullRequestHandler } from "./handlers/pull-request.ts";
import type { ShipFeedWebhooks } from "./types.ts";

export default (app: Probot) => {
  const webhooks = app as unknown as ShipFeedWebhooks;
  issuesHandler(webhooks);
  pullRequestHandler(webhooks);

  app.on("ping", async () => {
    app.log.info("ship-feed bot is alive");
  });
};
