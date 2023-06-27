import React, {useEffect} from 'react';
import {Image} from 'react-native';
import {withStatusBar} from '../components/StatusBar';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import i18n from '../../localize/i18n';
import {CustomStyleSheet} from './../utils/ScreenUtils';
import {useReducersContext} from './../utils/redux';

import {Home} from './home';
import {Project} from './project';
import {Navigator} from './navigator';
import {Group} from './group';
import {Profile} from './profile';

const Tab = createBottomTabNavigator();

const BottomMap = {
  Home: {
    title: i18n.t('Home'),
    normalIconSource: require('../../images/bottom_navigator/icon_home.png'),
    selectedIconSource: require('../../images/bottom_navigator/icon_home_selected.png'),
    component: Home,
  },
  Project: {
    title: i18n.t('Project'),
    normalIconSource: require('../../images/bottom_navigator/icon_project.png'),
    selectedIconSource: require('../../images/bottom_navigator/icon_project_selected.png'),
    component: Project,
  },
  Navigator: {
    title: i18n.t('Navigator'),
    normalIconSource: require('../../images/bottom_navigator/icon_navigator.png'),
    selectedIconSource: require('../../images/bottom_navigator/icon_navigator_selected.png'),
    component: Navigator,
  },
  Group: {
    title: i18n.t('Group'),
    normalIconSource: require('../../images/bottom_navigator/icon_group.png'),
    selectedIconSource: require('../../images/bottom_navigator/icon_group_selected.png'),
    component: Group,
  },
  Profile: {
    title: i18n.t('Profile'),
    normalIconSource: require('../../images/bottom_navigator/icon_profile.png'),
    selectedIconSource: require('../../images/bottom_navigator/icon_profile_selected.png'),
    component: Profile,
  },
};

function getScreen() {
  let keys = Object.keys(BottomMap);
  return Object.values(BottomMap).map((value, index) => {
    return (
      <Tab.Screen component={value.component} name={keys[index]} key={index} />
    );
  });
}

const getBottomIconSource = (routeName, focused) => {
  if (focused) {
    return BottomMap[routeName].selectedIconSource;
  }
  return BottomMap[routeName].normalIconSource;
};

function Main() {
  const {
    state: {theme},
  } = useReducersContext();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        title: BottomMap[route.name].title,
        tabBarIcon: ({focused, color, size}) => {
          return (
            <Image
              style={styles.bottomIcon}
              source={getBottomIconSource(route.name, focused)}
            />
          );
        },
        tabBarActiveTintColor: theme.themeColor,
        tabBarInactiveTintColor: theme.color,
        tabBarItemStyle: {
          backgroundColor: theme.backgroundColor,
        },
      })}>
      {getScreen()}
    </Tab.Navigator>
  );
}

const styles = CustomStyleSheet.create({
  bottomIcon: {
    width: 40,
    height: 40,
  },
});

export default withStatusBar()(Main);
