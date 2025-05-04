import { useState, useRef, useCallback, useEffect } from "react";
import { FlashcardGroup } from "@/store/groupStore";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import Flashcard from "./ui/Flashcard";
import {
  FlatList,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Flashcard as FlashcardType } from "@/store/flashcardStore";
import { useColor } from "@/hooks/useThemeColor";
import ThemedIcon from "./ThemedIcon";

type FlashcardsProps = {
  group: FlashcardGroup | null;
  onActiveIndexChange?: (index: number, flashcard: FlashcardType) => void;
};

export default function Flashcards({
  group,
  onActiveIndexChange,
}: FlashcardsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const viewConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 50,
    minimumViewTime: 300,
  });
  const iconColor = useColor("tint");

  useEffect(() => {
    if (
      group &&
      group.flashcards &&
      group.flashcards.length > activeIndex &&
      onActiveIndexChange
    ) {
      onActiveIndexChange(activeIndex, group.flashcards[activeIndex]);
    }
  }, [activeIndex, group, onActiveIndexChange]);

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const width = Dimensions.get("window").width;
      const index = Math.round(contentOffsetX / width);
      setActiveIndex(index);
    },
    []
  );

  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig: viewConfigRef.current,
      onViewableItemsChanged: ({ viewableItems }: any) => {
        if (viewableItems && viewableItems.length > 0) {
          setActiveIndex(viewableItems[0].index);
        }
      },
    },
  ]);

  const goToNextCard = () => {
    if (!group || !group.flashcards) return;

    const nextIndex = Math.min(activeIndex + 1, group.flashcards.length - 1);
    flatListRef.current?.scrollToIndex({
      index: nextIndex,
      animated: true,
    });
    setActiveIndex(nextIndex);
  };

  const goToPrevCard = () => {
    const prevIndex = Math.max(activeIndex - 1, 0);
    flatListRef.current?.scrollToIndex({
      index: prevIndex,
      animated: true,
    });
    setActiveIndex(prevIndex);
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: FlashcardType;
    index: number;
  }) => (
    <View style={styles.flashcardContainer}>
      <Flashcard flashcard={item} height={220} />
    </View>
  );

  if (!group || !group.flashcards || group.flashcards.length === 0) {
    return (
      <ThemedView className="py-2 px-4">
        <ThemedText className="text-center text-lg">
          Уг багцад флашкарт алга байна.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="w-full" style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={group.flashcards}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        contentContainerStyle={styles.listContent}
      />

      <ThemedView className="flex-row justify-between items-center px-10 py-2">
        <TouchableOpacity
          onPress={goToPrevCard}
          disabled={activeIndex === 0}
          style={[
            styles.navButton,
            activeIndex === 0 ? styles.navButtonDisabled : null,
          ]}
        >
          <ThemedIcon name="arrow-back" size={22} />
        </TouchableOpacity>

        <ThemedText className="text-lg">
          {activeIndex + 1} / {group.flashcards.length}
        </ThemedText>

        <TouchableOpacity
          onPress={goToNextCard}
          disabled={activeIndex === group.flashcards.length - 1}
          style={[
            styles.navButton,
            activeIndex === group.flashcards.length - 1
              ? styles.navButtonDisabled
              : null,
          ]}
        >
          <ThemedIcon name="arrow-forward" size={22} />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 0,
    marginBottom: 0,
  },
  listContent: {
    paddingVertical: 0,
  },
  flashcardContainer: {
    position: "relative",
    width: Dimensions.get("window").width,
    height: 250,
    marginVertical: 0,
    paddingVertical: 0,
  },
  navButton: {
    padding: 10,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
});
