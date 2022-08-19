import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { IMessage } from "react-native-gifted-chat";
import { Socket } from "socket.io-client";

export interface Action {
  type: string;
  payload?: object | string | boolean;
  user?: User;
  users?: User[];
  key?: string;
  messages?: IMessage[];
}

export interface Theme {
  StartColor: string;
  MiddleColor: string;
  EndColor: string;
  TextColor: string;
  name: string;
}

export interface User {
  id?: string;
  username?: string;
  verified?: boolean;
  message?: string;
  token?: string;
  sid?: string;
}

export interface InitState {
  theme: Theme;
  isLoggedIn: boolean;
  messages: { [key: string]: IMessage[] };
  user: User;
  users: User[];
  rooms: string[];
  socket: Socket | undefined;
  socketId: string;
}

export interface State {
  isLoggedIn?: boolean;
  theme?: Theme;
  user?: User;
  socket?: Socket;
  users?: User[];
  rooms?: string[];
  socketId?: string;
  messages?: { [key: string]: IMessage[] };
  updateUsers: (users: User[]) => void;
  updateRooms: (room: string) => void;
  removeRoom: (room: string) => void;
  setSocket: (socket: Socket) => void;
  updateLogin: (result: any) => void;
  changeTheme: (theme: Theme) => void;
  checkStorage: (key: string, type: string) => Promise<void>;
  signOut: () => void;
  onboardUser: (user: User) => void;
  addMessage: (key: string, messages: IMessage[]) => void;
  setSocketId: (socketId: string) => void;
}

export interface Messages {
  [key: string]: IMessage[];
}

export interface RequestOptions {
  url?: string;
  data?: any;
  headers?: any;
  method?: string;
  body?: any;
}

export interface AnyObj {
  [key: string]: any;
}

export type StackParamList = {
  Login: undefined;
  Signup: undefined;
  Message: undefined;
  RoomMessage: undefined;
  VerifyAccount: {
    hasCode: boolean;
  };
  Home: undefined;
  ForgotPassword: undefined;
  navigate: (key: string, value?: any) => void;
};

export type StackNavigationProps = NativeStackNavigationProp<StackParamList>;
