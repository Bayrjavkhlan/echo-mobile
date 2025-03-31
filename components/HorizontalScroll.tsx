import React from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";

const data = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`);

export default function HorizontalScrollView() {
  return (
    <FlatList
      data={data}
      horizontal
      keyExtractor={(item, index) => index.toString()}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <View>
          <Text>test1</Text>
        </View>
      )}
    />
  );
}
