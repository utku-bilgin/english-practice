import { useState } from "react";
import { useSentencePatternsContext } from "../../context/SentencePatternsContext";
import style from "./AddNewSentencePatterns.module.scss";
import { useNavigate } from "react-router";

const AddNewSentencePatterns = () => {
  const addNew = useSentencePatternsContext();
  const AddNewSentencePattern = addNew.AddNewSentencePattern;
  const navigate = useNavigate();

  const [ing, setIng] = useState<string>("");
  const [tr, setTr] = useState<string>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (ing && tr) {
      const newWordData = {
        ing,
        tr,
      };
      AddNewSentencePattern(newWordData);
      navigate("../");
    }
  };

  return (
    <div className={style.container}>
      <form className={style.form} onSubmit={handleSubmit}>
        <div className={style.formItem}>
          <label className={style.formItemLbl} htmlFor="ing">
            English
          </label>
          <textarea
            className={style.formItemTxtArea}
            placeholder="..."
            id="ing"
            name="ing"
            value={ing}
            onChange={(e) => setIng(e.target.value)}
          />
        </div>
        <div className={style.formItem}>
          <label className={style.formItemLbl} htmlFor="tr">
            Türkçe
          </label>
          <textarea
            className={style.formItemTxtArea}
            placeholder="..."
            id="tr"
            name="tr"
            value={tr}
            onChange={(e) => setTr(e.target.value)}
          />
        </div>
        <button className={style.formButton} type="submit">
          Ekle
        </button>
      </form>
    </div>
  );
};

export default AddNewSentencePatterns;
