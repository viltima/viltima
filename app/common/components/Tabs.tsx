import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Colors } from 'common/colors';
import { Inter } from 'common/fonts';
import { scale, verticalScale } from 'react-native-size-matters';

// object types, cuz ... why not?
type IProps = {
  selectedTab: number;
  changeTabs: Function;
  style?: object;
  tabs: string[];
};

export const Tabs: React.FC<IProps> = ({
  selectedTab,
  changeTabs,
  style,
  tabs = [],
}) => {
  return (
    <View style={[styles.loginTabs, style]}>
      {tabs.map((tab, index) => (
        <View
          key={index}
          style={[
            styles.tabContainer,
            selectedTab === index && styles.activeTab,
          ]}
        >
          <TouchableOpacity onPress={() => changeTabs(index)}>
            <Text
              style={[
                styles.tabText,
                selectedTab === index && styles.textTabActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  loginTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.Olive,
    paddingTop: scale(20),
  },
  container: {
    paddingHorizontal: 30,
    backgroundColor: Colors.White,
  },
  tabText: {
    textAlign: 'center',
    textTransform: 'capitalize',
    fontSize: verticalScale(14),
    color: Colors.LightGray,
    fontFamily: Inter.Regular,
  },
  tabContainer: {
    flex: 1,
    borderBottomColor: Colors.LightGray,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  textTabActive: {
    color: Colors.White,
  },
  activeTab: {
    borderBottomColor: Colors.White,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
