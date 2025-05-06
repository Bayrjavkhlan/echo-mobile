import React from "react";
import { View, Text, Dimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import tw from "twrnc";
const { height } = Dimensions.get("window");
const CARD_HEIGHT = 200;
const SPACING = 20;
const FULL_CARD_HEIGHT = CARD_HEIGHT + SPACING;
const cards = ["Card 1", "Card 2", "Card 3", "Card 4", "Card 5"];

const StackCards = () => {
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <Animated.ScrollView
      onScroll={onScroll}
      scrollEventThrottle={16}
      contentContainerStyle={tw`py-10 pb-40`}
    >
      {cards.map((card, index) => {
        return (
          <AnimatedCard
            key={index}
            index={index}
            scrollY={scrollY}
            title={card}
          />
        );
      })}
    </Animated.ScrollView>
  );
};

const AnimatedCard = ({
  index,
  scrollY,
  title,
}: {
  index: number;
  scrollY: Animated.SharedValue<number>;
  title: string;
}) => {
  const inputRange = [
    -1,
    0,
    FULL_CARD_HEIGHT * index,
    FULL_CARD_HEIGHT * (index + 2),
  ];

  const scale = useSharedValue(1);

  scale.value = interpolate(
    scrollY.value,
    inputRange,
    [1, 1, 1, 0.8],
    Extrapolate.CLAMP
  );

  const translateY = useSharedValue(0);
  translateY.value = interpolate(
    scrollY.value,
    inputRange,
    [0, 0, 0, -FULL_CARD_HEIGHT * 0.3],
    Extrapolate.CLAMP
  );

  return (
    <Animated.View
      style={[
        tw`mx-4 rounded-lg bg-white p-5 shadow-lg`,
        {
          height: CARD_HEIGHT,
          marginBottom: SPACING,
          transform: [{ translateY }, { scale }],
        },
      ]}
    >
      <Text style={tw`text-lg `}>{title}</Text>
    </Animated.View>
  );
};

export default StackCards;
