import React from 'react';
import { View, Text } from 'react-native';

export default function Row({children,style={}}) {
  return (
    <View style={[{flexDirection: "row",alignItems: 'center',justifyContent: 'space-between'},style]}>
        {children}
     </View>
  );
}
