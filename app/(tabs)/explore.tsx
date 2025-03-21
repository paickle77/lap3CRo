import React, { useCallback } from "react";
import { StyleSheet, Text, View, ViewToken } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { FlatList } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // Nhập GestureHandlerRootView

// 🔹 Dữ liệu mẫu (danh sách item)
const data = [
  { id: "1", title: "Item 1" },
  { id: "2", title: "Item 2" },
  { id: "3", title: "Item 3" },
  { id: "4", title: "Item 4" },
  { id: "5", title: "Item 5" },
  { id: "6", title: "Item 6" },
  { id: "7", title: "Item 7" },
  { id: "8", title: "Item 8" },
  { id: "9", title: "Item 9" },
  { id: "10", title: "Item 10" },
  { id: "11", title: "Item 11" },
  { id: "12", title: "Item 12" },
];

// 🔹 Định nghĩa kiểu dữ liệu cho ListItemProps
interface ListItemProps {
  item: { id: string; title: string }; // Một item chứa id và title
  viewableItems: Animated.SharedValue<ViewToken[]>; // Danh sách các item đang hiển thị
}

// 🔹 Component hiển thị từng item trong danh sách
const ListItem: React.FC<ListItemProps> = React.memo(({ item, viewableItems }) => {
  // 🟢 Dùng useAnimatedStyle để tạo hiệu ứng động cho từng item
  const rStyle = useAnimatedStyle(() => {
    // 🔹 Kiểm tra xem item này có đang hiển thị trên màn hình không
    const isVisible = viewableItems.value.some(
      (viewableItem) => viewableItem.isViewable && viewableItem.item.id === item.id
    );

    // 🔹 Nếu item đang hiển thị, nó sẽ hiện rõ và scale lên 1
    // 🔹 Nếu item không hiển thị, nó sẽ mờ đi và scale nhỏ lại
    return {
      opacity: withTiming(isVisible ? 1 : 0.3), // Hiển thị hoặc làm mờ
      transform: [{ scale: withTiming(isVisible ? 1 : 0.8) }], // Phóng to hoặc thu nhỏ
    };
  });

  // 🟢 Trả về một View động có hiệu ứng fade-in và scale
  return (
    <Animated.View style={[styles.item, rStyle]}>
      <Text style={styles.itemText}>{item.title}</Text>
    </Animated.View>
  );
});

// 🔹 Component chính chứa danh sách các item
const Explore = () => {
  // 🟢 useSharedValue lưu danh sách các item đang hiển thị
  const viewableItems = useSharedValue<ViewToken[]>([]);

  // 🟢 useCallback giúp tối ưu hiệu suất, tránh tạo lại hàm không cần thiết
  const onViewableItemsChanged = useCallback(({ viewableItems: vItems }: { viewableItems: ViewToken[] }) => {
    viewableItems.value = vItems; // Cập nhật danh sách item đang hiển thị
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}> {/* Bọc toàn bộ cây component với GestureHandlerRootView */}
      <View style={styles.container}>
        {/* 🟢 FlatList hiển thị danh sách item */}
        <FlatList
          data={data} // Dữ liệu danh sách
          keyExtractor={(item) => item.id} // Xác định key duy nhất cho mỗi item
          renderItem={({ item }) => <ListItem item={item} viewableItems={viewableItems} />} // Render từng item
          onViewableItemsChanged={onViewableItemsChanged} // Gọi khi item xuất hiện trên màn hình
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }} // Item phải hiển thị ít nhất 50% mới tính là hiển thị
          contentContainerStyle={{ paddingBottom: 20 }} // Thêm padding dưới cùng danh sách
        />
        <Text style={styles.title}>Explore List</Text>
      </View>
    </GestureHandlerRootView> 
  );
};

export default Explore;

// 🟢 Style cho giao diện
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
  item: {
    width: 300, // Độ rộng mỗi item
    padding: 20, // Khoảng cách bên trong item
    marginVertical: 10, // Khoảng cách giữa các item
    backgroundColor: "#3498db", // Màu nền xanh
    borderRadius: 10, // Bo góc
    alignItems: "center", // Canh giữa nội dung
  },
  itemText: {
    color: "white", // Màu chữ trắng
    fontSize: 18, // Cỡ chữ lớn
    fontWeight: "bold", // Chữ đậm
  },
  title: {
    fontSize: 20, // Cỡ chữ tiêu đề
    fontWeight: "bold", // Chữ đậm
    marginTop: 20, // Khoảng cách phía trên tiêu đề
  },
});
