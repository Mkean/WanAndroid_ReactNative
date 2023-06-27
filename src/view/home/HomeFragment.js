import React from 'react';
import {View, Text, Pressable} from 'react-native';
import {CustomStyleSheet} from '../../utils/ScreenUtils';

function HomeFragment({navigation}) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          navigation.navigate('Login');
        }}>
        <Text>Home</Text>
      </Pressable>
    </View>
  );
}

const styles = CustomStyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeFragment;
