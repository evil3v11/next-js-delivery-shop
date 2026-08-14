export interface SimplifiedOrderData {
  order: {
    orderNumber: string;
    status: string;
    createdAt: string;
    paymentMethod: string;
    paymentStatus: string;
    totalAmount: number;
    discountAmount: number;
    usedBonuses: number;
    earnedBonuses: number;
    name: string;
    lastName: string;
    phone: string;
    gender: string;
    birthday: string;
    deliveryAddress: {
      city: string;
      street: string;
      house: string;
      apartment: string;
      additional?: string;
    };
    deliveryTime: {
      date: string;
      timeSlot: string;
    };
  };
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
    totalPrice: number;
    weight: number;
    brand: string;
    manufacturer: string;
  }>;
}
