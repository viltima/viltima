import { Alert, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import React from 'react';

import { scale, verticalScale } from 'react-native-size-matters';

import { useNavigation } from '@react-navigation/core';
import { Colors, Inter } from 'common';
import { User, StackParamList } from 'types';

import { AntDesign } from '@expo/vector-icons';

// object types, cuz ... why not?
type IProps = {
  user: User;
  isChannel: boolean;
  receiver: string;
};

export const ChatRow: React.FC<IProps> = ({ user, isChannel, receiver }) => {
  const navigation = useNavigation<StackParamList>();

  const onShare = async (channel: string) => {
    try {
      const result = await Share.share({
        message: `Please join my channel using this channel name: ${channel}`,
      });
      if (result.action === Share.sharedAction) {
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  return (
    <View
      style={{ flexDirection: 'row', paddingRight: 20, alignItems: 'center' }}
    >
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() =>
          navigation.navigate(isChannel ? 'RoomMessage' : 'Message', {
            title: user?.username,
            isChannel: isChannel,
            to: receiver,
          })
        }
      >
        <View style={styles.container}>
          <View style={styles.message}>
            <Text style={styles.text}>{user?.username}</Text>
            {/* <Text style={styles.lastMessage}>{lastMessage || 'Say Hi!'}</Text> */}
          </View>
        </View>
        <View style={styles.divider} />
      </TouchableOpacity>
      {isChannel && <TouchableOpacity onPress={() => onShare(receiver)}>
        <AntDesign name='sharealt' size={24} color='black' />
      </TouchableOpacity>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomColor: Colors.LightGray,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  text: {
    color: Colors.Black,
    fontFamily: Inter.Black,
    fontSize: verticalScale(14),
    lineHeight: verticalScale(21),
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E6EA',
    marginHorizontal: 20,
  },
  message: {
    marginLeft: scale(16),
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lastMessage: {
    color: Colors.Black,
    fontSize: 12,
    marginTop: 2,
  },
});
