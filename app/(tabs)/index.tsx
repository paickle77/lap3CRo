import { Button, StyleSheet } from 'react-native';
import React from 'react';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { View } from 'react-native';

const UseSharedValueScreen = () => {
  const width = useSharedValue(100); // Giá trị động

  const handlePress = () => {
    width.value = withSpring(width.value + 50); // Khi nhấn, hộp mở rộng thêm 50px
  };

  return (
    <View style={styles.container}>
      <Button title="Mở Rộng" onPress={handlePress} />
      <Animated.View style={[styles.box, { width }]} />
    </View>
  );
};

export default UseSharedValueScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    height: 100,
    backgroundColor: 'blue',
    marginTop: 20, // Khoảng cách giữa button và box
  },
});
