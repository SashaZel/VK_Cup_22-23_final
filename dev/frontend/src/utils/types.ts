import { ORDERED_FOLDERS } from "./constants";
import { ICONS_FLAG } from "./iconsSVG";

export type TFolders = typeof ORDERED_FOLDERS[number];
export type TFoldersLoose = string;

export interface ILetterPreview {
  author: {
    name: string;
    surname: string;
    email: string;
    hasAvatar: boolean;
  };
  to: {
    name: string;
    surname: string;
    email: string;
    hasAvatar: boolean;
  }[];
  title: string;
  text: string;
  bookmark: boolean;
  important: boolean;
  read: boolean;
  folder: TFoldersLoose;
  date: string;
  hasAttachment: boolean;
  flag: keyof typeof ICONS_FLAG | '';
}


export type TTheme =
  | "light"
  | "dark"
  | "anime"
  | "brown"
  | "gray"
  | "purple"
  | "moon-blue"
  | "blue"
  | "pink"
  | "orange"
  | "green"
  | "turkey-blue"
  | 'light-sienna'
  | 'beige'
  | 'light-olive'
  | 'light-blue'
  | 'light-violet'
  | 'light-light-blue'
  | 'light-grey';

export type TLang = 'ENG' | 'RUS';

export interface IINT {
  [key: string]: {
    'ENG': string;
    'RUS': string;
  };
} 

export interface IFilter {
  showUnread: boolean;
  showBookmark: boolean;
  showWithAttachment: boolean;
}
