const ProductPage = async ({params}: {params: Promise<{id: string}>}) => {
  let productId: string = ""

  try {
    productId = (await params).id
  } catch (e) {
    throw e
  }
  return (
    <div>
      Страница продукта {productId}
    </div>
  )
}

export default ProductPage
