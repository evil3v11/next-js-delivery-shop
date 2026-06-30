import ErrorComponent from "@/components/ErrorComponent";

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ category: string }>;
}) => {
  let category: string = "";

  try {
    category = (await params).category;
  } catch (e) {
    return (
      <ErrorComponent
        error={e instanceof Error ? e : new Error(String(e))}
        userMessage="Не удалось загрузить статьи"
      />
    );
  }
  return <div>Страница категории {category}</div>;
};

export default CategoryPage;
