import { StyleSheet, View } from "react-native";
import React from "react";
import useAppState from "hooks/useAppState";
import { ChatRow } from "ui/home/components/ChatRow";
import { User } from "types";

export const Users = () => {
  const { users } = useAppState();
  return (
    <View>
      {users?.map((connectedUser: User, idx: number) => {
        return (
          connectedUser && (
            <ChatRow
              key={idx}
              receiver={connectedUser?.sid as string}
              user={connectedUser}
              isChannel={false}
            />
          )
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({});
