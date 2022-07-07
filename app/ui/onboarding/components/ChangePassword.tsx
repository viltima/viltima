import { StyleSheet, TextStyle, View } from "react-native";

import React from "react";

import { Input } from "react-native-elements";

import { scale, verticalScale } from "react-native-size-matters";

import useAppState from "hooks/useAppState";

import { Api, Button } from "common";

import { RequestOptions } from "types";

import { useAsync } from "hooks";

type IProps = {
  setErrorMessage: Function;
  setPasswordChanged: Function;
  token: string;
};

export const ChangePassword: React.FC<IProps> = ({
  setErrorMessage,
  setPasswordChanged,
  token,
}) => {
  const { theme, user } = useAppState();
  const [verificationCode, setVerificationCode] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [confirmPass, setConfirmPass] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const labelStyle: TextStyle = {
    color: theme?.TextColor,
    fontSize: verticalScale(11),
    lineHeight: verticalScale(13),
    textTransform: "uppercase",
    marginBottom: 6,
  };

  const { execute } = useAsync(async ({ data }: RequestOptions) => {
    try {
      const res = await Api.post("/change-password", {
        data: {
          code: Number(data?.code || "0"),
          password: data?.password,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || user?.token}`,
        },
      });
      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.message);
      }

      setIsLoading(false);
      setPasswordChanged(true);

      return response;
    } catch (error: any) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  });

  const getVerificationCode = React.useCallback(({ data }: RequestOptions) => {
    execute({ data });
  }, []);

  const changePass = async () => {
    setIsLoading(true);
    getVerificationCode({
      data: {
        code: verificationCode,
        password,
      },
    });
  };

  return (
    <View>
      <Input
        autoCompleteType={"off"}
        inputStyle={{ color: theme?.TextColor, textAlign: "center" }}
        onChangeText={setVerificationCode}
        value={verificationCode}
        inputContainerStyle={[
          styles.input,
          {
            borderColor: theme?.MiddleColor,
          },
        ]}
        labelStyle={labelStyle}
        autoCapitalize={"none"}
        label="Verification Code"
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
        inputStyle={{ color: theme?.TextColor, textAlign: "center" }}
        autoCompleteType={"off"}
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
        disabled={!verificationCode || password !== confirmPass}
        loading={isLoading}
        onPress={changePass}
        style={{
          backgroundColor: theme?.MiddleColor,
          marginBottom: scale(10),
        }}
        title={"Verify Account"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
});
