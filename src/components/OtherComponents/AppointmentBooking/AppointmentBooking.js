import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  useColorScheme,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS} from '../../constants/Constants';

const {width, height} = Dimensions.get('window');

const AppointmentBooking = () => {
  const [searchBorderColor, setSearchBorderColor] = useState(COLORS.lightGray);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

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
          styles.primaryHeaderContainer,
          {
            backgroundColor:
              colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
          },
        ]}>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => navigation.goBack('Home')}>
            <Feather
              name="chevron-left"
              size={30}
              color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.primaryHeaderTitleContainer}>
          <Text
            style={[
              styles.primaryHeaderTitleText,
              {
                color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
              },
            ]}>
            Book an Appointment
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.secondaryHeaderContainer,
          {
            backgroundColor:
              colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
          },
        ]}>
        <View style={styles.secondaryHeaderTitleContainer}>
          <Text
            style={[
              styles.secondaryHeaderTitleText,
              {
                color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
              },
            ]}>
            Medical Specialities
          </Text>
          <Text
            style={[
              styles.secondaryHeaderDescriptionText,
              {
                color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
              },
            ]}>
            Wide selection of doctor's specialities
          </Text>
        </View>
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
    </SafeAreaView>
  );
};

export default AppointmentBooking;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  primaryHeaderContainer: {
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
    flexDirection: 'row',
  },

  iconContainer: {
    top: height * 0.002,
  },

  primaryHeaderTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },

  primaryHeaderTitleText: {
    fontSize: width * 0.045,
    color: COLORS.dark,
    fontFamily: FONTS.bold,
  },

  secondaryHeaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: width * 0.05,
    paddingVertical: width * 0.05,
    flexDirection: 'column',
    marginTop: height * 0.1,
  },

  secondaryHeaderTitleText: {
    fontSize: width * 0.05,
    fontFamily: FONTS.bold,
  },

  secondaryHeaderDescriptionText: {
    fontSize: width * 0.04,
    fontFamily: FONTS.medium,
    marginTop: width * 0.01,
    marginLeft: width * 0.005,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.03,
    marginTop: height * 0.2,
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
    backgroundColor: COLORS.gray,
  },
});
