export interface BlogPost {
  id: string;
  title: string;
  description: string;
  link: string;
  slug: string;
  pubDate: string;
  imageUrl: string;
  author: string;
  category?: string;
}