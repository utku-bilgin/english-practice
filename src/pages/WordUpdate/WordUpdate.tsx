import { useState } from "react";
import { useNavigate } from "react-router";
import style from "./WordUpdate.module.scss";
import { useDictionaryContext } from "../../context/DictionaryContext";
import { useLocation } from 'react-router-dom';

interface UpdateWordItem {
    id: number;
    ing: string;
    tr1: string;
    tr2: string;
    tr3: string;
    tr4: string;
  }

const WordUpdate = ( ) => {
    const update = useDictionaryContext();
    const {UpdateWord} = update;
    const navigate = useNavigate();
    const location = useLocation();

    const { item } = location.state as { item: UpdateWordItem };
  
    const [ing, setIng] = useState<string>(item.ing);
    const [tr1, setTr1] = useState<string>(item.tr1);
    const [tr2, setTr2] = useState<string>(item.tr2);
    const [tr3, setTr3] = useState<string>(item.tr3);
    const [tr4, setTr4] = useState<string>(item.tr4);
    
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (ing && tr1) {
      const updateWordData = {
        id: item.id,
        ing,
        tr1,
        tr2,
        tr3,
        tr4,
      };
      UpdateWord(updateWordData);
      navigate("../");
    }
  };
  return (
    <div className={style.container}>
      <form className={style.form} onSubmit={handleSubmit}>
        <div className={style.formArea}>
          <div className={style.formAreaPart}>
            <div className={style.formItem}>
              <label className={style.formItemLbl} htmlFor="ing">
                Ing
              </label>
              <input
                className={style.formItemInp}
                type="text"
                name="ing"
                id="ing"
                value={ing}
                onChange={(e) => setIng(e.target.value)}
              />
            </div>
          </div>
          <div className={style.formAreaPart}>
            <div className={style.formItem}>
              <label className={style.formItemLbl} htmlFor="tr1">
                Tr1
              </label>
              <input
                className={style.formItemInp}
                type="text"
                name="tr1"
                id="tr1"
                value={tr1}
                onChange={(e) => setTr1(e.target.value)}
              />
            </div>
            <div className={style.formItem}>
              <label className={style.formItemLbl} htmlFor="tr2">
                Tr2
              </label>
              <input
                className={style.formItemInp}
                type="text"
                name="tr2"
                id="tr2"
                value={tr2}
                    onChange={(e) => setTr2(e.target.value)}
              />
            </div>
            <div className={style.formItem}>
              <label className={style.formItemLbl} htmlFor="tr3">
                Tr3
              </label>
              <input
                className={style.formItemInp}
                type="text"
                name="tr3"
                id="tr3"
                value={tr3}
                    onChange={(e) => setTr3(e.target.value)}
              />
            </div>
            <div className={style.formItem}>
              <label className={style.formItemLbl} htmlFor="tr4">
                Tr4
              </label>
              <input
                className={style.formItemInp}
                type="text"
                name="tr4"
                id="tr4"
                value={tr4}
                    onChange={(e) => setTr4(e.target.value)}
              />
            </div>
          </div>
        </div>
        <button className={style.formButton} type="submit">
          Update
        </button>
      </form>
    </div>
  )
}

export default WordUpdate