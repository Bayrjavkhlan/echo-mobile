import React, { useState, useRef, useEffect } from "react";
import {
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  View,
  Animated,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 60;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.7;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.1;
const SWIPE_OUT_DURATION = 250;

type FlashcardTrainProps = {
  rawGroup: FlashcardGroup | null;
};

export default function FlashcardTrain({ rawGroup }: FlashcardTrainProps) {
  const [group, setGroup] = useState<FlashcardGroup | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const contentBackground = useColor("contentBackground");

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
                      : "Товшоод асуултаа харарай"}
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
    <ThemedView className="flex-1">
      <View style={styles.carouselContainer}>{renderCard()}</View>

      <ThemedView className="flex-row justify-center ">
        {group.flashcards.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              currentIndex === idx ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </ThemedView>

      <View style={styles.navButtons}>
        <TouchableOpacity style={styles.navButton} onPress={handlePrevButton}>
          <ThemedIcon name="arrow-back" size={26} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleNextButton}>
          <ThemedIcon name="arrow-forward" size={26} />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTouchable: {
    flex: 1,
  },
  cardContent: {
    position: "relative",
    borderRadius: 16,
    width: "100%",
    height: "100%",
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    backgroundColor: Colors.light.contentBackground,
  },
  indexIndicator: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(200, 200, 200, 0.3)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.light.tint,
  },
  inactiveDot: {
    backgroundColor: "rgba(200, 200, 200, 0.5)",
  },
  button: {
    marginTop: 20,
    backgroundColor: Colors.light.tint,
    padding: 10,
    borderRadius: 5,
  },
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  navButton: {
    padding: 10,
    backgroundColor: "rgba(200, 200, 200, 0.3)",
    borderRadius: 8,
    width: 100,
    alignItems: "center",
  },
});
