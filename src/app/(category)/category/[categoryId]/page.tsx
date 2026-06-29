const CategoryPage = async ({params}: {params: Promise<{category: string}>}) => {
  let category: string = ""

  try {
    category = (await params).category
  } catch (e) {
    console.error("Ошибка получения категорий\n", e)
  }
  return (
    <div>
      Страница категории {category}
    </div>
  )
}

export default CategoryPage
