import { BrowserRouter, Route,  Routes } from "react-router-dom"
import Home from "./pages/home/Home"
import Signup from "./pages/sign-up/Signup"
import Login from "./pages/log-in/Login"
import Fav from "./pages/favourites/Fav"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home/>}/>
          <Route path="/sign-up" element={<Signup/>}/>
          <Route path="/log-in" element={<Login/>}/>
          <Route path="/Favourites" element={<Fav/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
