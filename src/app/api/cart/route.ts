import { NextResponse } from "next/server";

import { getCartAction } from "@/actions/cartActions";

import { CartItem } from "@/types/cart";

export const GET = async (): Promise<NextResponse<CartItem[]>> => {
  try {
    const cart = await getCartAction()
    return NextResponse.json(cart, { status: 200 })
  } catch (e) {
    console.error('Ошибка при запросе корзины: ', e)
    return NextResponse.json([], { status: 500 })
  }
};
