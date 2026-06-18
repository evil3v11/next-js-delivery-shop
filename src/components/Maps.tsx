"use client";

import { useState } from "react";

import { Map, YMaps, Placemark } from "@pbe/react-yandex-maps";

import { locations } from "@/data/locations";

const Maps = () => {
  const [currentLocation, setCurrentLocation] = useState("novosibirsk");
  const currentLocationData = locations[currentLocation];

  return (
    <YMaps
      query={{
        lang: "ru_RU",
        apikey: "c80819d2-ddbb-454f-8abf-1959fdefd897",
        load: "package.full",
      }}
    >
      <section>
        <div className="flex flex-col justify-center xl:max-w-[1208px]">
          <h2
            className="mb-4 md:mb-8 xl:mb-10 text-2xl xl:text-4xl text-left font-bold 
          text-[#414141]"
          >
            Наши магазины
          </h2>
          <div className="flex flex-wrap gap-x-2 gap-y-3 mb-5">
            {Object.keys(locations).map((key) => {
              const isActive = currentLocation === key;

              return (
                <button
                  key={key}
                  onClick={() => setCurrentLocation(key)}
                  className={`px-4 py-2 text-xs justify-center items-center 
                  active:shadow-button-active border-none rounded cursor-pointer 
                  transition-colors duration-300 text-[#414141] 
                  ${
                    isActive
                      ? "bg-primary text-white hover:shadow-button-default"
                      : "bg-[#f3f2f1] hover:shadow-button-secondary"
                  }`}
                >
                  {locations[key].name}
                </button>
              );
            })}
          </div>
          <Map
            defaultState={{ center: currentLocationData.center, zoom: 12 }}
            state={{ center: currentLocationData.center, zoom: 12 }}
            width="100%"
            height="354px"
          >
            {locations[currentLocation].shops.map((shop) => (
              <Placemark
                key={shop.id}
                geometry={shop.coordinates}
                properties={{ hintContent: shop.name }}
                options={{
                  iconLayout: "default#image",
                  iconImageHref: "icons-map/icon-location.svg",
                  iconImageSize: [32, 32],
                  iconImageOffset: [-16, -16],
                }}
              />
            ))}
          </Map>
        </div>
      </section>
    </YMaps>
  );
};

export default Maps;
