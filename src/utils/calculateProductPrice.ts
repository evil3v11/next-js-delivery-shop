export const calculateFinalPrice = (price: number, discount: number): number =>
  discount ? price * (1 - discount / 100) : price;

export const calculatePriceByCard = (price: number, discount: number): number =>
  calculateFinalPrice(price, discount);
