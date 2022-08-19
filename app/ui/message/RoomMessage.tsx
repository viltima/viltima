import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import useAppState from "hooks/useAppState";
import { Messages, StackParamList, User } from "types";
import { useNavigation } from "@react-navigation/native";
import { Colors, Tabs } from "common";
import { scale, verticalScale } from "react-native-size-matters";

import { Entypo } from "@expo/vector-icons";

type Params = {
  params: { to: string; isChannel: boolean };
};

type IProps = {
  route: Params;
};

export const RoomMessage: React.FC<IProps> = ({ route }) => {
  const navigation = useNavigation<StackParamList>();
  const [currentMessages, setMessages] = React.useState<Messages>({
    public: [],
  });
  const [selectedTab, setSelectedTab] = React.useState(0);
  const { user, socket, removeRoom } = useAppState();
  const [usersInRoom, setUsersInRoom] = React.useState<User[]>([]);
  const [roomOwner, setRoomOwner] = React.useState("");
  const [receiver, setReceiver] = React.useState(route.params.to);

  React.useEffect(() => {
    socket?.on("new_message_room", (msg) => {
      setMessages((previousMessages) => {
        return {
          ...previousMessages,
          [msg?.chatName]: GiftedChat.append(previousMessages[msg?.chatName], [
            msg?.content,
          ]),
        };
      });
    });
  }, [socket]);

  React.useEffect(() => {
    socket?.emit("join_room", { user, roomName: route.params.to });
    socket?.on("room", (room) => {
      setRoomOwner(room?.owner);
      setUsersInRoom(room?.users || []);
    });

    socket?.on("remove_me", ({ id, room }) => {
      if (id === user?.id) {
        socket?.emit("leave_room", { id, room });
        removeRoom(room);
        navigation.navigate("Home");
      }
    });
  }, []);

  const onSend = React.useCallback(
    (msg: IMessage[] = []) => {
      const { to, isChannel } = route?.params;

      setReceiver(to);

      socket?.emit("send_message", {
        content: {
          ...(msg[0] as object),
          user: {
            _id: user?.id,
            name: user?.username,
          },
        },
        to: to,
        sender: user?.username,
        isChannel: isChannel,
        chatName: to,
      });
      setMessages((previousMessages) => {
        return {
          ...previousMessages,
          [to]: GiftedChat.append(previousMessages[to], msg),
        };
      });
    },
    [route]
  );

  const changeTabs = (index: number) => {
    if (index === selectedTab) {
      return;
    }
    setSelectedTab(index);
  };

  const removeUser = (id: string, room: string) => {
    socket?.emit("remove_user_from_room", { id, room });
  };

  React.useEffect(() => {
    return () => {
      setMessages({});
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        selectedTab={selectedTab}
        changeTabs={changeTabs}
        tabs={["Chat", "Users"]}
      />
      {selectedTab === 0 ? (
        <GiftedChat
          renderUsernameOnMessage={true}
          bottomOffset={0}
          messages={currentMessages[receiver] || []}
          wrapInSafeArea={false}
          onSend={(msgs) => onSend(msgs)}
          user={{
            _id: 1,
          }}
        />
      ) : (
        <View>
          {usersInRoom.map((_user, idx: number) => (
            <View style={styles.container} key={idx}>
              <Text style={styles.username}>{_user.username}</Text>
              <TouchableOpacity
                onPress={() => removeUser(_user?.id as string, receiver)}
                disabled={_user?.username === roomOwner}
              >
                {_user?.username === roomOwner ? (
                  <Text>{"(admin)"}</Text>
                ) : user?.username === roomOwner ? (
                  <Entypo name="cross" size={24} color={Colors.Red} />
                ) : null}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
    paddingVertical: scale(5),
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontSize: verticalScale(16),
    color: Colors.White,
    flex: 1,
  },
});
