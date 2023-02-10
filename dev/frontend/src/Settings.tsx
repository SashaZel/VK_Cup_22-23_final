import { useContext, useState } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";
import { TLang, TTheme } from "./utils/types";
import { SettingsTheme } from "./SettingsTheme";
import { LanguageContext } from "./app";
import iconFlagRUS from "./assets/icon_flag_ru.svg";
import iconFlagUSA from "./assets/icon_flag_usa.svg";

interface ISettingProps {
  handleChangeTheme: (newTheme: TTheme) => void;
  handleShowSettings: (x: boolean) => void;
  handleChangeLang: (lang: TLang) => void;
  theme: TTheme;
}

type TSettingTabs = "themes" | "lang";

const INT_SETTINGS = {
  VIEW: {
    ENG: "View",
    RUS: "Внешний вид",
  },
  LANG: {
    ENG: "Language",
    RUS: "Язык",
  },
  LANG_ENG: {
    ENG: "English",
    RUS: "Английский",
  },
  LANG_RUS: {
    ENG: "Russian",
    RUS: "Русский",
  },
  CHANGE_LANG: {
    ENG: "Change Language",
    RUS: "Изменить язык",
  },
  SET_LANG: {
    ENG: "Set Language",
    RUS: "Выбрать язык",
  },
};

export function Settings({
  handleChangeTheme,
  handleShowSettings,
  handleChangeLang,
  theme,
}: ISettingProps) {
  const [settingTab, setSettingTab] = useState<TSettingTabs>("themes");
  const [newLang, setNewLang] = useState<TLang>("ENG");
  const lang = useContext(LanguageContext);

  const handleSubmitLang = (
    e: JSXInternal.TargetedEvent<HTMLFormElement, Event>
  ) => {
    e.preventDefault();
    handleChangeLang(newLang);
    try {
      localStorage.setItem("VK_mail_lang", newLang);
    } catch (error) {
      console.error("localStorage is not available " + String(error));
    }
  };

  const langTab = (
    <div class="settings__lang">
      <h3 class="settings__header">{INT_SETTINGS.CHANGE_LANG[lang]}</h3>
      <form
        class="settings__lang-container"
        onSubmit={(e) => handleSubmitLang(e)}
      >
        <label htmlFor="rus" class="checkbox_container">
          <img src={iconFlagRUS} alt="flag icon" />
          {INT_SETTINGS.LANG_RUS[lang]}
          <input
            id="rus"
            type="checkbox"
            checked={newLang === "RUS"}
            onChange={() => setNewLang("RUS")}
          />
          <span class="checkmark"></span>
        </label>
        <label htmlFor="eng" class="checkbox_container">
          <img src={iconFlagUSA} alt="flag icon" />
          {INT_SETTINGS.LANG_ENG[lang]}
          <input
            id="eng"
            type="checkbox"
            checked={newLang === "ENG"}
            onChange={() => setNewLang("ENG")}
          />
          <span class="checkmark"></span>
        </label>
        <button class="settings__lang-button">
          {INT_SETTINGS.SET_LANG[lang]}
        </button>
      </form>
    </div>
  );

  return (
    <div class="settings">
      <div
        className="settings__closingArea"
        onClick={() => handleShowSettings(false)}
      ></div>
      <div class="settings__main">
        <div class="setting__menu">
          <button
            class={`setting__menu-button ${
              settingTab === "themes" ? "setting__menu-button-active" : ""
            }`}
            onClick={() => {
              setSettingTab("themes");
            }}
          >
            {INT_SETTINGS.VIEW[lang]}
          </button>
          <button
            class={`setting__menu-button ${
              settingTab === "lang" ? "setting__menu-button-active" : ""
            }`}
            onClick={() => {
              setSettingTab("lang");
            }}
          >
            {`${INT_SETTINGS.LANG[lang]}: `}
            {lang === "ENG" ? (
              <span>
                {INT_SETTINGS.LANG_ENG[lang] + " "}
                <img src={iconFlagUSA} alt="flag icon" />
              </span>
            ) : (
              <span>
                {INT_SETTINGS.LANG_RUS[lang] + " "}
                <img src={iconFlagRUS} alt="flag icon" />
              </span>
            )}
          </button>
        </div>
        <div className="settings__main-tab">
          {settingTab === "themes" && (
            <SettingsTheme
              theme={theme}
              handleChangeTheme={handleChangeTheme}
            />
          )}
          {settingTab === "lang" && langTab}
        </div>
      </div>
    </div>
  );
}
