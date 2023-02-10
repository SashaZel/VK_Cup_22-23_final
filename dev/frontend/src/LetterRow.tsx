import { useContext, useState } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";
import { ILetterPreview, TFolders, TLang } from "./utils/types";
import { LanguageContext } from "./app";
import { INT_MONTHS } from "./utils/internationalizationConsts";
import iconBookmark from "./assets/icon_bookmark_fill.svg";
import iconEmptyBookmark from "./assets/icon_bookmark_shape.svg";
import iconImportant from "./assets/icon_important.svg";
import { ICONS_FLAG, ICONS_FOLDERS, ICON_CLIP } from "./utils/iconsSVG";
import { ORDERED_FOLDERS } from "./utils/constants";

const INT_LETTER_IN_ROW = {
  TO_DRAFTS: {
    ENG: "to Drafts",
    RUS: "в Черновики",
  },
  TO_ARCHIVE: {
    ENG: "to Archive",
    RUS: "в Архив",
  },
  TO_SPAM: {
    ENG: "to SPAM",
    RUS: "в Спам",
  },
  DELETE: {
    ENG: "delete letter",
    RUS: "Удалить",
  },
};

interface ILetterRow {
  letter: ILetterPreview;
  handleClickOnLetter: (
    e: JSXInternal.TargetedMouseEvent<HTMLDivElement>,
    letter: ILetterPreview
  ) => void;
  handleTooltipOn: (
    e: JSXInternal.TargetedMouseEvent<HTMLDivElement>,
    letter: ILetterPreview
  ) => void;
  handleUnread: (
    e: JSXInternal.TargetedMouseEvent<HTMLButtonElement>,
    letter: ILetterPreview
  ) => void;
  handleBookmark: (
    e: JSXInternal.TargetedMouseEvent<HTMLImageElement>,
    letter: ILetterPreview
  ) => void;
  handleDnDletter: (letter: ILetterPreview | null) => void;
  handleDnDdrop: (folder: TFolders) => void;
}

const getFormattedDate = (dateInISO: string, lang: TLang) => {
  try {
    const dateProcessed = new Date(dateInISO);
    if (!(dateProcessed instanceof Date)) {
      return " ";
    }
    const dateNow = new Date();
    if (dateInISO.slice(0, 9) === dateNow.toISOString().slice(0, 9)) {
      return `${String(dateProcessed.getHours()).padStart(2, "0")}:${String(
        dateProcessed.getMinutes()
      ).padStart(2, "0")}`;
    }
    if (dateNow.getTime() - dateProcessed.getTime() > 31556952000) {
      return `${
        INT_MONTHS[lang][dateProcessed.getMonth()]
      } ${dateProcessed.getFullYear()}`;
    }
    const dateForDisplay = `${dateProcessed.getDate()} ${
      INT_MONTHS[lang][dateProcessed.getMonth()]
    }`;
    return dateForDisplay;
  } catch (error) {
    console.error(error);
    return " ";
  }
};

export function LetterRow({
  letter,
  handleClickOnLetter,
  handleTooltipOn,
  handleUnread,
  handleBookmark,
  handleDnDletter,
  handleDnDdrop,
}: ILetterRow) {
  const [isHover, setIsHover] = useState(false);
  const [showRightClickTooltip, setShowRightClickTooltip] = useState(false);
  const [clientXtooltip, setClientXtooltip] = useState(0);
  const [clientYtooltip, setClientYtooltip] = useState(0);
  const lang = useContext(LanguageContext);

  const handleDragStart = (
    e: JSXInternal.TargetedDragEvent<HTMLDivElement>,
    letter: ILetterPreview
  ) => {
    handleDnDletter(letter);
  };

  const handleDragEnd = (e: JSXInternal.TargetedDragEvent<HTMLDivElement>) => {
    handleDnDletter(null);
  };

  const handleSelect = (
    e: JSXInternal.TargetedMouseEvent<HTMLButtonElement>,
    letter: ILetterPreview
  ) => {
    e.stopPropagation();
  };

  const handleRightClick = (
    e: JSXInternal.TargetedMouseEvent<HTMLDivElement>,
    letter: ILetterPreview
  ) => {
    e.preventDefault();
    setShowRightClickTooltip(true);
    setClientXtooltip(e.clientX);
    setClientYtooltip(e.clientY);
    handleDnDletter(letter);
  };

  const handleLeaveRightClickMenu = () => {
    setShowRightClickTooltip(false);
    setClientXtooltip(0);
    setClientYtooltip(0);
    handleDnDletter(null);
  };

  const handleClickOnTooltipButton = (
    e: JSXInternal.TargetedMouseEvent<HTMLButtonElement>,
    folderName: TFolders
  ) => {
    e.preventDefault();
    e.stopPropagation();
    handleDnDdrop(folderName);
  };

  const dateForDisplay = getFormattedDate(letter.date, lang);

  const avatarCheckbox = (
    <button
      class="letter-in-list__avatar-checkbox"
      onClick={(e) => handleSelect(e, letter)}
    ></button>
  );

  const avatarArea = letter.author.hasAvatar ? (
    <img
      src={`/images/avatars/avatar--${letter.author.email}.png`}
      alt="avatar"
      class="letter__avatar-image"
    />
  ) : (
    ""
  );

  const letterAuthorName =
    letter.author.name && letter.author.surname
      ? `${letter.author.name} ${letter.author.surname}`
      : letter.author.email;

  const rightClickTooltip = (
    <div
      class="letter-in-list__tooltip-container"
      style={{ left: clientXtooltip - 5, top: clientYtooltip - 5 }}
      onMouseLeave={handleLeaveRightClickMenu}
    >
      <div class="letter-in-list__toltip-blanc-area"></div>
      <div class="letter-in-list__tooltip-content">
        <button
          onClick={(e) => handleClickOnTooltipButton(e, "Черновики")}
          class={`menu__button`}
        >
          <div class="menu__button-left-container">
            <div class="menu__button-icon">{ICONS_FOLDERS[3]}</div>
            <div class="letter-in-list__tooltip-header">
              {INT_LETTER_IN_ROW.TO_DRAFTS[lang]}
            </div>
          </div>
        </button>
        <button
          onClick={(e) => handleClickOnTooltipButton(e, "Архив")}
          class={`menu__button`}
        >
          <div class="menu__button-left-container">
            <div class="menu__button-icon">{ICONS_FOLDERS[4]}</div>
            <div class="letter-in-list__tooltip-header">
              {INT_LETTER_IN_ROW.TO_ARCHIVE[lang]}
            </div>
          </div>
        </button>
        <button
          onClick={(e) => handleClickOnTooltipButton(e, "Спам")}
          class={`menu__button`}
        >
          <div class="menu__button-left-container">
            <div class="menu__button-icon">{ICONS_FOLDERS[5]}</div>
            <div class="letter-in-list__tooltip-header">
              {INT_LETTER_IN_ROW.TO_SPAM[lang]}
            </div>
          </div>
        </button>
        <button
          onClick={(e) => handleClickOnTooltipButton(e, "Корзина")}
          class={`menu__button`}
        >
          <div class="menu__button-left-container">
            <div class="menu__button-icon">{ICONS_FOLDERS[6]}</div>
            <div class="letter-in-list__tooltip-header">
              {INT_LETTER_IN_ROW.DELETE[lang]}
            </div>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <div
      class="letter-in-list"
      onClick={(e) => handleClickOnLetter(e, letter)}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      draggable={true}
      onDragStart={(e) => handleDragStart(e, letter)}
      onDragEnd={(e) => handleDragEnd(e)}
      onContextMenu={(e) => handleRightClick(e, letter)}
    >
      <div class="letter-in-list__row">
        <button
          class="letter-in-list__read-container"
          onClick={(e) => handleUnread(e, letter)}
        >
          <div
            class={letter.read ? "letter__unread-mark" : "letter__read-mark"}
          ></div>
        </button>
        <div class="letter-in-list__avatar-column">
          {isHover ? avatarCheckbox : avatarArea}
        </div>

        <div
          class="letter-in-list__first-col"
          style={{ fontWeight: letter.read ? "normal" : "bold" }}
        >
          {letterAuthorName}
        </div>
        <div class="letter-in-list__second-col">
          {letter.bookmark ? (
            <img
              src={iconBookmark}
              onClick={(e) => handleBookmark(e, letter)}
              alt="icon"
            />
          ) : (
            <img
              src={iconEmptyBookmark}
              onClick={(e) => handleBookmark(e, letter)}
              class="empty-bookmark"
              alt="icon"
            />
          )}{" "}
          {letter.important ? <img src={iconImportant} alt="icon" /> : ""}
        </div>
        <div class="letter-in-list__third-col">
          <span style={{ fontWeight: letter.read ? "normal" : "bold" }}>
            {letter.title}
          </span>
          {"  "}
          <span>{letter.text}</span>
        </div>
      </div>
      <div class="letter-in-list__right">
        {letter.flag ? (
          <img src={ICONS_FLAG[letter.flag]} class="letter__flag" alt="icon" />
        ) : null}
        {letter.hasAttachment ? (
          <div
            class="letter-in-list__attach"
            onMouseOver={(e) => handleTooltipOn(e, letter)}
          >
            {ICON_CLIP}
          </div>
        ) : null}
        <div class="letter-in-list__date">{dateForDisplay}</div>
      </div>
      {showRightClickTooltip ? rightClickTooltip : null}
    </div>
  );
}
