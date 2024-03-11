import { useState, useEffect } from "react";
import { useDictionaryContext } from "../../context/DictionaryContext";
import style from "./WordList.module.scss";
import SearchBar from "../../components/SearchBar/SearchBar";
import ChooseLanguageBar from "../../components/ChooseLanguageBar/ChooseLanguageBar";
import { FaPen } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { Virtuoso } from "react-virtuoso";
import { useNavigate } from "react-router";

interface DictionaryItem {
  id: number;
  ing: string;
  tr1: string;
  tr2: string;
  tr3: string;
  tr4: string;
  isLearning: boolean;
}

const WordList = () => {
  const words = useDictionaryContext();
  const { SearchWords } = words;
  const { DeleteWord } = words;
  const allWords = words.words;
  const [dictionary, setDictionary] = useState<DictionaryItem[]>([]);
  const [searchResult, setSearchResult] = useState<string>("");
  const [translationTypeResult, setTranslationTypeResult] =
    useState<string>("EnglishToTurkish");

  const handleSearch = (search: string) => {
    setSearchResult(search);
  };
  const handleTranslationSelect = (translationType: string) => {
    setTranslationTypeResult(translationType);
  };
  const navigate = useNavigate();
  

  useEffect(() => {
    const filteredWords = SearchWords(searchResult, translationTypeResult);
    searchResult === ""
      ? setDictionary(allWords)
      : setDictionary(filteredWords);
  }, [searchResult, translationTypeResult]);

  const handleDeleteWord = ( id: number ) => {
    DeleteWord(id);
    setSearchResult("");
  }

  const handleUpdateWord = (item: DictionaryItem) => {
    navigate(`../wordUpdate/`, { state: { item } });
    setSearchResult("");
  }

  return (
    <div className={style.container}>
      <div className={style.header}> Word List</div>
      <SearchBar onSearch={handleSearch} />
      <ChooseLanguageBar onSelectTranslation={handleTranslationSelect} />

      <Virtuoso
        className={style.virtuoso}
        style={{ height: 700 }}
        data={dictionary}
        itemContent={(index, item) => {
          return (
            <div key={item.id}>
              {translationTypeResult === "EnglishToTurkish" ? (
                <div className={style.wordCard}>
                  <div className={style.wordCardItem}>{item.ing}</div>
                  <div>
                    {item.tr1} {item.tr2 && `, ${item.tr2}`}{" "}
                    {item.tr3 && `, ${item.tr3}`} {item.tr4 && `, ${item.tr4}`}
                  </div>
                  <div className={style.management}>
                    <FaPen className={style.update} onClick={() => handleUpdateWord(item)} />
                    <FaTrash className={style.delete} onClick={() => handleDeleteWord(item.id)} />
                  </div>
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
          );
        }}
      />
    </div>
  );
};

export default WordList;
