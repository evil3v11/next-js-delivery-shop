const ProductPage = async ({params}: {params: Promise<{id: string}>}) => {
  let productId: string = ""

  try {
    productId = (await params).id
  } catch (e) {
    console.error("Ошибка получения продукта\n", e)
  }
  return (
    <div>
      Страница продукта {productId}
    </div>
  )
}

export default ProductPage
