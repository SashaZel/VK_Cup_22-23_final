import fs from "node:fs";
import { readFile } from "node:fs/promises";
import { getLetterPreview } from "../utils.js";

async function readDatabase() {
  try {
    const filePath = new URL("../../db.json", import.meta.url);
    const contents = await readFile(filePath, { encoding: "utf8" });
    const allLettersRaw = JSON.parse(contents);

    const foldersList = [];
    const lettersPreviewList = [];

    for (let i = 0; i < allLettersRaw.length; i++) {
      const folderName = allLettersRaw[i]?.folder || "income";

      if (!foldersList.includes(folderName)) {
        foldersList.push(folderName);
      }

      lettersPreviewList.push(getLetterPreview(allLettersRaw[i]));

      // get all avatars and save as a static asset

      if (allLettersRaw[i].to) {
        for (let j = 0; j < allLettersRaw[i].to.length; j++) {
          if (!allLettersRaw[i].to[j].avatar) continue;
          const avatarData = allLettersRaw[i].to[j].avatar.split(",")[1];
          const buffer = Buffer.from(avatarData, "base64");
          fs.writeFileSync(
            `images/avatars/avatar--${allLettersRaw[i].to[j].email}.png`,
            buffer
          );
        }
      }
      if (allLettersRaw[i]?.author?.avatar) {
        const avatarData = allLettersRaw[i].author.avatar.split(",")[1];
        const buffer = Buffer.from(avatarData, "base64");
        fs.writeFileSync(
          `images/avatars/avatar--${allLettersRaw[i].author.email}.png`,
          buffer
        );
      }

      // get all attachmetnt pic and save as a static asset

      if (allLettersRaw[i]?.doc?.img) {
        const picData = allLettersRaw[i].doc.img.split(",")[1];
        const bufferPic = Buffer.from(picData, "base64");
        fs.writeFileSync(
          `images/attachments/att-pic--${
            allLettersRaw[i].author.email
          }-${allLettersRaw[i].date.replaceAll(":", "--esc-colon--")}.jpg`,
          bufferPic
        );
      }
    }

    return {
      folders: foldersList,
      lettersPreview: lettersPreviewList,
    };
  } catch (err) {
    console.error(err.message);
    return null;
  }
}

export const appData = new Promise((resolve, reject) => {
  resolve(readDatabase());
  reject(new Error("@database: Error in reading db.json"));
});
