import React, { useState, useEffect } from 'react'

import Navbar from '../../components/Navbar/Navbar'
import {useNavigate} from "react-router-dom"
import NoteCard from '../../components/Cards/NoteCard'
import { MdAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import Modal from "react-modal"
import {BACKEND_URL} from "../../utils/config"
import axiosInstance from "../../utils/axiosInstance"

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null
  })

  const [userInfo, setUserInfo] = useState(null)

  const navigate = useNavigate()

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get(`get-user`);
      if(response.data && response.data.user){
        setUserInfo(response.data.user);
      }
    } catch (error) {
        if(error.response.status === 401){
          localStorage.clear();
          navigate("/log-in");
        }
    }
  }

  useEffect(()=>{
    getUserInfo()
    return ()=>{}
  }, [])

  return (
    <>
      <Navbar userInfo={userInfo}/>
      <div className='container mx-auto'>
        <div className='grid grid-cols-3 gap-4 mt-8'>

        <NoteCard 
        title="Meeting on 7th April" 
        date="3rd April 2025" 
        content="This is a reminder for the meet"
        isFavourite={true}
        onEdit={()=>{}}
        onDelete={()=>{}}
        onFavouriteNote={()=>{}}
        />
        
        </div>
      </div>

      <button className='w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-500 hover:bg-blue-600 absolute right-10 bottom-10' onClick={()=>{}}> 
        <MdAdd className='text-[32px] text-white' onClick={()=>{setOpenAddEditModal({isShown: true, type:"add", data: null})}}/>
      </button>

      <Modal isOpen={openAddEditModal.isShown}
      onRequestClose={()=>{}}
      style={{
        overlay: {
          backgroundColor: "rgba(0,0,0,0.2)"
        }
      }}
      contentLabel=""
      className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll">
      <AddEditNotes
        type={openAddEditModal.type} noteData={openAddEditModal.data}
      onClose={()=>{setOpenAddEditModal({isShown: false, type:"add", data: null})}}/>
      </Modal>
     
    </>
  )
}

export default Home