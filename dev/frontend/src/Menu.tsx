import { useContext, useEffect, useState } from "preact/hooks";
import { LanguageContext } from "./app";
import { IINT, TFolders } from "./utils/types";
import { ORDERED_FOLDERS } from "./utils/constants";
import { ICONS_FOLDERS, ICON_PLUS, ICON_SETTINGS } from "./utils/iconsSVG";
import iconPen from "./assets/icon_pen.svg";
import { createFolderAPI, getFoldersList, getInboxStatusAPI } from "./api/API";
import { JSXInternal } from "preact/src/jsx";

const INT_MENU: IINT = {
  WRITE_LETTER: {
    ENG: "Compose",
    RUS: "Написать письмо",
  },
  income: {
    ENG: "Inbox",
    RUS: "Входящие",
  },
  Важное: {
    ENG: "Important",
    RUS: "Важное",
  },
  Отправленные: {
    ENG: "Sent",
    RUS: "Отправленные",
  },
  Черновики: {
    ENG: "Drafts",
    RUS: "Черновики",
  },
  Архив: {
    ENG: "Archived",
    RUS: "Архив",
  },
  Спам: {
    ENG: "Spam",
    RUS: "Спам",
  },
  Корзина: {
    ENG: "Trash",
    RUS: "Корзина",
  },
  NEW_FOLDER: {
    ENG: "Create new folder",
    RUS: "Новая папка",
  },
  CLOSE: {
    ENG: "Cancel creation",
    RUS: "Закрыть без создания",
  },
  CREATE_NEW_FOLDER: {
    ENG: "Create new folder",
    RUS: "Создать новую папку",
  },
  SETTING: {
    ENG: "Setting",
    RUS: "Настройки",
  },
};

interface IMenuProps {
  currentFolder: string;
  handleChangeFolder: (folder: TFolders) => void;
  handleShowSettings: () => void;
  handleShowNewLetter: () => void;
  handleDnDdrop: (newFolder: TFolders) => void;
}

export function Menu({
  currentFolder,
  handleChangeFolder,
  handleShowSettings,
  handleShowNewLetter,
  handleDnDdrop,
}: IMenuProps) {
  const lang = useContext(LanguageContext);

  const [unreadInbox, setUnreadInbox] = useState(0);
  const [showCreateNewFolder, setShowCreateNewFolder] = useState(false);
  const [loadingCreateNewFolder, setLoadingCreateNewFolder] = useState(false);
  const [foldersList, setFoldersList] = useState<TFolders[]>([]);
  const [folderDragHover, setFolderDragHover] = useState("");

  useEffect(() => {
    async function getFolders() {
      const fetchedFoldersList = await getFoldersList();
      const foldersReuslt: TFolders[] = fetchedFoldersList.folders;
      setFoldersList(foldersReuslt);
    }
    getFolders();
  }, [loadingCreateNewFolder]);

  useEffect(() => {
    const checkInboxStatus = async () => {
      const inboxStatus = await getInboxStatusAPI();
      if (!inboxStatus.ok) {
        return;
      }
      setUnreadInbox(inboxStatus.unreadInIncomeFolder);
    };
    checkInboxStatus();
  }, [currentFolder, loadingCreateNewFolder]);

  const handleDragEnter = (
    e: JSXInternal.TargetedDragEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
  };

  const handleDragOver = (
    e: JSXInternal.TargetedDragEvent<HTMLButtonElement>,
    folderName: TFolders
  ) => {
    e.preventDefault();
    if (folderDragHover !== folderName) {
      setFolderDragHover(folderName);
    }
  };

  const handleDragLeave = () => {
    setFolderDragHover("");
  };

  const handleDrop = (
    e: JSXInternal.TargetedDragEvent<HTMLButtonElement>,
    folderName: TFolders
  ) => {
    e.preventDefault();
    handleDnDdrop(folderName);

    setFolderDragHover("");
  };

  const handleNewFolder = () => {
    setShowCreateNewFolder(!showCreateNewFolder);
  };

  const handleCreateNewFolder = async (
    e: JSXInternal.TargetedEvent<HTMLFormElement, Event>
  ) => {
    e.preventDefault();
    const targetElement = e.target as HTMLFormElement;
    const formElement = targetElement.elements;
    const firstInput = formElement[0] as HTMLInputElement;
    setLoadingCreateNewFolder(true);
    const _result = await createFolderAPI(firstInput.value);
    setShowCreateNewFolder(false);
    setLoadingCreateNewFolder(false);
  };

  const newFolderButton = (
    <button
      class="menu__button menu__button-light-color"
      onClick={handleNewFolder}
    >
      <div class="menu__button-left-container">
        <div class="menu__button-icon">{ICON_PLUS}</div>
        <div class="menu__button-header menu__hide-header">
          {INT_MENU.NEW_FOLDER[lang]}
        </div>
      </div>
      <div></div>
    </button>
  );

  const buttonNameInCreateNewFolder = loadingCreateNewFolder
    ? "Wait..."
    : INT_MENU.CREATE_NEW_FOLDER[lang];

  const newFolderTooltip = (
    <div class="menu__new-folder-tooltip">
      <button
        class="menu__button menu__button-light-color"
        onClick={() => setShowCreateNewFolder(false)}
      >
        {INT_MENU.CLOSE[lang]}
      </button>
      <form onSubmit={(e) => handleCreateNewFolder(e)}>
        <input class="menu__new-folder-input" type="text" maxLength={15} />
        <input
          class="menu__button"
          type="submit"
          value={buttonNameInCreateNewFolder}
        />
      </form>
    </div>
  );

  const foldersListCustom = [...ORDERED_FOLDERS];
  for (let i = 0; i < foldersList.length; i++) {
    if (!ORDERED_FOLDERS.includes(foldersList[i])) {
      foldersListCustom.push(foldersList[i]);
    }
  }

  const menuFolders = foldersListCustom.map((element, index: number) => {
    let folderName = INT_MENU[String(element)]
      ? INT_MENU[String(element)][lang]
      : element;

    const unread = unreadInbox ? String(unreadInbox) : "";

    return (
      <button
        key={String(index) + String(new Date())}
        onClick={() => handleChangeFolder(element)}
        class={`menu__button ${
          element === currentFolder ? "menu__button-active" : ""
        } ${folderDragHover === element ? "menu__button-hover" : ""}`}
        onDragEnter={(e) => handleDragEnter(e)}
        onDragOver={(e) => handleDragOver(e, element)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, element)}
      >
        <div class="menu__button-left-container">
          <div class="menu__button-icon">
            {ICONS_FOLDERS[index] ? ICONS_FOLDERS[index] : ICONS_FOLDERS[1]}
          </div>
          <div class="menu__button-header menu__hide-header">{folderName}</div>
        </div>
        <div class="menu__hide-header">
          {element === "income" ? unread : ""}
        </div>
      </button>
    );
  });

  return (
    <div class="menu">
      <div>
        <button class="menu__new-letter-button" onClick={handleShowNewLetter}>
          <img class="menu__new-letter-button-icon" src={iconPen} alt="icon" />
          <span class="menu__hide-header">{INT_MENU.WRITE_LETTER[lang]}</span>
        </button>
        <ul>{menuFolders}</ul>
        <div class="menu__panel-separator"></div>
        {showCreateNewFolder ? newFolderTooltip : newFolderButton}
      </div>
      <div>
        <button onClick={handleShowSettings} class="menu__button">
          <div class="menu__button-left-container">
            <div class="menu__button-icon">{ICON_SETTINGS}</div>
            <div class="menu__button-header menu__hide-header">
              {INT_MENU.SETTING[lang]}
            </div>
          </div>
          <div></div>
        </button>
      </div>
    </div>
  );
}
