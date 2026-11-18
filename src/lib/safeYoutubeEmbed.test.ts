import assert from "node:assert/strict";
import test from "node:test";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import {
  blogRehypePlugins,
  blogRemarkPlugins,
  toSafeEmbedSrc,
} from "./safeYoutubeEmbed.ts";

const VIDEO = "hVoGbdJPUbU";
const SAFE = `https://www.youtube-nocookie.com/embed/${VIDEO}?rel=0`;

type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
};

async function render(markdown: string): Promise<HastNode> {
  const processor = unified().use(remarkParse);
  for (const plugin of blogRemarkPlugins) {
    if (Array.isArray(plugin)) processor.use(plugin[0], ...plugin.slice(1));
    else processor.use(plugin);
  }
  processor.use(remarkRehype, { allowDangerousHtml: true });
  for (const plugin of blogRehypePlugins) {
    if (Array.isArray(plugin)) processor.use(plugin[0], ...plugin.slice(1));
    else processor.use(plugin);
  }
  return processor.run(processor.parse(markdown));
}

function collect(tree: HastNode, tagName: string): HastNode[] {
  const found: HastNode[] = [];
  const walk = (node: HastNode) => {
    if (node.type === "element" && node.tagName === tagName) found.push(node);
    node.children?.forEach(walk);
  };
  walk(tree);
  return found;
}

function textOf(tree: HastNode): string {
  if (tree.type === "text") return tree.value ?? "";
  return (tree.children ?? []).map(textOf).join("");
}

test("rewrites watch, short, and embed URLs onto youtube-nocookie", () => {
  assert.equal(
    toSafeEmbedSrc(`https://www.youtube.com/watch?v=${VIDEO}`),
    SAFE
  );
  assert.equal(toSafeEmbedSrc(`https://youtu.be/${VIDEO}`), SAFE);
  assert.equal(
    toSafeEmbedSrc(`https://www.youtube.com/embed/${VIDEO}?autoplay=1&enablejsapi=1`),
    SAFE
  );
  assert.equal(
    toSafeEmbedSrc(`https://www.youtube.com/shorts/${VIDEO}`),
    SAFE
  );
  assert.equal(
    toSafeEmbedSrc(`https://m.youtube.com/watch?v=${VIDEO}&t=1m30s`),
    `https://www.youtube-nocookie.com/embed/${VIDEO}?start=90&rel=0`
  );
});

test("rejects non-video and deceptive URLs", () => {
  const rejected = [
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "https://evil.com/embed/" + VIDEO,
    "https://www.youtube.com.evil.com/embed/" + VIDEO,
    "https://www.youtube.com@evil.com/embed/" + VIDEO,
    "https://www.youtube.com/embed/videoseries?list=PL123",
    "https://www.youtube.com/embed/live_stream?channel=UCxxxx",
    "https://www.youtube.com/watch?v=short",
    "https://www.youtube.com/@Forevergreenapp",
    "//www.youtube.com/embed/" + VIDEO,
    `https://www.youtube.com/embed/${VIDEO}/../../evil`,
    `http://www.youtube.com/watch?v=${VIDEO}`,
  ];
  for (const input of rejected) {
    assert.equal(toSafeEmbedSrc(input), null, input);
  }
});

test("a lone YouTube link becomes one nocookie iframe", async () => {
  const tree = await render(
    `Watch this\n\nhttps://www.youtube.com/watch?v=${VIDEO}&autoplay=1\n\nThanks`
  );
  const iframes = collect(tree, "iframe");
  assert.equal(iframes.length, 1);
  assert.equal(iframes[0].properties?.src, SAFE);
  assert.equal(iframes[0].properties?.allowFullScreen, true);
  assert.equal(iframes[0].properties?.loading, "lazy");
  assert.equal(
    iframes[0].properties?.referrerPolicy,
    "strict-origin-when-cross-origin"
  );
  assert.equal(textOf(tree).includes("Watch this"), true);
  assert.equal(textOf(tree).includes("Thanks"), true);
});

test("inline YouTube links stay links", async () => {
  const tree = await render(
    `**Watch the full video:** [Phantom jams](https://www.youtube.com/watch?v=${VIDEO}) on YouTube.`
  );
  assert.equal(collect(tree, "iframe").length, 0);
  const links = collect(tree, "a");
  assert.equal(links.length, 1);
  assert.equal(
    links[0].properties?.href,
    `https://www.youtube.com/watch?v=${VIDEO}`
  );
});

test("raw iframes are hardened or removed", async () => {
  const tree = await render(`
<iframe src="https://www.youtube.com/embed/${VIDEO}?autoplay=1" onload="alert(1)" srcdoc="&lt;script&gt;alert(1)&lt;/script&gt;" allow="camera; microphone"></iframe>

<iframe src="https://evil.example/embed/${VIDEO}"></iframe>

<iframe src="javascript:alert(1)"></iframe>

<script>alert(1)</script>

<img src="javascript:alert(1)" onerror="alert(1)" alt="nope">
`);
  const iframes = collect(tree, "iframe");
  assert.equal(iframes.length, 1);
  assert.equal(iframes[0].properties?.src, SAFE);
  assert.equal(iframes[0].properties?.onload, undefined);
  assert.equal(iframes[0].properties?.srcdoc, undefined);
  assert.equal(String(iframes[0].properties?.allow).includes("camera"), false);
  assert.equal(collect(tree, "script").length, 0);
  const images = collect(tree, "img");
  assert.equal(images[0]?.properties?.onerror, undefined);
  assert.equal(images[0]?.properties?.src, undefined);
});

test("the phantom traffic jams post embeds one safe player", async () => {
  const { readFile } = await import("node:fs/promises");
  const markdown = await readFile(
    new URL(
      "../../public/post/the-science-of-phantom-traffic-jams/content.md",
      import.meta.url
    ),
    "utf8"
  );
  const tree = await render(markdown);
  const iframes = collect(tree, "iframe");
  assert.equal(iframes.length, 1);
  assert.equal(iframes[0].properties?.src, SAFE);
  assert.equal(iframes[0].properties?.title, "The Science of Phantom Traffic Jams");
  const links = collect(tree, "a").map((node) => String(node.properties?.href));
  assert.equal(
    links.includes(`https://www.youtube.com/watch?v=${VIDEO}`),
    true
  );
  assert.equal(links.includes("https://www.youtube.com/@Forevergreenapp"), true);
  assert.equal(collect(tree, "script").length, 0);
});
