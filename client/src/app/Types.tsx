export type TUser = {
  _id?: string;
  fullName?: string;
  username?: string;
  isAvatar?: boolean;
  avatarColor?: string;
  status?: string;
  lastSeen?: string;
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
