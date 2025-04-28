import { StyleSheet, Text, View } from "react-native";

export default function LabelModal() {
  return (
    <View style={styles.container}>
      <Text>Modal screen</Text>
      // Todo: Label add screen 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
