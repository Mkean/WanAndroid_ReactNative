import React from 'react';
import {StatusBar, Platform} from 'react-native';

export const statusBarHeight = StatusBar.currentHeight;

export const withStatusBar =
  (statusbarProps = {}) =>
  WrappedComponent => {
    class Component extends React.PureComponent {
      constructor(props) {
        super(props);
        this._navListener = props.navigation.addListener(
          'focus',
          this._setStatusBar,
        );
      }

      componentWillUnmount() {
        this._navListener();
      }

      _setStatusBar = () => {
        const {
          barStyle = 'dark-content',
          backgroundColor = '#fff',
          translucent = false,
        } = statusbarProps;
        StatusBar.setBarStyle(barStyle);
        if (Platform.OS === 'android') {
          StatusBar.setTranslucent(translucent);
          StatusBar.setBackgroundColor(backgroundColor);
        }
      };

      render() {
        return <WrappedComponent {...this.props} />;
      }
    }

    return Component;
  };
