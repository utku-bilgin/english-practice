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
        // const response = await axios.get("/db.json");
        setSentences(sentencesData);
        setSentencesCount(sentencesData.length);
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

const sentencesData: SentencePatternsItem[] = [
  {
    "id": 1,
    "ing": "Today wasn't cloudly nor sunny",
    "tr": "Bugün bulutlu değil güneşli de değil",
    "isLearning": false
  },
  {
    "id": 2,
    "ing": "She doesn't like pizza nor does she like pasta",
    "tr": "O ne pizza sever ne de makarna",
    "isLearning": false
  },
  {
    "id": 3,
    "ing": "I neither want to go outside nor to speak",
    "tr": "Ne dışarı çıkmak istiyorum ne de konuşmak",
    "isLearning": false
  },
  {
    "id": 4,
    "ing": "I neither watch nor like footbal",
    "tr": "Futbolu ne izlerim ne de severim",
    "isLearning": false
  },
  {
    "id": 5,
    "ing": "Either you or I should talk to him",
    "tr": "Ya sen ya da ben onunla konuşmalıyız",
    "isLearning": false
  },
  {
    "id": 6,
    "ing": "Either she will come to the meeting or her friend will attend",
    "tr": "Toplantıya ya o ya da arkadaşı katılacak",
    "isLearning": false
  },
  {
    "id": 7,
    "ing": "I was so tired yet I couldn't sleep",
    "tr": "Çok yorgundum ama uyuyamadım",
    "isLearning": false
  },
  {
    "id": 8,
    "ing": "I'm so happy for I bought a new car",
    "tr": "Çok mutluyum çünkü yeni bir araba aldım",
    "isLearning": false
  },
  {
    "id": 9,
    "ing": "Both I and my nephew are going to swim",
    "tr": "Hem ben hemde yeğenim yüzmeye gidiyoruz",
    "isLearning": false
  },
  {
    "id": 10,
    "ing": "I'm not only speaking Turkish but also English",
    "tr": "Sadece Türkçe değil İngilizcede konuşuyorum",
    "isLearning": false
  },
  {
    "id": 11,
    "ing": "I don't know whether I'm coming or not",
    "tr": "Doğru yada yanlış olup olmadığını bilmiyorum",
    "isLearning": false
  },
  {
    "id": 12,
    "ing": "He asked me whether I was born in İstanbul or not",
    "tr": "O, bana İstanbul'da doğup doğmadığımı sordu",
    "isLearning": false
  },
  {
    "id": 13,
    "ing": "She asked me whether I was coming or not",
    "tr": "O, bana gelip gelmeyeceğimi sordu",
    "isLearning": false
  },
  {
    "id": 14,
    "ing": "Have you made a decision about whether to go to the movies or not ?",
    "tr": "Filme gidip gitmeyeceğine karar verdin mi ?",
    "isLearning": false
  },
  {
    "id": 15,
    "ing": "You must take the medicine whether you want to or not",
    "tr": "İlacı istesende istemesende almalısın",
    "isLearning": false
  },
  {
    "id": 16,
    "ing": "They will attend the trip, whether they want to or not",
    "tr": "Onlar isteselerde istemeselerde geziye katılacaklar",
    "isLearning": false
  },
  {
    "id": 17,
    "ing": "I don't know whether I'm caming or not",
    "tr": "Gelip gelmeyeceğimi bilmiyorum",
    "isLearning": false
  },
  {
    "id": 18,
    "ing": "Thougt it was raiining I didn't take my umbrella",
    "tr": "Yağmur yağmasına rağmen şemsiye almadım",
    "isLearning": false
  },
  {
    "id": 19,
    "ing": "Since I'm her big sister therefore, she has to respect",
    "tr": "Ben onun ablasıyım, bu nedenle saygı duymak zorunda",
    "isLearning": false
  },
  {
    "id": 20,
    "ing": "I'm here as a tourist",
    "tr": "Turist olarak geliyorum",
    "isLearning": false
  },
  {
    "id": 21,
    "ing": "How long do you plan to stay here ?",
    "tr": "Burada ne kadar kalmayı planlıyor sunuz ?",
    "isLearning": false
  },
  {
    "id": 22,
    "ing": "Where do you plan to stay ?",
    "tr": "Nerede kalmayı planlıyor sunuz ?",
    "isLearning": false
  },
  {
    "id": 23,
    "ing": "Are these novels on the table yours Lilly ?",
    "tr": "Masanın üzerinde duran şu romanlar senin mi Lilly ?",
    "isLearning": false
  },
  {
    "id": 24,
    "ing": "I borrowed them from the library for a week",
    "tr": "Onları bir haftalığına kütüphaneden ödünç aldım",
    "isLearning": false
  },
  {
    "id": 25,
    "ing": "I'm not sure but possibly it is vice versa",
    "tr": "Emin değilim ama muhtemelen tam tersi",
    "isLearning": false
  },
  {
    "id": 26,
    "ing": "Is there any room for me in the car?",
    "tr": "Arabada bana da yer var mı?",
    "isLearning": false
  },
  {
    "id": 27,
    "ing": "Must I laugh all the time?",
    "tr": "Sürekli gülmek zorunda mıyım?",
    "isLearning": false
  },
  {
    "id": 28,
    "ing": "I would do",
    "tr": "Yapardım",
    "isLearning": false
  },
  {
    "id": 29,
    "ing": "I would write",
    "tr": "Yazardım",
    "isLearning": false
  },
  {
    "id": 30,
    "ing": "I pick out and oufit",
    "tr": "Kıyafet seçiyorum",
    "isLearning": false
  },
  {
    "id": 31,
    "ing": "I hold up the sweater",
    "tr": "Kazağı tutuyorum",
    "isLearning": false
  },
  {
    "id": 32,
    "ing": "I check out the t-shirts",
    "tr": "Tişörtleri kontrol ediyorum",
    "isLearning": false
  },
  {
    "id": 33,
    "ing": "We can also drink some coffe there",
    "tr": "Orada birer kahve içebiliriz",
    "isLearning": false
  },
  {
    "id": 34,
    "ing": "We can go that restaurant across the street",
    "tr": "Yolun karşısındaki şu restorana gidebiliriz",
    "isLearning": false
  },
  {
    "id": 35,
    "ing": "Where does he find so much energy early in the morning ?",
    "tr": "Sabahın köründe bu kadar enerjiyi nereden buluyor ?",
    "isLearning": false
  },
  {
    "id": 36,
    "ing": "I can't even get up in the morning to go to work.",
    "tr": "Sabahları işe gitmek için bile kalkamıyorum",
    "isLearning": false
  },
  {
    "id": 37,
    "ing": "He runs his own marketing company",
    "tr": "Kendi pazarlama şirketini işletiyor",
    "isLearning": false
  },
  {
    "id": 38,
    "ing": "I like most of my classes at school, but especially music class",
    "tr": "Okuldaki derslerimin pek çoğunu seviyorum ama özellikle de müzik dersini",
    "isLearning": false
  },
  {
    "id": 39,
    "ing": "Although I am angry, I can keep my courtesy",
    "tr": "Kızgın olmama rağmen, nezaketimi(saygımı) koruyabilirim",
    "isLearning": false
  },
  {
    "id": 40,
    "ing": "Though she saw the danger,she wasn't afraid",
    "tr": "Tehlikeyi görmesine rağmen korkmadı",
    "isLearning": false
  },
  {
    "id": 41,
    "ing": "I didn't eat dinner even though i was starwing",
    "tr": "Açlıktan ölmeme rağmen yemek yemedim.",
    "isLearning": false
  },
  {
    "id": 42,
    "ing": "I didn't understand anything even though I came to class.",
    "tr": "Derse gelmeme rağmen hiçbir şey anlamadım",
    "isLearning": false
  },
  {
    "id": 43,
    "ing": "If I didn't like you, I wouldn't talk to you",
    "tr": "Eğer senden hoşlanmasaydım,seninle konuşmazdım.",
    "isLearning": false
  },
  {
    "id": 44,
    "ing": "I would be sad unless he come on vacation with me.",
    "tr": "Benimle tatile gelmezse çok üzülürüm.",
    "isLearning": false
  },
  {
    "id": 45,
    "ing": "in case of fire",
    "tr": "Yangın durumunda ",
    "isLearning": false
  },
  {
    "id": 46,
    "ing": "in the event of rain",
    "tr": "Yağmur yağması durumunda",
    "isLearning": false
  },
  {
    "id": 47,
    "ing": "You should call the fire brigade in case of fire",
    "tr": "Yangın durumunda itfaiyeyi aramalısın",
    "isLearning": false
  },
  {
    "id": 48,
    "ing": "I will take my umbrella with me in case it rains",
    "tr": "Yağmur yağarsa diye şemsiyemi yanıma alacağım",
    "isLearning": false
  },
  {
    "id": 49,
    "ing": "I had my winter tires installed in case it snowed",
    "tr": "Kar yağarsa diye kışlık lastiklerimi taktırdım",
    "isLearning": false
  },
  {
    "id": 50,
    "ing": "In case you should need to reach me,my mobile will be on",
    "tr": "Olur da bana ulaşman gerekirse telefonum açık olacak(olur da=should)",
    "isLearning": false
  },
  {
    "id": 51,
    "ing": "In case of an emergency, call an ambulance",
    "tr": "Acil bir durumda ambulans çağırın.",
    "isLearning": false
  },
  {
    "id": 52,
    "ing": "In the event of an earthquake ",
    "tr": "Deprem durumunda",
    "isLearning": false
  },
  {
    "id": 53,
    "ing": "Call me in case you see him",
    "tr": "Onu görmen durumunda beni ara",
    "isLearning": false
  },
  {
    "id": 54,
    "ing": "You should close the windows in the event that it rains",
    "tr": "Yağmur yağması durumunda/halinde camları kapatmalısın",
    "isLearning": false
  },
  {
    "id": 55,
    "ing": "You may return our product in case you don't like it",
    "tr": "Ürünümüzü beğenmemeniz durumunda iade edebilirsiniz",
    "isLearning": false
  },
  {
    "id": 56,
    "ing": "I will be at home in the event that you should need to reach me",
    "tr": "Olur da bana ulaşman gerekirse evde olacağım",
    "isLearning": false
  },
  {
    "id": 57,
    "ing": "What should we do in case of an accident?",
    "tr": "Kaza durumunda ne yapmalıyız?",
    "isLearning": false
  },
  {
    "id": 58,
    "ing": "If you don't water flowers,they dry up",
    "tr": "Çiçekleri sulamazsan kururlar.",
    "isLearning": false
  },
  {
    "id": 59,
    "ing": "If I get money,I can travel around the world",
    "tr": "Eğer para kazanırsam, dünyayı dolaşabilirim.",
    "isLearning": false
  },
  {
    "id": 60,
    "ing": "If you work hard, you will travel the whole world",
    "tr": "Çok çalışırsan, tüm dünyayı gezersin",
    "isLearning": false
  },
  {
    "id": 61,
    "ing": "If she came earlier,she could see me",
    "tr": "Daha erken gelseydi, beni görebilirdi",
    "isLearning": false
  },
  {
    "id": 62,
    "ing": "If I had studied more,I would pass the exam",
    "tr": "Daha fazla çalışsaydım, sınavı geçebilirdim.",
    "isLearning": false
  },
  {
    "id": 63,
    "ing": "If I were a good cyclist, I would cycle to the end of the world",
    "tr": "İyi bir bisikletçi olsaydım, dünyanın sonuna kadar bisiklet sürerdim",
    "isLearning": false
  },
  {
    "id": 64,
    "ing": "If I learning Arabic were piece of cake,I would give it try",
    "tr": "Arapça öğrenmek çocuk oyuncağı olsaydı,denerdim.",
    "isLearning": false
  },
  {
    "id": 65,
    "ing": "If they had been more careful,this would not have happened",
    "tr": "Eğer daha dikkatli olsalardı, bunlar olmazdı",
    "isLearning": false
  },
  {
    "id": 66,
    "ing": "If you arrived a little earlier, you could meet her",
    "tr": "Biraz daha erken gelseydin, onunla tanışabilirdin",
    "isLearning": false
  },
  {
    "id": 67,
    "ing": "If you had run faster, you could have overtaken him",
    "tr": "Eğer daha hızlı koşsaydın, onu geçebilirdin.",
    "isLearning": false
  },
  {
    "id": 68,
    "ing": "If you call me names again, I won't talk to you.",
    "tr": "Eğer bana bir daha isim takarsan, seninle konuşmam",
    "isLearning": false
  },
  {
    "id": 69,
    "ing": "If she didn't mend her ways,she would be in trouble",
    "tr": "Eğer davranışlarını düzeltmezse, başı belaya girecek.",
    "isLearning": false
  },
  {
    "id": 70,
    "ing": "If you had practiced well,you could have delivered better performance",
    "tr": "İyi çalışmış olsaydınız, daha iyi bir performans sergileyebilirdiniz",
    "isLearning": false
  },
  {
    "id": 71,
    "ing": "If you take good care of your health,you will not fall ill often",
    "tr": "Sağlığınıza iyi bakarsanız, sık sık hastalanmazsınız",
    "isLearning": false
  },
  {
    "id": 72,
    "ing": "If children don't receive adequate love and care during their formative yeras,they will develop behavior problems",
    "tr": "Çocuklar gelişim dönemlerinde yeterli sevgi ve ilgi görmezlerse, davranış problemleri geliştireceklerdir.",
    "isLearning": false
  },
  {
    "id": 73,
    "ing": "If you learned your lessons regularly,you would receive higher marks",
    "tr": "Derslerini düzenli olarak öğrenseydin, daha yüksek notlar alırdın",
    "isLearning": false
  },
  {
    "id": 74,
    "ing": "Let's stop here",
    "tr": "Burada duralım",
    "isLearning": false
  },
  {
    "id": 75,
    "ing": "This place looks nice for a picnic",
    "tr": "Bu yer piknik için güzel görünüyor",
    "isLearning": false
  },
  {
    "id": 76,
    "ing": "Let's sit over there",
    "tr": "Oraya oturalım",
    "isLearning": false
  },
  {
    "id": 77,
    "ing": "Let's go over there",
    "tr": "Oraya gidelim",
    "isLearning": false
  },
  {
    "id": 78,
    "ing": "Let's sit there by that tree",
    "tr": "Ağacın yanında oturalım",
    "isLearning": false
  },
  {
    "id": 79,
    "ing": "You go ahead",
    "tr": "Sen devam et",
    "isLearning": false
  },
  {
    "id": 80,
    "ing": "Did you bring the picnic basket?",
    "tr": "Piknik sepetini getirdin mi?",
    "isLearning": false
  },
  {
    "id": 81,
    "ing": "I cleaned it thoroughly",
    "tr": "İyice temizledim. (thoroughly)",
    "isLearning": false
  },
  {
    "id": 82,
    "ing": "Did you find the paper plates?",
    "tr": "Kağıt tabakları buldun mu?",
    "isLearning": false
  },
  {
    "id": 83,
    "ing": "You didn't forget the milk and sugar, did you?",
    "tr": "Süt ve şekeri unutmadın değil mi?(dimi)",
    "isLearning": false
  },
  {
    "id": 84,
    "ing": "Did you get the rug?",
    "tr": "Halıyı aldın mı?",
    "isLearning": false
  },
  {
    "id": 85,
    "ing": "I folded the rug and put in the trunk",
    "tr": "Halıyı katladım ve bagaja koydum.",
    "isLearning": false
  },
  {
    "id": 86,
    "ing": "She really asked a lot of question.",
    "tr": "O gerçekten çok soru sordu.",
    "isLearning": false
  },
  {
    "id": 87,
    "ing": "I wanted to ask about her",
    "tr": "Onun halini hatrını sormak istedim",
    "isLearning": false
  },
  {
    "id": 88,
    "ing": "We can have a picnic at the forest",
    "tr": "Ormanda piknik yapabiliriz",
    "isLearning": false
  },
  {
    "id": 89,
    "ing": "With whom?",
    "tr": "Kiminle?",
    "isLearning": false
  },
  {
    "id": 90,
    "ing": "Do you know where the sports shop is?",
    "tr": "Spor mağazası nerede biliyor musun?",
    "isLearning": false
  },
  {
    "id": 91,
    "ing": "How can I go to Taksim?",
    "tr": "Taksime nasıl gidebilirim?",
    "isLearning": false
  },
  {
    "id": 92,
    "ing": "Go straight ahead.Take the first right.",
    "tr": "Düz git.İlk sağa dön",
    "isLearning": false
  },
  {
    "id": 93,
    "ing": " You'll see the Spinach Bar at the end of the park",
    "tr": " Parkın sonunda Ispanak Bar'ı göreceksin",
    "isLearning": false
  },
  {
    "id": 94,
    "ing": "I am going to out of work late",
    "tr": "İşten geç çıkıyorum",
    "isLearning": false
  },
  {
    "id": 95,
    "ing": "What time is the store closed?",
    "tr": "Mağaza kaçta kapanıyor?",
    "isLearning": false
  },
  {
    "id": 96,
    "ing": "You can get permission from the boss",
    "tr": "Patrondan izin alabilirsin.",
    "isLearning": false
  },
  {
    "id": 97,
    "ing": "Are you cross with me ?",
    "tr": "Küs müyüz?",
    "isLearning": false
  },
  {
    "id": 98,
    "ing": "Don't ask if I'm happy, you know that I'm not",
    "tr": "Mutlu olup olmadığımı sorma,olmadığımı biliyorsun",
    "isLearning": false
  },
  {
    "id": 99,
    "ing": "I can say I'm not sad",
    "tr": "En azından üzgün değilim diyebilirim",
    "isLearning": false
  },
  {
    "id": 100,
    "ing": "Roll up your sleeves",
    "tr": "Kollarını sıva(El yıkarken vs)",
    "isLearning": false
  },
  {
    "id": 101,
    "ing": "Turn on the faucet",
    "tr": "Musluğu aç",
    "isLearning": false
  },
  {
    "id": 102,
    "ing": "Pomp some soap",
    "tr": "Biraz sabun pompala(sık anlamında)",
    "isLearning": false
  },
  {
    "id": 103,
    "ing": "Lather up",
    "tr": "Köpürt",
    "isLearning": false
  },
  {
    "id": 104,
    "ing": "Is this car yours?",
    "tr": "Bu araba sizin mi?",
    "isLearning": false
  },
  {
    "id": 105,
    "ing": "No,it's not my car.Mine is over there",
    "tr": "Hayır,o araba benim değil.Benimki orada",
    "isLearning": false
  },
  {
    "id": 106,
    "ing": "Whose is it?",
    "tr": "Kimin?",
    "isLearning": false
  },
  {
    "id": 107,
    "ing": "This is the entrance to the garage",
    "tr": "Burası garajın girişi",
    "isLearning": false
  },
  {
    "id": 108,
    "ing": "This car can't be here",
    "tr": "Araba burada olamaz",
    "isLearning": false
  },
  {
    "id": 109,
    "ing": "It's blocking the driveway",
    "tr": "Otoparkın giriş çıkışını engelliyor.",
    "isLearning": false
  },
  {
    "id": 110,
    "ing": "Would you like to help me find the owner of the car?",
    "tr": "Arabanın sahibini bulmama yardım etmek ister misin?",
    "isLearning": false
  },
  {
    "id": 111,
    "ing": "There is a phone number on the windshield",
    "tr": "Ön camda telefon numarası var.",
    "isLearning": false
  },
  {
    "id": 112,
    "ing": "Otherwise,I can call the police and they can tow the car",
    "tr": "Aksi takdirde polisi arayabilirim ve onlar arabayı çekebilir",
    "isLearning": false
  },
  {
    "id": 113,
    "ing": "Look, a man is coming towards us",
    "tr": "Bak,bir adam bize doğru geliyor.",
    "isLearning": false
  },
  {
    "id": 114,
    "ing": "Are you aware?",
    "tr": "Farkında mısın?",
    "isLearning": false
  },
  {
    "id": 115,
    "ing": "Are you aware that you are illegally parked?",
    "tr": "Hatalı park ettiğinizin farkında mısınız?",
    "isLearning": false
  },
  {
    "id": 116,
    "ing": "You can't park your car in front of the driveway",
    "tr": "Otoparkın önüne arabanı park edemezsin",
    "isLearning": false
  },
  {
    "id": 117,
    "ing": "I can pull it away",
    "tr": "Çekebilirim",
    "isLearning": false
  },
  {
    "id": 118,
    "ing": "be careful next time",
    "tr": "Bir dahaki sefere dikkatli ol",
    "isLearning": false
  },
  {
    "id": 119,
    "ing": "The way I see life is changing",
    "tr": "Hayata bakış açım değişiyor",
    "isLearning": false
  }
]
