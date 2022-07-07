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

import { Input } from "react-native-elements";

import { Api, Button, Inter } from "common";

import { validateEmail } from "lib";

import { VerifyCode } from "./components/VerifyCode";

import { useAsync } from "hooks";

import { RequestOptions, StackParamList } from "types";

// @ts-ignore
import { Root, Popup } from "popup-ui";

import { RouteProp, useNavigation } from "@react-navigation/native";

type ScreenRouteProp<T extends keyof StackParamList> = RouteProp<
  StackParamList,
  T
>;
type Props<T extends keyof StackParamList> = {
  route: ScreenRouteProp<T>;
};

export const VerifyAccount: React.FC<Props<"VerifyAccount">> = ({ route }) => {
  const { theme, onboardUser } = useAppState();
  const [email, setEmail] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [hasVerificationCode, setHasVerificationCode] =
    React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [accountVerified, setAccountVerified] = React.useState<boolean>(false);
  const { hasCode } = route.params;
  const navigation = useNavigation<StackParamList>();

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

  const { execute } = useAsync(async ({ data }: RequestOptions) => {
    try {
      const res = await Api.post("/code", {
        data: {
          email: data?.email,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();
      if (!res.ok) {
        throw new Error(response.message);
      }

      setIsLoading(false);
      onboardUser(response?.result);
      setHasVerificationCode(true);

      return response;
    } catch (error: any) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
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

  React.useEffect(() => {
    setHasVerificationCode(hasCode);
  }, [hasCode]);

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
            Account Verification
          </Text>
          <View>
            {hasVerificationCode ? (
              <VerifyCode
                setAccountVerified={setAccountVerified}
                setErrorMessage={setErrorMessage}
              />
            ) : (
              <React.Fragment>
                <Input
                  autoCompleteType={"email"}
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

                <Button
                  disabled={!validateEmail(email)}
                  loading={isLoading}
                  onPress={getCode}
                  style={{
                    backgroundColor: theme?.MiddleColor,
                    marginBottom: scale(10),
                  }}
                  title={"Get Code"}
                />
              </React.Fragment>
            )}

            <TouchableOpacity
              onPress={() => setHasVerificationCode(!hasVerificationCode)}
            >
              <Text style={passwordText}>
                {hasVerificationCode
                  ? "Don't have the verification code?"
                  : "Have the verification code?"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {accountVerified &&
          Popup.show({
            type: "Success",
            title: "Account verified.",
            button: true,
            textBody: "Successfully verified account.",
            buttonText: "Ok",
            callback: () => {
              Popup.hide();
              setIsLoading(false);
              setAccountVerified(false);
              navigation.navigate("Login");
            },
          })}
      </View>
      {errorMessage
        ? Popup.show({
            type: "Danger",
            title: "Request Failed.",
            button: true,
            textBody: errorMessage || "Failed to verify your email.",
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
