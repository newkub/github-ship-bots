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

interface SelectorPart {
  tag?: string;
  id?: string;
  className?: string;
}

function parseSelector(selector: string): SelectorPart[] | undefined {
  const parts = selector.split(/\s*([>~+])\s*|\s+/).filter(Boolean);
  const result: SelectorPart[] = [];
  for (const part of parts) {
    if ([">", "~", "+"].includes(part)) continue;
    const parsed: SelectorPart = {};
    // split on # and .
    const tokens = part.split(/(?=[.#])/);
    for (const token of tokens) {
      if (token.startsWith("#")) {
        parsed.id = token.slice(1);
      } else if (token.startsWith(".")) {
        parsed.className = token.slice(1);
      } else if (token) {
        parsed.tag = token.toLowerCase();
      }
    }
    if (!parsed.tag && !parsed.id && !parsed.className) return undefined;
    result.push(parsed);
  }
  return result.length > 0 ? result : undefined;
}

function matchOpenTag(tag: string, attrs: string, part: SelectorPart): boolean {
  if (part.tag && tag.toLowerCase() !== part.tag) return false;
  if (part.id) {
    const idMatch = attrs.match(new RegExp(`\\bid\\s*=\\s*"([^"]*\\b${escapeRegex(part.id)}\\b[^"]*)"`, "i"));
    if (!idMatch) return false;
  }
  if (part.className) {
    const classMatch = attrs.match(new RegExp(`\\bclass\\s*=\\s*"([^"]*\\b${escapeRegex(part.className)}\\b[^"]*)"`, "i"));
    if (!classMatch) return false;
  }
  return true;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractSelectorText(html: string, selector: string): string | undefined {
  const parts = parseSelector(selector);
  if (!parts || parts.length === 0) return undefined;

  if (parts.length === 1) {
    const part = parts[0]!;
    const tagRegex = new RegExp(`<([a-zA-Z0-9_-]+)([^>]*)>`, "g");
    let match: RegExpExecArray | null;
    while ((match = tagRegex.exec(html)) !== null) {
      const [fullOpen, tag, attrs] = match;
      if (!tag || attrs === undefined) continue;
      if (matchOpenTag(tag, attrs, part)) {
        const start = fullOpen.length + match.index;
        const closeRegex = new RegExp(`<\\/${escapeRegex(tag)}\\s*>`, "i");
        const endMatch = html.slice(start).match(closeRegex);
        if (endMatch?.index !== undefined) {
          const inner = html.slice(start, start + endMatch.index);
          return stripHtml(inner);
        }
      }
    }
    return undefined;
  }

  // Descendant / child chain: find the first leaf element matched inside the closest ancestor.
  // Naive approach: search for the first matching leaf tag inside the first matching ancestor.
  const last = parts[parts.length - 1]!;
  const ancestor = parts[parts.length - 2]!;
  const ancestorRegex = new RegExp(`<([a-zA-Z0-9_-]+)([^>]*)>`, "g");
  let match: RegExpExecArray | null;
  while ((match = ancestorRegex.exec(html)) !== null) {
    const [, tag, attrs] = match;
    if (!tag || attrs === undefined) continue;
    if (matchOpenTag(tag, attrs, ancestor)) {
      const closeRegex = new RegExp(`<\\/${escapeRegex(tag)}\\s*>`, "i");
      const endMatch = html.slice(match.index + match[0].length).match(closeRegex);
      if (endMatch?.index !== undefined) {
        const inner = html.slice(match.index + match[0].length, match.index + match[0].length + endMatch.index);
        const text = extractSelectorText(inner, selectorForPart(last));
        if (text) return text;
      }
    }
  }
  return undefined;
}

function selectorForPart(part: SelectorPart): string {
  const parts: string[] = [];
  if (part.tag) parts.push(part.tag);
  if (part.id) parts.push(`#${part.id}`);
  if (part.className) parts.push(`.${part.className}`);
  return parts.join("");
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
