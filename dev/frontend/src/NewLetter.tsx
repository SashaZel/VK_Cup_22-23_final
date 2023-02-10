import { useContext, useEffect, useState } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";
import { sendLetterAPI } from "./api/API";
import { LanguageContext } from "./app";
import { ICONS_FLAG, ICONS_FLAG_EMPTY, ICON_CLIP } from "./utils/iconsSVG";
import iconBookmark from "./assets/icon_bookmark_fill.svg";
import iconEmptyBookmark from "./assets/icon_bookmark_shape.svg";
import iconImportant from "./assets/icon_important.svg";
import iconImportantEmpty from "./assets/icon_importantEmpty.svg";
import { ILetterPreview } from "./utils/types";

interface INewLetterProps {
  handleShowNewLetter: () => void;
}

const INT_NEW_LETTER = {
  NEW_LETTER: {
    ENG: "New Message",
    RUS: "Новое письмо",
  },
  RECIPIENTS: {
    ENG: "Recipients",
    RUS: "Получатели",
  },
  SUBJECT: {
    ENG: "Subject",
    RUS: "Тема",
  },
  ATTACH_FILE: {
    ENG: "Attach file",
    RUS: "Прикрепить файл",
  },
  SEND: {
    ENG: "Send",
    RUS: "Отправить",
  },
  SAVE: {
    ENG: "Save to Drafts",
    RUS: "Сохранить в Черновики",
  },
  CANCEL: {
    ENG: "Cancel",
    RUS: "Отменить",
  },
  SUCCESS: {
    ENG: "Message sent",
    RUS: "Письмо отправлено",
  },
  ERROR: {
    ENG: "Your message wasn't delivered because Error:",
    RUS: "Ошибка при отправке:",
  },
  CLOSE: {
    ENG: "Close",
    RUS: "Закрыть",
  },
};

export function NewLetter({ handleShowNewLetter }: INewLetterProps) {
  const [showResultModal, setShowResultModal] = useState(false);
  const [errorInSending, setErrorInSending] = useState("");
  const [inputReceivers, setInputReceivers] = useState("");
  const [inputSubject, setInputSubject] = useState("");
  const [inputLetterBody, setInputLetterBody] = useState("");
  const [selectedFile, setSelectedFile] = useState<null | File>(null);
  const [previewLink, setPreviewLink] = useState("");
  const [previewDataSize, setPreviewDataSize] = useState("");
  const [importantState, setImportantState] = useState(false);
  const [bookmarkState, setBookmarkState] = useState(false);
  const [flagState, setFlagState] = useState<keyof typeof ICONS_FLAG | "">("");
  const [dndGreenArea, setDndGreenArea] = useState(false);

  const lang = useContext(LanguageContext);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewLink("");
      return;
    }
    const selectedURL = URL.createObjectURL(selectedFile);
    setPreviewLink(selectedURL);

    return () => {
      URL.revokeObjectURL(selectedURL);
    };
  }, [selectedFile]);

  const handleInputReceivers = (
    e: JSXInternal.TargetedEvent<HTMLInputElement, Event>
  ) => {
    const inputValue = (e.target as HTMLInputElement).value;
    setInputReceivers(inputValue);
  };

  const handleInputSubject = (
    e: JSXInternal.TargetedEvent<HTMLInputElement, Event>
  ) => {
    const inputValue = (e.target as HTMLInputElement).value;
    setInputSubject(inputValue);
  };

  const handleImportantClick = (
    e: JSXInternal.TargetedMouseEvent<HTMLDivElement>
  ) => {
    e.stopPropagation();
    setImportantState((importantState) => !importantState);
  };

  const handleBookmarkClick = (
    e: JSXInternal.TargetedMouseEvent<HTMLDivElement>
  ) => {
    e.stopPropagation();
    setBookmarkState((bookmarkState) => !bookmarkState);
  };

  const handleFlagChange = (
    e: JSXInternal.TargetedMouseEvent<HTMLDivElement>,
    flagName: keyof typeof ICONS_FLAG | ""
  ) => {
    e.stopPropagation();
    if (flagState === flagName) {
      setFlagState("");
      return;
    }
    setFlagState(flagName);
  };

  const handleSelectFile = (
    e: JSXInternal.TargetedEvent<HTMLInputElement, Event>
  ) => {
    const inputFiles = (e.target as HTMLInputElement).files;

    if (!inputFiles || inputFiles.length === 0) {
      setSelectedFile(null);
      return;
    }
    setSelectedFile(inputFiles[0]);
    const formattedSize =
      inputFiles[0].size < 1024 ** 2
        ? `${Math.round(inputFiles[0].size / 1024)} KB`
        : `${Math.round(inputFiles[0].size / (1024 ** 2 / 100)) / 100} MB`;
    const imageDataMarkup = `...${inputFiles[0].name.slice(
      -22
    )} ${formattedSize}`;
    setPreviewDataSize(imageDataMarkup);
  };

  const handleDnDFileDrop = (
    e: JSXInternal.TargetedDragEvent<HTMLLabelElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.dataTransfer) {
      return;
    }

    setSelectedFile(e.dataTransfer.files[0]);
    const formattedSize =
      e.dataTransfer.files[0].size < 1024 ** 2
        ? `${Math.round(e.dataTransfer.files[0].size / 1024)} KB`
        : `${
            Math.round(e.dataTransfer.files[0].size / (1024 ** 2 / 100)) / 100
          } MB`;
    const imageDataMarkup = `...${e.dataTransfer.files[0].name.slice(
      -22
    )} ${formattedSize}`;
    setPreviewDataSize(imageDataMarkup);
    setDndGreenArea(false);
  };

  const handleDnDFileEnter = (
    e: JSXInternal.TargetedDragEvent<HTMLLabelElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDndGreenArea(true);
  };

  const handleDnDFileLeave = (
    e: JSXInternal.TargetedDragEvent<HTMLLabelElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDndGreenArea(false);
  };

  const handleInputBody = (
    e: JSXInternal.TargetedEvent<HTMLTextAreaElement, Event>
  ) => {
    const inputValue = (e.target as HTMLInputElement).value;
    setInputLetterBody(inputValue);
  };

  const handleSendLetter = (
    e: JSXInternal.TargetedEvent<HTMLFormElement, Event>
  ) => {
    e.preventDefault();
    const event = e as JSXInternal.TargetedEvent<HTMLFormElement, SubmitEvent>;
    const submitButton = event.submitter as HTMLButtonElement;
    const targetElement = e.target as HTMLFormElement;
    const formElement = targetElement.elements;
    const firstInput = formElement[0] as HTMLInputElement;
    const secondInput = formElement[1] as HTMLInputElement;
    const thirdInput = formElement[3] as HTMLTextAreaElement;
    const dateNow = new Date();

    const newLetter: ILetterPreview = {
      author: {
        name: "Alexander",
        surname: "Zelenkov",
        email: "lll555@yandex.ru",
        hasAvatar: false,
      },
      to: [
        {
          name: "",
          surname: "",
          email: firstInput.value,
          hasAvatar: false,
        },
      ],
      title: secondInput.value,
      text: thirdInput.value,
      bookmark: bookmarkState,
      important: importantState,
      read: true,
      folder: submitButton.value,
      date: dateNow.toISOString(),
      hasAttachment: false,
      flag: flagState,
    };

    const sendLetter = async (newLetter: ILetterPreview) => {
      const result = await sendLetterAPI(newLetter);
      setErrorInSending(result.error);
      setShowResultModal(true);
    };
    sendLetter(newLetter);
  };

  const resultModal = (
    <div class="result-modal__container">
      <div>
        {errorInSending ? (
          <div>
            <p>{INT_NEW_LETTER.ERROR[lang]}</p>
            <p class="result-modal__error">{errorInSending}</p>
          </div>
        ) : (
          <p>{INT_NEW_LETTER.SUCCESS[lang]}</p>
        )}
        <button
          class="new-letter__button new-letter__button-grey"
          onClick={handleShowNewLetter}
        >
          {INT_NEW_LETTER.CLOSE[lang]}
        </button>
      </div>
    </div>
  );

  return (
    <div class="new-letter">
      <div
        className="new-letter__closingArea"
        onClick={handleShowNewLetter}
      ></div>
      <div class="new-letter__main">
        <div class="new-letter__container-header">
          <h2 class="new-letter__constainer-title">
            {INT_NEW_LETTER.NEW_LETTER[lang]}
          </h2>
          <button
            class="new-letter__button new-letter__button-grey"
            onClick={handleShowNewLetter}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              class="base-0-2-1"
              ie-style=""
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.98357 8.50683L14.178 4.31241c.4165-.41655 1.0931-.41655 1.5096 0 .4165.41654.4165 1.09306 0 1.5096l-4.1944 4.19439 4.1944 4.1944c.4078.4069.4078 1.0689 0 1.4768-.4079.4078-1.0699.4078-1.4768 0l-4.1944-4.1944-4.19439 4.1944c-.41654.4165-1.09306.4165-1.5096 0-.41655-.4165-.41655-1.0931 0-1.5096l4.19442-4.19443-4.19442-4.19442c-.40785-.40688-.40785-1.0689 0-1.47674.40784-.40785 1.06986-.40785 1.47674 0l4.19442 4.19442z"
              ></path>
            </svg>
          </button>
        </div>
        <form
          class="new-letter__form"
          id="newLetterForm"
          onSubmit={(e) => handleSendLetter(e)}
        >
          <label class="new-letter__form-row">
            <div class="new-letter__form-header">
              {INT_NEW_LETTER.RECIPIENTS[lang]}
            </div>
            <input
              class="new-letter__form-text"
              type="text"
              value={inputReceivers}
              onInput={(e) => handleInputReceivers(e)}
            />
          </label>
          <label class="new-letter__form-row">
            <div class="new-letter__form-header">
              {INT_NEW_LETTER.SUBJECT[lang]}
            </div>
            <input
              class="new-letter__form-text"
              type="text"
              value={inputSubject}
              onInput={(e) => handleInputSubject(e)}
            />
          </label>
          <div class="new-letter__form-row">
            <label
              class={`new-lettr__file-attach-label ${
                dndGreenArea ? "new-letter__dnd-green" : ""
              }`}
              onDrag={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDragStartCapture={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDragEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDragEnter={(e) => handleDnDFileEnter(e)}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDragLeave={(e) => handleDnDFileLeave(e)}
              onDrop={(e) => handleDnDFileDrop(e)}
            >
              <div class="new-letter__form-header new-letter__clip-cont">
                <span class="new-letter__header-of-clip"></span>
                {INT_NEW_LETTER.ATTACH_FILE[lang]}
                <span class="new-letter__clip-icon">{ICON_CLIP}</span>
              </div>

              {selectedFile && (
                <>
                  <img class="new-letter__attach-preview" src={previewLink} />
                  <div>{previewDataSize}</div>
                </>
              )}

              <input
                class="new-letter__hidden-input"
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => handleSelectFile(e)}
              />
            </label>
            <div class="new-letter__flag-buttons">
              <div
                class="new-letter__flag-btn"
                onClick={(e) => handleImportantClick(e)}
              >
                <img
                  src={importantState ? iconImportant : iconImportantEmpty}
                  alt="icon"
                />
              </div>
              <div
                class="new-letter__flag-btn"
                onClick={(e) => handleBookmarkClick(e)}
              >
                <img
                  src={bookmarkState ? iconBookmark : iconEmptyBookmark}
                  alt="icon"
                />
              </div>
              <div
                class="new-letter__flag-btn"
                onClick={(e) => handleFlagChange(e, "Билеты")}
              >
                <img
                  src={
                    flagState === "Билеты"
                      ? ICONS_FLAG["Билеты"]
                      : ICONS_FLAG_EMPTY["Билеты"]
                  }
                  alt="icon"
                />
              </div>
              <div
                class="new-letter__flag-btn"
                onClick={(e) => handleFlagChange(e, "Заказы")}
              >
                <img
                  src={
                    flagState === "Заказы"
                      ? ICONS_FLAG["Заказы"]
                      : ICONS_FLAG_EMPTY["Заказы"]
                  }
                  alt="icon"
                />
              </div>
              <div
                class="new-letter__flag-btn"
                onClick={(e) => handleFlagChange(e, "Путешевствия")}
              >
                <img
                  src={
                    flagState === "Путешевствия"
                      ? ICONS_FLAG["Путешевствия"]
                      : ICONS_FLAG_EMPTY["Путешевствия"]
                  }
                  alt="icon"
                />
              </div>
              <div
                class="new-letter__flag-btn"
                onClick={(e) => handleFlagChange(e, "Регистрации")}
              >
                <img
                  src={
                    flagState === "Регистрации"
                      ? ICONS_FLAG["Регистрации"]
                      : ICONS_FLAG_EMPTY["Регистрации"]
                  }
                  alt="icon"
                />
              </div>
              <div
                class="new-letter__flag-btn"
                onClick={(e) => handleFlagChange(e, "Финансы")}
              >
                <img
                  src={
                    flagState === "Финансы"
                      ? ICONS_FLAG["Финансы"]
                      : ICONS_FLAG_EMPTY["Финансы"]
                  }
                  alt="icon"
                />
              </div>
              <div
                class="new-letter__flag-btn"
                onClick={(e) => handleFlagChange(e, "Штрафы и налоги")}
              >
                <img
                  src={
                    flagState === "Штрафы и налоги"
                      ? ICONS_FLAG["Штрафы и налоги"]
                      : ICONS_FLAG_EMPTY["Штрафы и налоги"]
                  }
                  alt="icon"
                />
              </div>
            </div>
          </div>
          <textarea
            class="new-letter__textarea"
            value={inputLetterBody}
            onInput={(e) => handleInputBody(e)}
          />
        </form>
        <div class="new-letter__button-container">
          <button
            class="new-letter__button new-letter__button-blue"
            type="submit"
            value="Отправленные"
            form="newLetterForm"
          >
            {INT_NEW_LETTER.SEND[lang]}
          </button>
          <button
            class="new-letter__button new-letter__button-grey"
            type="submit"
            value="Черновики"
            form="newLetterForm"
          >
            {INT_NEW_LETTER.SAVE[lang]}
          </button>
          <button
            class="new-letter__button new-letter__button-grey"
            onClick={handleShowNewLetter}
          >
            {INT_NEW_LETTER.CANCEL[lang]}
          </button>
        </div>
        {showResultModal ? resultModal : null}
      </div>
    </div>
  );
}
