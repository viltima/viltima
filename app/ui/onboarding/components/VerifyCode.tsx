import { View, TextStyle, StyleSheet } from "react-native";

import React from "react";

import { Input } from "react-native-elements";

import { scale, verticalScale } from "react-native-size-matters";

import useAppState from "hooks/useAppState";

import { Api, Button } from "common";

import { useAsync } from "hooks";

import { RequestOptions } from "types";

type IProps = {
  setErrorMessage: Function;
  setAccountVerified: Function;
};

export const VerifyCode: React.FC<IProps> = ({
  setErrorMessage,
  setAccountVerified,
}) => {
  const { theme, user } = useAppState();
  const [verificationCode, setVerificationCode] = React.useState<string>("");
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
      const res = await Api.post("/verify", {
        data: {
          code: Number(data?.code || "0"),
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const response = await res.json();
      if (!res.ok) {
        throw new Error(response.message);
      }

      setIsLoading(false);
      setAccountVerified(true);

      return response;
    } catch (error: any) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  });

  const getVerificationCode = React.useCallback(({ data }: RequestOptions) => {
    execute({ data });
  }, []);

  const verifyAccount = async () => {
    setIsLoading(true);
    getVerificationCode({
      data: {
        code: verificationCode,
      },
    });
  };

  return (
    <View>
      <Input
        autoCompleteType={"email"}
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

      <Button
        disabled={!verificationCode}
        loading={isLoading}
        onPress={verifyAccount}
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
