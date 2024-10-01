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
import uploadAnimation from '../../../assets/animations/image.json';
import Feather from 'react-native-vector-icons/Feather';
import {COLORS, FONTS} from '../../constants/Constants';
import ImagePicker from 'react-native-image-crop-picker';
import CustomModal from './CustomModal';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

const {width, height} = Dimensions.get('window');

const ImageUploadModal = ({
  visible,
  title,
  description,
  onClose,
  onImageUpload,
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSelection = async image => {
    try {
      setLoading(true);
      const user = auth().currentUser;

      if (user) {
        const userDocRef = firestore().collection('app_users').doc(user.uid);
        const oldImageRef = storage().ref(
          `app_users/profile_images/${user.uid}`,
        );
        const fileName = `profile_image_${Date.now()}.jpg`;
        const newImageRef = storage().ref(
          `app_users/profile_images/${user.uid}/${fileName}`,
        );

        if (imageUrl) {
          try {
            const oldImage = storage().refFromURL(imageUrl);
            await oldImage.delete();
          } catch (deleteError) {
            if (deleteError.code !== 'storage/object-not-found') {
              throw deleteError;
            }
          }
        }

        await newImageRef.putFile(image.path);
        const downloadURL = await newImageRef.getDownloadURL();

        await userDocRef.update({
          imageUrl: downloadURL,
        });

        setImageUrl(downloadURL);

        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          onClose();
        }, 2000);

        onImageUpload(downloadURL);
      }
    } catch (error) {
      console.error(error);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
      });

      handleImageSelection(image);
    } catch (error) {
      console.error(error);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    }
  };

  const handleOpenCamera = async () => {
    try {
      const image = await ImagePicker.openCamera({
        width: 400,
        height: 400,
        cropping: true,
      });

      handleImageSelection(image);
    } catch (error) {
      console.error(error);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      false
      visible={visible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <LottieView
              source={uploadAnimation}
              autoPlay
              loop
              style={styles.animation}
            />
            <Text style={styles.modalText}>{title}</Text>
            <Text style={styles.descriptionText}>{description}</Text>

            <View style={styles.btnContainer}>
              <TouchableOpacity onPress={handleOpenCamera}>
                <View style={styles.cameraContainer}>
                  <View style={styles.icon}>
                    <Feather
                      name="camera"
                      size={25}
                      color={COLORS.white}
                    />
                  </View>
                  <Text style={styles.cameraText}>Camera</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={handlePickImage}>
                <View style={styles.galleryContainer}>
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
                            name="image"
                            size={25}
                            color={COLORS.white}
                          />
                        </View>
                        <Text style={styles.galleryText}>Gallery</Text>
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
        description="Image uploaded successfully!"
      />

      <CustomModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        animationSource={require('../../../assets/animations/error.json')}
        title="Upload Failed"
        description="There was an error during the image upload!"
      />
    </Modal>
  );
};

export default ImageUploadModal;

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

  cameraContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.dark,
    borderRadius: 10,
    gap: 10,
    paddingVertical: height * 0.022,
    paddingHorizontal: height * 0.02,
    marginHorizontal: width * 0.003,
    width: width * 0.35,
  },

  galleryContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    gap: 10,
    paddingVertical: height * 0.022,
    paddingHorizontal: height * 0.02,
    marginHorizontal: width * 0.003,
    width: width * 0.35,
  },

  cameraText: {
    fontSize: 16,
    color: COLORS.white,
    fontFamily: FONTS.bold,
  },

  galleryText: {
    fontSize: 16,
    color: COLORS.white,
    fontFamily: FONTS.bold,
  },

  icon: {
    top: 2,
  },
});
