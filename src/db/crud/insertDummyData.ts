import { createGroupRecord, getAllGroupTableData } from "./group";
import { createLabelTableData, getAllLabelTableData } from "./labels";
import { createManyFlashcards, getAllFlashcardTableData } from "./flashcards";
import {
  addLabelToFlashcard,
  getAllFlashcardLabelsTableData,
} from "./flashcardLabels";
import { saveCalendarData, getAllCalendarTableData } from "./calendar";
import {
  createWrongAnswerTableData,
  getAllWrongAnswerTableData,
} from "./wrongAnswers";

export async function insertDummyData() {
  // 1. Insert a group
  const groupName = "Ахьсан түвшний англи хэл";
  const groupDescription = "This is a dummy group for testing.";
  await createGroupRecord(groupName, groupDescription, 0);
  const groups = (await getAllGroupTableData()) || [];
  const groupId = groups[0]?.id || 1;

  // 2. Insert a label
  const labelName = "Dummy Label";
  await createLabelTableData(labelName);
  const labels = (await getAllLabelTableData()) || [];
  const labelId = labels[0]?.id || 1;

  // 3. Insert flashcards
  const flashcards = [
    { question: "What is 2+2?", answer: "4", groupId },
    { question: "What is the capital of France?", answer: "Paris", groupId },
  ];
  await createManyFlashcards(flashcards);
  const allFlashcards = (await getAllFlashcardTableData()) || [];
  const flashcardId1 = allFlashcards[0]?.id || 1;
  const flashcardId2 = allFlashcards[1]?.id || 2;

  // 4. Add label to flashcards
  await addLabelToFlashcard(flashcardId1, labelId);
  await addLabelToFlashcard(flashcardId2, labelId);

  // 5. Insert calendar data
  const today = new Date();
  const dateStr = today.toISOString().split("T")[0];
  await saveCalendarData({
    userId: 0,
    date: dateStr,
    minutesSpent: 10,
    wordsMemorized: 2,
    appOpened: true,
    isSync: 0,
  });

  // 6. Insert wrong answers
  await createWrongAnswerTableData({
    flashcardId: flashcardId1,
    wrongText: "5",
    correctText: "4",
    userId: 0,
    isSync: 0,
  });
  await createWrongAnswerTableData({
    flashcardId: flashcardId2,
    wrongText: "London",
    correctText: "Paris",
    userId: 0,
    isSync: 0,
  });

  // Optionally, return inserted data for debugging
  return {
    groups: await getAllGroupTableData(),
    labels: await getAllLabelTableData(),
    flashcards: await getAllFlashcardTableData(),
    flashcardLabels: await getAllFlashcardLabelsTableData(),
    calendar: await getAllCalendarTableData(),
    wrongAnswers: await getAllWrongAnswerTableData(),
  };
}
