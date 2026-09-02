import { Hono } from "hono";
import { cors } from "hono/cors";
import { setCookie, getCookie, deleteCookie } from "hono/cookie";
import auth from "./routes/auth";
import cards from "./routes/cards";
import repos from "./routes/repos";
import plugins from "./routes/plugins";
import evidence from "./routes/evidence";
import oracle from "./routes/oracle";
import inspector from "./routes/inspector";
import stripe from "./routes/stripe";
import learning from "./routes/learning";
import push from "./routes/push";
import type { Env } from "@ship-feed/shared";

const app = new Hono<{ Bindings: Env }>();

app.use(
  "*",
  cors({
    origin: [
      "https://github-ship-bots.newkubise.workers.dev",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);

app.get("/", (c) => c.text(""));
app.get("/health", (c) => c.json({ ok: true, service: "ship-feed-api" }));

app.route("/auth", auth);
app.route("/api/cards", cards);
app.route("/api/repos", repos);
app.route("/api/plugins", plugins);
app.route("/api/evidence", evidence);
app.route("/api/oracle", oracle);
app.route("/api/inspector", inspector);
app.route("/api/stripe", stripe);
app.route("/api/learning", learning);
app.route("/api/push", push);

export default app;
