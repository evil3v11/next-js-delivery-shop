"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

import { Edit } from "lucide-react";
import SelectCity from "@/app/(auth)/(registration)/_components/SelectCity";
import SelectRegion from "@/app/(auth)/(registration)/_components/SelectRegion";

interface ProfileFormData {
  region: string;
  location: string;
}

const LocationSection = () => {
  const [formData, setFormData] = useState<ProfileFormData>({
    region: "",
    location: "",
  });
  const { user, fetchUserData } = useAuthStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({ region: user.region || "", location: user.location || "" });
    }
  }, [user]);

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCancel = () => {
    setFormData({ region: user?.region || "", location: user?.location || "" });
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await fetch("/api/users/location", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          region: formData.region,
          location: formData.location,
        }),
      });

      if (!response.ok) throw new Error("Не удалось обновить местоположение");

      await response.json();
      await fetchUserData();
    } catch (e) {
      console.log("Ошибка обновления местоположения: ", e);
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-between gap-y-10 md:gap-y-5 w-full relative">
      <h2 className="text-xl font-bold text-[#414141]">Местоположение</h2>
      <div className="flex w-full flex-col gap-y-5 md:flex-row md:gap-x-5">
        <SelectRegion
          value={formData.region}
          onChangeAction={handleLocationChange}
          className="w-full"
          disabled={!isEditing}
        />
        <SelectCity
          value={formData.location}
          onChangeAction={handleLocationChange}
          className="w-full"
          disabled={!isEditing}
        />
      </div>
      <div className="md:absolute right-0 top-0">
        {isEditing ? (
          <div className="flex justify-center gap-x-5">
            <button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded cursor-pointer 
              duration-300 flex-1 shadow-button-default active:shadow-button-active"
            >
              {isLoading ? "Сохранение..." : "Сохранить"}
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-200 hover:bg-gray-300 text-gray-600 px-4 py-2 rounded cursor-pointer 
              duration-300 flex-1 shadow-button-default active:shadow-button-active"
            >
              Отмена
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#ff6633] hover:bg-[#ff6633]/80 text-white px-4 py-2 rounded cursor-pointer 
              duration-300 font-bold flex items-center shadow-button-default active:shadow-button-active"
            >
              <Edit className="h-4 w-4 inline mr-2" />
              Редактировать
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSection;
