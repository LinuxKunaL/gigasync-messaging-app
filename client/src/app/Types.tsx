export type TUser = {
  _id?: string;
  fullName?: string;
  username?: string;
  isAvatar?: boolean;
  avatarColor?: string;
  status?: string;
  lastSeen?: string;
  contacts?: string[];
  profile?: {
    privacy: {
      profilePhoto?: boolean;
      about?: boolean;
      status?: boolean;
    };
    about?: string;
    avatar?: string;
  };
  mediaStatus?: {
    createdAt: Date;
    expiredAt?: Date;
    type: string;
    file: string;
    caption: string;
  }[];
  socketId?: string;
};

export type TGroup = {
  _id?: string;
  groupDetails?: {
    name?: string;
    description?: string;
  };
  createdBy?: TUser;
  groupMembers?: TUser[];
  groupMembersLength?: number;
  groupSetting?: {
    privacy: {
      isPhotoAllowed?: boolean;
      isVideoAllowed?: boolean;
      isVoiceAllowed?: boolean;
      isAudioAllowed?: boolean;
      isFileAllowed?: boolean;
      isChatAllowed?: boolean;
    };
    private: boolean;
  };
  avatar?: string;
};

export type TMessages = {
  message: {
    file: {
      name?: string;
      type?: string;
      data?: string;
    };
    text: string;
  };
  sender: TUser;
  receiver: TUser;
  timestamp: Date | undefined;
  replyMessage?: {
    id: string;
    message: {
      file: {
        name?: string;
        type?: string;
        data?: string;
      };
      text: string;
    };
    to: {
      fullName?: string;
    };
  };
  _id?: string;
};

type TCall = {
  video: {
    visible: boolean;
    data: TUser;
    signal: RTCSessionDescriptionInit;
    streamSetting: {
      width: number;
      height: number;
    };
  };
  voice: {
    visible: boolean;
    data: TUser;
    signal: RTCSessionDescriptionInit;
    streamSetting: {
      width: number;
      height: number;
    };
  };
};

export type TUfile = {
  data?: {
    name: string;
    type: string;
    size: number;
    buffer: any;
  };
  visible: {
    image?: boolean;
    video?: boolean;
    file?: boolean;
    audio?: boolean;
  };
  fileType?: "image" | "video" | "file" | "audio";
};

export type TCallStates = {
  do: TCall;
  pick: TCall;
};

export type TReaderResult = {
  image?: string | ArrayBuffer | null;
  video?: string | ArrayBuffer | null;
  audio?: string | ArrayBuffer | null;
};