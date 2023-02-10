import { TTheme } from "./utils/types";
import iconThemeOk from "./assets/icon_theme_ok.svg";

interface IThemeColorButton {
  themeOfButton: TTheme;
  themeCurrent: TTheme;
  handleChangeTheme: (newTheme: TTheme) => void;
}

export function ThemeColorButton({
  themeOfButton,
  themeCurrent,
  handleChangeTheme,
}: IThemeColorButton) {
  return (
    <button
      onClick={() => handleChangeTheme(themeOfButton)}
      class={`settings__theme-color-button settings__pick-${themeOfButton}`}
    >
      {themeCurrent === themeOfButton ? (
        <div class="settings__button-active">
          <img src={iconThemeOk} alt="icon" />
        </div>
      ) : (
        ""
      )}
    </button>
  );
}
