export interface InspectResult {
  ok: boolean;
  status: number;
  title?: string;
  selectorText?: string;
  error?: string;
}

export async function inspectUrl(url: string, selector: string): Promise<InspectResult> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: { "user-agent": "ship-feed-inspector/1.0" },
    });
  } catch (err) {
    return { ok: false, status: 0, error: err instanceof Error ? err.message : String(err) };
  }

  const html = await response.text();
  const title = extractTitle(html);
  const selectorText = selector ? extractSelectorText(html, selector) : undefined;

  return {
    ok: response.ok,
    status: response.status,
    title,
    selectorText,
  };
}

function extractTitle(html: string): string | undefined {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!match?.[1]) return undefined;
  return match[1].replace(/\s+/g, " ").trim();
}

function extractSelectorText(html: string, selector: string): string | undefined {
  const tag = parseTagFromSelector(selector);
  if (!tag) return undefined;
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = html.match(regex);
  if (!match?.[1]) return undefined;
  return match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function parseTagFromSelector(selector: string): string | undefined {
  const m = selector.trim().match(/^([a-zA-Z0-9_-]+)/);
  return m?.[1];
}
