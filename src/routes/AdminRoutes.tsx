import { Route, Routes } from "react-router";
import Dashboard from "../pages/Dashboard/Dashboard";
import AddNewSentencePatterns from "../pages/AddNewSentencePatterns/AddNewSentencePatterns";
import AddNewWord from "../pages/AddNewWord/AddNewWord";
import WordList from "../pages/WordList/WordList";
import WordUpdate from "../pages/WordUpdate/WordUpdate";


const AdminRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/addnewsentencepattern" element={<AddNewSentencePatterns />} />
        <Route path="/addnewword" element={<AddNewWord />} />
        <Route path="/wordlist" element={<WordList />} />
        <Route path="/wordUpdate" element={<WordUpdate />} />
      </Routes>
    </div>
  );
};

export default AdminRoutes;
