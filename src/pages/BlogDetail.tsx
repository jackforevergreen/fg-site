import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import blogData from "@/assets/post/posts.json";
import type { BlogPost } from "@/assets/post/types";
import { calculateReadTime } from "@/lib/blogUtils";

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [markdown, setMarkdown] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [readTime, setReadTime] = useState<number>(0);

  // Find post in posts.json
  useEffect(() => {
    const foundPost = blogData.posts.find((p) => p.slug === slug);
    if (!foundPost) {
      navigate("/404");
      return;
    }
    setPost(foundPost);
    loadMarkdownContent(foundPost.slug);
  }, [slug, navigate]);

  // Load markdown content
  const loadMarkdownContent = async (postSlug: string) => {
    try {
      const response = await fetch(`/src/assets/post/${postSlug}/content.md`);
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        // Check if it's actually markdown/text, not HTML
        if (contentType && (contentType.includes("text/plain") || contentType.includes("text/markdown"))) {
          const text = await response.text();
          setMarkdown(text);
          setReadTime(calculateReadTime(text));
        } else {
          // Got HTML or wrong content type - no markdown file exists
          console.log("Content file not found or wrong type, using placeholder");
          setMarkdown("");
        }
      } else {
        // No markdown file exists - use placeholder
        setMarkdown("");
      }
    } catch (error) {
      console.error("Error loading markdown:", error);
      setMarkdown("");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-32">
          <p className="text-center text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section with Header Image */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />

        {/* Category Badge */}
        {post.category && (
          <div className="absolute top-24 right-8 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
            {post.category}
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="max-w-4xl mx-auto">

          {/* Article Header */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-2xl shadow-lg py-4 px-8 md:px-12"
          >

          {/* Back Button */}
          <Link to="/post">
            <motion.button
              whileHover={{ x: -5 }}
              className="mb-4 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-6 w-6 mt-1" />
              Back to Blog
            </motion.button>
          </Link>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.pubDate)}</span>
              </div>
              {markdown && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{readTime} min read</span>
                </div>
              )}
            </div>

            {/* Content */}
            {markdown ? (
              <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  components={{
                    // Custom component styling
                    h1: ({ ...props }) => (
                      <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground" {...props} />
                    ),
                    h2: ({ ...props }) => (
                      <h2 className="text-2xl font-bold mt-6 mb-3 text-foreground" {...props} />
                    ),
                    h3: ({ ...props }) => (
                      <h3 className="text-xl font-bold mt-4 mb-2 text-foreground" {...props} />
                    ),
                    p: ({ ...props }) => (
                      <p className="mb-4 leading-relaxed text-muted-foreground" {...props} />
                    ),
                    ul: ({ ...props }) => (
                      <ul className="list-disc list-outside mb-4 space-y-2 text-muted-foreground ml-6" {...props} />
                    ),
                    ol: ({ ...props }) => (
                      <ol className="list-decimal list-outside mb-4 space-y-2 text-muted-foreground ml-6" {...props} />
                    ),
                    blockquote: ({ ...props }) => (
                      <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground" {...props} />
                    ),
                    code: ({ inline, ...props }: any) =>
                      inline ? (
                        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                      ) : (
                        <code className="block bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono my-4" {...props} />
                      ),
                    img: ({ ...props }) => (
                      <img className="rounded-lg my-6 w-full max-w-md mx-auto" {...props} />
                    ),
                    a: ({ ...props }) => (
                      <a className="text-primary hover:underline" {...props} />
                    ),
                  }}
                >
                  {markdown}
                </ReactMarkdown>
              </div>
            ) : (
              // Placeholder content when no markdown exists
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {post.description}
                </p>
                <div className="bg-muted/30 rounded-xl p-6 text-center">
                  <p className="text-muted-foreground">
                    Full article content coming soon! Check back later for the complete story.
                  </p>
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Read on our main site →
                  </a>
                </div>
              </div>
            )}
          </motion.article>

          {/* Related Posts Section */}
          <div className="mt-16 mb-32">
            <h2 className="text-2xl font-bold mb-8 text-foreground">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogData.posts
                .filter((p) => p.id !== post.id && p.category === post.category)
                .slice(0, 3)
                .map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    to={`/post/${relatedPost.slug}`}
                    className="group"
                  >
                    <div className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                      <img
                        src={relatedPost.imageUrl}
                        alt={relatedPost.title}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="p-4">
                        <h3 className="font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
