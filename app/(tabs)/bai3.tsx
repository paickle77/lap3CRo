import React from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
  withSpring,
} from "react-native-reanimated";

// Dữ liệu danh sách
const DATA = Array.from({ length: 20 }, (_, i) => ({
  id: `${i}`,
  title: `Popular Quiz ${i + 1}`,
}));

const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 80;
const AVATAR_SIZE = 80;
const AVATAR_MIN_SIZE = 40;

const ScrollHeader = () => {
  const scrollY = useSharedValue(0); // Giá trị cuộn

  // 🟢 Lắng nghe sự kiện cuộn
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // 🟢 Animation cho header
  const headerStyle = useAnimatedStyle(() => {
    return {
      height: withSpring(
        interpolate(
          scrollY.value,
          [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
          [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
          Extrapolate.CLAMP
        )
      ),
    };
  });

  // 🟢 Animation cho avatar
  const avatarStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(scrollY.value, [0, 100], [AVATAR_SIZE, AVATAR_MIN_SIZE], Extrapolate.CLAMP),
      height: interpolate(scrollY.value, [0, 100], [AVATAR_SIZE, AVATAR_MIN_SIZE], Extrapolate.CLAMP),
      opacity: interpolate(scrollY.value, [0, 100], [1, 0], Extrapolate.CLAMP),
    };
  });

  // 🟢 Animation cho tiêu đề
  const titleStyle = useAnimatedStyle(() => {
    return {
      fontSize: interpolate(scrollY.value, [0, 100], [24, 16], Extrapolate.CLAMP),
      opacity: interpolate(scrollY.value, [0, 100], [1, 0], Extrapolate.CLAMP),
    };
  });

  return (
    <View style={styles.container}>
      {/* 🟢 Header với animation */}
      <Animated.View style={[styles.header, headerStyle]}>
        <Animated.Image
          source={{ uri: "https://via.placeholder.com/150" }}
          style={[styles.avatar, avatarStyle]}
        />
        <Animated.Text style={[styles.title, titleStyle]}>LAB 3</Animated.Text>
      </Animated.View>

      {/* 🟢 Danh sách nội dung */}
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listText}>{item.title}</Text>
          </View>
        )}
        onScroll={scrollHandler} // ✅ Không lỗi, đúng cú pháp
        scrollEventThrottle={16} 
        contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT }}
      />
    </View>
  );
};

export default ScrollHeader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  avatar: {
    borderRadius: 50,
    marginTop: 40,
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    marginTop: 10,
  },
  listItem: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  listText: {
    fontSize: 18,
  },
});
