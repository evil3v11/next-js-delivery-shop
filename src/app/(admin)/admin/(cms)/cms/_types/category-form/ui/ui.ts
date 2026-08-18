export interface CategorySubmitSectionProps {
  onCancel: () => void;
}

export interface HeaderActionsProps {
  onCreate: () => void;
}

export interface CategoryNotificationProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}
