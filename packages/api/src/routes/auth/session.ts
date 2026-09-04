import { Elysia } from "elysia";
import { getSession } from "../../lib/session";
import { withEnv } from "../../lib/env";

const session = withEnv(new Elysia({ prefix: "/auth" }));

session.get("/session", async ({ request, set, env }) => {
  const user = await getSession({ request, set, env });
  if (!user) return { user: null };
  return { user };
});

export default session;
