import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import type { PluggableList } from "unified";

const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;
const RESERVED_IDS = new Set(["videoseries", "live_stream"]);
const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
  "youtu.be",
  "www.youtu.be",
]);

/** Embed URLs this app is willing to place in an iframe. */
const EMBED_SRC =
  /^https:\/\/www\.youtube-nocookie\.com\/embed\/[A-Za-z0-9_-]{11}\?(?:start=\d{1,5}&)?(?:end=\d{1,5}&)?rel=0$/;

const IFRAME_ALLOW =
  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

const MAX_START_SECONDS = 24 * 60 * 60;

type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
};

type MdNode = {
  type: string;
  url?: string;
  value?: string;
  children?: MdNode[];
};

export const youtubeSanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "iframe"],
  attributes: {
    ...defaultSchema.attributes,
    iframe: [
      ["src", EMBED_SRC],
      ["allow", IFRAME_ALLOW],
      ["allowFullScreen", true],
      ["loading", "lazy"],
      ["referrerPolicy", "strict-origin-when-cross-origin"],
    ],
  },
};

function parseTime(value: string | null): number | null {
  if (!value) return null;
  if (/^\d{1,6}$/.test(value)) {
    const seconds = Number(value);
    return seconds <= MAX_START_SECONDS ? seconds : null;
  }
  const match = /^(?:(\d{1,3})h)?(?:(\d{1,4})m)?(?:(\d{1,5})s)?$/.exec(value);
  if (!match || (!match[1] && !match[2] && !match[3])) return null;
  const seconds =
    Number(match[1] || 0) * 3600 +
    Number(match[2] || 0) * 60 +
    Number(match[3] || 0);
  return seconds <= MAX_START_SECONDS ? seconds : null;
}

/**
 * Turn a YouTube watch, short, or embed URL into a privacy-enhanced embed
 * URL. Returns null for anything that is not a single public video.
 */
export function toSafeEmbedSrc(input: string): string | null {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }

  if (url.protocol !== "https:") return null;
  if (url.username || url.password) return null;
  if (!YOUTUBE_HOSTS.has(url.hostname)) return null;

  let id: string | undefined;
  if (url.hostname === "youtu.be" || url.hostname === "www.youtu.be") {
    id = /^\/([A-Za-z0-9_-]{11})$/.exec(url.pathname)?.[1];
  } else if (url.pathname === "/watch") {
    id = url.searchParams.get("v") ?? undefined;
  } else {
    id =
      /^\/embed\/([A-Za-z0-9_-]{11})$/.exec(url.pathname)?.[1] ??
      /^\/shorts\/([A-Za-z0-9_-]{11})$/.exec(url.pathname)?.[1];
  }

  if (!id || !VIDEO_ID.test(id) || RESERVED_IDS.has(id)) return null;

  const start = parseTime(url.searchParams.get("start") ?? url.searchParams.get("t"));
  const end = parseTime(url.searchParams.get("end"));
  const safe = new URL(`https://www.youtube-nocookie.com/embed/${id}`);
  if (start != null && start > 0) safe.searchParams.set("start", String(start));
  if (end != null && end > 0 && (start == null || end > start)) {
    safe.searchParams.set("end", String(end));
  }
  safe.searchParams.set("rel", "0");

  const result = safe.toString();
  return EMBED_SRC.test(result) ? result : null;
}

function cleanTitle(value: unknown): string {
  if (typeof value !== "string") return "YouTube video";
  const cleaned = value.replace(/[\u0000-\u001F\u007F]/g, "").trim();
  return cleaned.slice(0, 180) || "YouTube video";
}

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function plainText(node: MdNode): string {
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(plainText).join("");
}

/** A paragraph whose only content is a YouTube link becomes an embed. */
export function remarkSafeYoutubeEmbeds() {
  return (tree: { children?: MdNode[] }) => {
    const children = tree.children;
    if (!children) return;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.type !== "paragraph" || !child.children?.length) continue;
      const meaningful = child.children.filter(
        (node) => !(node.type === "text" && !(node.value ?? "").trim())
      );
      if (meaningful.length !== 1) continue;
      const only = meaningful[0];
      const url =
        only.type === "link"
          ? only.url
          : only.type === "text"
            ? only.value?.trim()
            : undefined;
      if (!url) continue;
      const safe = toSafeEmbedSrc(url);
      if (!safe) continue;
      const title = escapeHtmlAttr(plainText(only).trim() || "YouTube video");
      children[i] = {
        type: "html",
        value: `<iframe src="${safe}" title="${title}"></iframe>`,
      };
    }
  };
}

/**
 * Keep only YouTube iframes, and rebuild each one with a fixed allow-list
 * of attributes. Other iframes are removed.
 */
export function rehypeSafeYoutubeEmbeds() {
  return (tree: HastNode) => {
    rewrite(tree);
  };
}

function rewrite(node: HastNode) {
  if (!node.children) return;
  for (let i = node.children.length - 1; i >= 0; i--) {
    const child = node.children[i];
    if (child.type === "element" && child.tagName === "iframe") {
      const src =
        typeof child.properties?.src === "string" ? child.properties.src : "";
      const safe = toSafeEmbedSrc(src);
      if (!safe) {
        node.children.splice(i, 1);
        continue;
      }
      child.properties = {
        src: safe,
        title: cleanTitle(child.properties?.title),
        loading: "lazy",
        referrerPolicy: "strict-origin-when-cross-origin",
        allow: IFRAME_ALLOW,
        allowFullScreen: true,
      };
      child.children = [];
      continue;
    }
    rewrite(child);
  }
}

export const blogRemarkPlugins: PluggableList = [
  remarkGfm,
  remarkSafeYoutubeEmbeds,
];

export const blogRehypePlugins: PluggableList = [
  rehypeRaw,
  rehypeSafeYoutubeEmbeds,
  [rehypeSanitize, youtubeSanitizeSchema],
];
