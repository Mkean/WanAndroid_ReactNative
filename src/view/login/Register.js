import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, Image, Pressable, Keyboard, Animated} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import {withStatusBar, statusBarHeight} from '../../components/StatusBar';
import Icon from 'react-native-vector-icons/AntDesign';
import {CustomStyleSheet, scaleSize} from '../../utils/ScreenUtils';
import {useReducersContext} from '../../utils/redux';
import {register as registerApi} from '../../utils/api/login/LoginApi';

const Register = ({navigation}) => {
  const {
    state: {theme},
  } = useReducersContext();

  const [keyboardHeight] = useState(new Animated.Value(0));

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [reSecure, setReSecure] = useState(true);

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

  function toggleRePasswordVisibility() {
    setReSecure(!reSecure);
  }

  async function register() {
    try {
      if (!password || password.length < 6) {
        console.log('请输入6位以上的密码');
        return;
      }
      if (!repassword || repassword.length < 6) {
        console.log('请输入6位以上的确认密码');
        return;
      }
      if (password !== repassword) {
        console.log('确认密码与密码不符');
        return;
      }
      const {
        data: {errorCode, errorMsg},
      } = await registerApi(username, password);
      if (errorCode === 0) {
        onBack();
        return;
      }
      console.log(`注册失败: ${JSON.stringify(errorMsg)}`);
    } catch (e) {
      console.log('注册失败: ' + JSON.stringify(e));
    }
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={onBack}>
        <Icon name="left" size={scaleSize(30)} color={theme.themeColor} />
      </Pressable>
      <Animated.View style={[styles.content, contentStyle]}>
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

        <TextInput
          style={styles.input}
          label="确认密码"
          value={repassword}
          mode={'outlined'}
          activeOutlineColor={theme.themeColor}
          outlineColor={theme.color}
          onChangeText={setRepassword}
          right={
            <TextInput.Icon
              icon={reSecure ? 'eye-off' : 'eye'}
              onPress={toggleRePasswordVisibility}
            />
          }
          secureTextEntry={reSecure}
        />
        <Button
          style={styles.register}
          mode={'contained'}
          buttonColor={theme.backgroundColor}
          textColor={'#fff'}
          disabled={username === '' || password === '' || repassword === ''}
          onPress={register}>
          注册
        </Button>
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
    paddingTop: '35%',
  },

  input: {
    width: '90%',
    marginTop: 16,
  },

  register: {
    width: 144,
    height: 38,
    justifyContent: 'center',
    marginTop: 16,
  },
});

export default withStatusBar({
  backgroundColor: 'transparent',
  translucent: true,
})(Register);
