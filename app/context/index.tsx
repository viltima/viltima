import React, { createContext, useMemo, useReducer } from "react";

import PropTypes from "prop-types";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Action, AnyObj, State, Theme, User } from "types";

import { BOARDING, CHANGE_THEME, LOGIN, LOGOUT, Themes } from "common";

import { getData, storeData, validateAccessToken } from "lib";

export const AppContext = createContext<State>({} as State);

type Props = {
  children: React.ReactNode;
};

export const AppStateProvider: React.FC<Props> = ({ children }) => {
  const initState = {
    theme: Themes.Main,
    isLoggedIn: false,
    user: {},
  };

  const reducer = (state: object, action: Action) => {
    switch (action.type) {
      case LOGIN: {
        return {
          ...state,
          isLoggedIn: true,
          user: action.payload,
        };
      }

      case BOARDING: {
        return {
          ...state,
          user: action.payload,
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
          theme: action.payload,
        };
      default:
        return state;
    }
  };

  const [themeState, dispatch] = useReducer(reducer, initState);

  const appContext = useMemo(
    () => ({
      updateLogin: (result: any) => {
        storeData("@auth", { auth: result });
        dispatch({
          type: LOGIN,
          payload: result,
        });
      },
      checkStorage: async (key: string, type: string) => {
        const result: AnyObj = await getData(`@${key}`);

        if (!result) return;

        if (type === LOGIN && validateAccessToken(result[key]?.token)) return;

        dispatch({
          type,
          payload: type === CHANGE_THEME ? Themes[result[key]] : result[key],
        });
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem("@auth");
          dispatch({
            type: LOGOUT,
          });
        } catch (error) { }
      },
      onboardUser: (user: User) => {
        dispatch({
          type: BOARDING,
          payload: user,
        });
      },
      changeTheme: (theme: Theme) => {
        storeData("@theme", { theme: theme.name });
        dispatch({
          type: CHANGE_THEME,
          payload: theme,
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
