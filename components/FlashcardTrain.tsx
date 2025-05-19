import React, { useState, useRef, useEffect } from "react";
import {
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  View,
  Animated,
  PanResponder,
  TextInput,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  Platform,
  AppState,
} from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { FlashcardGroup } from "@/store/groupStore";
import { Flashcard } from "@/store/flashcardStore";
import { Colors } from "@/constants/Colors";
import ThemedIcon from "./ThemedIcon";
import { useColor } from "@/hooks/useThemeColor";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "./ui/Button";
import {
  createWrongAnswerTableData,
  deleteWrongAnswerTableData,
} from "@/db/crud/wrongAnswers";
import WrongAnswersList from "./WrongAnswersList";
import Toast from "react-native-toast-message";
import { useAuth } from "@/app/context/AuthContext";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 60;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.7;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.1;
const SWIPE_OUT_DURATION = 250;

type FlashcardTrainProps = {
  rawGroup: FlashcardGroup | null;
};

export default function FlashcardTrain({ rawGroup }: FlashcardTrainProps) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [group, setGroup] = useState<FlashcardGroup | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const contentBackground = useColor("contentBackground");

  // Wrong answer tracking
  const [wrongAnswerText, setWrongAnswerText] = useState("");
  const [showWrongAnswerModal, setShowWrongAnswerModal] = useState(false);
  const [showWrongAnswersList, setShowWrongAnswersList] = useState(false);

  const position = useRef(new Animated.ValueXY()).current;

  const goToNext = () => {
    if (!group?.flashcards) return;

    if (currentIndex < group.flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const goToPrevious = () => {
    if (!group?.flashcards) return;

    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(group.flashcards.length - 1);
    }
  };

  const forceSwipe = (direction: "left" | "right") => {
    if (isAnimating) return;

    setIsAnimating(true);
    const x = direction === "left" ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => {
      if (direction === "left") {
        goToPrevious();
      } else {
        goToNext();
      }

      // Reset position after a brief delay to ensure clean transition
      setTimeout(() => {
        position.setValue({ x: 0, y: 0 });
        setIsAnimating(false);
      }, 100);
    });
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start(() => {
      setIsAnimating(false);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isAnimating,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: 0 });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe("left");
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe("right");
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  // Completely reset position when index changes
  useEffect(() => {
    position.setValue({ x: 0, y: 0 });
    setIsAnimating(false);
  }, [currentIndex]);

  useEffect(() => {
    if (rawGroup && rawGroup.flashcards && rawGroup.flashcards.length > 0) {
      const shuffled = [...rawGroup.flashcards].sort(() => Math.random() - 0.5);
      setGroup({ ...rawGroup, flashcards: shuffled });
      setCurrentIndex(0); // Reset to first card when group changes
      position.setValue({ x: 0, y: 0 });
    }
  }, [rawGroup]);

  // Add this emergency reset function
  const resetCardState = () => {
    position.setValue({ x: 0, y: 0 });
    setIsAnimating(false);
  };

  // Emergency reset if app comes back from background
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        resetCardState();
      }
    });
    return () => subscription.remove();
  }, []);

  // Emergency reset on mount
  useEffect(() => {
    resetCardState();
  }, []);

  if (!group || !group.flashcards || group.flashcards.length === 0) {
    return (
      <ThemedView className="items-center justify-center py-8">
        <ThemedText className="text-lg">Флашкарт хоосон байна</ThemedText>
      </ThemedView>
    );
  }

  const toggleCardFlip = (cardId: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ["30deg", "0deg", "-30deg"],
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }],
    };
  };

  const handleSaveWrongAnswer = async () => {
    if (!wrongAnswerText.trim()) {
      return;
    }

    const currentFlashcard = group.flashcards[currentIndex];

    try {
      await createWrongAnswerTableData({
        flashcardId: parseInt(currentFlashcard.id),
        wrongText: wrongAnswerText.trim(),
        correctText: currentFlashcard.answer,
        userId: user?.id ? parseInt(user.id) : null,
      });

      Toast.show({
        type: "success",
        text1: "Saved",
        text2: "Your answer was recorded",
        visibilityTime: 2000,
      });

      // Clear the input and close the modal
      setWrongAnswerText("");
      setShowWrongAnswerModal(false);
    } catch (error) {
      console.error("Error saving wrong answer:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to save your answer",
        visibilityTime: 3000,
      });
    }
  };

  const handleDeleteWrongAnswer = async (wrongAnswerId: number) => {
    try {
      await deleteWrongAnswerTableData(wrongAnswerId);
      Toast.show({
        type: "success",
        text1: "Deleted",
        text2: "Wrong answer was removed",
        visibilityTime: 2000,
      });
      return true;
    } catch (error) {
      console.error("Error deleting wrong answer:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to delete wrong answer",
        visibilityTime: 3000,
      });
      return false;
    }
  };

  const renderCard = () => {
    const item = group.flashcards[currentIndex];
    const isFlipped = flippedCards[item.id] || false;

    return (
      <View style={styles.cardWrapper}>
        <Animated.View
          style={[getCardStyle(), styles.cardContainer]}
          {...panResponder.panHandlers}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => toggleCardFlip(item.id)}
            style={styles.cardTouchable}
          >
            <ThemedView
              className="rounded-xl p-0 items-center justify-center"
              style={styles.cardContent}
              customBackgroundColor={contentBackground}
            >
              <>
                <ThemedText className="text-xl font-bold mb-4 text-center">
                  {!isFlipped ? "Асуулт" : "Хариулт"}
                </ThemedText>
                <ThemedText className="text-lg text-center">
                  {!isFlipped ? item.question : item.answer}
                </ThemedText>
                <ThemedView
                  className="absolute bottom-4"
                  customBackgroundColor={contentBackground}
                >
                  <ThemedText className="text-sm text-gray-500">
                    {!isFlipped
                      ? "Товшоод хариултаа хараарай"
                      : "Товшоод асуултаа хараарай"}
                  </ThemedText>
                </ThemedView>
              </>

              <View style={styles.indexIndicator}>
                <ThemedText className="text-xs">
                  {currentIndex + 1} / {group.flashcards.length}
                </ThemedText>
              </View>
            </ThemedView>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  // Update the button handlers to make sure they work regardless of animation state
  const handleNextButton = () => {
    // Cancel any ongoing animations
    if (isAnimating) {
      position.stopAnimation();
      // resetCardState();
    }
    goToNext();
  };

  const handlePrevButton = () => {
    // Cancel any ongoing animations
    if (isAnimating) {
      position.stopAnimation();
      // resetCardState();
    }
    goToPrevious();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ThemedView className="flex-1">
        <View style={styles.carouselContainer}>{renderCard()}</View>

        <ThemedView className="flex-row justify-center mb-2">
          {group.flashcards.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    idx === currentIndex ? Colors.gray[500] : Colors.gray[300],
                },
              ]}
            />
          ))}
        </ThemedView>

        <ThemedView className="flex-row justify-around px-4 py-2">
          <TouchableOpacity
            style={styles.navButton}
            onPress={handlePrevButton}
            disabled={isAnimating}
          >
            <ThemedIcon name="chevron-left" size={30} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowWrongAnswerModal(true)}
          >
            <ThemedIcon
              name="error-outline"
              size={26}
              color={theme.colors.error}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowWrongAnswersList(true)}
          >
            <ThemedIcon name="list" size={26} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={handleNextButton}
            disabled={isAnimating}
          >
            <ThemedIcon name="chevron-right" size={30} />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      {/* Wrong Answer Input Modal */}
      <Modal
        visible={showWrongAnswerModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowWrongAnswerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.background },
            ]}
          >
            <ThemedText style={styles.modalTitle}>
              Record Wrong Answer
            </ThemedText>
            <ThemedText style={styles.modalSubtitle}>
              What answer did you think was correct?
            </ThemedText>

            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.colors.cardBackground,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              value={wrongAnswerText}
              onChangeText={setWrongAnswerText}
              placeholder="Enter your answer"
              placeholderTextColor={theme.colors.textSecondary}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: theme.colors.border },
                ]}
                onPress={() => setShowWrongAnswerModal(false)}
              >
                <ThemedText>Cancel</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  {
                    backgroundColor: wrongAnswerText.trim()
                      ? theme.colors.primary
                      : theme.colors.border,
                  },
                ]}
                onPress={handleSaveWrongAnswer}
                disabled={!wrongAnswerText.trim()}
              >
                <ThemedText
                  style={{
                    color: wrongAnswerText.trim()
                      ? theme.colors.background
                      : theme.colors.text,
                  }}
                >
                  Save
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Wrong Answers List Modal */}
      <Modal
        visible={showWrongAnswersList}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowWrongAnswersList(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              styles.listModalContent,
              { backgroundColor: theme.colors.background },
            ]}
          >
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Wrong Answers</ThemedText>
              <TouchableOpacity onPress={() => setShowWrongAnswersList(false)}>
                <ThemedIcon name="close" size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.listScrollView}>
              <WrongAnswersList
                flashcardId={parseInt(group.flashcards[currentIndex].id)}
                onDelete={handleDeleteWrongAnswer}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    // Shadow styles for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // And for Android
    elevation: 2,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: "hidden",
  },
  cardTouchable: {
    flex: 1,
  },
  cardContent: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  navButton: {
    padding: 10,
  },
  actionButton: {
    padding: 10,
  },
  indexIndicator: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalContent: {
    width: "90%",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  listModalContent: {
    height: "80%",
    alignItems: "stretch",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  textInput: {
    width: "100%",
    minHeight: 100,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  listScrollView: {
    flex: 1,
    width: "100%",
  },
});
