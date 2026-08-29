import { MenuContentProps } from "../../../_types";
import MenuApiInfoAlert from "./MenuApiInfoAlert";
import MenuErrorPanel from "./MenuErrorPanel";
import MenuPromptSection from "./MenuPromptSection";
import MenuResultPanel from "./MenuResultPanel";
import MenuSettingsPanel from "./MenuSettingsPanel";
import MenuStatusPanel from "./MenuStatusPanel";

const MenuContent = ({
  prompt,
  apiInfo,
  generation,
  elapsedSeconds,
  selectedAspect,
  selectedStyle,
  isGenerating,
  onPromptChange,
  onAspectChange,
  onStyleChange,
  onDownload,
  onInsertInEditor,
}: MenuContentProps) => {
  return (
    <div className="flex-1 p-5">
      <MenuApiInfoAlert apiInfo={apiInfo} />
      <MenuPromptSection
        prompt={prompt}
        onPromptChange={onPromptChange}
        isGenerating={isGenerating}
      />
      <MenuSettingsPanel
        isGenerating={isGenerating}
        selectedAspect={selectedAspect}
        selectedStyle={selectedStyle}
        onAspectChange={onAspectChange}
        onStyleChange={onStyleChange}
      />
      {isGenerating && (
        <MenuStatusPanel
          status={generation.status}
          operationId={generation.operationId || ""}
          elapsedSeconds={elapsedSeconds}
        />
      )}
      {generation.status === "success" && generation.imageUrl && (
        <MenuResultPanel
          imageUrl={generation.imageUrl}
          prompt={prompt}
          selectedStyle={selectedStyle}
          selectedAspect={selectedAspect}
          elapsedSeconds={elapsedSeconds}
          onDownload={onDownload}
          onInsertInEditor={onInsertInEditor}
        />
      )}
      {generation.status === "error" && generation.error && (
        <MenuErrorPanel error={generation.error} />
      )}
    </div>
  );
};

export default MenuContent;
