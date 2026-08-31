import BlogSearch from "./_components/BlogSearch";

const BlogLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <BlogSearch />
      </div>
      {children}
    </div>
  );
};

export default BlogLayout;
