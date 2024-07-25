import { configureStore, createSlice } from "@reduxjs/toolkit";

const themeRefreshSlice = createSlice({
  initialState: 0,
  name: "themeRefreshSlice",
  reducers: {
    refresh: (state): any => {
      return state + 1;
    },
  },
});

const chatDetailsSlice = createSlice({
  initialState: {
    visible: false,
    id: null,
  },
  name: "chatDetails",
  reducers: {
    setChatDetails: (state, action): any => {
      return { ...state, ...action.payload };
    },
  },
});

const changeContentBar = createSlice({
  initialState: "home",
  name: "changeContendBar",
  reducers: {
    changeContent: (state, action): any => {
      return action.payload;
    },
  },
});

const UserAccountDataSlice = createSlice({
  initialState: {},
  name: "UserAccountDataSlice",
  reducers: {
    insertData: (state, action): any => {
      return { ...state, ...action.payload };
    },
  },
});

const loadUserAccountDataSlice = createSlice({
  initialState: 0,
  name: "loadUserAccountDataSlice",
  reducers: {
    load: (state): any => {
      return state + 1;
    },
  },
});

const currentChatSlice = createSlice({
  initialState: {},
  name: "currentChatSlice",
  reducers: {
    insertCurrentChatData: (state, action): any => {
      return { ...action.payload };
    },
  },
});

const currentGroupChatSlice = createSlice({
  initialState: {},
  name: "currentGroupChatSlice",
  reducers: {
    insertCurrentGroupChatData: (state, action): any => {
      return { ...action.payload };
    },
  },
});

const callStateSlice = createSlice({
  initialState: {
    do: {
      video: {
        visible: false,
        data: "",
      },
      voice: {
        visible: false,
        data: "",
      },
    },
    pick: {
      video: {
        visible: false,
        data: null,
        signal: null,
      },
      voice: {
        visible: false,
        data: null,
        signal: null,
      },
    },
  },
  name: "callStateSlice",
  reducers: {
    setCallState: (state, action): any => {
      return { ...state, ...action.payload };
    },
  },
});

const Store = configureStore(<any>{
  reducer: {
    themeRefresh: themeRefreshSlice.reducer,
    chatDetails: chatDetailsSlice.reducer,
    changeContentBar: changeContentBar.reducer,
    UserAccountData: UserAccountDataSlice.reducer,
    loadUserAccountData: loadUserAccountDataSlice.reducer,
    currentGroupChat: currentGroupChatSlice.reducer,
    currentChat: currentChatSlice.reducer,
    callStates: callStateSlice.reducer,
  },
});

export { Store };
export const { refresh } = themeRefreshSlice.actions;
export const { setChatDetails } = chatDetailsSlice.actions;
export const { changeContent } = changeContentBar.actions;
export const { insertData } = UserAccountDataSlice.actions;
export const { load } = loadUserAccountDataSlice.actions;
export const { insertCurrentChatData } = currentChatSlice.actions;
export const { insertCurrentGroupChatData } = currentGroupChatSlice.actions;
export const { setCallState } = callStateSlice.actions;
