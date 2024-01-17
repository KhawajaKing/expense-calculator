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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Row from '../../components/Row';
import colors from '../../constant/colors';
import Entypo from 'react-native-vector-icons/Entypo';
import RobotoText from '../../components/RobotoText';

const List = ({data, onSelectback}) => {
  const [existingData, setExistingData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleForShare, setModalVisibleForShare] = useState(false);
  const [key, setKey] = useState(false);
  const [randomCode, setRandomCode] = useState('');

  useEffect(() => {
    takeData();
    generateRandomDigits();
  }, [modalVisibleForShare]);

  const takeData = async () => {
    try {
      const value = await AsyncStorage.getItem('listData');
      if (value !== null) {
        setExistingData(JSON.parse(value));
      } else {
        setExistingData(null);
      }
    } catch (error) {
      console.error('Error taking listData:', error);
    }
  };

  const convertTimestampToTime = timestamp => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';

    // Convert hours to 12-hour format
    hours = hours % 12 || 12;

    // Add leading zero to minutes if needed
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${minutes} ${ampm}`;
  };

  const formatDate = timestamp => {
    const date = new Date(timestamp);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day} / ${month} / ${year}`;
  };

  const calculateTotalPrice = () => {
    if (Array.isArray(data.data) && data.data.length > 0) {
      // Use reduce to sum up the prices
      const totalPrice = data.data.reduce((accumulator, currentItem) => {
        const price = parseFloat(currentItem.price) || 0; // Convert price to a number, default to 0 if not a valid number
        return accumulator + price;
      }, 0);

      return totalPrice;
    }

    return 0; // Return 0 if the array is empty
  };

  const renderHeader = () => (
    <Row
      style={{
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
      }}>
      <RobotoText type="bold" style={styles.numberSection}>
        No.
      </RobotoText>
      <RobotoText type="bold" style={styles.itemSection}>
        ITEMS
      </RobotoText>
      <RobotoText type="bold" style={styles.rsSection}>
        Rs.
      </RobotoText>
    </Row>
  );
  const renderfooter = () => (
    <Row style={{}}>
      <RobotoText type="bold" style={styles.numberSection}>
        {data.data ? data.data.length : 0}.
      </RobotoText>
      <RobotoText type="bold" style={styles.itemSection}>
        Total Expense
      </RobotoText>
      <RobotoText type="bold" style={styles.rsSection}>
        {calculateTotalPrice()}
      </RobotoText>
    </Row>
  );

  const handleLongPress = async index => {
    try {
      const updatedData = [...existingData];

      // Find the index of the item to be deleted
      const itemIndexToDelete = updatedData.findIndex(
        item => item.category === data.category,
      );

      if (itemIndexToDelete >= 0) {
        // Check if the index is within bounds
        if (index >= 0 && index < updatedData[itemIndexToDelete].data.length) {
          // Remove the item at the specified index
          updatedData[itemIndexToDelete].data.splice(index, 1);

          // Update AsyncStorage with the modified data
          await AsyncStorage.setItem('listData', JSON.stringify(updatedData));

          // Update state with the modified data
          setExistingData(updatedData);
          onSelectback();
        } else {
          console.warn('Index out of bounds:', index);
        }
      } else {
        console.warn('Category not found:', data.category);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };
  const generateRandomDigits = () => {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    setRandomCode(randomDigits);
  };

  return (
    <View style={{flex: 1}}>
      <Row style={{padding: 20, backgroundColor: colors.baseLight}}>
        <TouchableOpacity onPress={onSelectback} style={{flex: 1}}>
          <Entypo name="chevron-left" color={colors.white} size={25} />
        </TouchableOpacity>
        <View style={{flex: 3, alignItems: 'center'}}>
          <RobotoText size={20} type="bold">
            {data.category}
          </RobotoText>
        </View>
        <View style={{flex: 1}}>
          {data.type == 'group' ? (
            <TouchableOpacity
              onPress={() => setModalVisibleForShare(true)}
              style={{flex: 1, alignItems: 'flex-end'}}>
              <Entypo name="share" color={colors.white} size={25} />
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>
      </Row>
      <View style={{flex: 1, borderWidth: 2, borderColor: colors.gray}}>
        <FlatList
          data={data.data}
          style={{flex: 1}}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                onLongPress={() => {
                  setKey(index);
                  setModalVisible(true);
                }}>
                <Row
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: colors.gray,
                  }}>
                  <RobotoText type="bold" style={styles.numberSection}>
                    {index + 1}.
                  </RobotoText>
                  <View style={[styles.itemSection, {flexDirection: 'row'}]}>
                    <RobotoText
                      type="bold"
                      style={[{textAlign: 'left', flex: 1}]}>
                      {item?.reason}
                    </RobotoText>
                    <View style={{alignItems: 'center'}}>
                      <RobotoText size={7} type="medium">
                        {formatDate(item?.timestamp)}
                      </RobotoText>
                      <RobotoText size={7} type="medium">
                        {convertTimestampToTime(item?.timestamp)}
                      </RobotoText>
                    </View>
                  </View>
                  <RobotoText type="bold" style={styles.rsSection}>
                    {item?.price}
                  </RobotoText>
                </Row>
              </TouchableOpacity>
            );
          }}
          ListHeaderComponent={renderHeader}
        />
        <View style={{borderTopWidth: 1, borderTopColor: colors.gray}}>
          {renderfooter()}
        </View>
      </View>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisibleForShare}
        onRequestClose={() => {
          setModalVisibleForShare(!modalVisibleForShare);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <RobotoText
              color={colors.base}
              type="bold"
              size={30}
              style={{marginVertical: 5}}>
              Share
            </RobotoText>
            <RobotoText
              color={colors.gray}
              type="medium"
              size={12}
              style={{marginBottom: 25}}>
              This 6-digit code is used to share your group
            </RobotoText>
            <RobotoText
              color={colors.black}
              type="bold"
              letterSpacing={20}
              size={25}>
              {randomCode}
            </RobotoText>

            <View
              style={{
                borderBottomWidth: 1,
                borderBlockColor: colors.lightGray,
                width: '100%',
                marginTop: 25,
              }}
            />
          </View>
        </View>
      </Modal>

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
              Do you really want to delete this item? This process cannot be
              undone.
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
                  handleLongPress(key);
                  setModalVisible(false);
                }}>
                <RobotoText>Delete</RobotoText>
              </TouchableOpacity>
            </Row>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default List;

const styles = StyleSheet.create({
  numberSection: {
    width: 50,
    textAlign: 'center',
    paddingVertical: 15,
    borderRightWidth: 1,
    borderRightColor: colors.gray,
  },
  itemSection: {
    flex: 3,
    textAlign: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: colors.gray,
  },
  rsSection: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 15,
    borderRightWidth: 1,
    borderRightColor: colors.gray,
  },
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
    height: '60%',
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
