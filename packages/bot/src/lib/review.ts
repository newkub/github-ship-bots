import { getBotEnv } from "./api";
import { fetchExternal, getCorrelationId } from "@ship-feed/shared";

function heuristicReview(diff: string): string {
  const added = (diff.match(/^\+[^+]/gm) ?? []).length;
  const removed = (diff.match(/^-[^-]/gm) ?? []).length;
  const files = new Set((diff.match(/^diff --git a\/(.+?) b\//gm) ?? []).map((m) => m.replace(/^diff --git a\/(.+?) b\//, "$1")));
  const fileList = Array.from(files).slice(0, 5);

  const lines: string[] = [];
  lines.push("## ship-feed code review");
  lines.push(`- **Files changed:** ${files.size}`);
  lines.push(`- **Added lines:** ${added}`);
  lines.push(`- **Removed lines:** ${removed}`);

  if (files.size === 0) {
    lines.push("- **Note:** diff not available or empty");
  } else {
    lines.push(`- **Top files:** ${fileList.join(", ")}${files.size > 5 ? "..." : ""}`);
  }

  const concerns: string[] = [];
  if (added > 200 && removed < 20) concerns.push("Large addition with little cleanup — consider splitting.");
  if (removed > 200 && added < 20) concerns.push("Large deletion — ensure no critical code was removed.");
  if (diff.includes("console.log") || diff.includes("debugger")) concerns.push("Contains debug statements.");
  if (diff.includes("TODO") || diff.includes("FIXME")) concerns.push("Contains TODO/FIXME comments.");

  if (concerns.length === 0) {
    lines.push("- **Verdict:** looks clean");
  } else {
    lines.push("- **Concerns:**");
    for (const c of concerns) lines.push(`  - ${c}`);
  }

  return lines.join("\n");
}

async function openaiReview(diff: string, apiKey: string, baseUrl: string, model: string, correlationId: string): Promise<string> {
  const res = await fetchExternal("openai", "chat.completions", correlationId, `${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "You are a concise code reviewer. Summarize the diff in 3-5 bullets. Mention risks and cleanups." },
        { role: "user", content: diff.slice(0, 12000) },
      ],
      max_tokens: 300,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${text}`);
  }
  const data = (await res.json()) as { choices: { message: { content: string } }[] };
  return data.choices[0]?.message?.content?.trim() || "AI review unavailable.";
}

export async function generateReviewComment(diff: string): Promise<string> {
  const env = getBotEnv();
  if (!env.OPENAI_API_KEY) {
    return heuristicReview(diff);
  }
  const baseUrl = env.OPENAI_API_URL || "https://api.openai.com/v1";
  const model = env.OPENAI_MODEL || "gpt-4o-mini";
  const correlationId = getCorrelationId();
  try {
    return await openaiReview(diff, env.OPENAI_API_KEY, baseUrl, model, correlationId);
  } catch {
    return heuristicReview(diff);
  }
}
