import React, {useState} from "react"
import style from "./SearchBar.module.scss"

interface SearchBarProps {
    onSearch: (search: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({onSearch}) => {
    const [search, setSearch] = useState<string>("");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSearch(search);
    }
  return (
    <div className={style.container}>
        <form onSubmit={handleSubmit} className={style.form}>
            <input className={style.formSearch} type="text" placeholder="Search..." value={search} onChange={handleInputChange} />
            <button className={style.formBtn} type="submit">Search</button>
        </form>
    </div>
  )
}

export default SearchBar