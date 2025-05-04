import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState, useCallback } from "react";
import { useGroupStore } from "@/store/groupStore";
import Flashcards from "@/components/Flashcards";
import { ScrollView, StyleSheet, Alert } from "react-native";
import { Button } from "@/components/ui/Button";
import ThemedIcon from "@/components/ThemedIcon";
import CustomModal from "@/components/ui/Modal";
import { useColor } from "@/hooks/useThemeColor";
import { Input } from "@/components/ui/Input";
import FlashcardAdd from "@/components/FlashcardAdd";
import HorizontalLabelScroll from "@/components/HorizontalLabelScroll";
import { LabelType } from "@/components/ui/Label";
import { Flashcard } from "@/store/flashcardStore";
import {
  updateFlashcardRecord,
  createFlashcardRecord,
  deleteFlashcardRecord,
} from "@/db/crud/flashcards";
import {
  updateFlashcardLabels,
  addLabelToFlashcard,
  removeAllLabelsFromFlashcard,
} from "@/db/crud/flashcardLabels";
import Toast from "react-native-toast-message";

export default function GroupsOverviewScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const name = params.name as string;
  const { currentGroup, fetchGroupById, fetchGroups } = useGroupStore();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentFlashcard, setCurrentFlashcard] = useState<Flashcard | null>(
    null
  );
  const [activeFlashcardIndex, setActiveFlashcardIndex] = useState(0);
  const [activeFlashcard, setActiveFlashcard] = useState<Flashcard | null>(
    null
  );
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<LabelType[]>([]);
  const [hasError, setHasError] = useState(false);
  const redColor = useColor("red");

  const handleActiveFlashcardChange = (index: number, flashcard: Flashcard) => {
    setActiveFlashcardIndex(index);
    setActiveFlashcard(flashcard);
  };

  const handleOpenModal = (flashcard?: Flashcard) => {
    const cardToEdit = flashcard || activeFlashcard;

    if (cardToEdit) {
      setEditMode(true);
      setCurrentFlashcard(cardToEdit);
      setQuestion(cardToEdit.question);
      setAnswer(cardToEdit.answer);
      setSelectedLabels(cardToEdit.labels || []);
    } else {
      setEditMode(false);
      setCurrentFlashcard(null);
      setQuestion("");
      setAnswer("");
      setSelectedLabels([]);
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setCurrentFlashcard(null);
    setQuestion("");
    setAnswer("");
    setSelectedLabels([]);
    setHasError(false);
  };

  const handleSaveFlashcard = async () => {
    if (!question.trim() || !answer.trim()) {
      setHasError(true);
      return;
    }

    try {
      setLoading(true);

      if (editMode && currentFlashcard) {
        await updateFlashcardRecord(
          Number(currentFlashcard.id),
          question,
          answer
        );

        if (selectedLabels.length > 0) {
          const labelIds = selectedLabels.map((label) => Number(label.id));
          await updateFlashcardLabels(Number(currentFlashcard.id), labelIds);
        } else {
          await updateFlashcardLabels(Number(currentFlashcard.id), []);
        }

        await fetchGroups();
        await fetchGroupById(String(id));
      } else {
        if (!id) return;

        const result = await createFlashcardRecord(
          question,
          answer,
          Number(id)
        );

        if (result && result.lastInsertRowId) {
          const newFlashcardId = Number(result.lastInsertRowId);

          if (selectedLabels.length > 0) {
            const labelIds = selectedLabels.map((label) => Number(label.id));
            await updateFlashcardLabels(newFlashcardId, labelIds);
          }
        }

        await fetchGroups();
        await fetchGroupById(String(id));
      }
    } catch (error) {
      console.error("Error saving flashcard:", error);
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  const handleDeleteFlashcard = async () => {
    if (!activeFlashcard) return;

    Alert.alert("Устгах", "Та энэ флашкартыг устгахдаа итгэлтэй байна уу?", [
      {
        text: "Буцах",
        style: "cancel",
      },
      {
        text: "Устгах",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            const flashcardId = Number(activeFlashcard.id);
            await removeAllLabelsFromFlashcard(flashcardId);
            await deleteFlashcardRecord(flashcardId);
            await fetchGroups();
            await fetchGroupById(String(id));

            Toast.show({
              type: "success",
              text1: "Амжилттай!",
              text2: "Флашкарт амжилттай устгагдлаа.",
              visibilityTime: 3000,
              position: "top",
            });
          } catch (error) {
            console.error("Error deleting flashcard:", error);
            Toast.show({
              type: "error",
              text1: "Алдаа!",
              text2: "Флашкарт устгахад алдаа гарлаа.",
              visibilityTime: 3000,
              position: "top",
            });
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleTrain = useCallback(() => {
    router.push({
      pathname: "/group/[id]/Train",
      params: { id: id, name: name },
    });
  }, [id, name, router]);

  const handleExam = () => {
    console.log("handleExam pressed");
  };

  useEffect(() => {
    const loadGroup = async () => {
      setLoading(true);
      await fetchGroupById(String(id));
      setLoading(false);
    };

    loadGroup();
  }, [id, fetchGroupById]);

  useEffect(() => {
    if (
      currentGroup &&
      currentGroup.flashcards &&
      currentGroup.flashcards.length > 0
    ) {
      setActiveFlashcard(currentGroup.flashcards[0]);
      setActiveFlashcardIndex(0);
    }
  }, [currentGroup]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom", "left", "right"]}>
      <Stack.Screen
        options={{
          title: `Багц: ${name}  ` || "Багцын мэдээлэл",
          headerBackTitle: "Back",
        }}
      />
      <ThemedView className="flex-1">
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <ThemedView style={styles.flashcardsContainer}>
            <Flashcards
              group={currentGroup}
              onActiveIndexChange={handleActiveFlashcardChange}
            />
          </ThemedView>

          <ThemedView className="flex gap-2 px-5 mt-2">
            <Button
              title="Флашкарт нэмэх"
              leftIcon={<ThemedIcon name="add" size={18} />}
              iconSize={24}
              alignRightIcon
              type="outlined"
              size="extra"
              textClass={`text-[18px]`}
              onPress={() => handleOpenModal()}
            />
            <Button
              title="Шалгалт өгөх"
              leftIcon={<ThemedIcon name="quiz" size={18} />}
              iconSize={24}
              alignRightIcon
              type="outlined"
              size="extra"
              textClass={`text-[18px]`}
              onPress={handleExam}
            />
            <Button
              title="Давтах"
              leftIcon={<ThemedIcon name="checklist" size={18} />}
              iconSize={24}
              alignRightIcon
              type="outlined"
              size="extra"
              textClass={`text-[18px]`}
              onPress={handleTrain}
            />
            <Button
              title="Засах"
              leftIcon={<ThemedIcon name="edit" size={18} />}
              iconSize={24}
              alignRightIcon
              type="outlined"
              size="extra"
              textClass={`text-[18px]`}
              onPress={() => {
                if (activeFlashcard) {
                  handleOpenModal(activeFlashcard);
                } else {
                  handleOpenModal();
                }
              }}
            />
            <Button
              title="Устгах"
              leftIcon={<ThemedIcon name="delete" size={18} color={redColor} />}
              iconSize={24}
              type="outlined"
              alignRightIcon
              size="extra"
              textClass={`text-[18px] text-[${redColor}]`}
              color={redColor}
              onPress={handleDeleteFlashcard}
              disabled={!activeFlashcard}
            />
          </ThemedView>
        </ScrollView>
      </ThemedView>
      <CustomModal
        title={editMode ? "Флашкарт засах" : "Флашкарт нэмэх"}
        visible={modalVisible}
        onClose={handleCloseModal}
        okeyButtonText="Хадгалах"
        onOk={handleSaveFlashcard}
        cancelButtonText="Цуцлах"
      >
        <FlashcardAdd
          question={question}
          answer={answer}
          onChangeQuestion={setQuestion}
          onChangeAnswer={setAnswer}
          hasError={hasError}
          labels={selectedLabels}
          onChangeLabels={setSelectedLabels}
        />
      </CustomModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 25,
    paddingTop: 5,
  },
  flashcardsContainer: {
    paddingTop: 0,
    marginTop: 0,
    marginBottom: 5,
  },
});
