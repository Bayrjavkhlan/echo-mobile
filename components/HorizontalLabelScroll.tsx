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

  // Modal state
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

  // On component mount, fetch labels if needed
  useEffect(() => {
    if (labels.length === 0) {
      console.log("Fetching labels on component mount");
      fetchLabels();
    }
  }, []);

  // For debugging
  console.log("Available labels:", labels);
  console.log("Selected labels:", selectedLabels || internalSelected);

  // Helper function to normalize a label (ensure it has both text and name)
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

    // Check if the label is already selected
    const isAlreadySelected = internalSelected.some(
      (selectedLabel) => String(selectedLabel.id) === String(normalizedLabel.id)
    );

    if (isAlreadySelected) {
      // Remove it from selection
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

    // Update internal state
    setInternalSelected(updatedSelected);

    // Call the callback if provided
    if (onChangeSelectedLabels) {
      onChangeSelectedLabels(updatedSelected);
    }
  };

  // Create a merged labels array that ensures each label has both text and name properties
  const normalizedLabels = labels.map(normalizeLabel);

  // Determine which labels to consider "selected"
  const selectedLabelsToUse = selectedLabels || internalSelected;

  return (
    <ThemedView className={`py-2 ${className || ""}`}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4, gap: 8 }}
      >
        {/* Add Label button */}
        <Label
          data={{ text: "Шошго", icon: "add" }}
          selectable={false}
          className={`mr-2 bg-[${contentBackground}]`}
          onPress={handleOpenModal}
        />

        {/* Display all available labels */}
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
          className={`bg-[${backgroundColor}]`}
          backgroundColor={backgroundColor}
        />
      </CustomModal>
    </ThemedView>
  );
}
