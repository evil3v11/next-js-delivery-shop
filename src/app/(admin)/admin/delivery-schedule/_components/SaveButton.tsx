import { buttonStyles } from "@/app/styles";

interface SaveButtonProps {
  isSaving: boolean;
  onSaveSchedule: () => void;
  className?: string;
}

const SaveButton = ({
  isSaving,
  onSaveSchedule,
  className = "",
}: SaveButtonProps) => {
  return (
    <div className="flex justify-center mb-8">
      <button
        onClick={onSaveSchedule}
        disabled={isSaving}
        className={`${buttonStyles.active} px-4 py-2 [&&]:w-full ${className}`}
      >
        {isSaving ? "Сохранение..." : "Сохранить расписание"}
      </button>
    </div>
  );
};

export default SaveButton;
