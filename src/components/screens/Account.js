import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
  useColorScheme,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS} from '../constants/Constants';
import imgPlaceHolder from '../../assets/img-placeholder.png';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import LogoutModal from '../utils/Modals/LogoutModal';
import ImageUploadModal from '../utils/Modals/ImageUploadModal';
import DeleteAccountModal from '../utils/Modals/DeleteAccountModal';
import CustomModal from '../utils/Modals/CustomModal';
import ContentLoader, {Rect} from 'react-content-loader/native';

const {width, height} = Dimensions.get('window');

const Account = () => {
  const [photoURL, setPhotoURL] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const authInstance = auth();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const fetchUser = async () => {
      const user = authInstance.currentUser;
      if (user) {
        try {
          const userDoc = await firestore()
            .collection('app_users')
            .doc(user.uid)
            .get();

          if (userDoc.exists) {
            const userData = userDoc.data();
            const profileImageURL =
              userData?.imageUrl || user.photoURL || imgPlaceHolder;
            setPhotoURL(profileImageURL);
            setName(userData.name);
            setEmail(userData.email);
          }
        } catch {
          setShowErrorModal(true);
          setTimeout(() => {
            setShowErrorModal(false);
          }, 3000);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUser();
  }, []);

  const handleEditPress = () => {
    setShowImageUploadModal(true);
  };

  const handleLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const handleDeleteAccountModal = () => {
    setShowDeleteAccountModal(true);
  };

  const handleImageUpload = url => {
    setShowImageUploadModal(false);
    setPhotoURL(url);
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 2000);
  };

  return (
    <SafeAreaView
      style={[
        styles.primaryContainer,
        {
          backgroundColor:
            colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
        },
      ]}>
      <View
        style={[
          styles.headerContainer,
          {
            backgroundColor:
              colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
          },
        ]}>
        <TouchableOpacity onPress={() => navigation.goBack('Home')}>
          <Feather
            name="chevron-left"
            size={30}
            color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.headerTextContainer}>
        <Text
          style={[
            styles.headerTitleText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          Settings
        </Text>
        <Text
          style={[
            styles.headerDescriptionText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          App Settings - Preferences.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View
          style={[
            styles.cardContainer,
            colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
          ]}>
          <View
            style={[
              styles.profileCard,
              {
                backgroundColor:
                  colorScheme === 'dark' ? COLORS.lightDark : COLORS.white,
              },
            ]}>
            <View style={styles.imgContainer}>
              {loading ? (
                <ContentLoader
                  speed={2}
                  width={width * 0.8}
                  height={width * 0.5}
                  viewBox={`0 0 ${width * 0.8} ${width * 0.5}`}
                  backgroundColor={
                    colorScheme === 'dark' ? COLORS.lightGray : COLORS.white
                  }
                  foregroundColor={
                    colorScheme === 'dark' ? COLORS.lightGray : COLORS.white
                  }>
                  <Rect
                    x="0"
                    y="0"
                    rx="10"
                    ry="10"
                    width={width * 0.8}
                    height={width * 0.5}
                  />
                </ContentLoader>
              ) : photoURL && typeof photoURL === 'string' ? (
                <Image source={{uri: photoURL}} style={styles.image} />
              ) : (
                <Feather
                  name="image"
                  size={width * 0.5}
                  color={COLORS.lightGray}
                />
              )}
            </View>

            <View style={styles.infoContainer}>
              {loading ? (
                <ContentLoader
                  speed={2}
                  width={width * 0.9}
                  height={80}
                  viewBox={`0 0 ${width * 0.9} 80`}
                  backgroundColor={
                    colorScheme === 'dark' ? COLORS.lightGray : COLORS.lightGray
                  }
                  foregroundColor={
                    colorScheme === 'dark' ? COLORS.lightGray : COLORS.lightGray
                  }>
                  <Rect
                    x="0"
                    y="0"
                    rx="4"
                    ry="4"
                    width={width * 0.6}
                    height="20"
                  />
                  <Rect
                    x="0"
                    y="30"
                    rx="4"
                    ry="4"
                    width={width * 0.4}
                    height="20"
                  />
                </ContentLoader>
              ) : (
                <>
                  <View style={styles.info}>
                    <Text
                      style={[
                        styles.name,
                        {
                          color:
                            colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                        },
                      ]}>
                      {name}
                    </Text>

                    <Text
                      style={[
                        styles.email,
                        {
                          color:
                            colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                        },
                      ]}>
                      {email}
                    </Text>
                  </View>
                  <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={handleEditPress}>
                      <Feather
                        name="edit"
                        size={25}
                        color={COLORS.primary}
                        style={styles.editIcon}
                      />
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>

          <View
            style={[
              styles.statusCard,
              {
                backgroundColor:
                  colorScheme === 'dark' ? COLORS.lightDark : COLORS.white,
              },
            ]}>
            <View style={styles.statusContainer}>
              <View style={styles.leftContainer}>
                <View style={styles.iconContainer}>
                  <Feather
                    name="rotate-cw"
                    size={25}
                    style={[
                      styles.icon,
                      {
                        color:
                          colorScheme === 'dark'
                            ? COLORS.white
                            : COLORS.primary,
                      },
                    ]}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text
                    style={{
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      fontSize: width * 0.045,
                      marginLeft: 10,
                    }}>
                    Change Password:{' '}
                  </Text>
                </View>
              </View>

              <View style={styles.rightContainer}>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Change_Password')}>
                    <Feather
                      name="chevron-right"
                      size={30}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.aboutCard,
              {
                backgroundColor:
                  colorScheme === 'dark' ? COLORS.lightDark : COLORS.white,
              },
            ]}>
            <View style={styles.aboutContainer}>
              <View style={styles.leftContainer}>
                <View style={styles.iconContainer}>
                  <Feather
                    name="info"
                    size={25}
                    style={[
                      styles.icon,
                      {
                        color:
                          colorScheme === 'dark'
                            ? COLORS.white
                            : COLORS.primary,
                      },
                    ]}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text
                    style={{
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      fontSize: width * 0.045,
                      marginLeft: 10,
                    }}>
                    About The App:{' '}
                  </Text>
                </View>
              </View>

              <View style={styles.rightContainer}>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('About')}>
                    <Feather
                      name="chevron-right"
                      size={30}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.aboutContainer}>
              <View style={styles.leftContainer}>
                <View style={styles.iconContainer}>
                  <Feather
                    name="book-open"
                    size={25}
                    style={[
                      styles.icon,
                      {
                        color:
                          colorScheme === 'dark'
                            ? COLORS.white
                            : COLORS.primary,
                      },
                    ]}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text
                    style={{
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      fontSize: width * 0.045,
                      marginLeft: 10,
                    }}>
                    Terms Of Use:{' '}
                  </Text>
                </View>
              </View>

              <View style={styles.rightContainer}>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Terms')}>
                    <Feather
                      name="chevron-right"
                      size={30}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity onPress={handleDeleteAccountModal}>
            <View
              style={[
                styles.deleteContainer,
                colorScheme === 'dark' && {backgroundColor: COLORS.errorColor},
              ]}>
              <View style={styles.leftContainer}>
                <View style={styles.iconContainer}>
                  <Feather
                    name="trash"
                    size={25}
                    color={
                      colorScheme === 'dark' ? COLORS.white : COLORS.errorColor
                    }
                    style={{bottom: 2}}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text
                    style={[
                      styles.deleteText,
                      {
                        color:
                          colorScheme === 'dark'
                            ? COLORS.white
                            : COLORS.errorColor,
                      },
                    ]}>
                    Delete Account
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogoutModal}>
            <View
              style={[
                styles.logoutContainer,
                colorScheme === 'dark' ? COLORS.primary : COLORS.primary,
              ]}>
              <View style={styles.leftContainer}>
                <View style={styles.iconContainer}>
                  <Feather
                    name="log-out"
                    size={25}
                    color={COLORS.white}
                    style={{bottom: 2}}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text
                    style={[
                      styles.deleteText,
                      {
                        color:
                          colorScheme === 'dark' ? COLORS.white : COLORS.white,
                      },
                    ]}>
                    Logout
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ImageUploadModal
        visible={showImageUploadModal}
        onClose={() => setShowImageUploadModal(false)}
        onImageUpload={handleImageUpload}
        title="Upload Image!"
        description="Please choose your profile picture to upload"
      />

      <LogoutModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Logout!"
        description="Are your sure you want to logout ?"
      />

      <DeleteAccountModal
        visible={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
        title="Delete Account!"
        description="Are you sure you want to delete your account ?"
      />

      <CustomModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        animationSource={require('../../assets/animations/success.json')}
        title="Success!"
        description="Image uploaded successfully!"
      />

      <CustomModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Error"
        description="Error fetching user data. Please try again later."
        animationSource={require('../../assets/animations/error.json')}
      />
    </SafeAreaView>
  );
};

export default Account;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: width * 0.02,
    paddingVertical: width * 0.05,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.gray,
  },

  scrollContainer: {
    paddingTop: height * 0.025,
  },

  headerTextContainer: {
    marginTop: height * 0.1,
    marginLeft: width * 0.05,
  },

  headerTitleText: {
    fontSize: width * 0.09,
    color: COLORS.dark,
    fontFamily: FONTS.bold,
  },

  headerDescriptionText: {
    color: COLORS.dark,
    fontSize: width * 0.042,
    fontFamily: FONTS.medium,
    left: width * 0.01,
  },

  cardContainer: {
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    gap: 20,
  },

  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    width: width * 0.9,
  },

  imgContainer: {
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: 20,
  },

  image: {
    width: width * 0.8,
    height: width * 0.5,
    resizeMode: 'cover',
  },

  name: {
    fontSize: width * 0.04,
    marginBottom: 10,
    color: COLORS.dark,
    fontFamily: FONTS.semiBold,
  },

  email: {
    fontSize: width * 0.038,
    color: COLORS.dark,
    fontFamily: FONTS.semiBold,
  },

  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  editIcon: {
    top: height * 0.005,
  },

  statusCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    width: width * 0.9,
    gap: 20,
  },

  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  aboutCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    width: width * 0.9,
    gap: 20,
  },

  aboutContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  leftContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 5,
    gap: 5,
  },

  icon: {
    color: COLORS.dark,
  },

  btnContainer: {
    marginTop: height * 0.01,
    gap: 20,
  },

  deleteContainer: {
    width: 380,
    alignItems: 'center',
    padding: height * 0.009,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.errorColor,
    borderRadius: 10,
  },

  deleteText: {
    fontSize: width * 0.045,
    color: COLORS.errorColor,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
    marginBottom: 5,
  },

  logoutContainer: {
    width: 380,
    alignItems: 'center',
    padding: height * 0.009,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },

  logoutText: {
    fontSize: width * 0.045,
    color: COLORS.white,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
});
