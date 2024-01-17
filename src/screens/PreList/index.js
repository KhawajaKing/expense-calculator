import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Row from '../../components/Row';
import Entypo from 'react-native-vector-icons/Entypo';
import RobotoText from '../../components/RobotoText';
import colors from '../../constant/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
const PreList = ({onSelectback, onSelectCategroy, newListHanldler}) => {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItemForDelete, setSelectedItemForDelete] = useState([]);
  const [modalVisibleGroup, setModalVisibleGroup] = useState(false);

  useEffect(() => {
    takeData();
  }, []);

  const takeData = async () => {
    try {
      const value = await AsyncStorage.getItem('listData');
      if (value !== null) {
        setData(JSON.parse(value));
      } else {
        setData(null);
      }
    } catch (error) {
      console.error('Error taking listData:', error);
    }
  };

  const filterObjectsByType = targetType => {
    return data?.filter(item => item.type === targetType);
  };

  const handleLongPress = async () => {
    console.log(selectedItemForDelete, '-------itemData---------');
    try {
      const updatedData = data.filter(
        item => item.category !== selectedItemForDelete.category,
      );

      await AsyncStorage.setItem('listData', JSON.stringify(updatedData));
      takeData();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };
  return (
    <View style={{flex: 1}}>
      <Row style={{padding: 20, backgroundColor: colors.baseLight}}>
        <TouchableOpacity onPress={onSelectback} style={{flex: 1}}>
          <Entypo name="chevron-left" color={colors.white} size={25} />
        </TouchableOpacity>
        <View style={{flex: 3, alignItems: 'center'}}>
          <RobotoText size={20} type="bold">
            List of Expense
          </RobotoText>
        </View>
        <View style={{flex: 1}} />
      </Row>
      <View style={{flex: 1}}>
        {data?.length >= 1 ? (
          // <View
          //   style={{
          //     paddingHorizontal: 30,
          //     paddingVertical: 10,
          //     alignItems: 'center',
          //     marginHorizontal: 20,
          //     marginVertical: 10,
          //     borderRadius: 100,
          //   }}>
          //   <RobotoText size={24} type="bold" color={colors.white}>
          //     List
          //   </RobotoText>
          // </View>
          <FlatList
            data={data}
            numColumns={2}
            renderItem={({item, index}) => {
              return (
                <>
                  <Pressable
                    onLongPress={() => {
                      setSelectedItemForDelete(item);
                      setModalVisible(true);
                      console.log(item, 'item-------');
                    }}
                    onPress={() => onSelectCategroy(item)}
                    style={{
                      width: '50%',
                      alignItems: 'center',
                      borderWidth: 1,
                      paddingVertical: 20,
                      borderColor: colors.bg2,
                    }}>
                    <View
                      style={{
                        backgroundColor: colors.base,
                        borderRadius: 100,
                        height: 60,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 60,
                        marginBottom: 10,
                      }}>
                      <RobotoText size={30} type="bold">
                        {item?.category.charAt(0).toUpperCase()}
                      </RobotoText>
                    </View>

                    <RobotoText size={18} type="medium">
                      {item?.category}
                    </RobotoText>
                  </Pressable>
                  <Modal
                    animationType="none"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                      setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                      <View style={styles.modalView}>
                        <View
                          style={{
                            borderRadius: 100,
                            backgroundColor: colors.white,
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 7,
                            borderWidth: 2,
                            borderColor: colors.red,
                            marginBottom: 20,
                          }}>
                          <Entypo name="cross" color={colors.red} size={35} />
                        </View>
                        <RobotoText color={colors.gray} size={20} type="medium">
                          Are you sure?
                        </RobotoText>
                        <RobotoText
                          color={colors.gray}
                          size={14}
                          letterSpacing={1}
                          style={{textAlign: 'center', marginTop: 15}}>
                          Do you want to delete this category? This process
                          cannot be undone.
                        </RobotoText>
                        <Row style={{marginTop: 30}}>
                          <TouchableOpacity
                            style={{
                              backgroundColor: colors.gray,
                              width: '40%',
                              marginRight: 10,
                              alignItems: 'center',
                              padding: 10,
                              borderRadius: 10,
                              elevation: 2,
                            }}
                            onPress={() => setModalVisible(false)}>
                            <RobotoText>Cancel</RobotoText>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={{
                              backgroundColor: colors.red,
                              width: '40%',
                              marginRight: 10,
                              alignItems: 'center',
                              padding: 10,
                              borderRadius: 10,
                              elevation: 2,
                            }}
                            onPress={() => {
                              handleLongPress();
                              setModalVisible(false);
                            }}>
                            <RobotoText>Delete</RobotoText>
                          </TouchableOpacity>
                        </Row>
                      </View>
                    </View>
                  </Modal>
                </>
              );
            }}
          />
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <RobotoText type="bold" color={colors.gray}>
              Get start making lists
            </RobotoText>
            <TouchableOpacity
              onPress={newListHanldler}
              style={{
                backgroundColor: colors.base,
                padding: 10,
                borderRadius: 10,
                marginTop: 20,
              }}>
              <RobotoText>New List</RobotoText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default PreList;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,.7)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
