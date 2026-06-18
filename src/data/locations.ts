import { Locations } from "@/types/shop";

export const locations: Locations = {
  novosibirsk: {
    name: "Новосибирск",
    center: [55.010815, 82.921345],
    shops: [
      { id: 1, coordinates: [55.043721, 82.922343], name: "Магазин на Гоголя" },
      {
        id: 2,
        coordinates: [55.055738, 82.911914],
        name: "Магазин в Ройял Парк",
      },
      { id: 3, coordinates: [55.028806, 82.93659], name: "Магазин в Ауре" },
    ],
  },
  novodvinsk: {
    name: "Новодвинск",
    center: [64.42, 40.81],
    shops: [{ id: 4, coordinates: [64.42, 40.81], name: "Магазин на Ленина" }],
  },
  kotlas: {
    name: "Котлас",
    center: [61.25, 46.65],
    shops: [
      { id: 5, coordinates: [61.25, 46.65], name: "Магазин на Советской" },
    ],
  },
  koryazhma: {
    name: "Коряжма",
    center: [61.31, 47.16],
    shops: [
      { id: 6, coordinates: [61.31, 47.16], name: "Магазин на Гагарина" },
    ],
  },
  archangelsk: {
    name: "Архангельск",
    center: [64.54, 40.55],
    shops: [
      { id: 7, coordinates: [64.54, 40.55], name: "Магазин на Ломоносова" },
    ],
  },
};
