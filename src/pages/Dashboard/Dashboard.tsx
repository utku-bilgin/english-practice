import style from "./Dashboard.module.scss";
import { useNavigate } from "react-router";
import RoutesButton from "../../components/RoutesButton/RoutesButton";
import { useDictionaryContext } from "../../context/DictionaryContext";
import { useSentencePatternsContext } from "../../context/SentencePatternsContext";
// import { useEffect, useState } from "react";



interface ButtonContent {
  id: number;
  index1: string;
  index2: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const wordsC = useDictionaryContext();
  const sentencesC = useSentencePatternsContext();
  // const [wordsCount, setWordsCount] = useState<number>();
  // const [sentencesCount, setSentencesCount] = useState<number>();

  // useEffect(() => {
  //   setWordsCount(wordsC.wordsCount)
  //   setSentencesCount(sentencesC.sentencesCount)
  // },[])

  const buttonContent: ButtonContent[] = [
    {
      id: 1,
      index1: "Add new word",
      index2: "Yeni kelime ekle",
    },
    {
      id: 2,
      index1: "Word list",
      index2: "Kelime listesi",
    },
    {
      id: 3,
      index1: "Add new sentence pattern",
      index2: "Yeni cümle kalıbı ekle",
    },
    {
      id: 4,
      index1: "Sentence pattern list",
      index2: "Cümle kalıbı listesis"
    }

  ];

  const handleClickRoute = (item: ButtonContent) => {
    switch (item.id){
      case 1:
        navigate("./addnewword");
        break;
      case 2:
        navigate("./wordlist")
        break;
      case 3:
        navigate("./addnewsentencepattern");
        break;
      case 4:
        navigate("./sentencepatternlist")
        break;
      default:
        navigate("./")
        break;
    }
  }



  return (
    <div className={style.container}>
      <div className={style.info}>
        <div className={style.infoContent}>
          <div className={style.infoContentItem}>Kelime sayısı: </div>
          <div>{wordsC.wordsCount}</div>
        </div>
        <div className={style.infoContent}>
          <div className={style.infoContentItem}>Cümle grubu sayısı: </div>
          <div>{sentencesC.sentencesCount}</div>
        </div>
      </div>
      <div className={style.addContentButtonArea}>
      {buttonContent.map((item) => (
        <div key={item.id} onClick={() => handleClickRoute(item)}>
          <RoutesButton  content={item} />
        </div>
      ))}
      </div>
    </div>
  );
};

export default Dashboard;
