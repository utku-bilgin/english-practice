import style from "./SentencePatternList.module.scss";
import { useState, useEffect } from "react";
import { useSentencePatternsContext } from "../../context/SentencePatternsContext";
import { FaPen, FaTrash } from "react-icons/fa";
import { Virtuoso } from "react-virtuoso";
import SearchBar from "../../components/SearchBar/SearchBar";
import { useNavigate } from "react-router";

interface SentencePatternsItem {
  id: number;
  ing: string;
  tr: string;
  isLearning: boolean;
}

const SentencePatternList = () => {
  const sentencespattern = useSentencePatternsContext();
  const allSentences = sentencespattern.sentences;
  const { SearchSentences } = sentencespattern;
  const { DeleteSentence } = sentencespattern;

  const [sentences, setSentences] = useState<SentencePatternsItem[]>([]);
  const [searchResult, setSearchResult] = useState<string>("");
  const navigate = useNavigate();

  const handleSearch = (search: string) => {
    setSearchResult(search);
  };

  useEffect(() => {
    const filteredSentences = SearchSentences(searchResult);
    searchResult === ""
      ? setSentences(allSentences)
      : setSentences(filteredSentences);
  }, [searchResult]);

  const handleUpdateSentence = (item: SentencePatternsItem) => {
    navigate(`../sentenceUpdate/`, { state: { item } });
    setSearchResult("");
  };

  const handleDeleteSentence = (id: number) => {
    DeleteSentence(id);
    setSearchResult("");
  };

  return (
    <div className={style.container}>
      <div className={style.header}> Sentence Pattern List</div>
      <SearchBar onSearch={handleSearch} />

      <Virtuoso
        className={style.virtuoso}
        style={{ height: 700 }}
        data={sentences}
        itemContent={(index, item) => {
          return (
            <div key={item.id}>
              <div className={style.sentenceCard}>
                <div className={style.sentenceCardItem}>{item.ing}</div>
                <div>{item.tr}</div>
                <div className={style.management}>
                  <FaPen
                    className={style.update}
                    onClick={() => handleUpdateSentence(item)}
                  />
                  <FaTrash
                    className={style.delete}
                    onClick={() => handleDeleteSentence(item.id)}
                  />
                </div>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};

export default SentencePatternList;
