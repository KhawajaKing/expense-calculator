import {
  ActivityIndicator,
  Alert,
  BackHandler,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../constant/colors';
import FirstScreen from '../FirstScreen';
import Home from '../Home';
import List from '../List';
import PreList from '../PreList';
import NetInfo from '@react-native-community/netinfo';

const Navigation = () => {
  const [activeScreen, setActiveScreen] = useState('loading');
  const [user, setUser] = useState('');
  const [selectedListData, setSelectedListData] = useState([]);
  const [isConnected, setConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  console.log(isConnected, '-------isConnected-------');

  useEffect(() => {
    const backAction = () => {
      if (activeScreen === 'list') {
        setActiveScreen('preList');
      } else if (activeScreen === 'preList') {
        setActiveScreen('home');
      } else if (activeScreen === 'home') {
        Alert.alert('Hold on!', 'Are you sure you want to go back?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'YES',
            onPress: () => BackHandler.exitApp(),
          },
        ]);
      } else {
        setActiveScreen(null);
      }
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [activeScreen]);

  useEffect(() => {
    initialFunctions();
  }, []);

  const initialFunctions = async () => {
    takeUser();
  };

  const takeUser = async () => {
    try {
      const value = await AsyncStorage.getItem('user');
      if (value !== null) {
        setUser(value);
        setActiveScreen('home');
      } else {
        setUser(null);
        setActiveScreen('firstScreen');
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  const savingNameHandler = async inputValue => {
    try {
      await AsyncStorage.setItem('user', inputValue);
      takeUser();
    } catch (error) {
      console.log('Error while saving name', error);
    }
  };

  const onSelectList = data => {
    setActiveScreen('preList');
  };

  const onSelectback = () => {
    if (activeScreen == 'preList') {
      setActiveScreen('home');
    } else if (activeScreen == 'list') {
      setActiveScreen('preList');
    }
  };

  const onSelectCategroy = data => {
    setSelectedListData(data);
    setActiveScreen('list');
  };

  if (activeScreen == 'loading') {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator color={colors.base} size={'large'} />
      </View>
    );
  }
  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor={colors.base} />
      {activeScreen == 'firstScreen' ? (
        <FirstScreen savingNameHandler={savingNameHandler} />
      ) : activeScreen == 'home' ? (
        <Home
          user={user}
          onSelectList={onSelectList}
          isConnected={isConnected}
        />
      ) : activeScreen == 'preList' ? (
        <PreList
          onSelectback={onSelectback}
          onSelectCategroy={onSelectCategroy}
        />
      ) : activeScreen == 'list' ? (
        <List onSelectback={onSelectback} data={selectedListData} />
      ) : (
        <></>
      )}
    </View>
  );
};

export default Navigation;

const styles = StyleSheet.create({});
