import ScrollToTopButton from "@/components/ScrollToTopButton";
import BlogSearch from "./_components/BlogSearch";
import BlogShareButtons from "./_components/BlogShareButtons";

const BlogLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <BlogSearch />
      </div>
      {children}
      <BlogShareButtons />
      <ScrollToTopButton appearPos={300} />
    </div>
  );
};

export default BlogLayout;
