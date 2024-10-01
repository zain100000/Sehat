import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  Dimensions,
  useColorScheme,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {COLORS, FONTS, CARDS} from '../constants/Constants';
import Feather from 'react-native-vector-icons/Feather';
import appointmentBooking from '../../assets/png/card-icon-1.png';
import qrAppointment from '../../assets/png/card-icon-2.png';
import consultation from '../../assets/png/card-icon-3.png';
import pharmacy from '../../assets/png/card-icon-4.png';
import Card from '../utils/Cards/Card';

const {width, height} = Dimensions.get('window');

const Home = () => {
  const [name, setName] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [searchBorderColor, setSearchBorderColor] = useState(COLORS.lightGray);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const authInstance = auth();

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
            setName(userData.name);
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

  return (
    <SafeAreaView
      style={[
        styles.primaryContainer,
        {
          backgroundColor:
            colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
        },
      ]}>
      <View style={styles.headerContainer}>
        <View style={styles.leftContainer}>
          <View style={styles.greetingContainer}>
            <Text
              style={[
                styles.greeting,
                {
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}>
              Hi
            </Text>
            <Text
              style={[
                styles.name,
                {
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}>
              {name}!
            </Text>
          </View>
          <Text
            style={[
              styles.description,
              {
                color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
              },
            ]}>
            May you always be in good condition
          </Text>
        </View>
        <TouchableOpacity>
          <View style={styles.rightContainer}>
            <Feather
              name="bell"
              size={width * 0.06}
              color={colorScheme === 'dark' ? COLORS.dark : COLORS.dark}
            />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View
          style={[styles.searchBarContainer, {borderColor: searchBorderColor}]}>
          <Feather
            name="search"
            size={width * 0.045}
            color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
            style={styles.searchIcon}
          />
          <TextInput
            style={[
              styles.searchInputField,
              {
                color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
              },
            ]}
            placeholder="Symtoms, Diseases"
            placeholderTextColor={
              colorScheme === 'dark' ? COLORS.gray : COLORS.lightGray
            }
            onFocus={() => setSearchBorderColor(COLORS.primary)}
            onBlur={() => setSearchBorderColor(COLORS.lightGray)}
          />
        </View>
        <TouchableOpacity>
          <View style={styles.filterIconContainer}>
            <Feather
              name="filter"
              size={width * 0.05}
              color={colorScheme === 'dark' ? COLORS.dark : COLORS.dark}
            />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.cardsContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Appointment_Booking')}>
          <Card
            title="Book an Appointment"
            description="Find a Doctor or specialist"
            imageSource={appointmentBooking}
            backgroundColor={CARDS.lightPurple}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Card
            title="Appointment with QR"
            description="Queuing without the hustle"
            imageSource={qrAppointment}
            backgroundColor={CARDS.lightGreen}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Card
            title="Request Consultation"
            description="Talk to specialist"
            imageSource={consultation}
            backgroundColor={CARDS.lightYellow}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Card
            title="Locate a Pharmacy"
            description="Purchase Medicines"
            imageSource={pharmacy}
            backgroundColor={CARDS.lightRed}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.promotionContainer}>
        <Image source={require('../../assets/png/promotion-card.png')} />
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  headerContainer: {
    paddingHorizontal: width * 0.02,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.01,
    marginTop: height * 0.01,
  },

  leftContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: height * 0.01,
    marginLeft: height * 0.01,
  },

  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.02,
  },

  rightContainer: {
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    padding: height * 0.009,
    borderRadius: 12,
    marginTop: height * 0.005,
    marginRight: height * 0.01,
    backgroundColor: COLORS.gray,
  },

  greeting: {
    fontSize: width * 0.055,
    fontFamily: FONTS.semiBold,
  },

  name: {
    fontSize: width * 0.055,
    fontFamily: FONTS.semiBold,
  },

  description: {
    fontSize: width * 0.035,
    fontFamily: FONTS.bold,
    marginTop: width * 0.01,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.03,
  },

  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.03,
    width: width * 0.75,
    top: height * 0.005,
  },

  searchInputField: {
    paddingHorizontal: width * 0.03,
    fontFamily: FONTS.semiBold,
    width: width * 0.65,
  },

  searchIcon: {
    marginRight: width * 0.01,
    marginTop: width * 0.01,
  },

  filterIconContainer: {
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    padding: height * 0.009,
    borderRadius: 12,
    marginTop: height * 0.005,
    marginRight: height * 0.01,
    backgroundColor: COLORS.gray,
  },

  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
    gap: 5,
  },

  promotionContainer: {
    alignSelf: 'center',
    marginTop: height * 0.005,
  },
});
