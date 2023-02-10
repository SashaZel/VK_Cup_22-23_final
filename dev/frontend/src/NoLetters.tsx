import { useContext } from "preact/hooks";
import { LanguageContext } from "./app";

const INT_NO_LETTERS = {
  NO_LETTERS: {
    ENG: "No letters",
    RUS: "Писем нет",
  },
};

export function NoLetters() {
  const lang = useContext(LanguageContext);

  return (
    <div class="empty">
      <div class="empty__title">{INT_NO_LETTERS.NO_LETTERS[lang]}</div>
    </div>
  );
}
