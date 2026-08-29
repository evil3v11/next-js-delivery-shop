import AlignmentMenu from "../tiptap-components/AlignmentMenu";
import BackgroundColorMenu from "../tiptap-components/color-menu/BackgroundColorMenu";
import CodeEditorButton from "../tiptap-components/CodeEditorButton";
import FontSizeMenu from "../tiptap-components/FontSizeMenu";
import HistoryMenu from "../tiptap-components/HistoryMenu";
import ImageAttributes from "../tiptap-components/ImageAttributes";
import ImageMenu from "../tiptap-components/ImageMenu";
import LinkMenu from "../tiptap-components/LinkMenu";
import ListMenu from "../tiptap-components/ListMenu";
import QuoteButton from "../tiptap-components/QuoteButton";
import TableMenu from "../tiptap-components/TableMenu";
import TextColorMenu from "../tiptap-components/color-menu/TextColorMenu";
import TextFormattingMenu from "../tiptap-components/TextFormattingMenu";
import TextLevelMenu from "../tiptap-components/TextLevelMenu";
import TextAIMenu from "../tiptap-components/text-ai/TextAIMenu";
import ImageAIMenu from "../tiptap-components/image-ai/ImageAIMenu";

export const CONFIG_GROUPS = [
  {
    id: "history",
    name: "История",
    items: ["history"],
  },
  {
    id: "text",
    name: "Текст",
    items: ["textLevel", "fontSize"],
  },
  {
    id: "textFormatting",
    name: "Форматирование",
    items: ["textFormatting"],
  },
  {
    id: "quoteCode",
    name: "Цитаты и код",
    items: ["quote", "codeEditor"],
  },
  {
    id: "alignment",
    name: "Выравнивание",
    items: ["alignment"],
  },
  {
    id: "color",
    name: "Цвет текста и фона",
    items: ["textColor", "bgColor"],
  },
  {
    id: "list",
    name: "Списки",
    items: ["list"],
  },
  {
    id: "links",
    name: "Ссылки",
    items: ["link"],
  },
  {
    id: "table",
    name: "Таблицы",
    items: ["table"],
  },
  {
    id: "images",
    name: "Изображения",
    items: ["image"],
  },
  {
    id: "imageAttributes",
    name: "Атрибуты изображения",
    items: ["imageAttributes"],
  },
  {
    id: "textAI",
    name: "Генерация текста",
    items: ["textAI"],
  },
  {
    id: "imageAI",
    name: "Генерация изображений",
    items: ["imageAI"],
  },
];

export const CONFIG_TOOLBAR_COMPONENTS = {
  history: { component: HistoryMenu },
  textLevel: { component: TextLevelMenu },
  fontSize: { component: FontSizeMenu },
  textFormatting: { component: TextFormattingMenu },
  quote: { component: QuoteButton },
  codeEditor: { component: CodeEditorButton },
  alignment: { component: AlignmentMenu },
  textColor: { component: TextColorMenu },
  bgColor: { component: BackgroundColorMenu },
  list: { component: ListMenu },
  link: { component: LinkMenu },
  table: { component: TableMenu },
  image: { component: ImageMenu },
  imageAttributes: { component: ImageAttributes },
  textAI: { component: TextAIMenu },
  imageAI: { component: ImageAIMenu },
} as const;
