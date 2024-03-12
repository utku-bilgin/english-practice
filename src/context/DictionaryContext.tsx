import { useEffect, useState } from "react";
import axios from "axios";
import { createContext, useContext } from "react";

interface DictionaryItem {
  id: number;
  ing: string;
  tr1: string;
  tr2: string;
  tr3: string;
  tr4: string;
  isLearning: boolean;
}

interface NewWordItem {
  ing: string;
  tr1: string;
  tr2: string;
  tr3: string;
  tr4: string;
}

interface UpdateWordItem {
  id: number;
  ing: string;
  tr1: string;
  tr2: string;
  tr3: string;
  tr4: string;
}

interface DictionaryContextType {
  words: DictionaryItem[];
  SearchWords: (search: string, translationType: string) => DictionaryItem[];
  VocabularyWords: (next: boolean) => DictionaryItem;
  wordsCount: number;
  AddNewWord: (data: NewWordItem) => Promise<void>;
  UpdateWord: (data: UpdateWordItem) => Promise<void>;
  DeleteWord: (data: number) => Promise<void>;
}

const DictionaryContext = createContext<DictionaryContextType>({
  words: [],
  SearchWords: () => [],
  VocabularyWords: () => ({
    id: 0,
    ing: "",
    tr1: "",
    tr2: "",
    tr3: "",
    tr4: "",
    isLearning: false,
  }),
  wordsCount: 0,
  AddNewWord: async () => {},
  UpdateWord: async () => {},
  DeleteWord: async () => {},
});

interface DictionaryProviderProps {
  children: React.ReactNode;
}

export const useDictionaryContext = () => {
  return useContext(DictionaryContext);
};

export const DictionaryProvider = ({ children }: DictionaryProviderProps) => {
  const [words, setWords] = useState<DictionaryItem[]>([]);
  const [wordsCount, setWordsCount] = useState<number>(0);
  useEffect(() => {
    async function fetchDictionary() {
      try {
        const response = await axios.get("http://localhost:3002/words");
        setWords(response.data);
        setWordsCount(response.data.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchDictionary();
  }, []);

  const SearchWords = (
    search: string,
    translationType: string
  ): DictionaryItem[] => {
    if (search !== "") {
      const filteredWords = words.filter((word) => {
        if (translationType === "EnglishToTurkish") {
          return word.ing
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase());
        } else if (translationType === "TurkishToEnglish") {
          return (
            word.tr1.toLowerCase().includes(search.toLowerCase()) ||
            word.tr2.toLowerCase().includes(search.toLowerCase()) ||
            word.tr3.toLowerCase().includes(search.toLowerCase()) ||
            word.tr4.toLowerCase().includes(search.toLowerCase())
          );
        }
        return false;
      });
      return filteredWords;
    } else {
      return [];
    }
  };

  const VocabularyWords = (next: boolean): DictionaryItem => {
    if (next) {
      const randomIndex: number = Math.floor(Math.random() * words.length);
      return words[randomIndex];
    }
    return {
      id: 0,
      ing: "",
      tr1: "",
      tr2: "",
      tr3: "",
      tr4: "",
      isLearning: false,
    };
  };

  const AddNewWord = async (data: NewWordItem) => {
    if (
      !words.some(
        (word) => word.ing === data.ing && [word.tr1, word.tr2, word.tr3, word.tr4].includes(data.tr1)
      )
    ) {
      const lastWord: DictionaryItem  = words.splice(-1)[0];
      const Id: number = parseInt(lastWord.id.toString()) + 1;

      const newData = {
        id: Id,
        ing: data.ing,
        tr1: data.tr1,
        tr2: data.tr2,
        tr3: data.tr3,
        tr4: data.tr4,
        isLearning: false,
      };
      
      try {
        console.log(newData);
        await axios.post("http://localhost:3002/words", newData);
        setWords([...words, newData]);
        setWordsCount(wordsCount + 1);
      } catch (error) {
        console.error("Yeni sözcük eklerken hata oluştu:", error);
      }

     
    } else {
      console.log("Veriler zaten mevcut:", data);
    }
};


  const UpdateWord = async (data: UpdateWordItem) => {
    const dataIndex = words.findIndex(word => word.id === data.id);
    if(dataIndex === -1)return

    const updatedWord = {
      id: data.id,
      ing: data.ing,
      tr1: data.tr1,
      tr2: data.tr2,
      tr3: data.tr3,
      tr4: data.tr4,
      isLearning: false,
    };

    await axios.put(`http://localhost:3002/words/${data.id}`, updatedWord);

    setWords(prevWords => {
      const updatedWords = [...prevWords];
      updatedWords[dataIndex] = updatedWord;
      return updatedWords;
    });
  }

  const DeleteWord = async (data: number) => {
    const dataIndex = words.findIndex(word => word.id === data);

    if(dataIndex === -1)return

    await axios.delete(`http://localhost:3002/words/${data}`);

    const deleteWord = [...words];
    deleteWord.splice(dataIndex, 1)
  }

  const value: DictionaryContextType = {
    words: words,
    SearchWords,
    VocabularyWords,
    wordsCount,
    AddNewWord,
    UpdateWord,
    DeleteWord,
  };

  return (
    <DictionaryContext.Provider value={value}>
      {children}
    </DictionaryContext.Provider>
  );
};

