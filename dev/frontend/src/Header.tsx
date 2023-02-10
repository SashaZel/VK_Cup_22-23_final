import { useContext, useState } from "preact/hooks";
import { LanguageContext } from "./app";
import { IFilter, TLang } from "./utils/types";
import logoMailAt from "./assets/logo_mail_at.svg";
import { FilterPanel } from "./FilterPanel";
import { ICON_BACK, ICON_DOWN, ICON_MAIL_LETTERS } from "./utils/iconsSVG";
import { INT_FILTERS } from "./utils/internationalizationConsts";
import iconBookmark from "./assets/icon_bookmark_fill.svg";
import { ICON_CLIP } from "./utils/iconsSVG";

interface IHeader {
  showLetter: boolean;
  handleHideLetter: () => void;
  filterState: IFilter;
  handleFilterState: (newFilterState: IFilter) => void;
}

const INT_HEADER = {
  BACK: {
    ENG: "Back",
    RUS: "Вернуться",
  },
};

const getFiltersButtonContent = (filterState: IFilter, lang: TLang) => {
  let buttonHeader = INT_FILTERS.FILTERS[lang];
  if (
    filterState.showUnread &&
    !filterState.showBookmark &&
    !filterState.showWithAttachment
  ) {
    buttonHeader = INT_FILTERS.UNREAD[lang];
  }
  if (
    !filterState.showUnread &&
    filterState.showBookmark &&
    !filterState.showWithAttachment
  ) {
    buttonHeader = INT_FILTERS.BOOKMARKED[lang];
  }
  if (
    !filterState.showUnread &&
    !filterState.showBookmark &&
    filterState.showWithAttachment
  ) {
    buttonHeader = INT_FILTERS.WITH_ATTACHMENT[lang];
  }

  let iconUnread = null;
  let iconBookmarked = null;
  let iconAttachment = null;

  if (filterState.showUnread) {
    iconUnread = (
      <div class="filter__icon-container">
        <div class="letter__read-mark" />
      </div>
    );
  }
  if (filterState.showBookmark) {
    iconBookmarked = (
      <div class="filter__icon-container">
        <img src={iconBookmark} alt="icon" />
      </div>
    );
  }
  if (filterState.showWithAttachment) {
    iconAttachment = <div class="filter__icon-container">{ICON_CLIP}</div>;
  }

  return (
    <>
      <div  class="header__filter-button-icons">{iconUnread}{iconBookmarked}{iconAttachment}</div>
      <div class="header__filter-button-element">{buttonHeader}</div>
      <div class="header__filter-button-arrow">{ICON_DOWN}</div>
    </>
  );
};

export function Header({
  showLetter,
  handleHideLetter,
  filterState,
  handleFilterState,
}: IHeader) {
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const lang = useContext(LanguageContext);

  const filterButtonContent = getFiltersButtonContent(filterState, lang);

  const handleShowFilterPanel = () => {
    setShowFilterPanel((showFilterPanel) => !showFilterPanel);
  };

  return (
    <div>
      <header>
        <div
          class={`header__container ${
            showLetter ? "header__container-hide" : "header__container-show"
          }`}
        >
          <div class="header__content-screen">
            <button class="header__back-button" onClick={handleHideLetter}>
              <div>{ICON_BACK}</div>
              <div class="header__back-description">
                {INT_HEADER.BACK[lang]}
              </div>
            </button>
          </div>
          <div class="header__content-screen">
            <div class="header__logo-container">
              <img
                src={logoMailAt}
                alt="main Logo Mail"
                class="header__logo-at"
              />
              <div class="header__logo-letters">{ICON_MAIL_LETTERS}</div>
            </div>
            <button
              class="header__filter-button"
              onClick={handleShowFilterPanel}
            >
              {filterButtonContent}
            </button>
          </div>
        </div>
      </header>
      {showFilterPanel ? (
        <FilterPanel
          handleShowFilterPanel={handleShowFilterPanel}
          filterState={filterState}
          handleFilterState={handleFilterState}
        />
      ) : null}
    </div>
  );
}
