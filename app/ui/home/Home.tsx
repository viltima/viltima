import { View, StyleSheet, Text } from "react-native";

import React from "react";

import { verticalScale } from "react-native-size-matters";

import useAppState from "hooks/useAppState";

import { Inter } from "common";

export const Home = () => {
  const { theme, user } = useAppState();

  return (
    <View style={styles.main}>
      <View style={[styles.container, styles.user]}>
        <Text
          style={[
            styles.welcome,
            {
              color: theme?.TextColor,
            },
          ]}
        >{`Hello, ${user?.username}`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex: 1,
  },
  user: {
    justifyContent: "center",
    alignItems: "center",
  },
  welcome: {
    fontFamily: Inter.SemiBold,
    fontSize: verticalScale(30),
    textTransform: "capitalize",
  },
});
