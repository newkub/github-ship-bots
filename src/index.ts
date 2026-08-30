import { Probot } from "probot";
import { issuesHandler } from "./handlers/issues.ts";
import { pullRequestHandler } from "./handlers/pull-request.ts";

export default (app: Probot) => {
  issuesHandler(app as any);
  pullRequestHandler(app as any);

  app.on("ping", async () => {
    app.log.info("ship-feed bot is alive");
  });
};
