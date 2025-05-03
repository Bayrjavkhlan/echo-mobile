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
import { createLabelTableData, getAllLabelTableData } from "@/db/crud/labels";
import { useLabelStore } from "@/store/labelStore";
import { OuterThemedView } from "./OuterThemedView";

interface HorizontalLabelScrollProps {
  className?: string;
  selectedLabels?: LabelType[];
  onChangeSelectedLabels?: (labels: LabelType[]) => void;
}

export default function HorizontalLabelScroll({
  className,
  selectedLabels,
  onChangeSelectedLabels,
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
  console.log("selectedLabels", selectedLabels);
  useEffect(() => {
    fetchLabels();
  }, []);

  const handleSaveLabel = async () => {
    await addLabel(labelInput);
    setLabelInput("");
    handleCloseModal();
  };
  const contentBackground = useColor("contentBackground");
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
            data={{ text: "Шошго", icon: "add" }}
            selectable={false}
            className={`mr-2 bg-[${contentBackground}]`}
            onPress={handleOpenModal}
          />
          {labels.map((label, index) => (
            <Label
              key={index}
              data={label as LabelType}
              className={`mr-2 bg-[${contentBackground}]`}
              onPress={() => {
                const alreadySelected = selectedLabels?.some(
                  (l) => l.id === label.id
                );
                if (onChangeSelectedLabels) {
                  if (alreadySelected) {
                    onChangeSelectedLabels(
                      (selectedLabels ?? []).filter((l) => l.id !== label.id)
                    );
                  } else {
                    onChangeSelectedLabels([...(selectedLabels ?? []), label]);
                  }
                }
              }}
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
