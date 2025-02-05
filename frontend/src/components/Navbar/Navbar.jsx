import ProfileInfo from "../Cards/ProfileInfo"
import {useNavigate} from "react-router-dom"
import SearchBar from "../SearchBar/SearchBar"
import { useState } from "react"

const Navbar =({userInfo})=>{
    const [searchQuery, setSearchQuery] = useState("")
    const navigate = useNavigate()
    const onLogout =()=>{
        localStorage.clear()
        navigate("/log-in")  // Fixed path to match Auth component's route
    }
    const handleSearch = ()=>{
        // Empty function but no error
    }

    const onClearSearch = ()=>{
        setSearchQuery("")
    }
    
    return (
        <div className="bg-white flex items-center justify-between px-6 py-7 drop-shadow">
            <h2 className="text-xl font-medium text-black py-2">Notes</h2>
            <SearchBar value={searchQuery} onChange={({target})=>{setSearchQuery(target.value)}} handleSearch={handleSearch} onClearSearch={onClearSearch} />
            <ProfileInfo userInfo={userInfo} onLogout={onLogout}/>
        </div>
    )
}

export default Navbar