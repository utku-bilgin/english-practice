import style from "./SentencePatternUpdate.module.scss";
import { useState } from "react";
import { useSentencePatternsContext } from "../../context/SentencePatternsContext";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";

interface UpdateSentencePatternsItem {
  id: number;
  ing: string;
  tr: string;
}

const SentencePatternUpdate = () => {
  const addNew = useSentencePatternsContext();
  const AddNewSentencePattern = addNew.AddNewSentencePattern;
  const navigate = useNavigate();
  const location = useLocation();

  const { item } = location.state as { item: UpdateSentencePatternsItem };

  const [ing, setIng] = useState<string>(item.ing);
  const [tr, setTr] = useState<string>(item.tr);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (ing && tr) {
      const updateSentencedData = {
        id: item.id,
        ing,
        tr,
      };
      AddNewSentencePattern(updateSentencedData);
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
          Update
        </button>
      </form>
    </div>
  );
};

export default SentencePatternUpdate;
