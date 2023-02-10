import { useContext, useEffect, useState } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";
import { LanguageContext } from "./app";
import { ILetterPreview, TLang } from "./utils/types";
import { getImageSize } from "./api/API";
import { ICONS_FLAG, ICON_DOWNLOAD } from "./utils/iconsSVG";
import { INT_FLAGS, INT_MONTHS } from "./utils/internationalizationConsts";
import iconBookmark from "./assets/icon_bookmark_fill.svg";
import iconEmptyBookmark from "./assets/icon_bookmark_shape.svg";
import iconImportant from "./assets/icon_important.svg";

interface IShowWholeLetter {
  letter: ILetterPreview;
  handleUnread: (
    e: JSXInternal.TargetedMouseEvent<HTMLButtonElement>,
    letter: ILetterPreview
  ) => void;
  handleBookmark: (
    e: JSXInternal.TargetedMouseEvent<HTMLImageElement>,
    letter: ILetterPreview
  ) => void;
}

const INT_SHOW_WHOLE_LETTER = {
  TODAY: {
    ENG: "Today",
    RUS: "Сегодня",
  },
  DOWNLOAD: {
    ENG: "Download",
    RUS: "Скачать",
  },
  FILE: {
    ENG: "file",
    RUS: "файл",
  },
  TO: {
    ENG: "To: ",
    RUS: "Кому: ",
  },
  COPY_ME: {
    ENG: "Copy me!",
    RUS: "Кликнуть для копирования",
  },
  COPIED: {
    ENG: "Copied to clipboard",
    RUS: "Скопировано в буфер",
  },
};

const getForrmattedLetterDate = (dateInISO: string, lang: TLang) => {
  try {
    const dateProcessed = new Date(dateInISO);
    if (!(dateProcessed instanceof Date)) {
      return " ";
    }
    const timeOfLetter = `${String(dateProcessed.getHours()).padStart(
      2,
      "0"
    )}:${String(dateProcessed.getMinutes()).padStart(2, "0")} `;
    const dateNow = new Date();
    if (dateInISO.slice(0, 9) === dateNow.toISOString().slice(0, 9)) {
      return `${INT_SHOW_WHOLE_LETTER?.TODAY[lang]}, ${timeOfLetter}`;
    }
    const dateOfLetter = `${dateProcessed.getDate()} ${
      INT_MONTHS[lang][dateProcessed.getMonth()]
    } ${dateProcessed.getFullYear()}`;
    return `${dateOfLetter}, ${timeOfLetter}`;
  } catch (error) {
    console.error(error);
    return " ";
  }
};

function copyToClipboard(text: string) {
  const doc = document;
  const txt = doc.createTextNode(text);
  const wind = window;
  const bodyOfDoc = doc.body as HTMLBodyElement;
  bodyOfDoc.appendChild(txt);
  const docum = doc.createRange();
  const g = wind.getSelection;
  docum.selectNodeContents(txt);
  g()!.removeAllRanges();
  g()!.addRange(docum);
  doc.execCommand("copy");
  g()!.removeAllRanges();
  txt.remove();
}

export function ShowWholeLetter({
  letter,
  handleUnread,
  handleBookmark,
}: IShowWholeLetter) {
  const lang = useContext(LanguageContext);
  const [attachmentSize, setAttachmentSize] = useState("");

  const [showRightClickTooltip, setShowRightClickTooltip] = useState(false);
  const [alreadyCopied, setAlreadyCopied] = useState(false);
  const [clientXtooltip, setClientXtooltip] = useState(0);
  const [clientYtooltip, setClientYtooltip] = useState(0);

  const handleCopyToClipboard = (
    e: JSXInternal.TargetedMouseEvent<HTMLSpanElement>
  ) => {
    const targetSpan = e.target as HTMLSpanElement;
    copyToClipboard(targetSpan.innerText);
    setAlreadyCopied(true);
  };

  const handleTooltipMouseOver = (
    e: JSXInternal.TargetedMouseEvent<HTMLDivElement>
  ) => {
    setShowRightClickTooltip(true);
    setClientXtooltip(e.clientX);
    setClientYtooltip(e.clientY);
  };

  const handleTooltipMove = (
    e: JSXInternal.TargetedMouseEvent<HTMLDivElement>
  ) => {
    setClientXtooltip(e.clientX);
    setClientYtooltip(e.clientY);
  };

  const handleTooltipMouseLeave = (
    e: JSXInternal.TargetedMouseEvent<HTMLDivElement>
  ) => {
    setShowRightClickTooltip(false);
    setClientXtooltip(0);
    setClientYtooltip(0);
    setAlreadyCopied(false);
  };

  const dateOfLetter = getForrmattedLetterDate(letter.date, lang);

  const flagPanel = letter.flag ? (
    <div class="letter__flag-container">
      <img
        class="letter__flag-image"
        src={ICONS_FLAG[letter.flag]}
        alt="icon"
      />
      <span class="letter__flag-name">{INT_FLAGS[letter.flag][lang]}</span>
    </div>
  ) : null;

  const signPanel = (
    <div class="letter__sign-panel">
      {letter.important ? <img src={iconImportant} alt="icon" /> : ""}{" "}
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
          class="letter__sign-empty-bookmark"
          alt="icon"
        />
      )}
    </div>
  );

  const tooltipForCopy = (
    <div
      class="letter__tooltip-for-copy"
      style={{ left: clientXtooltip, top: clientYtooltip + 10 }}
    >
      {alreadyCopied
        ? INT_SHOW_WHOLE_LETTER.COPIED[lang]
        : INT_SHOW_WHOLE_LETTER.COPY_ME[lang]}
    </div>
  );

  const listOfReceivers = letter.to.map((element) => (
    <>
      <div
        class="letter__to-header"
        onClick={(e) => handleCopyToClipboard(e)}
        onMouseOver={(e) => handleTooltipMouseOver(e)}
        onMouseMove={(e) => handleTooltipMove(e)}
        onMouseLeave={handleTooltipMouseLeave}
      >
        {String(element.name + " " + element.surname)}
      </div>
      <div
        class="letter__to-adress"
        onClick={(e) => handleCopyToClipboard(e)}
        onMouseOver={(e) => handleTooltipMouseOver(e)}
        onMouseMove={(e) => handleTooltipMove(e)}
        onMouseLeave={handleTooltipMouseLeave}
      >
        {element.email}
      </div>
    </>
  ));
  const formattedText = letter.text;

  let attachedImage = null;
  let imagePath: string | null = null;
  if (letter.hasAttachment) {
    imagePath = `/images/attachments/att-pic--${
      letter.author.email
    }-${letter.date.replaceAll(":", "--esc-colon--")}.jpg`;

    attachedImage = (
      <>
        <div class="letter__image-preview">
          <a href={imagePath} target="_blank">
            <div
              class="example__card"
              style={{ backgroundImage: `url(${imagePath})` }}
            >
              <img src={imagePath} class="example__invisible" />
              <div class="example__card-content">
                {ICON_DOWNLOAD}
                <span class="letter__img-preview-text">
                  {INT_SHOW_WHOLE_LETTER.DOWNLOAD[lang]}
                </span>
              </div>
            </div>
          </a>
        </div>
        <div>
          1 {INT_SHOW_WHOLE_LETTER.FILE[lang]}{" "}
          <a href={imagePath} target="_blank">
            {INT_SHOW_WHOLE_LETTER.DOWNLOAD[lang]}
            {attachmentSize}
          </a>
        </div>
      </>
    );
  }

  useEffect(() => {
    const requestImageSize = async () => {
      if (!imagePath) {
        return;
      }
      const attachedImageData = await getImageSize(imagePath.split("/")[3]);
      if (!attachedImageData?.ok) {
        return;
      }
      const formattedSize =
        attachedImageData.imageSize < 1024 ** 2
          ? `(${Math.round(attachedImageData.imageSize / 1024)} Kb)`
          : `(${
              Math.round(attachedImageData.imageSize / (1024 ** 2 / 10)) / 10
            } Mb)`;
      setAttachmentSize(formattedSize);
    };
    requestImageSize();
  }, []);

  return (
    <div>
      <div class="letter__first-row">
        <h3 class="letter__title">{letter.title}</h3>
        {flagPanel}
      </div>
      <div class="letter__second-row">
        <button
          class="letter-in-list__read-container"
          onClick={(e) => handleUnread(e, letter)}
        >
          <div
            class={letter.read ? "letter__unread-mark" : "letter__read-mark"}
          ></div>
        </button>
        <div>
          {letter.author.hasAvatar ? (
            <img
              src={`/images/avatars/avatar--${letter.author.email}.png`}
              alt="avatar"
              class="letter__avatar-image"
            />
          ) : (
            ""
          )}
        </div>
        <div>
          <p class="letter__header-row">
            <span class="letter__author">
              {letter.author.name + " " + letter.author.surname}
            </span>
            <span class="letter__date">{dateOfLetter}</span>
            {signPanel}
          </p>
          <div class="letter__header-row">
            {INT_SHOW_WHOLE_LETTER.TO[lang]} {listOfReceivers}
            {showRightClickTooltip ? tooltipForCopy : null}
          </div>
        </div>
      </div>
      <div class="letter__third-row">{attachedImage}</div>
      <div class="letter__body-row">{formattedText}</div>
    </div>
  );
}
