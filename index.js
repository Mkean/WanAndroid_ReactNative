/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import App from './App';
import App from './App';
import {name as appName} from './app.json';
import {XHttpConfig, HttpConst} from './src/utils/fetch';

XHttpConfig()
  .initLogOn(true)
  .initBaseUrl('https://www.wanandroid.com/')
  .initContentType(HttpConst.CONTENT_TYPE_FORM_DATA)
  .initLoadingFunc(isLoading => {
    console.log('isLoading: ' + isLoading);
  });

AppRegistry.registerComponent(appName, () => App);
