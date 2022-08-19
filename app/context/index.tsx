import React, { createContext, useMemo, useReducer } from "react";

import PropTypes from "prop-types";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Action, AnyObj, InitState, State, Theme, User } from "types";

import {
  BOARDING,
  CHANGE_THEME,
  LOGIN,
  LOGOUT,
  REMOVE_ROOM,
  SET_SOCKET,
  SET_SOCKET_ID,
  Themes,
  UPDATE_MESSAGES,
  UPDATE_ROOMS,
  UPDATE_USERS,
} from "common";

import { getData, storeData, validateAccessToken } from "lib";
import { Socket } from "socket.io-client";
import { IMessage } from "react-native-gifted-chat";

export const AppContext = createContext<State>({} as State);

type Props = {
  children: React.ReactNode;
};

export const AppStateProvider: React.FC<Props> = ({ children }) => {
  const initState: InitState = {
    theme: Themes.Main,
    isLoggedIn: false,
    messages: {},
    user: {},
    users: [],
    rooms: ["Public"],
    socket: undefined,
    socketId: "",
  };

  const reducer = (state: InitState, action: Action): InitState => {
    switch (action.type) {
      case LOGIN: {
        return {
          ...state,
          isLoggedIn: true,
          user: action.user as User,
        };
      }

      case UPDATE_MESSAGES:
        return {
          ...state,
          messages: {
            ...state?.messages,
            [action.key as string]: action.messages,
          } as {},
        };

      case SET_SOCKET_ID:
        return {
          ...state,
          socketId: action.payload as string,
        };

      case SET_SOCKET:
        return {
          ...state,
          socket: action.payload as Socket,
        };

      case UPDATE_USERS:
        return {
          ...state,
          users: action.users as User[],
        };

      case UPDATE_ROOMS: {
        if (state.rooms.includes(action.payload as string)) {
          return state;
        }
        return {
          ...state,
          rooms: [...state.rooms, action.payload as string],
        };
      }

      case REMOVE_ROOM:
        return {
          ...state,
          rooms: state.rooms.filter((room) => room !== action.payload),
        };

      case BOARDING: {
        return {
          ...state,
          user: action.user as User,
        };
      }

      case LOGOUT:
        return {
          ...state,
          isLoggedIn: false,
          user: {},
        };

      case CHANGE_THEME:
        return {
          ...state,
          theme: action.payload as Theme,
        };
      default:
        return state;
    }
  };

  const [themeState, dispatch] = useReducer(reducer, initState);

  const appContext = useMemo(
    () => ({
      updateLogin: (result: User) => {
        storeData("@auth", { auth: result });

        dispatch({
          type: LOGIN,
          user: result,
        });
      },
      checkStorage: async (key: string, type: string) => {
        const result: AnyObj = await getData(`@${key}`);
        if (!result) return;

        if (type === LOGIN && validateAccessToken(result[key]?.token)) return;

        dispatch({
          type,
          user: result[key],
        });
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem("@auth");
          dispatch({
            type: LOGOUT,
          });
        } catch (error) {}
      },
      setSocketId: (socketId: string) => {
        dispatch({
          type: SET_SOCKET_ID,
          payload: socketId,
        });
      },
      onboardUser: (user: User) => {
        dispatch({
          type: BOARDING,
          user,
        });
      },
      changeTheme: (theme: Theme) => {
        storeData("@theme", { theme: theme.name });
        dispatch({
          type: CHANGE_THEME,
          payload: theme,
        });
      },
      setSocket: (socket: Socket) => {
        dispatch({
          type: SET_SOCKET,
          payload: socket,
        });
      },
      addMessage: (key: string, messages: IMessage[]) => {
        dispatch({
          type: UPDATE_MESSAGES,
          key,
          messages,
        });
      },
      updateUsers: (users: User[]) => {
        dispatch({
          type: UPDATE_USERS,
          users: users,
        });
      },
      removeRoom: (room: string) => {
        dispatch({
          type: REMOVE_ROOM,
          payload: room,
        });
      },
      updateRooms: (room: string) => {
        dispatch({
          type: UPDATE_ROOMS,
          payload: room,
        });
      },
    }),
    []
  );

  return (
    <AppContext.Provider value={{ ...appContext, ...themeState }}>
      {children}
    </AppContext.Provider>
  );
};

AppStateProvider.propTypes = {
  children: PropTypes.any,
};
