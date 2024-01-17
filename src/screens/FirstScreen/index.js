import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import RobotoText from '../../components/RobotoText';
import colors from '../../constant/colors';

const FirstScreen = ({savingNameHandler}) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const nameSavingHandler = () => {
    if (inputValue) {
      savingNameHandler(inputValue);
    } else {
      setError('Please enter your name.');
    }
  };

  return (
    <View style={{flex: 1, padding: 20}}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <RobotoText size={40} type="bold" style={{textAlign: 'center'}}>
          We can calculate your expense.
        </RobotoText>
      </View>
      <View style={{flex: 1}}>
        <TextInput
          value={inputValue}
          placeholder="Enter your name"
          placeholderTextColor={colors.gray}
          onChangeText={e => {
            setError('');
            setInputValue(e);
          }}
          style={{
            borderWidth: 1,
            borderColor: colors.gray,
            borderRadius: 10,
            paddingHorizontal: 10,
          }}
        />
        {error ? (
          <RobotoText
            size={14}
            color={colors.red}
            type="medium"
            style={{marginTop: 5, marginLeft: 5}}>
            {error}
          </RobotoText>
        ) : (
          <></>
        )}
        <TouchableOpacity
          onPress={nameSavingHandler}
          style={{
            backgroundColor: colors.base,
            alignItems: 'center',
            marginVertical: 20,
            padding: 15,
            borderRadius: 100,
          }}>
          <RobotoText size={20} type="bold">
            Get Started !
          </RobotoText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FirstScreen;

const styles = StyleSheet.create({});
