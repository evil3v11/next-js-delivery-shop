"use client";

import { useState } from "react";

import { YMaps } from "@iminside/react-yandex-maps";

import Locations from "./Locations";
import MapView from "./MapView";

const Maps = () => {
  const [currentLocation, setCurrentLocation] = useState("novosibirsk");

  return (
    <YMaps
      query={{
        lang: "ru_RU",
        apikey: process.env.YANDEX_MAPS_API_KEY,
        load: "package.full",
      }}
    >
      <section>
        <div className="flex flex-col justify-center xl:max-w-302 text-main-text">
          <h2 className="mb-4 md:mb-8 xl:mb-10 text-2xl xl:text-4xl text-left font-bold">
            Наши магазины
          </h2>
          <Locations
            currentLocation={currentLocation}
            onLocationChange={setCurrentLocation}
          />
          <MapView currentLocation={currentLocation} />
        </div>
      </section>
    </YMaps>
  );
};

export default Maps;
