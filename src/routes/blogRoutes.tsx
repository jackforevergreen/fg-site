import { Route } from "react-router-dom";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";

/**
 * Blog Routes
 * All routes under /post for blog listing and individual posts
 */
export const blogRoutes = (
  <>
    <Route path="/post" element={<Blog />} />
    <Route path="/post/:slug" element={<BlogDetail />} />
  </>
);
