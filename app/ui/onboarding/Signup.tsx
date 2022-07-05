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

export const Signup = () => {
  const navigation = useNavigation<StackParamList>();
  const { theme, onboardUser } = useAppState();
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [username, setUsername] = React.useState<string>("");
  const [registerError, setRegisterError] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [confirmPass, setConfirmPass] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
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
    textDecorationLine: "underline",
    fontFamily: Inter.Regular,
    marginBottom: verticalScale(10),
  };

  const { execute } = useAsync(({ data }: RequestOptions) => {
    return Api.post("/signup", {
      data: {
        email: data?.email,
        username: data?.username,
        password: data?.password,
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
        setMessage(res?.result?.message);
        setSentVerificationCode(true);

        return res;
      })
      .catch((e) => {
        setErrorMessage(e.message);
        setIsLoading(false);
        setRegisterError(true);
      });
  });

  const userRegister = React.useCallback(({ data }: RequestOptions) => {
    execute({ data });
  }, []);

  const register = async () => {
    setIsLoading(true);
    userRegister({
      data: {
        email,
        password,
        username,
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
            Signup
          </Text>
          <View>
            <Input
              autoCompleteType={"email"}
              placeholder={"your@email.com"}
              placeholderTextColor={"grey"}
              inputStyle={{ color: theme?.TextColor, textAlign: "center" }} 
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

            <Input
              autoCompleteType={"off"}
              inputStyle={{ color: theme?.TextColor, textAlign: "center" }}
              onChangeText={setUsername}
              value={username}
              inputContainerStyle={[
                styles.input,
                {
                  borderColor: theme?.MiddleColor,
                },
              ]}
              labelStyle={labelStyle}
              autoCapitalize={"none"}
              label="Username"
            />

            <Input
              autoCompleteType={"off"}
              inputStyle={{ color: theme?.TextColor, textAlign: "center" }}
              inputContainerStyle={[
                styles.input,
                {
                  borderColor: theme?.MiddleColor,
                },
              ]}
              labelStyle={labelStyle}
              value={password}
              secureTextEntry
              onChangeText={setPassword}
              label="Password"
            />

            <Input
              autoCompleteType={"off"}
              inputStyle={{ color: theme?.TextColor, textAlign: "center" }}
              inputContainerStyle={[
                styles.input,
                {
                  borderColor: theme?.MiddleColor,
                },
              ]}
              labelStyle={labelStyle}
              value={confirmPass}
              secureTextEntry
              onChangeText={setConfirmPass}
              label="Confirm Password"
            />

            <Button
              disabled={
                !validateEmail(email) || !username || password !== confirmPass
              }
              loading={isLoading}
              onPress={register}
              style={{
                backgroundColor: theme?.MiddleColor,
                marginBottom: scale(10),
              }}
              title={"Register"}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate("Login" as never)}
            >
              <Text style={passwordText}>Already have an account?</Text>
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
              navigation.navigate("VerifyAccount", {
                hasCode: true,
              });
            },
          })}
        {registerError &&
          Popup.show({
            type: "Danger",
            title: "Registration Failed",
            button: true,
            textBody: errorMessage || "Failed to login",
            buttonText: "Ok",
            callback: () => {
              Popup.hide();
              setRegisterError(false);
              setIsLoading(false);
            },
          })}
      </View>
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
