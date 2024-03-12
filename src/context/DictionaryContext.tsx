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
        // const response = await axios.get("/db.json");
        setWords(wordsData);
        setWordsCount(wordsData.length);
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


const wordsData: DictionaryItem[] = [
    {
      "id": 1,
      "ing": "a",
      "tr1": "bir",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 2,
      "ing": "ability",
      "tr1": "kabiliyet",
      "tr2": "yetenek",
      "tr3": "beceri",
      "tr4": "hüner",
      "isLearning": false
    },
    {
      "id": 3,
      "ing": "able",
      "tr1": "yapabilmek",
      "tr2": "yapabilen",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 4,
      "ing": "about",
      "tr1": "hakkında",
      "tr2": "ilgili",
      "tr3": "konusunda",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 5,
      "ing": "above",
      "tr1": "yukarıda",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 6,
      "ing": "accept",
      "tr1": "kabul etmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 7,
      "ing": "according",
      "tr1": "göre",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 8,
      "ing": "account",
      "tr1": "hesap",
      "tr2": "açıklama",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 9,
      "ing": "across",
      "tr1": "karşısında",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 10,
      "ing": "act",
      "tr1": "eylem",
      "tr2": "davranış",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 11,
      "ing": "action",
      "tr1": "eylem",
      "tr2": "etki",
      "tr3": "hareket",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 12,
      "ing": "activity",
      "tr1": "faaliyet",
      "tr2": "etkinlik",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 13,
      "ing": "actually",
      "tr1": "aslında",
      "tr2": "gerçekte",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 14,
      "ing": "add",
      "tr1": "eklemek",
      "tr2": "ilave etmek",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 15,
      "ing": "address",
      "tr1": "adres",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 16,
      "ing": "administration",
      "tr1": "yönetim",
      "tr2": "idare",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 17,
      "ing": "admit",
      "tr1": "kabul etmek",
      "tr2": "itiraf etmek",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 18,
      "ing": "adult",
      "tr1": "yetişkin",
      "tr2": "erişkin",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 19,
      "ing": "affect",
      "tr1": "etkilemek",
      "tr2": "etki etmek",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 20,
      "ing": "after",
      "tr1": "sonra",
      "tr2": "ardından",
      "tr3": "daha sonra",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 21,
      "ing": "afternoon",
      "tr1": "öğleden sonra",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 22,
      "ing": "afterwards",
      "tr1": "ondan sonra",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 23,
      "ing": "again",
      "tr1": "tekrar",
      "tr2": "yeniden",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 24,
      "ing": "against",
      "tr1": "karşı",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 25,
      "ing": "age",
      "tr1": "yaş",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 26,
      "ing": "agency",
      "tr1": "ajans",
      "tr2": "acenta",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 27,
      "ing": "agent",
      "tr1": "ajan",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 28,
      "ing": "ago",
      "tr1": "önce",
      "tr2": "evvel",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 29,
      "ing": "agree",
      "tr1": "katılmak",
      "tr2": "hem fikir olmak",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 30,
      "ing": "agreement",
      "tr1": "anlaşma",
      "tr2": "sözleşme",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 31,
      "ing": "ahead",
      "tr1": "önde",
      "tr2": "ileri",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 32,
      "ing": "air",
      "tr1": "hava",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 33,
      "ing": "all",
      "tr1": "her şey",
      "tr2": "tüm",
      "tr3": "bütün",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 34,
      "ing": "all right",
      "tr1": "peki",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 35,
      "ing": "allow",
      "tr1": "izin vermek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 36,
      "ing": "almost",
      "tr1": "neredeyse",
      "tr2": "hemen hemen",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 37,
      "ing": "alone",
      "tr1": "yalnız",
      "tr2": "tek başına",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 38,
      "ing": "along",
      "tr1": "boyunca",
      "tr2": "yanı sıra",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 39,
      "ing": "already",
      "tr1": "zaten",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 40,
      "ing": "also",
      "tr1": "ayrıca",
      "tr2": "hem de",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 41,
      "ing": "although",
      "tr1": "rağmen",
      "tr2": "karşın",
      "tr3": "gerçi",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 42,
      "ing": "always",
      "tr1": "her zaman",
      "tr2": "daima",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 43,
      "ing": "american",
      "tr1": "amerikan",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 44,
      "ing": "among",
      "tr1": "arasında",
      "tr2": "içinde",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 45,
      "ing": "amount",
      "tr1": "miktar",
      "tr2": "tutar",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 46,
      "ing": "analysis",
      "tr1": "analiz",
      "tr2": "çözümleme",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 47,
      "ing": "and",
      "tr1": "ve",
      "tr2": "ile",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 48,
      "ing": "animal",
      "tr1": "hayvan",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 49,
      "ing": "another",
      "tr1": "diğeri",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 50,
      "ing": "answer",
      "tr1": "cevap",
      "tr2": "yanıt",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 51,
      "ing": "any",
      "tr1": "herhangi",
      "tr2": "hiç",
      "tr3": "her",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 52,
      "ing": "anyone",
      "tr1": "kimse",
      "tr2": "herhangi biri",
      "tr3": "hiç kimse",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 53,
      "ing": "anything",
      "tr1": "bir şeyi",
      "tr2": "herhangi bir şey",
      "tr3": "hiçbir şey",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 54,
      "ing": "anyway",
      "tr1": "her halükârda",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 55,
      "ing": "anywhere",
      "tr1": "herhangi bir yere",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 56,
      "ing": "appear",
      "tr1": "görünmek",
      "tr2": "gözükmek",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 57,
      "ing": "apple",
      "tr1": "elma",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 58,
      "ing": "apply",
      "tr1": "uygulamak",
      "tr2": "başvurmak",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 59,
      "ing": "approach",
      "tr1": "yaklaşım",
      "tr2": "yaklaşma",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 60,
      "ing": "april",
      "tr1": "nisan",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 61,
      "ing": "area",
      "tr1": "alan",
      "tr2": "bölge",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 62,
      "ing": "argue",
      "tr1": "tartışmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 63,
      "ing": "arm",
      "tr1": "kol",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 64,
      "ing": "around",
      "tr1": "etrafında",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 65,
      "ing": "arrive",
      "tr1": "varmak",
      "tr2": "ulaşmak",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 66,
      "ing": "art",
      "tr1": "sanat",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 67,
      "ing": "article",
      "tr1": "makale",
      "tr2": "yazı",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 68,
      "ing": "artist",
      "tr1": "sanatçı",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 69,
      "ing": "as",
      "tr1": "gibi",
      "tr2": "olarak",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 70,
      "ing": "ask",
      "tr1": "sormak",
      "tr2": "istemek",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 71,
      "ing": "assume",
      "tr1": "varsaymak",
      "tr2": "farzetmek",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 72,
      "ing": "attack",
      "tr1": "saldırı",
      "tr2": "atak",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 73,
      "ing": "attention",
      "tr1": "dikkat",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 74,
      "ing": "attorney",
      "tr1": "avukat",
      "tr2": "vekil",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 75,
      "ing": "audience",
      "tr1": "seyirci",
      "tr2": "izleyici",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 76,
      "ing": "author",
      "tr1": "yazar",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 77,
      "ing": "authority",
      "tr1": "yetki",
      "tr2": "otorite",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 78,
      "ing": "available",
      "tr1": "müsait",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 79,
      "ing": "avoid",
      "tr1": "önlemek",
      "tr2": "kaçınmak",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 80,
      "ing": "away",
      "tr1": "uzak",
      "tr2": "uzakta",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 81,
      "ing": "baby",
      "tr1": "bebek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 82,
      "ing": "back",
      "tr1": "geri",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 83,
      "ing": "bad",
      "tr1": "kötü",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 84,
      "ing": "bag",
      "tr1": "çanta",
      "tr2": "torba",
      "tr3": "poşet",
      "tr4": "kese",
      "isLearning": false
    },
    {
      "id": 85,
      "ing": "ball",
      "tr1": "top",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 86,
      "ing": "bank",
      "tr1": "banka",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 87,
      "ing": "bar",
      "tr1": "bar",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 88,
      "ing": "base",
      "tr1": "üs",
      "tr2": "temel",
      "tr3": "baz",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 89,
      "ing": "be",
      "tr1": "olmak",
      "tr2": "var olmak",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 90,
      "ing": "beat",
      "tr1": "dövmek",
      "tr2": "yenmek",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 91,
      "ing": "beautiful",
      "tr1": "güzel",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 92,
      "ing": "because",
      "tr1": "çünkü",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 93,
      "ing": "become",
      "tr1": "olmak",
      "tr2": "haline gelmek",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 94,
      "ing": "bed",
      "tr1": "yatak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 95,
      "ing": "before",
      "tr1": "önce",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 96,
      "ing": "begin",
      "tr1": "başlamak",
      "tr2": "başlatmak",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 97,
      "ing": "behavior",
      "tr1": "davranış",
      "tr2": "tutum",
      "tr3": "hareket",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 98,
      "ing": "behind",
      "tr1": "arkasında",
      "tr2": "gerisinde",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 99,
      "ing": "believe",
      "tr1": "inanmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 100,
      "ing": "benefit",
      "tr1": "yarar",
      "tr2": "fayda",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 101,
      "ing": "best",
      "tr1": "en iyi",
      "tr2": "en iyisi",
      "tr3": "en",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 102,
      "ing": "better",
      "tr1": "daha iyi",
      "tr2": "daha güzel",
      "tr3": "daha iyi şekilde",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 103,
      "ing": "between",
      "tr1": "arasında",
      "tr2": "aralarında",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 104,
      "ing": "beyond",
      "tr1": "ötesinde",
      "tr2": "öte",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 105,
      "ing": "big",
      "tr1": "büyük",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 106,
      "ing": "bill",
      "tr1": "fatura",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 107,
      "ing": "billion",
      "tr1": "milyar",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 108,
      "ing": "black",
      "tr1": "siyah",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 109,
      "ing": "blood",
      "tr1": "kan",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 110,
      "ing": "blue",
      "tr1": "mavi",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 111,
      "ing": "board",
      "tr1": "yazı tahtası",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 112,
      "ing": "body",
      "tr1": "vücut",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 113,
      "ing": "book",
      "tr1": "kitap",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 114,
      "ing": "born",
      "tr1": "doğmuş",
      "tr2": "doğum",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 115,
      "ing": "both",
      "tr1": "her ikisi de",
      "tr2": "ikisi de",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 116,
      "ing": "box",
      "tr1": "kutu",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 117,
      "ing": "boy",
      "tr1": "erkek çocuk",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 118,
      "ing": "break",
      "tr1": "kırmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 119,
      "ing": "bring",
      "tr1": "getirmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 120,
      "ing": "brother",
      "tr1": "erkek kardeş",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 121,
      "ing": "budget",
      "tr1": "bütçe",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 122,
      "ing": "build",
      "tr1": "inşa etmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 123,
      "ing": "building",
      "tr1": "bina",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 124,
      "ing": "business",
      "tr1": "iş",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 125,
      "ing": "but",
      "tr1": "fakat",
      "tr2": "ama",
      "tr3": "lakin",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 126,
      "ing": "buy",
      "tr1": "satın almak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 127,
      "ing": "by",
      "tr1": "tarafından",
      "tr2": "ile",
      "tr3": "göre",
      "tr4": "vasıtasıyla",
      "isLearning": false
    },
    {
      "id": 128,
      "ing": "call",
      "tr1": "aramak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 129,
      "ing": "camera",
      "tr1": "kamera",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 130,
      "ing": "campaign",
      "tr1": "kampanya",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 131,
      "ing": "can",
      "tr1": "yapabilmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 132,
      "ing": "cancer",
      "tr1": "kanser",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 133,
      "ing": "candidate",
      "tr1": "aday",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 134,
      "ing": "capital",
      "tr1": "başkent",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 135,
      "ing": "car",
      "tr1": "araba",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 136,
      "ing": "card",
      "tr1": "kart",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 137,
      "ing": "care",
      "tr1": "bakım",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 138,
      "ing": "career",
      "tr1": "kariyer",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 139,
      "ing": "carry",
      "tr1": "taşımak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 140,
      "ing": "case",
      "tr1": "dava",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 141,
      "ing": "catch",
      "tr1": "yakalamak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 142,
      "ing": "cause",
      "tr1": "sebep olmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 143,
      "ing": "cell",
      "tr1": "hücre",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 144,
      "ing": "center",
      "tr1": "merkez",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 145,
      "ing": "central",
      "tr1": "merkezi",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 146,
      "ing": "century",
      "tr1": "yüzyıl",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 147,
      "ing": "certain",
      "tr1": "belirli",
      "tr2": "kesin",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 148,
      "ing": "certainly",
      "tr1": "kesinlikle",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 149,
      "ing": "chair",
      "tr1": "sandalye",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 150,
      "ing": "challenge",
      "tr1": "meydan okuma",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 151,
      "ing": "chance",
      "tr1": "şans",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 152,
      "ing": "change",
      "tr1": "değişiklik",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 153,
      "ing": "character",
      "tr1": "karakter",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 154,
      "ing": "charge",
      "tr1": "şarj etmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 155,
      "ing": "check",
      "tr1": "kontrol etmek",
      "tr2": "denetlemek",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 156,
      "ing": "child",
      "tr1": "çocuk",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 157,
      "ing": "choice",
      "tr1": "seçim",
      "tr2": "seçenek",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 158,
      "ing": "choose",
      "tr1": "seçmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 159,
      "ing": "church",
      "tr1": "kilise",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 160,
      "ing": "citizen",
      "tr1": "vatandaş",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 161,
      "ing": "city",
      "tr1": "şehir",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 162,
      "ing": "civil",
      "tr1": "sivil",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 163,
      "ing": "claim",
      "tr1": "iddia etmek",
      "tr2": "iddia",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 164,
      "ing": "class",
      "tr1": "sınıf",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 165,
      "ing": "clear",
      "tr1": "temiz",
      "tr2": "açık",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 166,
      "ing": "clearly",
      "tr1": "açıkça",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 167,
      "ing": "close",
      "tr1": "kapatmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 168,
      "ing": "coach",
      "tr1": "koç",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 169,
      "ing": "cold",
      "tr1": "soğuk",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 170,
      "ing": "collection",
      "tr1": "toplamak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 171,
      "ing": "college",
      "tr1": "kolej",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 172,
      "ing": "color",
      "tr1": "renk",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 173,
      "ing": "come",
      "tr1": "gelmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 174,
      "ing": "commercial",
      "tr1": "ticari",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 175,
      "ing": "common",
      "tr1": "ortak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 176,
      "ing": "community",
      "tr1": "topluluk",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 177,
      "ing": "company",
      "tr1": "şirket",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 178,
      "ing": "compare",
      "tr1": "karşılaştırmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 179,
      "ing": "computer",
      "tr1": "bilgisayar",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 180,
      "ing": "concern",
      "tr1": "ilişkisi olmak",
      "tr2": "ait olmak",
      "tr3": "ilgilendirmek",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 181,
      "ing": "condition",
      "tr1": "şart",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 182,
      "ing": "conference",
      "tr1": "konferans",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 183,
      "ing": "congress",
      "tr1": "kongre",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 184,
      "ing": "consider",
      "tr1": "dikkate almak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 185,
      "ing": "consumer",
      "tr1": "tüketici",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 186,
      "ing": "contain",
      "tr1": "içermek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 187,
      "ing": "continue",
      "tr1": "devam etmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 188,
      "ing": "control",
      "tr1": "kontrol",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 189,
      "ing": "cost",
      "tr1": "maliyet",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 190,
      "ing": "country",
      "tr1": "ülke",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 191,
      "ing": "couple",
      "tr1": "çift",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 192,
      "ing": "course",
      "tr1": "ders",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 193,
      "ing": "court",
      "tr1": "mahkeme",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 194,
      "ing": "cover",
      "tr1": "örtmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 195,
      "ing": "create",
      "tr1": "yaratmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 196,
      "ing": "crime",
      "tr1": "suç",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 197,
      "ing": "cultural",
      "tr1": "kültürel",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 198,
      "ing": "culture",
      "tr1": "kültür",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 199,
      "ing": "cup",
      "tr1": "fincan",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 200,
      "ing": "current",
      "tr1": "şu andaki",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 201,
      "ing": "customer",
      "tr1": "müşteri",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 202,
      "ing": "cut",
      "tr1": "kesmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 203,
      "ing": "dark",
      "tr1": "karanlık",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 204,
      "ing": "data",
      "tr1": "veri",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 205,
      "ing": "daughter",
      "tr1": "kız evlat",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 206,
      "ing": "day",
      "tr1": "gün",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 207,
      "ing": "dead",
      "tr1": "ölü",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 208,
      "ing": "deal",
      "tr1": "anlaşmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 209,
      "ing": "death",
      "tr1": "ölüm",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 210,
      "ing": "debate",
      "tr1": "müzakere",
      "tr2": "tartışma",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 211,
      "ing": "decade",
      "tr1": "on yıl",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 212,
      "ing": "decide",
      "tr1": "karar vermek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 213,
      "ing": "decision",
      "tr1": "karar",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 214,
      "ing": "deep",
      "tr1": "derin",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 215,
      "ing": "defense",
      "tr1": "savunma",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 216,
      "ing": "degree",
      "tr1": "derece",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 217,
      "ing": "democrat",
      "tr1": "demokrat",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 218,
      "ing": "democratic",
      "tr1": "demokratik",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 219,
      "ing": "describe",
      "tr1": "tanımlamak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 220,
      "ing": "design",
      "tr1": "tasarım",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 221,
      "ing": "despite",
      "tr1": "rağmen",
      "tr2": "aksine",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 222,
      "ing": "detail",
      "tr1": "ayrıntı",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 223,
      "ing": "determine",
      "tr1": "belirlemek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 224,
      "ing": "develop",
      "tr1": "geliştirmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 225,
      "ing": "development",
      "tr1": "gelişim",
      "tr2": "kalkınma",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 226,
      "ing": "die",
      "tr1": "ölmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 227,
      "ing": "difference",
      "tr1": "fark",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 228,
      "ing": "different",
      "tr1": "farklı",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 229,
      "ing": "difficult",
      "tr1": "zor",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 230,
      "ing": "dinner",
      "tr1": "akşam yemeği",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 231,
      "ing": "direction",
      "tr1": "yön",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 232,
      "ing": "director",
      "tr1": "yönetmen",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 233,
      "ing": "discover",
      "tr1": "keşfetmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 234,
      "ing": "discuss",
      "tr1": "tartışmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 235,
      "ing": "discussion",
      "tr1": "tartışma",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 236,
      "ing": "disease",
      "tr1": "hastalık",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 237,
      "ing": "do",
      "tr1": "yapmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 238,
      "ing": "doctor",
      "tr1": "doktor",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 239,
      "ing": "dog",
      "tr1": "köpek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 240,
      "ing": "door",
      "tr1": "kapı",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 241,
      "ing": "down",
      "tr1": "aşağı",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 242,
      "ing": "draw",
      "tr1": "çizmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 243,
      "ing": "dream",
      "tr1": "rüya",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 244,
      "ing": "drive",
      "tr1": "sürmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 245,
      "ing": "drop",
      "tr1": "düşürmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 246,
      "ing": "drug",
      "tr1": "uyuşturucu",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 247,
      "ing": "during",
      "tr1": "sırasında",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 248,
      "ing": "each",
      "tr1": "her biri",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 249,
      "ing": "early",
      "tr1": "erken",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 250,
      "ing": "east",
      "tr1": "doğu",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 251,
      "ing": "easy",
      "tr1": "kolay",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 252,
      "ing": "eat",
      "tr1": "yemek yemek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 253,
      "ing": "economic",
      "tr1": "ekonomik",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 254,
      "ing": "economy",
      "tr1": "ekonomi",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 255,
      "ing": "edge",
      "tr1": "kenar",
      "tr2": "kıyı",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 256,
      "ing": "education",
      "tr1": "eğitim",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 257,
      "ing": "effect",
      "tr1": "efekt",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 258,
      "ing": "effort",
      "tr1": "çaba",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 259,
      "ing": "eight",
      "tr1": "sekiz",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 260,
      "ing": "either",
      "tr1": "ya",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 261,
      "ing": "election",
      "tr1": "seçim",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 262,
      "ing": "else",
      "tr1": "başka",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 263,
      "ing": "employee",
      "tr1": "çalışan",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 264,
      "ing": "end",
      "tr1": "son",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 265,
      "ing": "energy",
      "tr1": "enerji",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 266,
      "ing": "enjoy",
      "tr1": "keyif almak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 267,
      "ing": "enough",
      "tr1": "yeterli",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 268,
      "ing": "enter",
      "tr1": "girmek",
      "tr2": "katılmak",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 269,
      "ing": "entire",
      "tr1": "tamamı",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 270,
      "ing": "environment",
      "tr1": "çevre",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 271,
      "ing": "environmental",
      "tr1": "çevreci",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 272,
      "ing": "especially",
      "tr1": "özellikle",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 273,
      "ing": "establish",
      "tr1": "kurmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 274,
      "ing": "evening",
      "tr1": "akşam",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 275,
      "ing": "event",
      "tr1": "olay",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 276,
      "ing": "ever",
      "tr1": "hiç",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 277,
      "ing": "every",
      "tr1": "her",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 278,
      "ing": "everybody",
      "tr1": "herkes",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 279,
      "ing": "everyone",
      "tr1": "herkes",
      "tr2": "her biri",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 280,
      "ing": "everything",
      "tr1": "her şey",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 281,
      "ing": "evidence",
      "tr1": "delil",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 282,
      "ing": "exactly",
      "tr1": "kesinlikle",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 283,
      "ing": "example",
      "tr1": "örnek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 284,
      "ing": "executive",
      "tr1": "yönetici",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 285,
      "ing": "exist",
      "tr1": "var olmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 286,
      "ing": "expect",
      "tr1": "ummak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 287,
      "ing": "experience",
      "tr1": "deneyim",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 288,
      "ing": "expert",
      "tr1": "uzman",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 289,
      "ing": "explain",
      "tr1": "açıklamak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 290,
      "ing": "eye",
      "tr1": "göz",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 291,
      "ing": "face",
      "tr1": "yüz",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 292,
      "ing": "fact",
      "tr1": "gerçek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 293,
      "ing": "factor",
      "tr1": "faktör",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 294,
      "ing": "fail",
      "tr1": "başarısız",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 295,
      "ing": "fall",
      "tr1": "düşmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 296,
      "ing": "family",
      "tr1": "aile",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 297,
      "ing": "far",
      "tr1": "uzak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 298,
      "ing": "fast",
      "tr1": "hızlı",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 299,
      "ing": "father",
      "tr1": "baba",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 300,
      "ing": "fear",
      "tr1": "korku",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 301,
      "ing": "federal",
      "tr1": "federal",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 302,
      "ing": "feel",
      "tr1": "hissetmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 303,
      "ing": "feeling",
      "tr1": "duygu",
      "tr2": "his",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 304,
      "ing": "few",
      "tr1": "az",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 305,
      "ing": "field",
      "tr1": "tarla",
      "tr2": "alan",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 306,
      "ing": "fight",
      "tr1": "kavga",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 307,
      "ing": "figure",
      "tr1": "şekil",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 308,
      "ing": "fill",
      "tr1": "doldurmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 309,
      "ing": "film",
      "tr1": "film",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 310,
      "ing": "final",
      "tr1": "final",
      "tr2": "nihai",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 311,
      "ing": "finally",
      "tr1": "en sonunda",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 312,
      "ing": "financial",
      "tr1": "mali",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 313,
      "ing": "find",
      "tr1": "bulmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 314,
      "ing": "fine",
      "tr1": "iyi",
      "tr2": "güzel",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 315,
      "ing": "finger",
      "tr1": "parmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 316,
      "ing": "finish",
      "tr1": "bitiş",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 317,
      "ing": "fire",
      "tr1": "ateş",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 318,
      "ing": "firm",
      "tr1": "firma",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 319,
      "ing": "first",
      "tr1": "ilk",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 320,
      "ing": "fish",
      "tr1": "balık",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 321,
      "ing": "five",
      "tr1": "beş",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 322,
      "ing": "floor",
      "tr1": "zemin",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 323,
      "ing": "fly",
      "tr1": "uçmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 324,
      "ing": "focus",
      "tr1": "odaklanmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 325,
      "ing": "follow",
      "tr1": "takip etmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 326,
      "ing": "food",
      "tr1": "gıda",
      "tr2": "yiyecek",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 327,
      "ing": "foot",
      "tr1": "ayak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 328,
      "ing": "for",
      "tr1": "için",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 329,
      "ing": "force",
      "tr1": "kuvvet",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 330,
      "ing": "foreign",
      "tr1": "yabancı",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 331,
      "ing": "forget",
      "tr1": "unutmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 332,
      "ing": "form",
      "tr1": "form",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 333,
      "ing": "former",
      "tr1": "önceki",
      "tr2": "eski",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 334,
      "ing": "forward",
      "tr1": "İleri",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 335,
      "ing": "four",
      "tr1": "dört",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 336,
      "ing": "free",
      "tr1": "ücretsiz",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 337,
      "ing": "friend",
      "tr1": "arkadaş",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 338,
      "ing": "front",
      "tr1": "ön",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 339,
      "ing": "full",
      "tr1": "tam",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 340,
      "ing": "fund",
      "tr1": "fon",
      "tr2": "sermaye",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 341,
      "ing": "future",
      "tr1": "gelecek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 342,
      "ing": "game",
      "tr1": "oyun",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 343,
      "ing": "garden",
      "tr1": "bahçe",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 344,
      "ing": "gas",
      "tr1": "gaz",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 345,
      "ing": "general",
      "tr1": "genel",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 346,
      "ing": "generation",
      "tr1": "nesil",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 347,
      "ing": "get",
      "tr1": "almak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 348,
      "ing": "girl",
      "tr1": "kız",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 349,
      "ing": "give",
      "tr1": "vermek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 350,
      "ing": "glass",
      "tr1": "bardak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 351,
      "ing": "go",
      "tr1": "gitmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 352,
      "ing": "goal",
      "tr1": "hedef",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 353,
      "ing": "good",
      "tr1": "iyi",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 354,
      "ing": "government",
      "tr1": "hükümet",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 355,
      "ing": "great",
      "tr1": "harika",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 356,
      "ing": "green",
      "tr1": "yeşil",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 357,
      "ing": "ground",
      "tr1": "zemin",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 358,
      "ing": "group",
      "tr1": "grup",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 359,
      "ing": "grow",
      "tr1": "büyümek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 360,
      "ing": "growth",
      "tr1": "büyüme",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 361,
      "ing": "guess",
      "tr1": "tahmin",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 362,
      "ing": "gun",
      "tr1": "silah",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 363,
      "ing": "guy",
      "tr1": "adam",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 364,
      "ing": "hair",
      "tr1": "saç",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 365,
      "ing": "half",
      "tr1": "yarım",
      "tr2": "devre",
      "tr3": "ara",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 366,
      "ing": "hand",
      "tr1": "el",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 367,
      "ing": "hang",
      "tr1": "asmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 368,
      "ing": "happen",
      "tr1": "olmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 369,
      "ing": "happy",
      "tr1": "mutlu",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 370,
      "ing": "hard",
      "tr1": "zor",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 371,
      "ing": "have",
      "tr1": "sahip olmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 372,
      "ing": "he",
      "tr1": "o (erkek)",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 373,
      "ing": "head",
      "tr1": "kafa",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 374,
      "ing": "health",
      "tr1": "sağlık",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 375,
      "ing": "hear",
      "tr1": "duymak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 376,
      "ing": "heart",
      "tr1": "kalp",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 377,
      "ing": "heat",
      "tr1": "sıcaklık",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 378,
      "ing": "heavy",
      "tr1": "ağır",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 379,
      "ing": "help",
      "tr1": "yardım",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 380,
      "ing": "her",
      "tr1": "onun",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 381,
      "ing": "here",
      "tr1": "burada",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 382,
      "ing": "herself",
      "tr1": "kendini",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 383,
      "ing": "high",
      "tr1": "yüksek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 384,
      "ing": "him",
      "tr1": "onu",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 385,
      "ing": "himself",
      "tr1": "kendisi",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 386,
      "ing": "his",
      "tr1": "onun",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 387,
      "ing": "history",
      "tr1": "tarih",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 388,
      "ing": "hit",
      "tr1": "çarmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 389,
      "ing": "hold",
      "tr1": "tutmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 390,
      "ing": "home",
      "tr1": "ev",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 391,
      "ing": "hope",
      "tr1": "umut",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 392,
      "ing": "hospital",
      "tr1": "hastane",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 393,
      "ing": "hot",
      "tr1": "sıcak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 394,
      "ing": "hotel",
      "tr1": "otel",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 395,
      "ing": "hour",
      "tr1": "saat",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 396,
      "ing": "house",
      "tr1": "ev",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 397,
      "ing": "how",
      "tr1": "nasıl",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 398,
      "ing": "however",
      "tr1": "ancak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 399,
      "ing": "huge",
      "tr1": "kocaman",
      "tr2": "iri",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 400,
      "ing": "human",
      "tr1": "insan",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 401,
      "ing": "hundred",
      "tr1": "yüz",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 402,
      "ing": "husband",
      "tr1": "koca",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 403,
      "ing": "idea",
      "tr1": "fikir",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 404,
      "ing": "identify",
      "tr1": "belirlemek",
      "tr2": "tanımak",
      "tr3": "tanımlamak",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 405,
      "ing": "if",
      "tr1": "eğer",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 406,
      "ing": "image",
      "tr1": "görüntü",
      "tr2": "resim",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 407,
      "ing": "imagine",
      "tr1": "hayal etmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 408,
      "ing": "impact",
      "tr1": "etki",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 409,
      "ing": "important",
      "tr1": "önemli",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 410,
      "ing": "improve",
      "tr1": "iyileştirmek",
      "tr2": "iyi hale getirmek",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 411,
      "ing": "in",
      "tr1": "içinde",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 412,
      "ing": "include",
      "tr1": "dahil etmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 413,
      "ing": "including",
      "tr1": "dahil olmak üzere",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 414,
      "ing": "increase",
      "tr1": "artırmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 415,
      "ing": "indeed",
      "tr1": "aslında",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 416,
      "ing": "indicate",
      "tr1": "belirtmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 417,
      "ing": "individual",
      "tr1": "bireysel",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 418,
      "ing": "industry",
      "tr1": "endüstri",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 419,
      "ing": "information",
      "tr1": "bilgi",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 420,
      "ing": "inside",
      "tr1": "İçeride",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 421,
      "ing": "instead",
      "tr1": "yerine",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 422,
      "ing": "institution",
      "tr1": "kurum",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 423,
      "ing": "interest",
      "tr1": "faiz",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 424,
      "ing": "interesting",
      "tr1": "ilginç",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 425,
      "ing": "international",
      "tr1": "uluslararası",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 426,
      "ing": "interview",
      "tr1": "röportaj",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 427,
      "ing": "into",
      "tr1": "İçine",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 428,
      "ing": "investment",
      "tr1": "yatırım",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 429,
      "ing": "involve",
      "tr1": "içermek",
      "tr2": "kapsamak",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 430,
      "ing": "issue",
      "tr1": "sorun",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 431,
      "ing": "it",
      "tr1": "o (cansız)",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 432,
      "ing": "item",
      "tr1": "öğe",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 433,
      "ing": "its",
      "tr1": "onun (cansız)",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 434,
      "ing": "itself",
      "tr1": "kendisi",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 435,
      "ing": "job",
      "tr1": "meslek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 436,
      "ing": "join",
      "tr1": "katılmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 437,
      "ing": "just",
      "tr1": "sadece",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 438,
      "ing": "keep",
      "tr1": "tutmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 439,
      "ing": "key",
      "tr1": "anahtar",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 440,
      "ing": "kid",
      "tr1": "çocuk",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 441,
      "ing": "kill",
      "tr1": "öldürmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 442,
      "ing": "kind",
      "tr1": "tür",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 443,
      "ing": "kitchen",
      "tr1": "mutfak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 444,
      "ing": "know",
      "tr1": "bilmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 445,
      "ing": "knowledge",
      "tr1": "bilgi",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 446,
      "ing": "land",
      "tr1": "arazi",
      "tr2": "toprak",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 447,
      "ing": "language",
      "tr1": "dil",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 448,
      "ing": "large",
      "tr1": "geniş",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 449,
      "ing": "last",
      "tr1": "son",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 450,
      "ing": "late",
      "tr1": "geç",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 451,
      "ing": "later",
      "tr1": "sonra",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 452,
      "ing": "laugh",
      "tr1": "gülmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 453,
      "ing": "law",
      "tr1": "hukuk",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 454,
      "ing": "lawyer",
      "tr1": "avukat",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 455,
      "ing": "lay",
      "tr1": "yatırmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 456,
      "ing": "lead",
      "tr1": "öncülük etmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 457,
      "ing": "leader",
      "tr1": "lider",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 458,
      "ing": "learn",
      "tr1": "öğrenmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 459,
      "ing": "least",
      "tr1": "en az",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 460,
      "ing": "leave",
      "tr1": "ayrılmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 461,
      "ing": "left",
      "tr1": "ayrıldı",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 462,
      "ing": "leg",
      "tr1": "bacak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 463,
      "ing": "legal",
      "tr1": "yasal",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 464,
      "ing": "less",
      "tr1": "az",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 465,
      "ing": "let",
      "tr1": "Izin vermek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 466,
      "ing": "letter",
      "tr1": "mektup",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 467,
      "ing": "level",
      "tr1": "seviye",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 468,
      "ing": "lie",
      "tr1": "yalan",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 469,
      "ing": "life",
      "tr1": "hayat",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 470,
      "ing": "light",
      "tr1": "ışık",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 471,
      "ing": "like",
      "tr1": "sevmek",
      "tr2": "beğenmek",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 472,
      "ing": "likely",
      "tr1": "muhtemel",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 473,
      "ing": "line",
      "tr1": "çizgi",
      "tr2": "sıra",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 474,
      "ing": "list",
      "tr1": "liste",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 475,
      "ing": "listen",
      "tr1": "dinlemek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 476,
      "ing": "little",
      "tr1": "küçük",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 477,
      "ing": "live",
      "tr1": "canlı",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 478,
      "ing": "local",
      "tr1": "yerel",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 479,
      "ing": "long",
      "tr1": "uzun",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 480,
      "ing": "look",
      "tr1": "bakmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 481,
      "ing": "lose",
      "tr1": "kaybetmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 482,
      "ing": "loss",
      "tr1": "kayıp",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 483,
      "ing": "lot",
      "tr1": "çok",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 484,
      "ing": "love",
      "tr1": "aşk",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 485,
      "ing": "low",
      "tr1": "düşük",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 486,
      "ing": "machine",
      "tr1": "makine",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 487,
      "ing": "magazine",
      "tr1": "dergi",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 488,
      "ing": "main",
      "tr1": "ana",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 489,
      "ing": "maintain",
      "tr1": "sürdürmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 490,
      "ing": "majority",
      "tr1": "çoğunluk",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 491,
      "ing": "make",
      "tr1": "yapmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 492,
      "ing": "man",
      "tr1": "adam",
      "tr2": "insan",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 493,
      "ing": "manage",
      "tr1": "yönetmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 494,
      "ing": "management",
      "tr1": "yönetim",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 495,
      "ing": "manager",
      "tr1": "müdür",
      "tr2": "yönetici",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 496,
      "ing": "many",
      "tr1": "çok",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 497,
      "ing": "market",
      "tr1": "pazar",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 498,
      "ing": "marriage",
      "tr1": "evlilik",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 499,
      "ing": "material",
      "tr1": "malzeme",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 500,
      "ing": "matter",
      "tr1": "konu",
      "tr2": "mesele",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 501,
      "ing": "may",
      "tr1": "mayıs ayı",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 502,
      "ing": "maybe",
      "tr1": "belki",
      "tr2": "olabilir",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 503,
      "ing": "me",
      "tr1": "bana",
      "tr2": "beni",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 504,
      "ing": "mean",
      "tr1": "anlamına gelmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 505,
      "ing": "measure",
      "tr1": "ölçmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 506,
      "ing": "media",
      "tr1": "medya",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 507,
      "ing": "medical",
      "tr1": "tıbbi",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 508,
      "ing": "meet",
      "tr1": "buluşmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 509,
      "ing": "meeting",
      "tr1": "toplantı",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 510,
      "ing": "member",
      "tr1": "üye",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 511,
      "ing": "memory",
      "tr1": "hafıza",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 512,
      "ing": "mention",
      "tr1": "değinmek",
      "tr2": "söz etmek",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 513,
      "ing": "message",
      "tr1": "mesaj",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 514,
      "ing": "method",
      "tr1": "yöntem",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 515,
      "ing": "middle",
      "tr1": "orta",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 516,
      "ing": "might",
      "tr1": "belki",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 517,
      "ing": "military",
      "tr1": "askeri",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 518,
      "ing": "million",
      "tr1": "milyon",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 519,
      "ing": "mind",
      "tr1": "zihin",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 520,
      "ing": "minute",
      "tr1": "dakika",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 521,
      "ing": "miss",
      "tr1": "özlemek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 522,
      "ing": "mission",
      "tr1": "misyon",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 523,
      "ing": "model",
      "tr1": "model",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 524,
      "ing": "modern",
      "tr1": "modern",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 525,
      "ing": "moment",
      "tr1": "an",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 526,
      "ing": "money",
      "tr1": "para",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 527,
      "ing": "month",
      "tr1": "ay",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 528,
      "ing": "more",
      "tr1": "daha",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 529,
      "ing": "morning",
      "tr1": "sabah",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 530,
      "ing": "most",
      "tr1": "çoğu",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 531,
      "ing": "mother",
      "tr1": "anne",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 532,
      "ing": "mouth",
      "tr1": "ağız",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 533,
      "ing": "move",
      "tr1": "hareket etmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 534,
      "ing": "movement",
      "tr1": "hareket",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 535,
      "ing": "movie",
      "tr1": "film",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 536,
      "ing": "Mr",
      "tr1": "bay",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 537,
      "ing": "Mrs",
      "tr1": "bayan",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 538,
      "ing": "much",
      "tr1": "çok",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 539,
      "ing": "music",
      "tr1": "müzik",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 540,
      "ing": "must",
      "tr1": "zorunlu",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 541,
      "ing": "my",
      "tr1": "benim",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 542,
      "ing": "myself",
      "tr1": "kendim",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 543,
      "ing": "name",
      "tr1": "isim",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 544,
      "ing": "nation",
      "tr1": "ulus",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 545,
      "ing": "national",
      "tr1": "ulusal",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 546,
      "ing": "natural",
      "tr1": "doğal",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 547,
      "ing": "nature",
      "tr1": "doğa",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 548,
      "ing": "near",
      "tr1": "yakın",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 549,
      "ing": "nearly",
      "tr1": "neredeyse",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 550,
      "ing": "necessary",
      "tr1": "gerekli",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 551,
      "ing": "need",
      "tr1": "ihtiyaç, gereksinim",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 552,
      "ing": "network",
      "tr1": "ağ",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 553,
      "ing": "never",
      "tr1": "asla",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 554,
      "ing": "new",
      "tr1": "yeni",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 555,
      "ing": "news",
      "tr1": "haber",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 556,
      "ing": "newspaper",
      "tr1": "gazete",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 557,
      "ing": "next",
      "tr1": "sonraki",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 558,
      "ing": "nice",
      "tr1": "iyi, güzel",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 559,
      "ing": "night",
      "tr1": "gece",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 560,
      "ing": "no",
      "tr1": "hayır",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 561,
      "ing": "none",
      "tr1": "yok, hayır, hiçbiri, hiçbir şey",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 562,
      "ing": "nor",
      "tr1": "ne de",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 563,
      "ing": "north",
      "tr1": "kuzey",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 564,
      "ing": "not",
      "tr1": "değil",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 565,
      "ing": "note",
      "tr1": "not",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 566,
      "ing": "nothing",
      "tr1": "hiçbir şey",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 567,
      "ing": "notice",
      "tr1": "fark etmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 568,
      "ing": "now",
      "tr1": "şimdi",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 569,
      "ing": "number",
      "tr1": "numara",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 570,
      "ing": "occur",
      "tr1": "meydana gelmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 571,
      "ing": "off",
      "tr1": "kapalı",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 572,
      "ing": "offer",
      "tr1": "teklif etmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 573,
      "ing": "office",
      "tr1": "ofis",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 574,
      "ing": "officer",
      "tr1": "memur",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 575,
      "ing": "official",
      "tr1": "resmi",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 576,
      "ing": "often",
      "tr1": "sıklıkla",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 577,
      "ing": "oil",
      "tr1": "yağ",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 578,
      "ing": "okay",
      "tr1": "tamam",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 579,
      "ing": "old",
      "tr1": "yaşlı, eski",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 580,
      "ing": "on",
      "tr1": "üzerinde",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 581,
      "ing": "once",
      "tr1": "bir zamanlar",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 582,
      "ing": "one",
      "tr1": "bir",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 583,
      "ing": "only",
      "tr1": "bir tek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 584,
      "ing": "onto",
      "tr1": "üstüne",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 585,
      "ing": "open",
      "tr1": "açık",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 586,
      "ing": "operation",
      "tr1": "ameliyat",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 587,
      "ing": "opportunity",
      "tr1": "fırsat",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 588,
      "ing": "option",
      "tr1": "seçenek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 589,
      "ing": "or",
      "tr1": "veya",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 590,
      "ing": "order",
      "tr1": "sipariş, sipariş vermek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 591,
      "ing": "organization",
      "tr1": "organizasyon",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 592,
      "ing": "other",
      "tr1": "diğer",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 593,
      "ing": "others",
      "tr1": "diğerleri",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 594,
      "ing": "our",
      "tr1": "bizim",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 595,
      "ing": "out",
      "tr1": "dışarı",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 596,
      "ing": "outside",
      "tr1": "dışında",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 597,
      "ing": "over",
      "tr1": "bitti",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 598,
      "ing": "own",
      "tr1": "kendi",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 599,
      "ing": "owner",
      "tr1": "sahip",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 600,
      "ing": "page",
      "tr1": "sayfa",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 601,
      "ing": "pain",
      "tr1": "ağrı",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 602,
      "ing": "painting",
      "tr1": "boyama",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 603,
      "ing": "paper",
      "tr1": "kağıt",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 604,
      "ing": "parent",
      "tr1": "ebeveyn",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 605,
      "ing": "part",
      "tr1": "bölüm",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 606,
      "ing": "participant",
      "tr1": "katılımcı",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 607,
      "ing": "particular",
      "tr1": "özel, belirli",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 608,
      "ing": "particularly",
      "tr1": "özellikle",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 609,
      "ing": "partner",
      "tr1": "partner, ortak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 610,
      "ing": "party",
      "tr1": "parti",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 611,
      "ing": "pass",
      "tr1": "geçmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 612,
      "ing": "past",
      "tr1": "geçmiş",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 613,
      "ing": "patient",
      "tr1": "hasta, sabırlı, hoşgörülü",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 614,
      "ing": "pattern",
      "tr1": "desen",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 615,
      "ing": "pay",
      "tr1": "ödemek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 616,
      "ing": "peace",
      "tr1": "barış",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 617,
      "ing": "people",
      "tr1": "insanlar",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 618,
      "ing": "per",
      "tr1": "başına, göre",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 619,
      "ing": "perform",
      "tr1": "yapmak, uygulamak, yerine getirmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 620,
      "ing": "performance",
      "tr1": "performans",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 621,
      "ing": "perhaps",
      "tr1": "belki",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 622,
      "ing": "period",
      "tr1": "periyot, dönem",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 623,
      "ing": "person",
      "tr1": "kişi",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 624,
      "ing": "personal",
      "tr1": "kişisel",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 625,
      "ing": "phone",
      "tr1": "telefon",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 626,
      "ing": "physical",
      "tr1": "fiziksel",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 627,
      "ing": "pick",
      "tr1": "almak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 628,
      "ing": "picture",
      "tr1": "resim",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 629,
      "ing": "piece",
      "tr1": "parça",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 630,
      "ing": "place",
      "tr1": "yer, mekan",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 631,
      "ing": "plan",
      "tr1": "plan",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 632,
      "ing": "plant",
      "tr1": "bitki",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 633,
      "ing": "play",
      "tr1": "oynamak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 634,
      "ing": "player",
      "tr1": "oyuncu",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 635,
      "ing": "point",
      "tr1": "puan",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 636,
      "ing": "police",
      "tr1": "polis",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 637,
      "ing": "policy",
      "tr1": "politika",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 638,
      "ing": "political",
      "tr1": "siyasi",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 639,
      "ing": "politics",
      "tr1": "siyaset",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 640,
      "ing": "poor",
      "tr1": "fakir",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 641,
      "ing": "popular",
      "tr1": "popüler",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 642,
      "ing": "population",
      "tr1": "nüfus",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 643,
      "ing": "position",
      "tr1": "pozisyon",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 644,
      "ing": "positive",
      "tr1": "pozitif",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 645,
      "ing": "possible",
      "tr1": "mümkün",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 646,
      "ing": "power",
      "tr1": "güç",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 647,
      "ing": "practice",
      "tr1": "uygulama, pratik",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 648,
      "ing": "prepare",
      "tr1": "hazırlamak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 649,
      "ing": "present",
      "tr1": "mevcut",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 650,
      "ing": "president",
      "tr1": "devlet başkanı",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 651,
      "ing": "pressure",
      "tr1": "basınç",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 652,
      "ing": "pretty",
      "tr1": "güzel",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 653,
      "ing": "prevent",
      "tr1": "engel olmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 654,
      "ing": "price",
      "tr1": "fiyat",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 655,
      "ing": "private",
      "tr1": "özel",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 656,
      "ing": "probably",
      "tr1": "muhtemelen",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 657,
      "ing": "problem",
      "tr1": "problem, sorun",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 658,
      "ing": "process",
      "tr1": "süreç, işlem",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 659,
      "ing": "produce",
      "tr1": "üretmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 660,
      "ing": "product",
      "tr1": "ürün",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 661,
      "ing": "production",
      "tr1": "üretim",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 662,
      "ing": "professional",
      "tr1": "profesyonel",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 663,
      "ing": "professor",
      "tr1": "profesör",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 664,
      "ing": "program",
      "tr1": "program",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 665,
      "ing": "project",
      "tr1": "proje",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 666,
      "ing": "property",
      "tr1": "gayrimenkul",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 667,
      "ing": "protect",
      "tr1": "korumak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 668,
      "ing": "prove",
      "tr1": "kanıtlamak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 669,
      "ing": "provide",
      "tr1": "sağlamak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 670,
      "ing": "public",
      "tr1": "halka açık",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 671,
      "ing": "pull",
      "tr1": "çekmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 672,
      "ing": "purpose",
      "tr1": "amaç",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 673,
      "ing": "push",
      "tr1": "itmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 674,
      "ing": "put",
      "tr1": "koymak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 675,
      "ing": "quality",
      "tr1": "kalite",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 676,
      "ing": "question",
      "tr1": "soru",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 677,
      "ing": "quickly",
      "tr1": "hızlı bir şekilde",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 678,
      "ing": "quite",
      "tr1": "oldukça",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 679,
      "ing": "race",
      "tr1": "yarış",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 680,
      "ing": "radio",
      "tr1": "radyo",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 681,
      "ing": "raise",
      "tr1": "yükseltmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 682,
      "ing": "range",
      "tr1": "menzil",
      "tr2": "aralık",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 683,
      "ing": "rate",
      "tr1": "oran",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 684,
      "ing": "rather",
      "tr1": "daha doğrusu",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 685,
      "ing": "reach",
      "tr1": "ulaşmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 686,
      "ing": "read",
      "tr1": "okumak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 687,
      "ing": "ready",
      "tr1": "hazır",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 688,
      "ing": "real",
      "tr1": "reel",
      "tr2": "gerçek",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 689,
      "ing": "reality",
      "tr1": "gerçeklik",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 690,
      "ing": "realize",
      "tr1": "fark etmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 691,
      "ing": "really",
      "tr1": "gerçekten",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 692,
      "ing": "reason",
      "tr1": "neden",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 693,
      "ing": "receive",
      "tr1": "teslim almak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 694,
      "ing": "recent",
      "tr1": "son",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 695,
      "ing": "recently",
      "tr1": "son günlerde",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 696,
      "ing": "recognize",
      "tr1": "tanımak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 697,
      "ing": "record",
      "tr1": "kayıt",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 698,
      "ing": "red",
      "tr1": "kırmızı",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 699,
      "ing": "reduce",
      "tr1": "azaltmak",
      "tr2": "düşürmek",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 700,
      "ing": "reflect",
      "tr1": "yansıtmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 701,
      "ing": "region",
      "tr1": "bölge",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 702,
      "ing": "relate",
      "tr1": "İlişki kurmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 703,
      "ing": "relationship",
      "tr1": "İlişki",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 704,
      "ing": "religious",
      "tr1": "dini",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 705,
      "ing": "remain",
      "tr1": "kalmak",
      "tr2": "sürdürmek",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 706,
      "ing": "remember",
      "tr1": "hatırlamak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 707,
      "ing": "remove",
      "tr1": "kaldırmak",
      "tr2": "uzaklaştırmak",
      "tr3": "ortadan kaldırmak",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 708,
      "ing": "report",
      "tr1": "rapor",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 709,
      "ing": "represent",
      "tr1": "temsil etmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 710,
      "ing": "republican",
      "tr1": "cumhuriyetçi",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 711,
      "ing": "require",
      "tr1": "gerekmek",
      "tr2": "gerektirmek",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 712,
      "ing": "research",
      "tr1": "araştırma",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 713,
      "ing": "resource",
      "tr1": "kaynak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 714,
      "ing": "respond",
      "tr1": "yanıtlamak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 715,
      "ing": "response",
      "tr1": "cevap vermek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 716,
      "ing": "responsibility",
      "tr1": "sorumluluk",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 717,
      "ing": "rest",
      "tr1": "dinlenme",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 718,
      "ing": "result",
      "tr1": "sonuç",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 719,
      "ing": "return",
      "tr1": "dönüş",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 720,
      "ing": "reveal",
      "tr1": "ortaya çıkartmak",
      "tr2": "açığa vurmak",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 721,
      "ing": "rich",
      "tr1": "zengin",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 722,
      "ing": "right",
      "tr1": "sağ",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 723,
      "ing": "rise",
      "tr1": "yükselmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 724,
      "ing": "risk",
      "tr1": "risk",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 725,
      "ing": "road",
      "tr1": "karayolu",
      "tr2": "yol",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 726,
      "ing": "rock",
      "tr1": "kaya",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 727,
      "ing": "role",
      "tr1": "rol",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 728,
      "ing": "room",
      "tr1": "oda",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 729,
      "ing": "rule",
      "tr1": "kural",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 730,
      "ing": "run",
      "tr1": "koşmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 731,
      "ing": "safe",
      "tr1": "güvenli",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 732,
      "ing": "same",
      "tr1": "aynı",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 733,
      "ing": "save",
      "tr1": "kayıt etmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 734,
      "ing": "say",
      "tr1": "söylemek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 735,
      "ing": "scene",
      "tr1": "sahne",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 736,
      "ing": "school",
      "tr1": "okul",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 737,
      "ing": "science",
      "tr1": "bilim",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 738,
      "ing": "scientist",
      "tr1": "bilim insanı",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 739,
      "ing": "score",
      "tr1": "skor",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 740,
      "ing": "sea",
      "tr1": "deniz",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 741,
      "ing": "season",
      "tr1": "sezon",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 742,
      "ing": "seat",
      "tr1": "koltuk",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 743,
      "ing": "second",
      "tr1": "ikinci",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 744,
      "ing": "section",
      "tr1": "bölüm",
      "tr2": "kesit",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 745,
      "ing": "security",
      "tr1": "güvenlik",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 746,
      "ing": "see",
      "tr1": "görmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 747,
      "ing": "seek",
      "tr1": "aramak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 748,
      "ing": "seem",
      "tr1": "görünmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 749,
      "ing": "sell",
      "tr1": "satmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 750,
      "ing": "send",
      "tr1": "göndermek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 751,
      "ing": "senior",
      "tr1": "kıdemli",
      "tr2": "yaşça büyük",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 752,
      "ing": "sense",
      "tr1": "algı",
      "tr2": "duyu",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 753,
      "ing": "series",
      "tr1": "dizi",
      "tr2": "seri",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 754,
      "ing": "serious",
      "tr1": "ciddi",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 755,
      "ing": "serve",
      "tr1": "servis",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 756,
      "ing": "service",
      "tr1": "hizmet",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 757,
      "ing": "set",
      "tr1": "ayarlamak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 758,
      "ing": "seven",
      "tr1": "yedi",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 759,
      "ing": "several",
      "tr1": "birkaç",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 760,
      "ing": "shake",
      "tr1": "sallamak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 761,
      "ing": "share",
      "tr1": "paylaşmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 762,
      "ing": "she",
      "tr1": "o (kadın)",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 763,
      "ing": "shoot",
      "tr1": "şut çekmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 764,
      "ing": "short",
      "tr1": "kısa",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 765,
      "ing": "shot",
      "tr1": "atış",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 766,
      "ing": "should",
      "tr1": "meli, malı",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 767,
      "ing": "shoulder",
      "tr1": "omuz",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 768,
      "ing": "show",
      "tr1": "göstermek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 769,
      "ing": "side",
      "tr1": "yan",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 770,
      "ing": "sign",
      "tr1": "işaret",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 771,
      "ing": "significant",
      "tr1": "önemli",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 772,
      "ing": "similar",
      "tr1": "benzer",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 773,
      "ing": "simple",
      "tr1": "basit",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 774,
      "ing": "simply",
      "tr1": "basitçe",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 775,
      "ing": "since",
      "tr1": "dan beri",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 776,
      "ing": "sing",
      "tr1": "şarkı söylemek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 777,
      "ing": "single",
      "tr1": "tek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 778,
      "ing": "sister",
      "tr1": "kız kardeş",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 779,
      "ing": "sit",
      "tr1": "oturmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 780,
      "ing": "site",
      "tr1": "alan",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 781,
      "ing": "situation",
      "tr1": "durum",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 782,
      "ing": "six",
      "tr1": "altı",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 783,
      "ing": "size",
      "tr1": "boyut",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 784,
      "ing": "skill",
      "tr1": "beceri",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 785,
      "ing": "skin",
      "tr1": "cilt",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 786,
      "ing": "small",
      "tr1": "küçük",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 787,
      "ing": "smile",
      "tr1": "gülümseme",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 788,
      "ing": "so",
      "tr1": "yani",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 789,
      "ing": "social",
      "tr1": "sosyal",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 790,
      "ing": "society",
      "tr1": "toplum",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 791,
      "ing": "soldier",
      "tr1": "asker",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 792,
      "ing": "some",
      "tr1": "bazı",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 793,
      "ing": "somebody",
      "tr1": "birileri",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 794,
      "ing": "someone",
      "tr1": "birisi",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 795,
      "ing": "something",
      "tr1": "bir şey",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 796,
      "ing": "sometimes",
      "tr1": "ara sıra",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 797,
      "ing": "son",
      "tr1": "oğul",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 798,
      "ing": "song",
      "tr1": "şarkı",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 799,
      "ing": "soon",
      "tr1": "yakında",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 800,
      "ing": "sort",
      "tr1": "çeşit",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 801,
      "ing": "sound",
      "tr1": "ses",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 802,
      "ing": "source",
      "tr1": "kaynak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 803,
      "ing": "south",
      "tr1": "güney",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 804,
      "ing": "southern",
      "tr1": "güney",
      "tr2": "güneyli",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 805,
      "ing": "space",
      "tr1": "boşluk",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 806,
      "ing": "speak",
      "tr1": "konuşmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 807,
      "ing": "special",
      "tr1": "özel",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 808,
      "ing": "specific",
      "tr1": "özel",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 809,
      "ing": "speech",
      "tr1": "konuşma",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 810,
      "ing": "spend",
      "tr1": "harcamak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 811,
      "ing": "sport",
      "tr1": "spor",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 812,
      "ing": "spring",
      "tr1": "bahar",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 813,
      "ing": "staff",
      "tr1": "personel",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 814,
      "ing": "stage",
      "tr1": "sahne",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 815,
      "ing": "stand",
      "tr1": "ayakta durmak",
      "tr2": "direnmek",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 816,
      "ing": "standard",
      "tr1": "standart",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 817,
      "ing": "star",
      "tr1": "yıldız",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 818,
      "ing": "start",
      "tr1": "başlama",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 819,
      "ing": "state",
      "tr1": "devlet",
      "tr2": "durum",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 820,
      "ing": "statement",
      "tr1": "beyan",
      "tr2": "ifade",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 821,
      "ing": "station",
      "tr1": "istasyon",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 822,
      "ing": "stay",
      "tr1": "kalmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 823,
      "ing": "step",
      "tr1": "adım",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 824,
      "ing": "still",
      "tr1": "hala",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 825,
      "ing": "stock",
      "tr1": "stok",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 826,
      "ing": "stop",
      "tr1": "dur",
      "tr2": "durmak",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 827,
      "ing": "store",
      "tr1": "mağaza",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 828,
      "ing": "story",
      "tr1": "öykü",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 829,
      "ing": "strategy",
      "tr1": "strateji",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 830,
      "ing": "street",
      "tr1": "sokak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 831,
      "ing": "strong",
      "tr1": "güçlü",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 832,
      "ing": "structure",
      "tr1": "yapı",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 833,
      "ing": "student",
      "tr1": "öğrenci",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 834,
      "ing": "study",
      "tr1": "ders çalışma",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 835,
      "ing": "stuff",
      "tr1": "şey",
      "tr2": "madde",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 836,
      "ing": "style",
      "tr1": "stil",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 837,
      "ing": "subject",
      "tr1": "konu",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 838,
      "ing": "success",
      "tr1": "başarı",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 839,
      "ing": "successful",
      "tr1": "başarılı",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 840,
      "ing": "such",
      "tr1": "böyle",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 841,
      "ing": "suddenly",
      "tr1": "aniden",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 842,
      "ing": "suffer",
      "tr1": "acı çekmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 843,
      "ing": "suggest",
      "tr1": "önermek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 844,
      "ing": "summer",
      "tr1": "yaz",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 845,
      "ing": "support",
      "tr1": "destek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 846,
      "ing": "sure",
      "tr1": "emin",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 847,
      "ing": "surface",
      "tr1": "yüzey",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 848,
      "ing": "system",
      "tr1": "sistem",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 849,
      "ing": "table",
      "tr1": "masa",
      "tr2": "tablo",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 850,
      "ing": "take",
      "tr1": "almak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 851,
      "ing": "talk",
      "tr1": "konuşmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 852,
      "ing": "task",
      "tr1": "görev",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 853,
      "ing": "tax",
      "tr1": "vergi",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 854,
      "ing": "teach",
      "tr1": "öğretmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 855,
      "ing": "teacher",
      "tr1": "öğretmen",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 856,
      "ing": "team",
      "tr1": "takım",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 857,
      "ing": "technology",
      "tr1": "teknoloji",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 858,
      "ing": "television",
      "tr1": "televizyon",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 859,
      "ing": "tell",
      "tr1": "söylemek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 860,
      "ing": "ten",
      "tr1": "on",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 861,
      "ing": "tend",
      "tr1": "yönelmek",
      "tr2": "eğilmek",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 862,
      "ing": "term",
      "tr1": "terim",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 863,
      "ing": "test",
      "tr1": "test",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 864,
      "ing": "thank",
      "tr1": "teşekkür etmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 865,
      "ing": "that",
      "tr1": "o",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 866,
      "ing": "their",
      "tr1": "onların",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 867,
      "ing": "them",
      "tr1": "onları",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 868,
      "ing": "themselves",
      "tr1": "kendilerini",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 869,
      "ing": "then",
      "tr1": "sonra",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 870,
      "ing": "theory",
      "tr1": "teori",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 871,
      "ing": "there",
      "tr1": "orada",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 872,
      "ing": "these",
      "tr1": "bunlar",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 873,
      "ing": "they",
      "tr1": "onlar",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 874,
      "ing": "thing",
      "tr1": "şey",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 875,
      "ing": "think",
      "tr1": "düşünmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 876,
      "ing": "third",
      "tr1": "üçüncü",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 877,
      "ing": "this",
      "tr1": "bu",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 878,
      "ing": "those",
      "tr1": "bunlar",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 879,
      "ing": "though",
      "tr1": "olsa da",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 880,
      "ing": "thought",
      "tr1": "düşündü",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 881,
      "ing": "thousand",
      "tr1": "bin",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 882,
      "ing": "threat",
      "tr1": "tehdit",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 883,
      "ing": "three",
      "tr1": "üç",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 884,
      "ing": "through",
      "tr1": "vasıtasıyla",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 885,
      "ing": "throughout",
      "tr1": "boyunca",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 886,
      "ing": "throw",
      "tr1": "atmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 887,
      "ing": "thus",
      "tr1": "böylece",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 888,
      "ing": "time",
      "tr1": "zaman",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 889,
      "ing": "to",
      "tr1": "mastar (mek, mak)",
      "tr2": "karşı",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 890,
      "ing": "today",
      "tr1": "bugün",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 891,
      "ing": "together",
      "tr1": "birlikte",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 892,
      "ing": "tonight",
      "tr1": "bu gece",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 893,
      "ing": "too",
      "tr1": "çok",
      "tr2": "fazla",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 894,
      "ing": "top",
      "tr1": "üst",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 895,
      "ing": "total",
      "tr1": "toplam",
      "tr2": "tüm",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 896,
      "ing": "tough",
      "tr1": "sert",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 897,
      "ing": "toward",
      "tr1": "-e doğru",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 898,
      "ing": "town",
      "tr1": "kasaba",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 899,
      "ing": "trade",
      "tr1": "ticaret",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 900,
      "ing": "traditional",
      "tr1": "geleneksel",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 901,
      "ing": "training",
      "tr1": "eğitim",
      "tr2": "antrenman",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 902,
      "ing": "travel",
      "tr1": "seyahat",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 903,
      "ing": "treat",
      "tr1": "tedavi etmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 904,
      "ing": "treatment",
      "tr1": "tedavi",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 905,
      "ing": "tree",
      "tr1": "ağaç",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 906,
      "ing": "trial",
      "tr1": "deneme",
      "tr2": "test",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 907,
      "ing": "trip",
      "tr1": "yolculuk",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 908,
      "ing": "trouble",
      "tr1": "sorun",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 909,
      "ing": "true",
      "tr1": "doğru",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 910,
      "ing": "truth",
      "tr1": "hakikat",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 911,
      "ing": "try",
      "tr1": "denemek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 912,
      "ing": "turn",
      "tr1": "çevirmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 913,
      "ing": "two",
      "tr1": "iki",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 914,
      "ing": "type",
      "tr1": "tip",
      "tr2": "tür",
      "tr3": "model",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 915,
      "ing": "under",
      "tr1": "altında",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 916,
      "ing": "understand",
      "tr1": "anlamak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 917,
      "ing": "unit",
      "tr1": "ünite",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 918,
      "ing": "until",
      "tr1": "-a kadar",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 919,
      "ing": "up",
      "tr1": "yukarı",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 920,
      "ing": "upon",
      "tr1": "üzerinde",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 921,
      "ing": "us",
      "tr1": "bize",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 922,
      "ing": "use",
      "tr1": "kullanmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 923,
      "ing": "usually",
      "tr1": "genellikle",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 924,
      "ing": "value",
      "tr1": "değer",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 925,
      "ing": "various",
      "tr1": "çeşitli",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 926,
      "ing": "very",
      "tr1": "çok",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 927,
      "ing": "victim",
      "tr1": "kurban",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 928,
      "ing": "view",
      "tr1": "görünüm",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 929,
      "ing": "violence",
      "tr1": "şiddet",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 930,
      "ing": "visit",
      "tr1": "ziyaret etmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 931,
      "ing": "voice",
      "tr1": "ses",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 932,
      "ing": "vote",
      "tr1": "oy",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 933,
      "ing": "wait",
      "tr1": "beklemek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 934,
      "ing": "walk",
      "tr1": "yürümek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 935,
      "ing": "wall",
      "tr1": "duvar",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 936,
      "ing": "want",
      "tr1": "istemek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 937,
      "ing": "war",
      "tr1": "savaş",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 938,
      "ing": "watch",
      "tr1": "izlemek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 939,
      "ing": "water",
      "tr1": "su",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 940,
      "ing": "way",
      "tr1": "yol",
      "tr2": "yön",
      "tr3": "yöntem",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 941,
      "ing": "we",
      "tr1": "biz",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 942,
      "ing": "weapon",
      "tr1": "silah",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 943,
      "ing": "wear",
      "tr1": "giyinmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 944,
      "ing": "week",
      "tr1": "hafta",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 945,
      "ing": "weight",
      "tr1": "ağırlık",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 946,
      "ing": "well",
      "tr1": "daha iyi",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 947,
      "ing": "west",
      "tr1": "batı",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 948,
      "ing": "western",
      "tr1": "batıda",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 949,
      "ing": "what",
      "tr1": "ne",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 950,
      "ing": "whatever",
      "tr1": "her neyse",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 951,
      "ing": "when",
      "tr1": "ne zaman",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 952,
      "ing": "where",
      "tr1": "nerede",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 953,
      "ing": "which",
      "tr1": "hangi",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 954,
      "ing": "while",
      "tr1": "iken",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 955,
      "ing": "white",
      "tr1": "beyaz",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 956,
      "ing": "who",
      "tr1": "kim",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 957,
      "ing": "whom",
      "tr1": "kime",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 958,
      "ing": "whose",
      "tr1": "kimin",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 959,
      "ing": "why",
      "tr1": "niçin",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 960,
      "ing": "wide",
      "tr1": "geniş",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 961,
      "ing": "wife",
      "tr1": "kadın eş",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 962,
      "ing": "win",
      "tr1": "kazanmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 963,
      "ing": "wind",
      "tr1": "rüzgar",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 964,
      "ing": "window",
      "tr1": "pencere",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 965,
      "ing": "wish",
      "tr1": "dilek",
      "tr2": "dilemek",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 966,
      "ing": "with",
      "tr1": "ile",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 967,
      "ing": "within",
      "tr1": "içinde",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 968,
      "ing": "without",
      "tr1": "olmadan",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 969,
      "ing": "woman",
      "tr1": "kadın",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 970,
      "ing": "wonder",
      "tr1": "merak etmek",
      "tr2": "şaşmak",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 971,
      "ing": "word",
      "tr1": "kelime",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 972,
      "ing": "work",
      "tr1": "çalışmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 973,
      "ing": "worker",
      "tr1": "işçi",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 974,
      "ing": "world",
      "tr1": "dünya",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 975,
      "ing": "worry",
      "tr1": "endişe etmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 976,
      "ing": "would",
      "tr1": "cekti",
      "tr2": "caktı",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 977,
      "ing": "write",
      "tr1": "yazmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 978,
      "ing": "writer",
      "tr1": "yazar",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 979,
      "ing": "wrong",
      "tr1": "YANLIŞ",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 980,
      "ing": "yard",
      "tr1": "avlu",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 981,
      "ing": "yarn",
      "tr1": "iplik",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 982,
      "ing": "year",
      "tr1": "yıl",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 983,
      "ing": "yearly",
      "tr1": "yıllık",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 984,
      "ing": "yelling",
      "tr1": "seslenmek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 985,
      "ing": "yes",
      "tr1": "evet",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 986,
      "ing": "yesterday",
      "tr1": "dün",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 987,
      "ing": "yet",
      "tr1": "henüz",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 988,
      "ing": "you",
      "tr1": "sen",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 989,
      "ing": "young",
      "tr1": "genç",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 990,
      "ing": "your",
      "tr1": "senin",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 991,
      "ing": "yourself",
      "tr1": "kendin",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 992,
      "ing": "youth",
      "tr1": "gençlik",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 993,
      "ing": "zebra",
      "tr1": "zebra",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 994,
      "ing": "zeppelin",
      "tr1": "zeplin",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 995,
      "ing": "zipper",
      "tr1": "fermuar",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 996,
      "ing": "zodiac",
      "tr1": "burçlar kuşağı",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 997,
      "ing": "zombie",
      "tr1": "zombi",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 998,
      "ing": "zoo",
      "tr1": "hayvanat bahçesi",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 999,
      "ing": "zoology",
      "tr1": "hayvan bilimi",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 1000,
      "ing": "zoom",
      "tr1": "yakınlaşmak",
      "tr2": "zoom yapmak",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 1001,
      "ing": "frustrating",
      "tr1": "sinir bozucu",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 1002,
      "ing": "examine",
      "tr1": "incelemek",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 1003,
      "ing": "downtown",
      "tr1": "şehir merkezi",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 1004,
      "ing": "frustrated",
      "tr1": "hayal kırıklığına uğramış",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 1005,
      "ing": "good at",
      "tr1": "başarılı olmak",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 1006,
      "ing": "exhibition",
      "tr1": "sergi",
      "tr2": "",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    },
    {
      "id": 1007,
      "ing": "grass",
      "tr1": "çimen",
      "tr2": "otlak",
      "tr3": "",
      "tr4": "",
      "isLearning": false
    }
  ]