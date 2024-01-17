import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import colors from './src/constant/colors';
import Navigation from './src/screens/Navigation';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <View style={{flex: 1, backgroundColor: colors.bg}}>
      <StatusBar backgroundColor={colors.base} />
      <Navigation />
      <Toast />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({});
