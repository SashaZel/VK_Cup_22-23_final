export const getLetterPreview = (letter) => {
  let hasAttachmentFiles = false;
  if (letter.doc) {
    hasAttachmentFiles = true;
  }

  let hasAuthorAvatar = false;
  if (letter.author.avatar) {
    hasAuthorAvatar = true;
  }

  let nameToArray = [];
  for (let i = 0; i < letter.to.length; i++) {
    const objectTo = {
      name: letter.to[i]?.name ?? "",
      surname: letter.to[i]?.surname ?? "",
      email: letter.to[i]?.email ?? "",
      hasAvatar: !!letter.to[i]?.avatar,
    };
    nameToArray.push(objectTo);
  }

  let categoriesFlag = "";
  if (letter.flag) {
    categoriesFlag = letter.flag;
  }

  return {
    author: {
      name: letter?.author?.name,
      surname: letter?.author?.surname,
      email: letter?.author?.email,
      hasAvatar: hasAuthorAvatar,
    },
    to: nameToArray,
    title: letter?.title,
    text: letter?.text,
    bookmark: letter?.bookmark,
    important: letter?.important,
    read: letter?.read,
    folder: letter?.folder || "income",
    date: letter?.date,
    hasAttachment: hasAttachmentFiles,
    flag: categoriesFlag,
  };
};
