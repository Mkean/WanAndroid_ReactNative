import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, Image, Pressable, Keyboard, Animated} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import {withStatusBar, statusBarHeight} from '../../components/StatusBar';
import Icon from 'react-native-vector-icons/AntDesign';
import {CustomStyleSheet, scaleSize} from '../../utils/ScreenUtils';
import {useReducersContext} from '../../utils/redux';
import {login as loginApi} from '../../utils/api/login/LoginApi';

const Login = ({navigation}) => {
  const {
    state: {theme},
  } = useReducersContext();

  const [keyboardHeight] = useState(new Animated.Value(0));

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      onKeyboardDidShow,
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      onKeyboardDidHide,
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [onKeyboardDidShow, onKeyboardDidHide]);

  const onKeyboardDidShow = useCallback(
    event => {
      Animated.timing(keyboardHeight, {
        duration: event.duration,
        toValue: event.endCoordinates.height,
        useNativeDriver: false,
      }).start();
    },
    [keyboardHeight],
  );

  const onKeyboardDidHide = useCallback(() => {
    Animated.timing(keyboardHeight, {
      duration: 250,
      toValue: 0,
      useNativeDriver: false,
    }).start();
  }, [keyboardHeight]);

  const contentStyle = {
    paddingBottom: keyboardHeight,
  };

  function onBack() {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }

  function togglePasswordVisibility() {
    setSecure(!secure);
  }

  async function login() {
    try {
      if (!password || password.length < 6) {
        console.log('请输入6位以上的密码');
        return;
      }
      const {
        data: {errorCode, errorMsg},
      } = await loginApi(username, password);
      if (errorCode === 0) {
        onBack();
        return;
      }
      console.log(`登录失败: ${JSON.stringify(errorMsg)}`);
    } catch (e) {
      console.log('登录失败: ' + JSON.stringify(e));
    }
  }

  function register() {
    navigation.navigate('Register');
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={onBack}>
        <Icon name="left" size={scaleSize(30)} color={theme.themeColor} />
      </Pressable>
      <Animated.View style={[styles.content, contentStyle]}>
        <Image
          style={styles.icon}
          source={require('../../../images/ic_launcher_round.png')}
        />

        <TextInput
          style={styles.input}
          label="用户名"
          value={username}
          mode={'outlined'}
          outlineColor={theme.color}
          activeOutlineColor={theme.themeColor}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          label="密码"
          value={password}
          mode={'outlined'}
          activeOutlineColor={theme.themeColor}
          outlineColor={theme.color}
          onChangeText={setPassword}
          right={
            <TextInput.Icon
              icon={secure ? 'eye-off' : 'eye'}
              onPress={togglePasswordVisibility}
            />
          }
          secureTextEntry={secure}
        />
        <Button
          style={styles.login}
          mode={'contained'}
          buttonColor={theme.backgroundColor}
          textColor={'#fff'}
          disabled={password === '' || username === ''}
          onPress={login}>
          登录
        </Button>

        <Pressable onPress={register}>
          <Text style={styles.register(theme)}>没有账号?来注册吧</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = CustomStyleSheet.create({
  container: {
    flex: 1,
    paddingStart: 24,
    paddingEnd: 24,
    paddingTop: statusBarHeight,
  },

  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  icon: {
    width: 144,
    height: 144,
    alignSelf: 'center',
    marginTop: '25%',
  },

  input: {
    width: '90%',
    marginTop: 16,
  },

  login: {
    width: 144,
    marginTop: 24,
  },

  register: theme => ({
    marginTop: 16,
    fontSize: 15,
    color: theme.themeColor,
  }),
});

export default withStatusBar({
  backgroundColor: 'transparent',
  translucent: true,
})(Login);
