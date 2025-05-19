import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { getWrongAnswerTableDataByFlashcardId } from "@/db/crud/wrongAnswers";
import { ThemedIcon } from "./ThemedIcon";

interface WrongAnswersListProps {
  flashcardId: number;
  onDelete?: (wrongAnswerId: number) => Promise<void>;
}

interface WrongAnswer {
  id: number;
  flashcardId: number;
  wrongText: string;
  correctText: string;
  createdAt: number;
}

const WrongAnswersList: React.FC<WrongAnswersListProps> = ({
  flashcardId,
  onDelete,
}) => {
  const { theme } = useTheme();
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWrongAnswers();
  }, [flashcardId]);

  const loadWrongAnswers = async () => {
    setLoading(true);
    try {
      const answers = await getWrongAnswerTableDataByFlashcardId(flashcardId);
      if (answers) {
        setWrongAnswers(answers as WrongAnswer[]);
      } else {
        setWrongAnswers([]);
      }
    } catch (error) {
      console.error("Error loading wrong answers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (wrongAnswerId: number) => {
    if (onDelete) {
      await onDelete(wrongAnswerId);
      // Refresh the list
      loadWrongAnswers();
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text
          style={[styles.loadingText, { color: theme.colors.textSecondary }]}
        >
          Loading wrong answers...
        </Text>
      </View>
    );
  }

  if (wrongAnswers.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
          No wrong answers found for this flashcard.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Previous Wrong Answers
      </Text>
      <ScrollView style={styles.scrollContainer}>
        {wrongAnswers.map((answer) => (
          <View
            key={answer.id}
            style={[
              styles.answerItem,
              {
                backgroundColor: theme.colors.cardBackground,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <View style={styles.answerContent}>
              <View style={styles.answerHeader}>
                <Text
                  style={[
                    styles.dateText,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {formatDate(answer.createdAt)}
                </Text>
                {onDelete && (
                  <TouchableOpacity
                    onPress={() => handleDelete(answer.id)}
                    style={styles.deleteButton}
                  >
                    <ThemedIcon
                      name="delete-outline"
                      size={16}
                      color={theme.colors.error}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.answerBody}>
                <View style={styles.textRow}>
                  <Text
                    style={[styles.labelText, { color: theme.colors.error }]}
                  >
                    Wrong:
                  </Text>
                  <Text
                    style={[styles.answerText, { color: theme.colors.text }]}
                  >
                    {answer.wrongText}
                  </Text>
                </View>
                <View style={styles.textRow}>
                  <Text
                    style={[styles.labelText, { color: theme.colors.success }]}
                  >
                    Correct:
                  </Text>
                  <Text
                    style={[styles.answerText, { color: theme.colors.text }]}
                  >
                    {answer.correctText}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  scrollContainer: {
    maxHeight: 300,
  },
  answerItem: {
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    overflow: "hidden",
  },
  answerContent: {
    padding: 12,
  },
  answerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dateText: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 4,
  },
  answerBody: {
    gap: 8,
  },
  textRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  labelText: {
    fontWeight: "bold",
    width: 60,
    fontSize: 14,
  },
  answerText: {
    flex: 1,
    fontSize: 14,
  },
  loadingText: {
    textAlign: "center",
    padding: 16,
  },
  emptyText: {
    textAlign: "center",
    padding: 16,
  },
});

export default WrongAnswersList;
