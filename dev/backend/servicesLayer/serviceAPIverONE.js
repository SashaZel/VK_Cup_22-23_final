import { appData } from "../dataLayer/database.js";

class AppReady {
  // Srart initialization class

  #appLetters;
  #appFolders;
  #errorDraft = { ok: false, letters: [], nextAvailable: false };

  constructor(formattedAppData) {
    this.#appLetters = formattedAppData.appLetters;
    this.#appFolders = formattedAppData.appFolders;
  }

  static sortByDate(letterA, letterB) {
    if (!letterA.date || !letterB.date) {
      return 0;
    }
    const dateA = new Date(letterA.date);
    const dateB = new Date(letterB.date);
    const aIsEqualB = dateA === dateB;
    if (aIsEqualB) {
      return 0;
    }
    const aLessThanB = dateA < dateB;
    if (aLessThanB) {
      return 1;
    }
    if (!aLessThanB) {
      return -1;
    }
  }

  static async getAllLettersSortedByFolders(appDataPromise) {
    try {
      const appDataResolved = await appDataPromise;
      const allLetters = appDataResolved.lettersPreview;
      allLetters.sort(this.sortByDate);
      const allFolders = appDataResolved.folders;
      const result = {
        appLetters: {},
        appFolders: allFolders,
      };
      for (let i = 0; i < allFolders.length; i++) {
        const folderName = allFolders[i];
        result.appLetters[folderName] = [];
      }
      for (let i = 0; i < allLetters.length; i++) {
        const letter = allLetters[i];
        const folderName = letter.folder;
        result.appLetters[folderName].push(letter);
      }
      return result;
    } catch (error) {
      console.error(
        "@serviceAPIverONE @AppReady @getAllLettersSortedByFolders ",
        error
      );
      return { appLetters: {}, appFolders: [] };
    }
  }

  static async initialize(appData) {
    const formattedAppData = await this.getAllLettersSortedByFolders(appData);
    return new AppReady(formattedAppData);
  }

  // End of intialization

  checkLetterIsValid(newLetter) {
    try {
      if (
        !newLetter.author ||
        !newLetter.to ||
        typeof newLetter.title !== "string" ||
        typeof newLetter.text !== "string" ||
        typeof newLetter.bookmark !== "boolean" ||
        typeof newLetter.important !== "boolean" ||
        typeof newLetter.read !== "boolean" ||
        typeof newLetter.folder !== "string" ||
        typeof newLetter.date !== "string" ||
        typeof newLetter.hasAttachment !== "boolean" ||
        typeof newLetter.flag !== "string" ||
        typeof newLetter?.author?.name !== "string" ||
        typeof newLetter?.author?.surname !== "string" ||
        typeof newLetter?.author?.email !== "string" ||
        typeof newLetter?.author?.hasAvatar !== "boolean"
      ) {
        return false;
      }
      return true;
    } catch (error) {
      console.error("@AppReady @checkLetterIsValid ", error);
      return false;
    }
  }

  async getLetters(folderName = "income", reqOffset = 0, reqLenght = 0) {
    try {
      const allLettersFromReqFolder = this.#appLetters[folderName];
      const offset = Number(reqOffset);
      const lengthOfList = Number(reqLenght);
      if (
        allLettersFromReqFolder === undefined ||
        offset === NaN ||
        lengthOfList === NaN
      ) {
        return this.#errorDraft;
      }
      const startOfSlice =
        offset > 0 && offset < allLettersFromReqFolder.length - 1 ? offset : 0;
      const endOfSlice = startOfSlice + lengthOfList;
      const result = { ok: true, nextAvailable: true };
      if (endOfSlice >= allLettersFromReqFolder.length) {
        result.nextAvailable = false;
      }
      result.letters = allLettersFromReqFolder.slice(startOfSlice, endOfSlice);

      return result;
    } catch (error) {
      console.error("@AppReady @getLetters ", error);
      return this.#errorDraft;
    }
  }

  async getFoldersList() {
    try {
      const appFolders = await this.#appFolders;
      return { ok: true, folders: appFolders };
    } catch (error) {
      console.log("@AppReady @getFoldersList ", error);
      return { ok: false, folders: [] };
    }
  }

  async getIncomeStatus() {
    try {
      const incomeFolder = this.#appLetters.income;
      if (!incomeFolder) {
        console.error("@AppReady @getUnreadInIncomeFolder no incomeFolder");
        return { ok: false, unreadInIncomeFolder: 0, newIncomeLetters: [] };
      }
      let unreadLetters = 0;
      for (let i = 0; i < incomeFolder.length; i++) {
        const isLetterRead = await incomeFolder[i].read;
        if (!isLetterRead) {
          unreadLetters++;
        }
      }
      return {
        ok: true,
        unreadInIncomeFolder: unreadLetters,
        newIncomeLetters: [],
      };
    } catch (error) {
      console.error("@AppReady @getUnreadInIncomeFolder ", error);
      return { ok: false, unreadInIncomeFolder: 0, newIncomeLetters: [] };
    }
  }

  async postLetter(newLetter) {
    try {
      if (!this.checkLetterIsValid(newLetter)) {
        return { ok: false, error: "Wrong letter format" };
      }
      const _result = await this.#appLetters[newLetter.folder].unshift(
        newLetter
      );
      return { ok: true, error: "" };
    } catch (error) {
      console.error("@AppReady @postLetter ", error);
      return { ok: false, error: "Internal Error" };
    }
  }

  async createFolder(newFolderObj) {
    try {
      if (
        !newFolderObj.newFolderName ||
        typeof newFolderObj.newFolderName !== "string" ||
        newFolderObj.newFolderName?.lenght > 15
      ) {
        return { ok: false, error: "Wrong folder name format or length > 15" };
      }
      if (this.#appFolders.includes(newFolderObj.newFolderName)) {
        return { ok: false, error: "Folder with this name already exist" };
      }
      this.#appFolders.push(newFolderObj.newFolderName);
      this.#appLetters[newFolderObj.newFolderName] = [];
      return { ok: true, error: "" };
    } catch (error) {
      console.error("@AppReady @createFolder ", error);
      return { ok: false, error: "Internal Error" };
    }
  }

  async moveLetterToFolder(newLetter, oldFolder) {
    try {
      if (!this.checkLetterIsValid(newLetter)) {
        return { ok: false, error: "Wrong letter format" };
      }
      if (
        !this.#appFolders.includes(oldFolder) ||
        !this.#appFolders.includes(newLetter.folder)
      ) {
        return { ok: false, error: "Error in folders name" };
      }
      const oldFolderForSearch = this.#appLetters[oldFolder];
      for (let i = 0; i < oldFolderForSearch.length; i++) {
        if (
          oldFolderForSearch[i].author.email === newLetter.author.email &&
          oldFolderForSearch[i].date === newLetter.date
        ) {
          oldFolderForSearch.splice(i, 1);
          break;
        }
        if (i === oldFolderForSearch.length - 1) {
          return { ok: false, error: "Error: no such letter for move" };
        }
      }
      const newLetterDate = new Date(newLetter.date);
      const newFolderForSearch = this.#appLetters[newLetter.folder];

      if (newFolderForSearch.length === 0) {
        newFolderForSearch.push(newLetter);
      } else {
        const oldestLetterDate = new Date(
          newFolderForSearch[newFolderForSearch.length - 1].date
        );

        if (newLetterDate < oldestLetterDate) {
          newFolderForSearch.push(newLetter);
          return { ok: true, error: "" };
        }

        for (let i = 0; i < newFolderForSearch.length; i++) {
          const currentLetterDate = new Date(newFolderForSearch[i].date);
          if (newLetterDate > currentLetterDate) {
            newFolderForSearch.splice(i, 0, newLetter);
            break;
          }
        }
      }

      return { ok: true, error: "" };
    } catch (error) {
      console.error("@AppReady @moveLetterToFolder");
      return { ok: false, error: "Internal Error" };
    }
  }
}

export const appReady = await AppReady.initialize(appData);
