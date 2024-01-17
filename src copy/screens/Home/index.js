import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../../constant/colors';
import Row from '../../components/Row';
import RobotoText from '../../components/RobotoText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from 'react-native-vector-icons/Entypo';
import {Picker} from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';

const TABS = [{name: 'Make List'}, {name: 'Make Group'}, {name: 'Join Group'}];

const Home = ({user, onSelectList, isConnected}) => {
  const [state, setState] = useState({
    price: '',
    type: '',
    reason: '',
    category: '',
  });
  const [errors, setErrors] = useState({
    price: '',
    category: '',
    reason: '',
  });
  const [data, setData] = useState([]);
  const [input, setInput] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState(TABS[0].name);
  const [modalVisibleCategory, setModalVisibleCategory] = useState(false);

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
  const generateUniqueKey = (length = 12) => {
    const characters =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      key += characters.charAt(randomIndex);
    }

    return key;
  };
  console.log(state, 'state');
  console.log(data, 'data');

  const addHandler = async () => {
    try {
      // firebaseHandling();
      localHandling();
    } catch (error) {
      console.error('Error updating listData:', error);
    }
  };

  const firebaseHandling = async () => {
    try {
      const currentTime = new Date().toISOString();

      const newData = {
        reason: state.reason,
        price: state.price,
        timestamp: currentTime,
      };

      const existingDataString = await AsyncStorage.getItem('listData');

      if (existingDataString) {
        const existingData = JSON.parse(existingDataString);

        const categoryIndex = existingData.findIndex(
          item => item.category === state.category,
        );
        console.log(existingData[categoryIndex], 'categoryIndex');

        if (categoryIndex < 0) {
          existingData.push({
            category: state.category,
            type: state.type,
            data: [newData],
          });
        } else {
          existingData[categoryIndex].data.push(newData);
        }

        await AsyncStorage.setItem('listData', JSON.stringify(existingData));

        console.log('Data updated successfully:', existingData);
      } else {
        const newDataArray = [
          {category: state.category, type: state.type, data: [newData]},
        ];

        await AsyncStorage.setItem('listData', JSON.stringify(newDataArray));

        console.log('New data array created:', newDataArray);
      }

      setState({...state, reason: '', price: ''});
      takeData();
    } catch (error) {
      console.error('Error updating listData in local:', error);
    }
  };
  const localHandling = async () => {
    try {
      const currentTime = new Date().toISOString();

      const newData = {
        reason: state.reason,
        price: state.price,
        timestamp: currentTime,
      };

      const existingDataString = await AsyncStorage.getItem('listData');

      if (existingDataString) {
        const existingData = JSON.parse(existingDataString);

        const categoryIndex = existingData.findIndex(
          item => item.category === state.category,
        );
        console.log(existingData[categoryIndex], 'categoryIndex');

        if (categoryIndex < 0) {
          existingData.push({
            category: state.category,
            type: state.type,
            data: [newData],
          });
        } else {
          existingData[categoryIndex].data.push(newData);
        }

        await AsyncStorage.setItem('listData', JSON.stringify(existingData));

        console.log('Data updated successfully:', existingData);
      } else {
        const newDataArray = [
          {category: state.category, type: state.type, data: [newData]},
        ];

        await AsyncStorage.setItem('listData', JSON.stringify(newDataArray));

        console.log('New data array created:', newDataArray);
      }

      setState({...state, reason: '', price: ''});
      takeData();
    } catch (error) {
      console.error('Error updating listData in local:', error);
    }
  };

  const checker = async () => {
    const _errors = {...errors};

    if (state.price == 0) {
      _errors['price'] = 'Enter some amount';
    } else {
      delete _errors['price'];
    }

    if (state.reason == '') {
      _errors['reason'] = 'Enter your reason';
    } else {
      delete _errors['reason'];
    }
    if (state.category == '') {
      _errors['category'] = 'Enter your category';
    } else {
      delete _errors['category'];
    }

    if (Object.keys(_errors).length > 0) {
      setErrors(_errors);
    } else {
      addHandler();
    }
  };

  const clearBtnHandleer = async () => {
    await AsyncStorage.removeItem('listData');

    takeData();
    setModalVisible(false);
  };

  return (
    <>
      <ScrollView keyboardShouldPersistTaps="handled" style={{flex: 1}}>
        {/*    Header   */}
        <Row style={{padding: 20, backgroundColor: colors.baseLight}}>
          <RobotoText size={20} type="bold">
            Hello {user.toUpperCase().split(' ')[0]} !
          </RobotoText>
          <TouchableOpacity onPress={onSelectList}>
            <Entypo name="list" color={colors.white} size={25} />
          </TouchableOpacity>
        </Row>

        {/*    Body   */}
        <View style={{paddingHorizontal: 20}}>
          <RobotoText
            size={30}
            type="bold"
            style={{textAlign: 'center', marginVertical: 50}}>
            We can calculate your expense.
          </RobotoText>

          {/*    DropDown   */}
          <View style={{marginBottom: 20}}>
            <Row>
              <View
                style={{
                  borderWidth: 1,
                  flex: 1,
                  borderColor: colors.gray,
                  borderRadius: 10,
                  overflow: 'hidden',
                }}>
                <Picker
                  selectedValue={state.category}
                  style={{
                    color: colors.white,
                    width: '100%',
                  }}
                  dropdownIconColor={colors.white}
                  onValueChange={itemValue => {
                    setState({
                      ...state,
                      category: itemValue[0],
                      type: itemValue[1],
                    });
                    setErrors({...errors, category: ''});
                  }}>
                  <Picker.Item
                    label="Select..."
                    value=""
                    enabled={false}
                    style={{color: colors.gray}}
                  />
                  {data?.map(item => (
                    <Picker.Item
                      label={item?.category}
                      value={[item?.category, item?.type]}
                      key={item?.category}
                    />
                  ))}
                </Picker>
              </View>

              {/*    btn for add new category    */}
              <Pressable
                onPress={() => {
                  setModalVisibleCategory(true);
                }}
                style={{
                  backgroundColor: colors.base,
                  padding: 10,
                  marginLeft: 20,
                  borderRadius: 100,
                }}>
                <Entypo name="add-to-list" size={25} color={colors.white} />
              </Pressable>
            </Row>
            {errors.category ? (
              <RobotoText
                size={10}
                color={colors.red}
                type="bold"
                style={{marginTop: 5, marginLeft: 5}}>
                {errors.category}
              </RobotoText>
            ) : (
              <></>
            )}
          </View>

          {/*    input for Rs.   */}
          <>
            <Row
              style={{
                borderWidth: 1,
                borderColor: colors.gray,
                borderRadius: 10,
              }}>
              <RobotoText size={20} type="bold" style={{paddingLeft: 15}}>
                Rs.
              </RobotoText>
              <TextInput
                value={state.price}
                placeholder="Enter amount"
                keyboardType="numeric"
                placeholderTextColor={colors.gray}
                onChangeText={e => {
                  setErrors({...errors, price: ''});
                  setState({...state, price: e});
                }}
                style={{
                  flex: 1,
                  fontFamily: 'Roboto-Medium',
                  fontWeight: '700',
                  fontSize: 14,
                }}
              />
            </Row>
            {errors.price ? (
              <RobotoText
                size={10}
                color={colors.red}
                type="bold"
                style={{marginTop: 5, marginLeft: 5}}>
                {errors.price}
              </RobotoText>
            ) : (
              <></>
            )}
          </>

          {/*    input for reason    */}
          <>
            <TextInput
              value={state.reason}
              placeholder="Enter reason"
              placeholderTextColor={colors.gray}
              onChangeText={e => {
                setErrors({...errors, reason: ''});
                setState({...state, reason: e});
              }}
              style={{
                borderWidth: 1,
                borderColor: colors.gray,
                borderRadius: 10,
                paddingHorizontal: 10,
                fontFamily: 'Roboto-Medium',
                fontWeight: '700',
                fontSize: 15,
                marginTop: 20,
              }}
            />
            {errors.reason ? (
              <RobotoText
                size={10}
                color={colors.red}
                type="bold"
                style={{marginTop: 5, marginLeft: 5}}>
                {errors.reason}
              </RobotoText>
            ) : (
              <></>
            )}
          </>

          {/*    Add btn    */}
          <Pressable
            onPress={checker}
            style={{
              backgroundColor: colors.base,
              alignItems: 'center',
              marginVertical: 20,
              padding: 15,
              borderRadius: 100,
            }}>
            <RobotoText size={20} type="bold">
              ADD
            </RobotoText>
          </Pressable>

          {/*    Clear data btn    */}
          <Pressable
            onPress={() => setModalVisible(true)}
            style={{
              backgroundColor: colors.base,
              alignItems: 'center',
              marginVertical: 20,
              padding: 15,
              borderRadius: 100,
            }}>
            <RobotoText size={20} type="bold">
              Clear All Data
            </RobotoText>
          </Pressable>
        </View>
      </ScrollView>

      {/*    Modal for add new category   */}

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisibleCategory}
        onRequestClose={() => {
          setModalVisibleCategory(!modalVisibleCategory);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <RobotoText color={colors.gray} size={20} type="medium">
              Add New Category
            </RobotoText>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-evenly',
                marginTop: 20,
                marginBottom: 15,
                borderBottomWidth: 1,
                borderBlockColor: colors.lightGray,
              }}>
              {TABS.map(item => (
                <Pressable
                  key={item.name}
                  style={[
                    selectedTab == item.name
                      ? styles.activeTab
                      : {paddingBottom: 5},
                  ]}
                  onPress={() => setSelectedTab(item.name)}>
                  <RobotoText
                    color={selectedTab == item.name ? colors.base : colors.gray}
                    size={13}
                    type={selectedTab == item.name ? 'bold' : 'medium'}>
                    {item.name}
                  </RobotoText>
                </Pressable>
              ))}
            </View>
            {selectedTab == 'Make Group' || selectedTab == 'Join Group' ? (
              isConnected ? (
                <>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      width: '100%',
                      borderColor: colors.gray,
                      borderRadius: 10,
                      paddingVertical: 5,
                      color: colors.black,
                      paddingHorizontal: 10,
                    }}
                    value={input}
                    placeholder={
                      selectedTab == 'Make Group' ? 'Group Name' : 'Group Code'
                    }
                    placeholderTextColor={colors.gray}
                    onChangeText={e => {
                      setInput(e);
                    }}
                  />
                  {selectedTab == 'Join Group' ? (
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
                        onPress={() => setModalVisibleCategory(false)}>
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
                          setInput('');
                        }}>
                        <RobotoText>Join</RobotoText>
                      </TouchableOpacity>
                    </Row>
                  ) : (
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
                        onPress={() => setModalVisibleCategory(false)}>
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
                          setState({
                            ...state,
                            category: input,
                            type: 'group',
                          });
                          setModalVisibleCategory(false);
                          setInput('');
                        }}>
                        <RobotoText>Add</RobotoText>
                      </TouchableOpacity>
                    </Row>
                  )}
                </>
              ) : (
                <View style={{alignItems: 'center'}}>
                  <View style={{height: 50, width: 50}}>
                    <Image
                      source={require('../../assets/images/internet.png')}
                      style={{
                        height: '100%',
                        width: '100%',
                        tintColor: colors.red,
                      }}
                    />
                  </View>
                  <RobotoText
                    color={colors.gray}
                    size={30}
                    type="bold"
                    letterSpacing={0}
                    style={{marginBottom: 10}}>
                    Ooops!
                  </RobotoText>
                  <RobotoText color={colors.gray} size={10} type="medium">
                    No Internet Connect found
                  </RobotoText>
                  <RobotoText color={colors.gray} size={10} type="medium">
                    Check your connection
                  </RobotoText>
                </View>
              )
            ) : (
              <>
                <TextInput
                  style={{
                    borderWidth: 1,
                    width: '100%',
                    borderColor: colors.gray,
                    borderRadius: 10,
                    paddingVertical: 5,
                    color: colors.black,
                    paddingHorizontal: 10,
                  }}
                  value={input}
                  placeholder="List Name"
                  placeholderTextColor={colors.gray}
                  onChangeText={e => {
                    setInput(e);
                  }}
                />
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
                    onPress={() => setModalVisibleCategory(false)}>
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
                      setState({
                        ...state,
                        category: input,
                        type: 'list',
                      });
                      setModalVisibleCategory(false);
                      setInput('');
                    }}>
                    <RobotoText>Add</RobotoText>
                  </TouchableOpacity>
                </Row>
              </>
            )}
            {/* <>
              <TextInput
                style={{
                  borderWidth: 1,
                  width: '100%',
                  borderColor: colors.gray,
                  borderRadius: 10,
                  paddingVertical: 5,
                  color: colors.black,
                  paddingHorizontal: 10,
                }}
                value={input}
                placeholder={
                  selectedTab == 'Make List'
                    ? 'List Name'
                    : selectedTab == 'Make Group'
                    ? 'Group Name'
                    : 'Group Code'
                }
                placeholderTextColor={colors.gray}
                onChangeText={e => {
                  setInput(e);
                }}
              />
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
                  onPress={() => setModalVisibleCategory(false)}>
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
                    setState({
                      ...state,
                      category: input,
                      type: selectedTab == 'Make Group' ? 'group' : 'list',
                    });
                    setModalVisibleCategory(false);
                    setInput('');
                  }}>
                  <RobotoText>Add</RobotoText>
                </TouchableOpacity>
              </Row>
            </> */}
          </View>
        </View>
      </Modal>

      {/*    Modal for clear all data   */}

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
              Do you really want to delete these records? This process cannot be
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
                onPress={clearBtnHandleer}>
                <RobotoText>Delete</RobotoText>
              </TouchableOpacity>
            </Row>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Home;

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
    height: 250,
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
  activeTab: {
    borderBottomWidth: 2,
    borderBlockColor: colors.base,
  },
});

{
  /* <Row style={{marginVertical: 40}}>
              <View
                style={{
                  backgroundColor: colors.bg2,
                  width: '45%',
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: colors.gray,
                  overflow: 'hidden',
                }}>
                <View
                  style={{
                    backgroundColor: colors.base,
                    alignItems: 'center',
                    paddingVertical: 10,
                    borderBottomWidth: 2,
                    borderBottomColor: colors.gray,
                  }}>
                  <RobotoText type="bold">Total Expense</RobotoText>
                </View>
                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: 15,
                  }}>
                  <RobotoText size={18} type="bold">
                    {calculateTotalPrice()}
                  </RobotoText>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: colors.bg2,
                  width: '45%',
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: colors.gray,
                  overflow: 'hidden',
                }}>
                <View
                  style={{
                    backgroundColor: colors.base,
                    alignItems: 'center',
                    paddingVertical: 10,
                    borderBottomWidth: 2,
                    borderBottomColor: colors.gray,
                  }}>
                  <RobotoText type="bold">Last Expense</RobotoText>
                </View>
                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: 15,
                  }}>
                  <RobotoText size={18} type="bold">
                    {getLastAddedItem()}
                  </RobotoText>
                </View>
              </View>
            </Row> */
}
