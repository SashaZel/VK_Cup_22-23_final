import { ILetterPreview, TFolders } from "../utils/types";

export const getFoldersList = async () => {
  try {
    const response = await fetch("/api/v1/folders.json");
    if (!response.ok) {
      console.error("@API_getFoldersList");
      return { ok: false, folders: [] };
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("@API_getFoldersList", error);
    return { ok: false, folders: [] };
  }
};

export const getImageSize = async (
  imageName: string
): Promise<{ ok: boolean; imageSize: number }> => {
  try {
    const response = await fetch(`/api/get-image-size?image=${imageName}`);
    if (!response.ok) {
      console.error("@getImageSize ");
      return { ok: false, imageSize: 0 };
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("@getImageSize", error);
    return { ok: false, imageSize: 0 };
  }
};

export const fetchLetters = async (
  folderName: TFolders = "income",
  offset = 0,
  reqLength = 10
): Promise<{
  ok: boolean;
  nextAvailable: boolean;
  letters: ILetterPreview[];
}> => {
  try {
    const response = await fetch(
      `/api/v1/get-letters?folder=${folderName}&offset=${offset}&length=${reqLength}`
    );
    if (!response.ok) {
      console.error("@fetchLetters ");
      return { ok: false, nextAvailable: false, letters: [] };
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("@API @getLettersFromFolder ", error);
    return { ok: false, nextAvailable: false, letters: [] };
  }
};

export const getInboxStatusAPI = async (): Promise<{
  ok: boolean;
  unreadInIncomeFolder: number;
  newIncomeLetters: ILetterPreview[];
}> => {
  try {
    const response = await fetch("/api/v1/income-status");
    if (!response.ok) {
      console.error("@sendLetterAPI ");
      return { ok: false, unreadInIncomeFolder: 0, newIncomeLetters: [] };
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("@getImageSize", error);
    return { ok: false, unreadInIncomeFolder: 0, newIncomeLetters: [] };
  }
};

export const sendLetterAPI = async (
  letter: ILetterPreview
): Promise<{ ok: boolean; error: string }> => {
  try {
    const letterJSON = JSON.stringify(letter);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: letterJSON,
    };
    const response = await fetch("/api/v1/new-letter", options);
    if (!response.ok) {
      console.error("@sendLetterAPI ");
      return { ok: false, error: `Error during sending letter. Response status: ${response?.status}` };
    }
    const result = response.json();
    return result;
  } catch (error) {
    console.error("@sendLetterAPI ", error);
    return { ok: false, error: "Error during sending letter" };
  }
};

export const createFolderAPI = async (folderName: string) => {
  try {
    const letterJSON = JSON.stringify({ newFolderName: folderName });
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: letterJSON,
    };
    const response = await fetch("/api/v1/new-folder", options);
    if (!response.ok) {
      console.error("@createFolderAPI");
      return { ok: false, error: `Error during create folder. Response status: ${response?.status}` };
    }
    const result = response.json();
    return result;
  } catch (error) {
    console.error("@createFolderAPI ", error);
    return { ok: false, error: "Error during sending creating folder" };
  }
};

export const changeFolderAPI = async (
  newLetterForMove: ILetterPreview,
  oldFolderFrom: string
) => {
  try {
    const payloadJSON = JSON.stringify({
      newLetter: newLetterForMove,
      oldFolder: oldFolderFrom,
    });
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: payloadJSON,
    };
    const response = await fetch("/api/v1/change-folder", options);
    if (!response.ok) {
      console.error("@changeFolderAPI ");
      return { ok: false, error: "Error during changing folder" };
    }
    const result = response.json();
    return result;
  } catch (error) {
    console.error("@changeFolderAPI ", error);
    return { ok: false, error: "Error during changing folder" };
  }
};
