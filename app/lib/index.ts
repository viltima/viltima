import AsyncStorage from "@react-native-async-storage/async-storage";

import { disposed } from "mailify";
import jwtDecode from "jwt-decode";

export const validateEmail = async (email: string) => {
  const regexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  // TODO:
  // const check = await disposed(email);
  // if(check.disposable) return -> use another email address

  return regexp.test(email);
};

export const storeData = async (key: string, value: object) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    // saving error
  }
};

export const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);

    return jsonValue !== null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};

export const validateAccessToken = (token: string) => {
  if (!token) return false;

  const { exp }: any = jwtDecode(token);

  return Date.now() >= exp * 1000;
};
