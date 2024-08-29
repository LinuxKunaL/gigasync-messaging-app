import { TGroup, TUser } from "../../../../app/Types";

export type TMedia = {
  images: string[] | any;
  videos: string[] | any;
  audios: string[] | any;
};

export type TFiles = {
  name: string;
  url: string;
  size: number;
  date: string;
  format: string;
};

export type TVoice = {
  name: string;
  url: string;
  size: number;
  date: string;
};

export type TChatProfileDetails = {
  media?: TMedia | undefined;
  userTo?: TUser;
  files?: TFiles[];
  voices?: TVoice[];
  links?: string[];
  isBlocked?: any;
};

export type TMediaTabProps = {
  mediaImages: string[];
  mediaVideos: string[];
  mediaAudios: string[];
};

export type TPreviewMedia = {
  image?: string;
  video?: string;
};

export type TGroupMembers = {
  props: {
    groupChatDetails: TGroupChatDetails | undefined;
    setIsMemberWindowVisible: (parm: any) => void;
    setRefreshTrigger: (parm: any) => void;
  };
};

export type TGroupChatDetails = TGroup & {
  media?: TMedia | undefined;
  files?: TFiles[];
  voices?: TVoice[];
  links?: string[];
};

export type TGroupSetting = {
  props: {
    groupChatDetails: TGroupChatDetails | undefined;
    setIsSettingsWindowVisible: (parm: any) => void;
    setRefreshTrigger: (parm: any) => void;
  };
};

export type PROPSChatDetailsSidebar = {
  props: {
    visible: boolean;
    id: string;
    type: string;
  };
};
