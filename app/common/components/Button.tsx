import PropTypes from 'prop-types';

import { StyleSheet, ViewStyle } from 'react-native';

import React from 'react';

import { Button as Btn } from 'react-native-elements';

import { Colors } from 'common/colors';

import { scale, verticalScale } from 'react-native-size-matters';

import { Inter } from 'common/fonts';

type IProps = {
  onPress: () => void,
  title: string,
  style: ViewStyle,
  [x: string]: any,
};

export const Button: React.FC<IProps> = ({
  onPress,
  style,
  title,
  ...props
}) => {
  return (
    <Btn
      onPress={onPress}
      titleStyle={styles.titleStyle}
      buttonStyle={[styles.button, style]}
      title={title}
      {...props}
    />
  );
};

Button.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.Olive,
    paddingVertical: verticalScale(16),
    borderRadius: scale(15)
  },
  titleStyle: {
    fontSize: verticalScale(16),
    fontFamily: Inter.Bold,
    lineHeight: verticalScale(24)
  }
});
