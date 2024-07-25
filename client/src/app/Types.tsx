export type TUser = {
  _id?: string;
  fullName?: string;
  username?: string;
  isAvatar?: boolean;
  avatarColor?: string;
  status?: string;
  lastSeen?: string;
  profile?: {
    privacy: {
      profilePhoto?: boolean;
      about?: boolean;
      status?: boolean;
    };
    about?: string;
    avatar?: string;
  };
};

export type TGroup = {
  _id?: string;
  groupDetails?: {
    name?: string;
    description?: string;
  };
  createdBy?: TUser;
  groupAdmin?: TUser;
  groupMembers?: TUser[];
  groupMembersLength?: number;
  groupSetting?: {
    privacy: {
      isPhotoAllowed?: boolean;
      isVideoAllowed?: boolean;
      isChatAllowed?: boolean;
    };
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

export type TCallStates = {
  do: TCall;
  pick: TCall;
};
