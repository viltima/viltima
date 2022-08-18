import { View, Text } from 'react-native';
import React from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import useAppState from 'hooks/useAppState';
import { Messages } from 'types';

type Params ={
  params: {to: string, isChannel: boolean }
}

type IProps = {
  route: Params
};



export const Message: React.FC<IProps> = ({ route }) => {
  const [currentMessages, setMessages] = React.useState<Messages>({});
  const { user, socket, socketId, } = useAppState();
  const [receiver, setReceiver] = React.useState(route?.params?.to);
  const [channel, setChannel] = React.useState(route?.params?.isChannel)

  React.useEffect(() => {

    socket?.on('new_message', (msg) => {
      setMessages((previousMessages) => {
       const chatId = channel ? msg?.chatName : 'sid'

        return {
          ...previousMessages,
          [msg[chatId]]: GiftedChat.append(
            previousMessages?.[msg[chatId]] || [],
            [msg?.content]
          ),
        };
      });
    });
  }, [socket]);




  const onSend = React.useCallback(
    (msg: IMessage[] = []) => {
      const { to, isChannel } = route?.params;

      setReceiver(to);
      setChannel(isChannel)
      socket?.emit('send_message', {
        content: {
          ...(msg[0] as object),
          user: {
            _id: user?.id,
            name: user?.username,
          },
        },
        to: to,
        sid: socketId,
        sender: user?.username,
        isChannel: isChannel,
        chatName: to,
      });
      setMessages((previousMessages) => {
        return {
          ...previousMessages,
          [to]: GiftedChat.append(previousMessages?.[to] || [], msg),
        };
      });
    },
    [route]
  );


  React.useEffect(() => {
    return () => {
      setMessages({});
    };
  }, []);



  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        renderUsernameOnMessage={true}
        bottomOffset={0}
        messages={currentMessages?.[receiver] || []}
        wrapInSafeArea={false}
        onSend={(msgs) => onSend(msgs)}
        user={{
          _id: user?.id as string,
          name: user?.username,
        }}
      />
    </View>
  );
};
