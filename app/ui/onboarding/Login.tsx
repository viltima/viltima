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

// @ts-ignore
import { Root, Popup } from "popup-ui";

import { validateEmail } from "lib";

import { useAsync } from "hooks";

import { RequestOptions, StackParamList } from "types";

export const Login = () => {
  const navigation = useNavigation<StackParamList>();
  const { theme, updateLogin } = useAppState();
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [loginError, setLoginError] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [userVerified, setUserVerified] = React.useState<boolean>(true);

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
    return Api.post("/login", {
      data: {
        email: data?.email,
        username: data?.username,
        password: data?.password,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res: any) => {
        if (!res.ok) {
          const response = await res.json();

          if (response?.message?.toLowerCase().includes("not verified")) {
            setUserVerified(false);
          }

          throw new Error(response.message);
        }

        return res.json();
      })
      .then((res: any) => {
        setIsLoading(false);
        updateLogin(res?.result);

        return res;
      })
      .catch((e: any) => {
        setErrorMessage(e.message);
        setIsLoading(false);
        setLoginError(true);
      });
  });

  const userLogin = React.useCallback(({ data }: RequestOptions) => {
    execute({ data });
  }, []);

  const login = async () => {
    setIsLoading(true);
    const usernameOrEmail = validateEmail(email) ? "email" : "username";
    userLogin({
      data: {
        [usernameOrEmail]: email,
        password,
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
            Login
          </Text>
          <View>
            <Input
              inputStyle={{ color: theme?.TextColor }}
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
              label="Email / Username"
            />

            <Input
              inputStyle={{ color: theme?.TextColor }}
              autoCompleteType={"off"}
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

            <Button
              disabled={!email || !password}
              loading={isLoading}
              onPress={login}
              style={{
                backgroundColor: theme?.MiddleColor,
                marginBottom: scale(10),
              }}
              title={"Login"}
            />

            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={passwordText}>Not a member yet?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={passwordText}>Forgot password</Text>
            </TouchableOpacity>
          </View>
        </View>
        {loginError &&
          Popup.show({
            type: "Danger",
            title: "Failed",
            button: true,
            textBody: errorMessage || "Failed to login",
            buttonText: "Ok",
            callback: () => {
              Popup.hide();
              setLoginError(false);
              setIsLoading(false);
            },
          })}

        {!userVerified && (
          <View style={styles.verifyContainer}>
            <Text
              style={[
                styles.verify,
                {
                  color: theme?.TextColor,
                },
              ]}
            >
              Your email has not yet been verified
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("VerifyAccount", {
                  hasCode: true,
                })
              }
            >
              <Text
                style={[
                  styles.verify,
                  {
                    color: theme?.TextColor,
                    fontFamily: Inter.SemiBold,
                    marginLeft: scale(1),
                  },
                ]}
              >
                Verify your email
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
  verifyContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: scale(10),
  },
  verify: {
    fontFamily: Inter.Regular,
    fontSize: scale(12),
  },
});
