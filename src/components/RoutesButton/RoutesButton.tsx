import style from "./RoutesButton.module.scss";

interface ButtonContent {
  id: number;
  index1: string;
  index2: string;
}

interface Props {
  content: ButtonContent;
}

const RoutesButton: React.FC<Props> = ({ content }) => {
  return <div className={style.container}>
    <div className={style.index1}>{content.index1}</div>
    <div className={style.index2}>{content.index2}</div>
  </div>;
};

export default RoutesButton;
