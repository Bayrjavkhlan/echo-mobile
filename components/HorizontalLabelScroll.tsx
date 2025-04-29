import { ScrollView, View } from "react-native";
import tw from "twrnc";
import Label, { LabelType } from "./ui/Label";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import LabelAdd from "./LabelAdd";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import CustomModal from "./ui/Modal";
import { Input } from "./ui/Input";
import { useColor } from "@/hooks/useThemeColor";
import {
  createLabelTableData,
  getAllLabelTableData,
} from "@/app/db/crud/labels";
import { useLabelStore } from "@/store/labelStore";

interface HorizontalLabelScrollProps {
  className?: string;
}

const labelColors = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "rose",
];

export default function HorizontalLabelScroll({
  className,
}: HorizontalLabelScrollProps) {
  // const [labels, setLabels] = useState<LabelType[]>([]);

  const labels = useLabelStore((state) => state.labels);
  const fetchLabels = useLabelStore((state) => state.fetchLabels);
  const addLabel = useLabelStore((state) => state.addLabel);

  const [modalVisible, setModalVisible] = useState(false);
  const handleOpenModal = () => setModalVisible(true);
  const handleCloseModal = () => setModalVisible(false);
  const backgroundColor = useColor("modalBackground");
  const [labelInput, setLabelInput] = useState("");

  useEffect(() => {
    fetchLabels();
  }, []);

  const handleSaveLabel = async () => {
    await addLabel(labelInput);
    setLabelInput("");
    handleCloseModal();
  };
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
            onPress={handleOpenModal}
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
      <CustomModal
        title="Шошго нэмэх"
        visible={modalVisible}
        onClose={handleCloseModal}
        okeyButtonText="Хадгалах"
        onOk={handleSaveLabel}
        cancelButtonText="Цуцлах"
      >
        <Input
          title="Шошго нэмэх"
          value={labelInput}
          onChangeText={setLabelInput}
          className={`bg-[${backgroundColor}]`}
          backgroundColor={backgroundColor}
        />
      </CustomModal>
    </ThemedView>
  );
}
