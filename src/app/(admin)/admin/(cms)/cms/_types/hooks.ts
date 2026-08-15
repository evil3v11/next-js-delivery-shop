import { FormData, SiteSettings } from "./siteSettings";

export type UseSiteSettingsResult = {
  settings: SiteSettings | null;
  isLoading: boolean;
  isSaving: boolean;
  formData: FormData;
  setFormData: (formData: FormData) => void;
  loadSettings: () => Promise<void>;
  handleSave: (e: React.SubmitEvent) => Promise<void>;
};
