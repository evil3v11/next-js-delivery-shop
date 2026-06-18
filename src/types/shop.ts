interface Shop {
  id: number;
  coordinates: [number, number];
  name: string;
}

interface Locations {
  [key: string]: Location;
}

type Location = {
  name: string;
  center: [number, number];
  shops: Shop[];
};

export type { Shop, Locations, Location };
