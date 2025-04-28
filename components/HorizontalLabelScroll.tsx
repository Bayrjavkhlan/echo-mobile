import { ScrollView, View } from "react-native";
import tw from "twrnc";
import Label, { LabelType } from "./ui/Label";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import LabelAdd from "./LabelAdd";
import { useRouter } from "expo-router";

interface HorizontalLabelScrollProps {
  // labels?: {
  //   text: string;
  //   color: string;
  //   icon?: keyof typeof MaterialIcons.glyphMap;
  // }[];
  className?: string;
}

const labels: {
  text: string;
  color: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
}[] = [
  // { text: "Шошго", color: "slate", icon: "add" },
  { text: "Нэр үг", color: "red" },
  { text: "Үйл үг", color: "orange" },
  { text: "Тоо", color: "amber" },
  { text: "Label 4", color: "yellow" },
  { text: "Label 5", color: "lime" },
  { text: "Label 6", color: "green" },
  { text: "Label 7", color: "emerald" },
  { text: "Label 8", color: "teal" },
  { text: "Label 9", color: "cyan" },
  { text: "Label 10", color: "sky" },
  { text: "Label 11", color: "blue" },
  { text: "Label 12", color: "indigo" },
  { text: "Label 13", color: "violet" },
  { text: "Label 14", color: "purple" },
  { text: "Label 15", color: "rose" },
];

export default function HorizontalLabelScroll({
  className,
}: HorizontalLabelScrollProps) {
  const router = useRouter();
  return (
    <ThemedView>
      {/* <ThemedText className="text-2xl">Шошго</ThemedText> */}
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={tw`py-2 ${className ?? ""}`}
      >
        <View style={tw`flex-row my-1`}>
          <Label
            data={{ text: "Шошго", color: "slate", icon: "add" }}
            selectable={false}
            className="mr-2"
            onPress={() => router.push("/labelModal")}
          />
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
