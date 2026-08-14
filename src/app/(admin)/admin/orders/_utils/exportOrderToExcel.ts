import { downloadExcel, generateOrderExcel } from "./excelGenerator";
import { getMappedStatus } from "./getMappedStatus";
import { getPaymentStatusText } from "./getPaymentStatusText";

import type { Product } from "@/types/product";
import type { Order, OrderItem } from "@/types/order";
import type { SimplifiedOrderData } from "@/types/excel";

type ProductData = Partial<
  Pick<Product, "title" | "weight" | "brand" | "manufacturer"> & {
    name: string;
  }
>;

interface EnrichedOrderItem extends Omit<OrderItem, "title"> {
  weight: number;
  brand: string;
  manufacturer: string;
}

const getProductName = (productData?: ProductData): string =>
  productData?.title || "Неизвестный товар";

const fetchProductDetails = async (productId: string): Promise<ProductData> => {
  try {
    const response = await fetch(`/api/products/${productId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn(`Не удалось загрузить товар ${productId}:`, error);
    return {};
  }
};

const enrichOrderItem = async (item: OrderItem): Promise<EnrichedOrderItem> => {
  const productData = await fetchProductDetails(item.productId);

  return {
    ...item,
    name: getProductName(productData),
    weight: productData?.weight || 0,
    brand: productData?.brand || "",
    manufacturer: productData?.manufacturer || "",
  };
};

const prepareExcelData = (
  order: Order,
  items: EnrichedOrderItem[],
): SimplifiedOrderData => ({
  order: {
    orderNumber: order.orderNumber,
    status: getMappedStatus(order),
    createdAt: String(order.createdAt),
    paymentMethod: order.paymentMethod,
    paymentStatus: getPaymentStatusText(order.paymentStatus),
    totalAmount: order.totalAmount,
    discountAmount: order.discountAmount,
    usedBonuses: order.bonusesUsed,
    earnedBonuses: order.bonusesEarned,
    name: order.name,
    lastName: order.lastName,
    phone: order.phone,
    gender: order.gender,
    birthday: order.birthday,
    deliveryAddress: order.deliveryAddress,
    deliveryTime: {
      date: order.deliveryTime.date,
      timeSlot: order.deliveryTime.timeSlot,
    },
  },
  items: items.map((item) => ({
    productId: item.productId,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    totalPrice: item.totalPrice || item.price * item.quantity,
    weight: item.weight,
    brand: item.brand,
    manufacturer: item.manufacturer,
  })),
});

export const exportOrderToExcel = async (order: Order): Promise<void> => {
  try {
    const enrichedItems = await Promise.all(order.items.map(enrichOrderItem));
    const excelData = prepareExcelData(order, enrichedItems);

    const excelBuffer = generateOrderExcel(excelData);
    downloadExcel(excelBuffer, `Заказ_${order.orderNumber}`);
  } catch (error) {
    console.error("Ошибка экспорта в Excel:", error);
    throw new Error("Не удалось экспортировать заказ");
  }
};
