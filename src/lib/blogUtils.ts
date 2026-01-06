export const getMarkdownPath = (slug: string): string => {
  return `/src/assets/post/${slug}/content.md`;
};

export const calculateReadTime = (content: string): number => {
  // Average reading speed: 200 words per minute
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
};
