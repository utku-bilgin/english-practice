import { FaUserTie } from "react-icons/fa6";
import style from "./Header.module.scss"
import { useNavigate } from "react-router"

const Header = () => {
    const navigate = useNavigate();

    const handleClickRouteHomePage = () => {
        navigate("/")
    }

    const handleClickRouteAdminPage = () => {
      navigate("/admin")
    }
  return (
    <div className={style.container}>
        <img className={style.logo} src="logo.png" alt="logo" onClick={handleClickRouteHomePage} />
        <FaUserTie className={style.adminLogin} onClick={handleClickRouteAdminPage} />
    </div>
  )
}

export default Header