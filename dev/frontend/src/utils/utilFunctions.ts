import { IFilter, ILetterPreview } from "./types"

export const filterLettersByFilterState = (letter: ILetterPreview, filterState: IFilter): boolean => {
  if (!filterState.showUnread && !filterState.showBookmark && !filterState.showWithAttachment) {
    return true;
  }
  if (letter.read && filterState.showUnread) {
    return false;
  }
  if (!letter.bookmark && filterState.showBookmark) {
    return false;
  }
  if (!letter.hasAttachment && filterState.showWithAttachment) {
    return false;
  }
  return true;
}