import { useState, useEffect } from "react";
import style from "./Vocabulary.module.scss";
import { useDictionaryContext } from "../../context/DictionaryContext";
import { FaEye, FaEyeSlash, FaForward } from "react-icons/fa";
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

const Vocabulary = () => {
  const words = useDictionaryContext();
  const VocabularyWords = words.VocabularyWords;
  const [vocabulary, setVocabulary] = useState<DictionaryItem>({
    id: 0,
    ing: "",
    tr1: "",
    tr2: "",
    tr3: "",
    tr4: "",
    isLearning: false,
  });
  const [inputValue, setInputValue] = useState<string>("");
  const [answer, setAnswer] = useState<boolean>(false);
  const [alert, setAlert] = useState<string>("");
  const [isShow, setIsShow] = useState<boolean>(false);
  const [translationTypeResult, setTranslationTypeResult] =
    useState<string>("EnglishToTurkish");

  useEffect(() => {
    const result = VocabularyWords(true);
    setVocabulary(result);
    setAnswer(false);
    setInputValue("");
    setIsShow(false);
  }, [answer, translationTypeResult]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const checkTranslation = () => {
    const translations =
      translationTypeResult === "EnglishToTurkish"
        ? [vocabulary.tr1, vocabulary.tr2, vocabulary.tr3, vocabulary.tr4]
        : [vocabulary.ing];

    const isCorrectTranslation = translations.some(
      (translation) =>
        translation.toLowerCase() === inputValue.toLowerCase() &&
        inputValue !== ""
    );

    setAnswer(isCorrectTranslation);
    setAlert(isCorrectTranslation ? "true" : "false");
  };

  const handleSubmit = () => {
    if (inputValue !== "") {
      checkTranslation();
    }

    setTimeout(() => {
      setAlert("");
    }, 2000);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleSubmit();
  };

  const handleSubmitAnsver = () => {
    setInputValue(
      translationTypeResult === "EnglishToTurkish"
        ? vocabulary.tr1
        : vocabulary.ing
    );
    setIsShow(true);
  };

  const handleTranslationSelect = (translationType: string) => {
    setTranslationTypeResult(translationType);
  };

  return (
    <div className={style.container}>
      <div className={style.header}> Vocabulary Exercise</div>
      <div className={style.vocabularyCard}>
        <div
          className={`${style.vocabularyCardItem} ${
            alert === "" ? "" : alert === "false" ? style.false : style.true
          }`}
        >
          {translationTypeResult === "EnglishToTurkish"
            ? vocabulary.ing
            : vocabulary.tr1}
        </div>
        <input
          className={style.vocabularyCardInput}
          type="text"
          placeholder="..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <div className={style.vocabularyCardButtonArea}>
          <button
            className={style.vocabularyCardButton}
            type="button"
            onClick={handleSubmit}
          >
            <FaForward />
          </button>
          <button
            className={style.vocabularyCardButton}
            type="button"
            onClick={handleSubmitAnsver}
          >
            {isShow ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>
        <ChooseLanguageBar onSelectTranslation={handleTranslationSelect} />
      </div>
    </div>
  );
};

export default Vocabulary;
