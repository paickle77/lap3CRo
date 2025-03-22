import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
  withSpring,
} from "react-native-reanimated";

// Dữ liệu danh sách sinh viên
const STUDENT_DATA = Array.from({ length: 20 }, (_, i) => ({
  id: `${i}`,
  name: `Student ${i + 1}`,
  age: 20 + (i % 5),  // Tuổi ngẫu nhiên từ 20 đến 24
  major: i % 2 === 0 ? "Computer Science" : "Electrical Engineering", // Chuyên ngành thay đổi
  imageUrl: "https://via.placeholder.com/150", // Hình ảnh đại diện của sinh viên
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
        <Animated.Text style={[styles.title, titleStyle]}>Student List</Animated.Text>
      </Animated.View>

      {/* 🟢 Danh sách sinh viên */}
      <Animated.FlatList
        data={STUDENT_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
            <View style={styles.textContainer}>
              <Text style={styles.listText}>{item.name}</Text>
              <Text style={styles.itemAge}>Age: {item.age}</Text>
              <Text style={styles.itemMajor}>Major: {item.major}</Text>
            </View>
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
    backgroundColor: "#fff",
    flexDirection: "row",
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    overflow: "hidden", // Đảm bảo ảnh không bị tràn ra ngoài item
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  listText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  itemAge: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
  },
  itemMajor: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
  },
});
