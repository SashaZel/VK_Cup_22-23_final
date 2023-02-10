import { useContext } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";
import { TTheme } from "./utils/types";
import { LanguageContext } from "./app";
import { ThemeColorButton } from "./ThemeColorButton";
import { THEME_COLORS_LIST } from "./utils/constants";
import iconThemeOk from "./assets/icon_theme_ok.svg";

interface ISettingTheme {
  theme: TTheme;
  handleChangeTheme: (newTheme: TTheme) => void;
}

const INT_SETTINGS_THEME = {
  SET_THEME: {
    ENG: "Set your favorite theme and color for your mail",
    RUS: "Настройки внешнего вида вашей почты и темы оформления",
  },
};

export function SettingsTheme({ theme, handleChangeTheme }: ISettingTheme) {
  const lang = useContext(LanguageContext);

  const listOfButtons: JSXInternal.Element[] = THEME_COLORS_LIST.map(
    (color) => (
      <ThemeColorButton
        themeOfButton={color}
        key={color}
        themeCurrent={theme}
        handleChangeTheme={handleChangeTheme}
      />
    )
  );

  return (
    <div class="setting__themes">
      <h3 class="settings__header">{INT_SETTINGS_THEME.SET_THEME[lang]}</h3>
      <div class="settings__themes-colors-container">{listOfButtons}</div>
      <div class="settings__themes-mains-container">
        <button
          class="settings__theme-main-button settings__button-dark"
          onClick={() => handleChangeTheme("dark")}
        >
          {theme === "dark" ? (
            <div class="settings__button-active">
              <img src={iconThemeOk} alt="icon" />
            </div>
          ) : (
            ""
          )}
        </button>
        <button
          class="settings__theme-main-button settings__button-light"
          onClick={() => handleChangeTheme("light")}
        >
          {theme === "light" ? (
            <div class="settings__button-active">
              <img src={iconThemeOk} alt="icon" />
            </div>
          ) : (
            ""
          )}
        </button>
        <button
          class="settings__theme-main-button settings__button-anime"
          onClick={() => handleChangeTheme("anime")}
        >
          {theme === "anime" ? (
            <div class="settings__button-active">
              <img src={iconThemeOk} alt="icon" />
            </div>
          ) : (
            ""
          )}
        </button>
      </div>
    </div>
  );
}
