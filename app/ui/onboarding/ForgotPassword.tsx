import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextStyle,
} from "react-native";

import React from "react";

import { scale, verticalScale } from "react-native-size-matters";

import useAppState from "hooks/useAppState";

import { useNavigation } from "@react-navigation/native";

import { Input } from "react-native-elements";

import { Api, Button, Inter } from "common";

import { validateEmail } from "lib";

import { RequestOptions, StackParamList } from "types";

import { useAsync } from "hooks";

// @ts-ignore
import { Root, Popup } from "popup-ui";

import { ChangePassword } from "./components/ChangePassword";

export const ForgotPassword = () => {
  const navigation = useNavigation<StackParamList>();
  const { theme, onboardUser } = useAppState();
  const [email, setEmail] = React.useState<string>("");
  const [token, setToken] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [hasRequestedCode, setHasRequestedCode] =
    React.useState<boolean>(false);
  const [passwordChanged, setPasswordChanged] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>("");
  const [sentVerificationCode, setSentVerificationCode] =
    React.useState<boolean>(false);

  const labelStyle: TextStyle = {
    color: theme?.TextColor,
    fontSize: verticalScale(11),
    lineHeight: verticalScale(13),
    textTransform: "uppercase",
    marginBottom: 6,
  };

  const passwordText: TextStyle = {
    color: theme?.TextColor,
    fontSize: verticalScale(13),
    lineHeight: verticalScale(15),
    textAlign: "right",
    fontFamily: Inter.Regular,
    marginBottom: verticalScale(10),
  };

  const { execute } = useAsync(({ data }: RequestOptions) => {
    return Api.post("/code", {
      data: {
        email: data?.email,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const response = await res.json();

          throw new Error(response.message);
        }

        return res.json();
      })
      .then((res) => {
        setIsLoading(false);
        onboardUser(res?.result);
        setToken(res?.result?.token);
        setMessage(res?.result?.message);
        setSentVerificationCode(true);

        return res;
      })
      .catch((e: any) => {
        setErrorMessage(e.message);
        setIsLoading(false);
      });
  });

  const getVerificationCode = React.useCallback(({ data }: RequestOptions) => {
    execute({ data });
  }, []);

  const getCode = async () => {
    setIsLoading(true);
    getVerificationCode({
      data: {
        email,
      },
    });
  };

  return (
    <Root>
      <View style={styles.container}>
        <View
          style={[
            styles.loginContainer,
            {
              backgroundColor: theme?.EndColor,
              borderColor: theme?.TextColor,
            },
          ]}
        >
          <Text
            style={[
              styles.login,
              {
                color: theme?.TextColor,
              },
            ]}
          >
            Reset Password
          </Text>
          <View>
            {hasRequestedCode ? (
              <ChangePassword
                token={token}
                setPasswordChanged={setPasswordChanged}
                setErrorMessage={setErrorMessage}
              />
            ) : (
              <React.Fragment>
                <Input
                  inputStyle={{ color: theme?.TextColor, textAlign: "center" }}
                  autoCompleteType={"email"}
                  onChangeText={setEmail}
                  value={email}
                  inputContainerStyle={[
                    styles.input,
                    {
                      borderColor: theme?.MiddleColor,
                    },
                  ]}
                  labelStyle={labelStyle}
                  autoCapitalize={"none"}
                  label="Email"
                />
                <Button
                  disabled={!validateEmail(email)}
                  loading={isLoading}
                  onPress={getCode}
                  style={{
                    backgroundColor: theme?.MiddleColor,
                    marginBottom: scale(10),
                  }}
                  title={"Reset Password"}
                />
              </React.Fragment>
            )}
            <TouchableOpacity
              onPress={() => navigation.navigate("Signup" as never)}
            >
              <Text style={passwordText}>Not a member yet?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login" as never)}
            >
              <Text style={passwordText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
        {sentVerificationCode &&
          Popup.show({
            type: "Success",
            title: "Verification code",
            button: true,
            textBody:
              message || "We've sent a verification code to your email.",
            buttonText: "Ok",
            callback: () => {
              Popup.hide();
              setIsLoading(false);
              setHasRequestedCode(true);
            },
          })}
        {passwordChanged &&
          Popup.show({
            type: "Success",
            title: "Password changed",
            button: true,
            textBody: "Successfully changed password.",
            buttonText: "Ok",
            callback: () => {
              Popup.hide();
              setIsLoading(false);
              setPasswordChanged(false);
              navigation.navigate("Login");
            },
          })}
      </View>
      {errorMessage
        ? Popup.show({
            type: "Danger",
            title: "Request Failed",
            button: true,
            textBody: errorMessage || "Failed to reset password.",
            buttonText: "Ok",
            callback: () => {
              Popup.hide();
              setErrorMessage("");
              setIsLoading(false);
            },
          })
        : null}
    </Root>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: scale(20),
  },
  loginContainer: {
    borderRadius: scale(10),
    padding: scale(15),
    borderWidth: 1,
  },
  login: {
    fontSize: verticalScale(20),
    fontFamily: Inter.Regular,
    textAlign: "center",
    marginBottom: scale(15),
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
});
