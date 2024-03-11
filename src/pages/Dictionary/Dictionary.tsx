import {useState, useEffect} from "react";
import style from "./Dictionary.module.scss";
import { useDictionaryContext } from "../../context/DictionaryContext";
import SearchBar from "../../components/SearchBar/SearchBar";
import ChooseLanguageBar from "../../components/ChooseLanguageBar/ChooseLanguageBar";

interface DictionaryItem {
  id: number;
  ing: string;
  tr1: string;
  tr2: string;
  tr3: string;
  tr4: string;
  isLearning: boolean;
}

const Dictionary = () => {
  const words = useDictionaryContext();
  const {SearchWords} = words;
  const [dictionary, setDictionary] = useState<DictionaryItem[]>([]);
  const [searchResult, setSearchResult] = useState<string>("");
  const [translationTypeResult, setTranslationTypeResult] = useState<string>("EnglishToTurkish")

  const handleSearch = (search: string) => {
    setSearchResult(search);
  }
  const handleTranslationSelect = (translationType: string) => {
    setTranslationTypeResult(translationType);
  }

  useEffect(() => {
    const filteredWords = SearchWords(searchResult, translationTypeResult);
    setDictionary(filteredWords);
  }, [searchResult, translationTypeResult])

  return (
    <div className={style.container}>
      <div className={style.header}>Dictionary</div>
      <SearchBar onSearch={handleSearch} />
      <ChooseLanguageBar onSelectTranslation={handleTranslationSelect} />
      {dictionary.map((item) => (
        <div key={item.id}>
          {translationTypeResult === "EnglishToTurkish" ? (
            <div className={style.wordCard}>
              <div className={style.wordCardItem}>{item.ing}</div>
              <div>{item.tr1} {item.tr2 && `, ${item.tr2}`} {item.tr3 &&  `, ${item.tr3}`} {item.tr4 && `, ${item.tr4}`}</div>
            </div>
          ) : (
            translationTypeResult === "TurkishToEnglish" && (
              <div className={style.wordCard}>
                <div className={style.wordCardItem}>{item.tr1}</div>
                <div>{item.ing}</div>
              </div>
            )
          )}
        </div>
      ))}
    </div>
  )
}

export default Dictionary