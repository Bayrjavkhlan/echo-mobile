import { ScrollView, View } from "react-native";
import tw from "twrnc";
import Label, { LabelType } from "./ui/Label";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import LabelAdd from "./LabelAdd";

interface HorizontalLabelScrollProps {
  labels: {
    text: string;
    color: string;
    icon?: keyof typeof MaterialIcons.glyphMap;
  }[];
}

export default function HorizontalLabelScroll({
  labels,
}: HorizontalLabelScrollProps) {
  return (
    <ThemedView>
      <ThemedText className="text-2xl">Шошго</ThemedText>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={tw`py-2`}
      >
        <View style={tw`flex-row my-1`}>
          {labels.map((label, index) => (
            <Label
              key={index}
              data={label as LabelType}
              className="mr-2"
              onPress={() => console.log("Label:", label)}
            />
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}
