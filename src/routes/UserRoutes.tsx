import { Route, Routes } from "react-router"
import Home from "../pages/Home/Home"
import Dictionary from "../pages/Dictionary/Dictionary"
import Vocabulary from "../pages/Vocabulary/Vocabulary"
import SentencePatterns from "../pages/SentencePatterns/SentencePatterns"

const UserRoutes = () => {
  return (
    <div>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/dictionary" element={<Dictionary />} />
            <Route path="/vocabulary" element={<Vocabulary />} />
            <Route path="/sentence-patterns" element={<SentencePatterns />} />
        </Routes>
    </div>
  )
}

export default UserRoutes