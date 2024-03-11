import RoutesButton from "../../components/RoutesButton/RoutesButton";
import style from "./Home.module.scss";
import { useNavigate } from "react-router";

interface ButtonContent {
  id: number;
  index1: string;
  index2: string;
}

const Home = () => {
  const navigate = useNavigate();
  const buttonContent: ButtonContent[] = [
    {
      id: 1,
      index1: "Dictionary",
      index2: "Sözlük",
    },
    {
      id: 2,
      index1: "Vocabulary Exercise",
      index2: "Kelime Egzersizi",
    },
    {
      id: 3,
      index1: "Sentence Patterns Exercise",
      index2: "Cümle Kalıpları Egzersizi",
    },
  ];

  const handleClickRoute = (item: ButtonContent) => {
    switch (item.id){
      case 1:
        navigate("./dictionary");
        break;
      case 2:
        navigate("./vocabulary");
        break;
      case 3:
        navigate("./sentence-patterns");
        break;
      default:
        navigate("/")
        break;
    }
  }

  return (
    <div className={style.container}>
      {buttonContent.map((item) => (
        <div key={item.id} onClick={() => handleClickRoute(item)}>
          <RoutesButton  content={item} />
        </div>
      ))}
    </div>
  );
};

export default Home;
