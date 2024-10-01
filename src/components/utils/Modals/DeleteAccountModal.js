import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import LottieView from 'lottie-react-native';
import deleteAnimation from '../../../assets/animations/delete.json';
import Feather from 'react-native-vector-icons/Feather';
import {COLORS, FONTS} from '../../constants/Constants';
import CustomModal from './CustomModal';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const DeleteAccountModal = ({visible, title, description, onClose}) => {
  const [reason, setReason] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();   

  const handleDeleteAccount = async () => {    
    setLoading(true);

    try {
      const user = auth().currentUser;
      if (!user) {
        throw new Error('No user is currently signed in');
      }

      const userRef = firestore().collection('app_users').doc(user.uid);

      const listAllUserFiles = async () => {
        const storageRef = storage().ref(
          `app_users/profile_images/${user.uid}`,
        );
        const listResult = await storageRef.listAll();
        return listResult.items;
      };

      const deleteUserFiles = async files => {
        const deletePromises = files.map(fileRef => fileRef.delete());
        await Promise.all(deletePromises);
      };

      await userRef.delete();
      const userFiles = await listAllUserFiles();
      await deleteUserFiles(userFiles);
      await user.delete();

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigation.replace('Auth');
      }, 2000);
    } catch (error) {
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <LottieView
              source={deleteAnimation}
              autoPlay
              loop
              style={styles.animation}
            />
            <Text style={styles.modalText}>{title}</Text>
            <Text style={styles.descriptionText}>{description}</Text>

            <View style={styles.btnContainer}>
              <TouchableOpacity onPress={onClose}>
                <View style={styles.cancelContainer}>
                  <View style={styles.icon}>
                    <Feather name="x-circle" size={25} color={COLORS.white} />
                  </View>
                  <Text style={styles.cancelText}>Cancel</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleDeleteAccount}>
                <View style={styles.proceedContainer}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                    }}>
                    {loading ? (
                      <ActivityIndicator size={25} color={COLORS.white} />
                    ) : (
                      <>
                        <View style={styles.icon}>
                          <Feather
                            name="check-circle"
                            size={25}
                            color={COLORS.white}
                          />
                        </View>
                        <Text style={styles.proceedText}>Delete</Text>
                      </>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>

      <CustomModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        animationSource={require('../../../assets/animations/success.json')}
        title="Success!"
        description="Your Account has been deleted successfully!"
      />

      <CustomModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        animationSource={require('../../../assets/animations/error.json')}
        title="Deletion Failed"
        description="There was an error during the account deletion!"
      />
    </Modal>
  );
};

export default DeleteAccountModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  modalView: {
    margin: 20,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: COLORS.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.9,
    maxHeight: height * 0.7,
  },

  animation: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: 15,
  },

  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: width * 0.05,
    color: COLORS.dark,
    fontFamily: FONTS.bold,
  },

  descriptionText: {
    textAlign: 'center',
    color: COLORS.secondary,
    fontFamily: FONTS.bold,
    fontSize: width * 0.04,
    marginBottom: 20,
  },

  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 30,
    width: '100%',
  },

  proceedContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.errorColor,
    borderRadius: 10,
    gap: 10,
    paddingVertical: height * 0.022,
    paddingHorizontal: height * 0.02,
    marginHorizontal: width * 0.003,
    width: width * 0.35,
  },

  cancelContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.dark,
    borderRadius: 10,
    gap: 10,
    paddingVertical: height * 0.022,
    paddingHorizontal: height * 0.02,
    marginHorizontal: width * 0.003,
    width: width * 0.35,
  },

  proceedText: {
    fontSize: 16,
    color: COLORS.white,
    fontFamily: FONTS.bold,
  },

  cancelText: {
    fontSize: 16,
    color: COLORS.white,
    fontFamily: FONTS.bold,
  },

  icon: {
    top: 1,
  },
});
