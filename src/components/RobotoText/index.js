import React from 'react';
import {Text, Platform} from 'react-native';

export default function RobotoText({
  color = '#fff',
  size = 16,
  type = 'regular',
  children,
  style = {},
  numOfLines,
  letterSpacing = 1.5,
}) {
  return (
    <Text
      numberOfLines={numOfLines}
      style={[
        {
          fontFamily:
            type === 'bold'
              ? 'Roboto-Bold'
              : type === 'medium'
              ? 'Roboto-Medium'
              : 'Roboto-Regular',
          fontSize: Platform.OS == 'ios' ? size + 2 : size,
          color: color,
          lineHeight: size + 2,
          letterSpacing: letterSpacing,
        },
        style,
      ]}>
      {children}
    </Text>
  );
}
