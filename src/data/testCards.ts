import { TestCard } from "@/types/payment";

export const TEST_CARDS: TestCard[] = [
  {
    number: "5555 5555 5555 4444",
    description: "Успешная оплата",
    result: "success",
  },
  {
    number: "4111 1111 1111 1111",
    description: "Недостаточно средств",
    result: "failure",
  },
  {
    number: "4000 0000 0000 0002",
    description: "Ошибка банка",
    result: "error",
  },
];
