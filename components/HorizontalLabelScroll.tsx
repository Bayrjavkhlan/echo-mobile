import { ScrollView, View } from "react-native";
import tw from "twrnc";
import Label, { LabelType } from "./ui/Label";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import LabelAdd from "./LabelAdd";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import CustomModal from "./ui/Modal";
import { Input } from "./ui/Input";
import { useColor } from "@/hooks/useThemeColor";
import { createLabelTableData, getAllLabelTableData } from "@/db/crud/labels";
import { useLabelStore } from "@/store/labelStore";
import { OuterThemedView } from "./OuterThemedView";

type HorizontalLabelScrollProps = {
  onChangeSelectedLabels?: (labels: LabelType[]) => void;
  selectedLabels?: LabelType[];
  className?: string;
};

export default function HorizontalLabelScroll({
  onChangeSelectedLabels,
  selectedLabels,
  className,
}: HorizontalLabelScrollProps) {
  const { labels, fetchLabels, addLabel } = useLabelStore();
  const [internalSelected, setInternalSelected] = useState<LabelType[]>(
    selectedLabels || []
  );
  const contentBackground = useColor("contentBackground");
  const backgroundColor = useColor("modalBackground");

  const [modalVisible, setModalVisible] = useState(false);
  const [labelInput, setLabelInput] = useState("");

  const handleOpenModal = () => setModalVisible(true);
  const handleCloseModal = () => setModalVisible(false);

  const handleSaveLabel = async () => {
    if (labelInput.trim()) {
      console.log("Saving new label:", labelInput);
      await addLabel(labelInput);
      setLabelInput("");
      handleCloseModal();
    }
  };

  useEffect(() => {
    if (labels.length === 0) {
      console.log("Fetching labels on component mount");
      fetchLabels();
    }
  }, []);

  const normalizeLabel = (label: LabelType): LabelType => {
    const id = String(label.id);
    const text = label.text || label.name || "Unknown";
    const name = label.name || label.text || "Unknown";

    return {
      id,
      text,
      name,
      ...label,
    };
  };

  const handleLabelPress = (label: LabelType) => {
    let updatedSelected: LabelType[];
    const normalizedLabel = normalizeLabel(label);

    const isAlreadySelected = internalSelected.some(
      (selectedLabel) => String(selectedLabel.id) === String(normalizedLabel.id)
    );

    if (isAlreadySelected) {
      updatedSelected = internalSelected.filter(
        (selectedLabel) =>
          String(selectedLabel.id) !== String(normalizedLabel.id)
      );
      console.log(
        `Removed label ${normalizedLabel.id} (${normalizedLabel.text}) from selection`
      );
    } else {
      // Add it to selection
      updatedSelected = [...internalSelected, normalizedLabel];
      console.log(
        `Added label ${normalizedLabel.id} (${normalizedLabel.text}) to selection`
      );
    }

    setInternalSelected(updatedSelected);

    if (onChangeSelectedLabels) {
      onChangeSelectedLabels(updatedSelected);
    }
  };

  const normalizedLabels = labels.map(normalizeLabel);

  const selectedLabelsToUse = selectedLabels || internalSelected;

  return (
    <ThemedView className={`py-2 ${className || ""}`}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        <Label
          data={{ text: "Шошго", icon: "add" }}
          selectable={false}
          className={` bg-[${contentBackground}]`}
          onPress={handleOpenModal}
        />
        {normalizedLabels.map((label) => {
          const isSelected = selectedLabelsToUse.some(
            (selectedLabel) => String(selectedLabel.id) === String(label.id)
          );

          return (
            <Label
              key={String(label.id)}
              data={label}
              selected={isSelected}
              onPress={() => handleLabelPress(label)}
            />
          );
        })}
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
          backgroundColor={backgroundColor}
          className="mb-0"
        />
      </CustomModal>
    </ThemedView>
  );
}
