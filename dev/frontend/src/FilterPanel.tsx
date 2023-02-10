import { useContext } from "preact/hooks";
import { IFilter } from "./utils/types";
import { LanguageContext } from "./app";
import { ICON_OK } from "./utils/iconsSVG";
import iconBookmark from "./assets/icon_bookmark_fill.svg";
import { ICON_CLIP } from "./utils/iconsSVG";
import { INT_FILTERS } from "./utils/internationalizationConsts";

interface IFilterPanel {
  handleShowFilterPanel: () => void;
  filterState: IFilter;
  handleFilterState: (newFilterState: IFilter) => void;
}

export function FilterPanel({
  handleShowFilterPanel,
  filterState,
  handleFilterState,
}: IFilterPanel) {

  const lang = useContext(LanguageContext);

  const handleUnread = () => {
    handleFilterState({ ...filterState, showUnread: !filterState.showUnread });
    handleShowFilterPanel();
  };

  const handleBookmark = () => {
    handleFilterState({
      ...filterState,
      showBookmark: !filterState.showBookmark,
    });
    handleShowFilterPanel();
  };

  const handleHasAttachment = () => {
    handleFilterState({
      ...filterState,
      showWithAttachment: !filterState.showWithAttachment,
    });
    handleShowFilterPanel();
  };

  const handleReset = () => {
    handleFilterState({
      showUnread: false,
      showBookmark: false,
      showWithAttachment: false,
    });
    handleShowFilterPanel();
  };

  return (
    <div class="filter-panel">
      <button onClick={handleReset} class="filter-panel__button">
        <div class="filter__ok-container">
          {!filterState.showBookmark &&
          !filterState.showUnread &&
          !filterState.showWithAttachment
            ? ICON_OK
            : ""}
        </div>
        {INT_FILTERS.ALL_LETTERS[lang]}
      </button>
      <button onClick={handleUnread} class="filter-panel__button">
        <div class="filter__ok-container">
          {filterState.showUnread ? ICON_OK : ""}
        </div>
        <div class="filter__icon-container">
          <div class='letter__read-mark' />
        </div>
        {INT_FILTERS.UNREAD[lang]}
      </button>
      <button onClick={handleBookmark} class="filter-panel__button">
        <div class="filter__ok-container">
          {filterState.showBookmark ? ICON_OK : ""}
        </div>
        <div class="filter__icon-container">
          <img src={iconBookmark} alt="icon" />
        </div>
        {INT_FILTERS.BOOKMARKED[lang]}
      </button>
      <button onClick={handleHasAttachment} class="filter-panel__button">
        <div class="filter__ok-container">
          {filterState.showWithAttachment ? ICON_OK : ""}
        </div>
        <div class="filter__icon-container">
          {ICON_CLIP}
        </div>
        {INT_FILTERS.WITH_ATTACHMENT[lang]}
      </button>
      <div class='filter__panel-separator'></div>
      <button onClick={handleReset} class="filter-panel__button">
        <div class="filter__ok-container"></div>
        {INT_FILTERS.RESET_FILTERS[lang]}
      </button>
    </div>
  );
}
