import { ImageAIMenuModalProps } from "../../../_types";

import MenuHeader from "./MenuHeader";
import MenuContent from "./MenuContent";
import MenuFooter from "./MenuFooter";

const ImageAIMenuModal = ({
  prompt,
  generation,
  selectedAspect,
  selectedStyle,
  elapsedSeconds,
  apiInfo,
  onCloseClick,
  onPromptChange,
  onAspectChange,
  onStyleChange,
  onDownload,
  onInsertInEditor,
  onGenerateImage,
  onTestApi,
}: ImageAIMenuModalProps) => {
  const isGenerating =
    generation.status === "generating" || generation.status === "loading";

  return (
    <div
      className="fixed inset-0 bg-linear-to-br from-cyan-500 to-blue-700 flex items-center 
    justify-center z-100 p-4 backdrop-blur-sm cursor-default"
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-hidden flex 
      flex-col select-text"
      >
        <MenuHeader
          onCloseClick={onCloseClick}
          isGenerating={isGenerating}
          onTestApi={onTestApi}
        />
        <MenuContent
          prompt={prompt}
          apiInfo={apiInfo}
          generation={generation}
          elapsedSeconds={elapsedSeconds}
          selectedAspect={selectedAspect}
          selectedStyle={selectedStyle}
          isGenerating={isGenerating}
          onPromptChange={onPromptChange}
          onAspectChange={onAspectChange}
          onStyleChange={onStyleChange}
          onDownload={onDownload}
          onInsertInEditor={onInsertInEditor}
          onGenerateImage={onGenerateImage}
        />
        <MenuFooter
          generationStatus={generation.status}
          elapsedSeconds={elapsedSeconds}
          prompt={prompt}
          onInsertInEditor={onInsertInEditor}
          onGenerateImage={onGenerateImage}
        />
      </div>
    </div>
  );
};

export default ImageAIMenuModal;
