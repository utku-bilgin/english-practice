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

interface UpdateSentencePatternsItem {
  id: number;
  ing: string;
  tr: string;
}

interface SentencePatternsContextType {
  sentences: SentencePatternsItem[];
  SearchSentences: (search: string) => SentencePatternsItem[];
  SentencePatterns: (next: boolean) => SentencePatternsItem;
  sentencesCount: number;
  AddNewSentencePattern: (data: AddNewSentencePatternsItem) => Promise<void>;
  UpdateSentence: (data: UpdateSentencePatternsItem) => Promise<void>;
  DeleteSentence: (data: number) => Promise<void>;
}

const SentencePatternsContext = createContext<SentencePatternsContextType>({
  sentences: [],
  SearchSentences: () => [],
  SentencePatterns: () => ({ id: 0, ing: "", tr: "", isLearning: false }),
  sentencesCount: 0,
  AddNewSentencePattern: async () => {},
  UpdateSentence: async () => {},
  DeleteSentence: async () => {},
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
        const response = await axios.get("http://localhost:3002/sentences");
        setSentences(response.data);
        setSentencesCount(response.data.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchSentences();
  }, []);

  const SearchSentences = (search: string): SentencePatternsItem[] => {
    if (search !== "") {
      const filteredSentences = sentences.filter((sentence) => {
        return sentence.ing.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
          sentence.tr.toLocaleLowerCase().includes(search.toLocaleLowerCase());
      });
      return filteredSentences;
    } else {
      return [];
    }
};


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
      const lastWord: SentencePatternsItem = sentences.splice(-1)[0];
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

  const UpdateSentence = async (data: UpdateSentencePatternsItem) => {
    const dataIndex = sentences.findIndex(sentence => sentence.id === data.id);
    if(dataIndex === -1)return

    const updateSentence = {
      id: data.id,
      ing: data.ing,
      tr: data.tr,
      isLearning: false,
    }

    await axios.put(`http://localhost:3002/sentences/${data.id}`, updateSentence);

    setSentences(prevSentences => {
      const updateSentences = [...prevSentences];
      updateSentences[dataIndex] = updateSentence;
      return updateSentences
    })
  }

  const DeleteSentence = async (data: number) => {
    const dataIndex = sentences.findIndex(sentence => sentence.id === data);

    if(dataIndex === -1)return

    await axios.delete(`http://localhost:3002/sentences/${data}`);

    const deleteSentence = [...sentences]
    deleteSentence.splice(dataIndex, 1)
  }

  const value: SentencePatternsContextType = {
    sentences: sentences,
    SearchSentences,
    SentencePatterns,
    sentencesCount,
    AddNewSentencePattern,
    UpdateSentence,
    DeleteSentence,
  };

  return (
    <SentencePatternsContext.Provider value={value}>
      {children}
    </SentencePatternsContext.Provider>
  );
};

