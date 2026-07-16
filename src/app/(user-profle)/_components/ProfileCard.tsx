"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

import {
  cleanCardNumber,
  formatCardNumber,
  isCardNumberValid,
} from "@/utils/validation/validateProfileCard";

import { formStyles } from "@/app/(auth)/styles";

import { InputMask } from "@react-input/mask";
import { CreditCard } from "lucide-react";
import PhoneEditView from "./ProfilePhone/PhoneEditView";
import AlertMessage from "./AlertMessage";

const ProfileCard = () => {
  const { user, fetchUserData } = useAuthStore();
  const [card, setCard] = useState<string>(user?.card || "");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const displayValue = formatCardNumber(card, isEditing);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user) setCard(user.card || "");
  }, [user]);

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCard(cleanCardNumber(e.target.value).slice(0, 16));
    setError("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCard(user?.card || "");
    setError("");
  };

  const handleSave = async () => {
    if (!card.trim()) {
      setError("Номер карты не может быть пустым");
      return;
    }

    if (!isCardNumberValid(card)) {
      setError("Номер карты должен содержать 16 цифр");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/users/update-card", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ card, userId: user?.id }),
      });

      const data = await response.json();
      if (response.ok) {
        await fetchUserData();
        setIsEditing(false);
      } else {
        setError(data.error || "Ошибка при обновлении карты");
      }
    } catch (e) {
      console.error("Не удалось обновить номер карты: ", e);
      setError(
        e instanceof Error ? e.message : "Не удалось обновить номер карты",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-5 md:gap-y-5 items-c w-full relative">
      <h2 className="text-xl font-bold text-[#414141]">Карта Северяночки</h2>
      <div className="relative">
        <InputMask
          mask="____-____-____-____"
          replacement={{ _: /\d/ }}
          placeholder="Добавьте карту"
          value={displayValue}
          onChange={handleCardChange}
          disabled={!isEditing}
          className={`${formStyles.input} w-full disabled:cursor-not-allowed disabled:bg-[#f3f2f1] 
          disabled:text-gray-400 placeholder-gray-400 mt-5`}
        />
        <CreditCard className="absolute right-3 top-1/2 h-5 w-5 text-gray-400" />
      </div>
      <div className="md:absolute right-0 top-0 flex justify-center">
        {isEditing ? (
          <PhoneEditView
            isLoading={isLoading}
            onSaveAction={handleSave}
            onCancelAction={handleCancel}
          />
        ) : (
          <button
            className="bg-[#ff6633] hover:bg-[#ff6633]/80 text-white px-4 py-2 rounded cursor-pointer 
          duration-300 font-bold flex items-center group"
            onClick={() => setIsEditing(true)}
          >
            {user?.hasCard ? "Изменить карту" : "Добавить карту"}
            <CreditCard className="w-5 h-5 ml-2 rotate-0 group-hover:rotate-20 duration-300" />
          </button>
        )}
      </div>
      {!user?.hasCard && !isEditing && (
        <span className="text-sm text-gray-500">
          Добавьте номер карты лояльности для получения бонусов
        </span>
      )}
      {error && <AlertMessage type="error" message={error} />}
    </div>
  );
};

export default ProfileCard;
