import { useState, useEffect } from "react";
import { useSentencePatternsContext } from "../../context/SentencePatternsContext";
import style from "./SentencePatterns.module.scss";
import { FaEye, FaEyeSlash, FaForward } from "react-icons/fa";
import ChooseLanguageBar from "../../components/ChooseLanguageBar/ChooseLanguageBar";

interface SentencePatternsItem {
  id: number;
  ing: string;
  tr: string;
  isLearning: boolean;
}

const SentencePatterns = () => {
  const sentencespattern = useSentencePatternsContext();
  const SentencePatterns = sentencespattern.SentencePatterns;
  const [sentences, setSentences] = useState<SentencePatternsItem>({
    id: 0,
    ing: "",
    tr: "",
    isLearning: false,
  });
  const [answer, setAnswer] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [isShow, setIsShow] = useState<boolean>(false);
  const [translationTypeResult, setTranslationTypeResult] = useState<string>("EnglishToTurkish")

  useEffect(() => {
    const result = SentencePatterns(true);
    setSentences(result)
    setAnswer(false);
    setInputValue("")
    setIsShow(false)
  }, [answer, translationTypeResult])

  const handleSubmitNext = () => {
    setAnswer(true)
  }

  const handleSubmitAnsver = () => {
    setInputValue(translationTypeResult === "EnglishToTurkish" ? sentences.tr : sentences.ing)
    setIsShow(true)
  }

  const handleTranslationSelect = (translationType: string) => {
    setTranslationTypeResult(translationType);
  }

  return (
    <div className={style.container}>
      <div className={style.header}> Sentence Pattern Exercise</div>
      <div className={style.sentencesCard}>
        <div className={style.sentencesCardItem}>
        {translationTypeResult === "EnglishToTurkish" ? sentences.ing : sentences.tr}
        </div>
        <div className={style.sentencesCardInput}>{inputValue}</div>
        <div className={style.sentencesCardButtonArea}>
          <button
            className={style.sentencesCardButton}
            type="button"
            onClick={handleSubmitNext}
          >
            <FaForward />
          </button>
          <button
            className={style.sentencesCardButton}
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

export default SentencePatterns;
