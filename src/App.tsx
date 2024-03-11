import { Routes, Route } from "react-router";
import style from "./App.module.scss";
import UserRoutes from "./routes/UserRoutes";
import { DictionaryProvider } from "./context/DictionaryContext";
import Header from "./layouts/Header";
import { SentencePatternsProvider } from "./context/SentencePatternsContext";
import AdminRoutes from "./routes/AdminRoutes";

function App() {
  return (
    <div className={style.container}>
      <Header />
      <DictionaryProvider>
        <SentencePatternsProvider>
          <Routes>
            <Route path="/*" element={<UserRoutes />} />
            <Route path="user/*" element={<UserRoutes />} />
            <Route path="admin/*" element={<AdminRoutes />} />
          </Routes>
        </SentencePatternsProvider>
      </DictionaryProvider>
    </div>
  );
}

export default App;

// npx json-server --watch db.json -p 3002