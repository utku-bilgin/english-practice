import {useState} from "react"
import style from "./ChooseLanguageBar.module.scss";

interface ChooseLanguageBarProps {
    onSelectTranslation: (translationType: string) => void;
}

const ChooseLanguageBar: React.FC<ChooseLanguageBarProps> = ({ onSelectTranslation }) => {
    const [selectedTranslation, setSelectedTranslation] = useState<string>("EnglishToTurkish")
    
    const handleTranslationSelect = (translationType: string) => {
        setSelectedTranslation(translationType);
        onSelectTranslation(translationType);
    }
  
    return (
    <div className={style.container}>
      <form className={style.form}>
        <button
        className={`${style.formBtn} ${selectedTranslation === "EnglishToTurkish" ? style.active : ""}`}
          type="button"
          onClick={() => handleTranslationSelect("EnglishToTurkish")}
        >
          English to Turkish
        </button>
        <button
        className={`${style.formBtn} ${selectedTranslation === "TurkishToEnglish" ? style.active : ""}`}
            type="button"
            onClick={() => handleTranslationSelect("TurkishToEnglish")}
            >Türkçe'den İngilizceye</button>
      </form>
    </div>
  );
};

export default ChooseLanguageBar;
