import { useEffect, useState } from "react";
import axios from "axios";
import { createContext, useContext } from "react";

interface SentencePatternsItem {
  id: number;
  ing: string;
  tr: string;
  isLearning: boolean;
}

interface AddNewSentencePatternsItem {
  ing: string;
  tr: string;
}

interface SentencePatternsContextType {
  sentences: SentencePatternsItem[];
  SentencePatterns: (next: boolean) => SentencePatternsItem;
  sentencesCount: number;
  AddNewSentencePattern: (data: AddNewSentencePatternsItem) => Promise<void>;
}

const SentencePatternsContext = createContext<SentencePatternsContextType>({
  sentences: [],
  SentencePatterns: () => ({ id: 0, ing: "", tr: "", isLearning: false }),
  sentencesCount: 0,
  AddNewSentencePattern: async () => {},
});

interface SentencePatternsProviderProps {
  children: React.ReactNode;
}

export const useSentencePatternsContext = () => {
  return useContext(SentencePatternsContext);
};

export const SentencePatternsProvider = ({
  children,
}: SentencePatternsProviderProps) => {
  const [sentences, setSentences] = useState<SentencePatternsItem[]>([]);
  const [sentencesCount, setSentencesCount] = useState<number>(0);

  useEffect(() => {
    async function fetchSentences() {
      try {
        const response = await axios.get("/db.json");
        setSentences(response.data.sentences);
        setSentencesCount(response.data.sentences.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchSentences();
  }, []);

  const SentencePatterns = (next: boolean): SentencePatternsItem => {
    if (next) {
      const randomIndex: number = Math.floor(Math.random() * sentences.length);
      return sentences[randomIndex];
    }
    return {
      id: 0,
      ing: "",
      tr: "",
      isLearning: false,
    };
  };

  const AddNewSentencePattern = async (data: AddNewSentencePatternsItem) => {
    if (
      !sentences.some(
        (sentence) => sentence.ing === data.ing && sentence.tr === data.tr
      )
    ) {
      const lastWord: SentencePatternsItem  = sentences.splice(-1)[0];
      const Id: number = parseInt(lastWord.id.toString());

      const newData = {
        id: Id + 1,
        ing: data.ing,
        tr: data.tr,
        isLearning: false,
      };

      try {
        await axios.post("http://localhost:3002/sentences", newData);
        setSentences([...sentences, newData]);
        setSentencesCount(sentencesCount + 1);
      } catch (error) {
        console.error("Error adding new sentence pattern:", error);
      }
    } else {
      console.log("Data already exists:", data);
    }
  };

  const value: SentencePatternsContextType = {
    sentences: sentences,
    SentencePatterns,
    sentencesCount,
    AddNewSentencePattern,
  };

  return (
    <SentencePatternsContext.Provider value={value}>
      {children}
    </SentencePatternsContext.Provider>
  );
};
