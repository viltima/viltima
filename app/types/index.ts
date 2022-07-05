import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export interface Action {
  type: string,
  payload?: object | string | boolean
}

export interface Theme {
  StartColor: string,
  MiddleColor: string,
  EndColor: string,
  TextColor: string,
  name: string,
}

export interface User {
  id?: string,
  username?: string,
  verified?: boolean,
  message?: string,
  token?: string
}

export interface State {
  isLoggedIn?: boolean,
  theme?: Theme,
  user?: User,
  updateLogin: (result: any) => void,
  changeTheme: (theme: Theme) => void,
  checkStorage: (key: string, type: string) => Promise<void>,
  signOut: () => void,
  onboardUser: (user: User) => void
}

export interface RequestOptions {
  url?: string,
  data?: any,
  headers?: any,
  method?: string,
  body?: any
}

export interface AnyObj {
  [key: string]: any
}

export type StackParamList = {
  Login: undefined,
  Signup: undefined,
  VerifyAccount: {
    hasCode: boolean
  },
  Home: undefined,
  ForgotPassword: undefined,
  navigate: (key: string, value?: any) => void
}

export type StackNavigationProps = NativeStackNavigationProp<StackParamList>
