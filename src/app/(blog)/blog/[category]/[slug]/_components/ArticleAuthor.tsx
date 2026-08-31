const ArticleAuthor = ({ author }: { author: string }) =>
  author ? (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <span className="italic">Автор: {author}</span>
    </div>
  ) : null;

export default ArticleAuthor;
