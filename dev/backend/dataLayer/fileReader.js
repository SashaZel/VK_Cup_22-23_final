import { readFile, stat } from "node:fs/promises";

export async function readStaticFile(path) {
  const fileDraft = {
    data: "",
    hasError: false,
  };

  try {
    fileDraft.data = await readFile(`.${path}`);
    return fileDraft;
  } catch (error) {
    console.error(error);
    fileDraft.hasError = true;
    return fileDraft;
  }
}

export async function readImageSize(attachedImageName) {
  const sizeDraft = {
    size: 0,
    hasError: false,
  };

  try {
    const fileStat = await stat(`./images/attachments/${attachedImageName}`);
    sizeDraft.size = fileStat.size;
    return sizeDraft;
  } catch (error) {
    console.error(error);
    sizeDraft.hasError = true;
    return sizeDraft;
  }
}
