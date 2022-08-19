import { View, StyleSheet, Text, ScrollView } from "react-native";

import React from "react";

import { scale, verticalScale } from "react-native-size-matters";

import useAppState from "hooks/useAppState";

import { Colors, Inter } from "common";

import { ChatRow } from "ui/home/components/ChatRow";

import { User } from "types";

export const Home = () => {
  const { user, socket, users, rooms } = useAppState();

  React.useEffect(() => {
    if (!socket) return;

    socket.on("connect_error", (err: any) => {
      console.log(`connect_error due to ${err.message}`);
    });

    socket.emit("join_server", user);
    // socket.emit('join_room', {user, roomName: 'public'})
  }, []);

  const currentUsers = users?.filter((_user) => _user.id !== user?.id);

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        {rooms?.length ? <Text style={styles.header}>Rooms</Text> : null}
        {rooms?.map((room: string, idx: number) => {
          return (
            room && (
              <ChatRow
                isChannel={true}
                receiver={room}
                key={idx}
                user={{ username: room }}
              />
            )
          );
        })}
        {currentUsers?.length ? (
          <Text style={styles.header}>Users online</Text>
        ) : null}
        {currentUsers?.map((connectedUser: User, idx: number) => {
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "80%",
    padding: scale(20),
    borderWidth: 1,
    borderColor: Colors.Gray,
    borderRadius: scale(20),
  },
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  header: {
    fontSize: scale(18),
    color: Colors.White,
    marginTop: verticalScale(20),
    marginLeft: scale(16),
  },
});
