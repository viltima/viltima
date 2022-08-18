import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import useAppState from 'hooks/useAppState';
import { ChatRow } from 'ui/home/components/ChatRow';
import { scale, verticalScale } from 'react-native-size-matters';
import {
  Button,
  Colors,
  Dialog,
  RadioButton,
  RadioGroup,
  TextField,
} from 'react-native-ui-lib';

const INPUT_SPACING = 10;

export const Rooms = () => {
  const [showDialog, setShowDialog] = React.useState(false);
  const [showJoinDialog, setShowJoinDialog] = React.useState(false);
  const [roomName, setRoomName] = React.useState('');
  const [joinRoom, setJoinRoom] = React.useState('');
  const [isPrivate, setIsPrivate] = React.useState(true);
  const { rooms, socket, user } = useAppState();

  const createRoom = () => {
    if (rooms?.includes(roomName)) {
      return;
    }
    socket?.emit('join_room', { user, roomName: roomName.trim() });
    setShowDialog(false);
    setRoomName('');
  };

  const join = () => {
    socket?.emit('join_room', { user, roomName: joinRoom.trim() });
    setShowJoinDialog(false);
    setJoinRoom('');
  };

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <FlatList
          keyExtractor={(_, index) => index.toString()}
          data={rooms}
          renderItem={({ item }) => (
            <ChatRow
              isChannel={true}
              receiver={item}
              user={{ username: item }}
            />
          )}
        />
      </View>
      <View>
        {/* Create Room */}
        <Dialog
          bottom={'bottom'}
          onDismiss={() => setShowDialog(false)}
          visible={showDialog}
          panDirection={'down'}
          containerStyle={[
            styles.dialog,
            {
              backgroundColor: Colors.white,
            },
          ]}
        >
          <TextField
            value={roomName}
            onChangeText={setRoomName}
            text70
            containerStyle={{ marginBottom: INPUT_SPACING }}
            placeholder='Room name'
            migrate
          />
          <Text>Private room</Text>
          <RadioGroup
            marginT-8
            initialValue={isPrivate}
            onValueChange={(answer: boolean) => setIsPrivate(answer)}
          >
            <RadioButton value={true} label={'Yes'} />
            <RadioButton marginT-5 value={false} label={'No'} />
          </RadioGroup>

          <Button
            disabled={!roomName}
            onPress={createRoom}
            marginT-10
            label={'Create'}
            size={Button.sizes.medium}
            backgroundColor={Colors.green10}
          />
        </Dialog>

        {/* Join room */}

        <Dialog
          bottom={'bottom'}
          onDismiss={() => setShowJoinDialog(false)}
          visible={showJoinDialog}
          panDirection={'down'}
          containerStyle={[
            styles.dialog,
            {
              backgroundColor: Colors.white,
            },
          ]}
        >
          <TextField
            value={joinRoom}
            onChangeText={setJoinRoom}
            text70
            containerStyle={{ marginBottom: INPUT_SPACING }}
            placeholder='Room name'
            migrate
          />

          <Button
            disabled={!joinRoom}
            onPress={join}
            marginT-10
            label={'Join'}
            size={Button.sizes.medium}
            backgroundColor={Colors.green10}
          />
        </Dialog>

        <View style={styles.rooms}>
          <TouchableOpacity onPress={() => setShowDialog(true)}>
            <Text style={styles.createRoom}>create room</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.join}
            onPress={() => setShowJoinDialog(true)}
          >
            <FontAwesome name='users' size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  createRoom: {
    fontSize: verticalScale(16),
    color: Colors.white,
    textTransform: 'uppercase',
    marginHorizontal: scale(20),
    paddingVertical: verticalScale(20),
  },
  dialog: {
    padding: scale(20),
    marginBottom: verticalScale(40),
    borderRadius: scale(20),
  },
  rooms: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  join: {
    marginHorizontal: scale(20),
  },
});
