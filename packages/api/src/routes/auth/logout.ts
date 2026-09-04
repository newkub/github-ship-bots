import { Elysia } from "elysia";
import { deleteSession } from "../../lib/session";
import { withEnv } from "../../lib/env";

const logout = withEnv(new Elysia({ prefix: "/auth" }));

logout.post("/logout", async ({ request, set, env }) => {
  await deleteSession({ request, set, env });
  return { ok: true };
});

export default logout;
