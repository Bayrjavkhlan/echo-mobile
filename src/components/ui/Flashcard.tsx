import { useState, useMemo } from "react";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import {
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Platform,
  View,
} from "react-native";
import { Flashcard as FlashcardType } from "@/store/flashcardStore";
import { useColor } from "@/hooks/useThemeColor";

type FlashcardProps = {
  flashcard: FlashcardType;
  height?: number;
};

export default function Flashcard({ flashcard, height = 250 }: FlashcardProps) {
  // Call all hooks at the top level
  const [isFlipped, setIsFlipped] = useState(false);
  const contentBackground = useColor("contentBackground");
  const shadowColor = useColor("text");
  const isAndroid = Platform.OS === "android";

  // Use useMemo for computed values that depend on props/state
  const dimensions = useMemo(() => {
    const screenWidth = Dimensions.get("window").width;
    const cardWidth = screenWidth * 0.9;
    return { screenWidth, cardWidth };
  }, []);

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={toggleFlip}
      style={styles.container}
    >
      {isAndroid ? (
        <View
          style={[
            styles.cardWrapper,
            {
              height,
              width: dimensions.cardWidth,
              borderRadius: 12,
              backgroundColor: "transparent",
            },
          ]}
        >
          <ThemedView
            className="rounded-xl justify-center items-center"
            style={[
              styles.androidCard,
              {
                height,
                width: dimensions.cardWidth,
                elevation: 8,
                backgroundColor: contentBackground,
              },
            ]}
          >
            <ThemedView style={styles.contentContainer}>
              <ThemedText className="text-center" style={styles.contentText}>
                {!isFlipped ? flashcard.question : flashcard.answer}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </View>
      ) : (
        <ThemedView
          className="rounded-xl justify-center items-center"
          style={[
            styles.card,
            {
              height,
              width: dimensions.cardWidth,
              shadowColor,
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
            },
          ]}
          customBackgroundColor={contentBackground}
        >
          <ThemedView style={styles.contentContainer}>
            <ThemedText className="text-center" style={styles.contentText}>
              {!isFlipped ? flashcard.question : flashcard.answer}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  cardWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    position: "relative",
    borderRadius: 12,
  },
  androidCard: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  contentText: {
    fontSize: 16,
  },
});
