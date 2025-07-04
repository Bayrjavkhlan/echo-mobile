import axios from "axios";
import { API_URL } from "../../config";

export interface Flashcard {
  id: number;
  group_id: number;
  question_type: string;
  answer: string;
  label: string;
  description: string;
}

export interface CreateFlashcardDPO {
  group_id: number;
  question_type: string;
  question: string;
  answer: string;
  label: string;
  description: string;
  label_ids: number[];
}

export interface UpdateFlashcardDPO {
  question_type: string;
  question: string;
  answer: string;
  label: string;
  description: string;
  label_ids: number[];
}

export interface FlashcardResponse {
  id: number;
  group_id: number;
}

export const flashcardApi = {
  getAllFlashcards: async (skip: number, limit: number) => {
    try {
      console.log("test");
      console.log("API URL:", API_URL);
      const response = await axios.get(`${API_URL}/flashcards`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log("Error fetching flashcards123:", error);
      throw error;
    }
  },
  getFlashcardById: async (id: number): Promise<Flashcard[]> => {
    try {
      const response = await axios.get(`${API_URL}/flashcards/${id}`);
      return response.data;
    } catch (error) {
      console.log("Error fetching flashcard by id:", error);
      throw error;
    }
  },
  getGroupFlashcards: async (group_id: number): Promise<Flashcard[]> => {
    try {
      const response = await axios.get(
        `${API_URL}/groups/${group_id}/flashcards`
      );
      return response.data;
    } catch (error) {
      console.log("Error fetching group flashcards:", error);
      throw error;
    }
  },
  createFlashcard: async (
    flashcard: CreateFlashcardDPO
  ): Promise<Flashcard> => {
    try {
      const response = await axios.post(`${API_URL}/flashcards`, flashcard);
      return response.data;
    } catch (error) {
      console.log("Error creating flashcard:", error);
      throw error;
    }
  },
  updateFlashcard: async (
    id: number,
    flashcard: UpdateFlashcardDPO
  ): Promise<Flashcard> => {
    try {
      const response = await axios.put(
        `${API_URL}/flashcards/${id}`,
        flashcard
      );
      return response.data;
    } catch (error) {
      console.log("Error updating flashcard:", error);
      throw error;
    }
  },
  deleteFlashcard: async (id: number): Promise<void> => {
    try {
      const response = await axios.delete(`${API_URL}/flashcards/${id}`);
      return response.data;
    } catch (error) {
      console.log("Error deleting flashcard:", error);
      throw error;
    }
  },
};
