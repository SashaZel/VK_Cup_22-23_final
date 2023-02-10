import { useEffect, useState } from "preact/hooks";
import { createContext } from "preact";
import {
  IFilter,
  ILetterPreview,
  TFolders,
  TLang,
  TTheme,
} from "./utils/types";
import { Menu } from "./Menu";
import { WorkingArea } from "./WorkingArea";
import { Settings } from "./Settings";
import { Header } from "./Header";
import { NewLetter } from "./NewLetter";
import { changeFolderAPI } from "./api/API";
import { THEME_COLORS_LIST } from "./utils/constants";

export const LanguageContext = createContext<TLang>("ENG");

export function App() {
  const [language, setLanguage] = useState<TLang>("ENG");
  const [theme, setTheme] = useState<TTheme>("light");
  const [filterState, setFilterState] = useState<IFilter>({
    showUnread: false,
    showBookmark: false,
    showWithAttachment: false,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [showNewLetter, setShowNewLetter] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<TFolders>("income");
  const [letterForDnD, setLetterForDnD] = useState<ILetterPreview | null>(null);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("VK_mail_lang");
      const savedTheme = localStorage.getItem("VK_mail_theme") as TTheme;
      if (savedLang === "ENG" || savedLang === "RUS") {
        handleChangeLang(savedLang);
      }
      if (savedTheme && THEME_COLORS_LIST.includes(savedTheme)) {
        handleChangeTheme(savedTheme);
      }
    } catch (error) {
      console.error("localStorage is not available " + String(error));
    }
  }, []);

  const handleChangeLang = (newLang: TLang) => {
    setLanguage(newLang);
  };

  const handleChangeTheme = (newTheme: TTheme) => {
    setTheme(newTheme);
    try {
      localStorage.setItem("VK_mail_theme", newTheme);
    } catch (error) {
      console.error("localStorage is not available " + String(error));
    }
  };

  const handleChangeFolder = (folderName: TFolders) => {
    setCurrentFolder(folderName);
    setShowLetter(false);
  };

  const handleShowSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleShowLetter = () => {
    setShowLetter(true);
  };

  const handleHideLetter = () => {
    setShowLetter(false);
  };

  const handleFilterState = (newFilterState: IFilter) => {
    setFilterState(newFilterState);
  };

  const handleShowNewLetter = () => {
    setShowNewLetter(!showNewLetter);
  };

  const handleDnDletter = (letter: ILetterPreview | null) => {
    setLetterForDnD(letter);
  };

  const handleDnDdrop = async (newFolderforLetter: TFolders) => {
    if (!letterForDnD || !newFolderforLetter) {
      return;
    }
    const oldFolder = letterForDnD.folder;
    letterForDnD.folder = newFolderforLetter;
    const _result = await changeFolderAPI(letterForDnD, oldFolder);
    setCurrentFolder(newFolderforLetter);
    setLetterForDnD(null);
  };

  return (
    <LanguageContext.Provider value={language}>
      <div class="container" data-theme={theme}>
        <div
          class={
            showSettings ? "container__scale-down" : "container__scale-normal"
          }
        >
          <Header
            showLetter={showLetter}
            handleHideLetter={handleHideLetter}
            filterState={filterState}
            handleFilterState={handleFilterState}
          />
          <div class="main">
            <Menu
              currentFolder={currentFolder}
              handleChangeFolder={handleChangeFolder}
              handleShowSettings={handleShowSettings}
              handleShowNewLetter={handleShowNewLetter}
              handleDnDdrop={handleDnDdrop}
            />
            <WorkingArea
              filterState={filterState}
              currentFolder={currentFolder}
              showLetter={showLetter}
              handleShowLetter={handleShowLetter}
              handleDnDletter={handleDnDletter}
              handleDnDdrop={handleDnDdrop}
            />
          </div>
        </div>
        {showSettings ? (
          <Settings
            handleChangeTheme={handleChangeTheme}
            handleShowSettings={handleShowSettings}
            handleChangeLang={handleChangeLang}
            theme={theme}
          />
        ) : null}
        {showNewLetter ? (
          <NewLetter handleShowNewLetter={handleShowNewLetter} />
        ) : null}
      </div>
    </LanguageContext.Provider>
  );
}
