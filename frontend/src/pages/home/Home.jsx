import React, { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import {useNavigate} from "react-router-dom"
import NoteCard from '../../components/Cards/NoteCard'
import { MdAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import Modal from "react-modal"
import {BACKEND_URL} from "../../utils/config"
import axiosInstance from "../../utils/axiosInstance"
import Toast from '../../components/ToastMessage/Toast'
import Footer from '../../components/Footer/Footer'
import AddSpeech from './AddSpeech'

// Home component definition
const Home = () => {
  // State to manage the Add/Edit Notes modal
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null
  })

  // State to manage the toast message
  const [showToastMsg, setShowToastMsg] = useState({
    isShown : false,
    message : "",
    type : "add"
  })

  // State to manage all notes
  const [allNotes, setAllNotes] = useState([])
  // State to manage user information
  const [userInfo, setUserInfo] = useState(null)
  // State to manage search results
  const [searchResults, setSearchResults] = useState(false)

  // Use navigate hook for navigation
  const navigate = useNavigate()

  // Function to handle edit note action
  const handleEdit = (noteDetails)=>{
    setOpenAddEditModal({isShown: true, data: noteDetails, type: "edit"})
  }

  // Function to close the toast message
  const handleCloseToast=()=>{
      setShowToastMsg({
        isShown : false,
        message: ""
      })
  }

  // Function to show a toast message
  const showToastMessage=(message, type)=>{
    setShowToastMsg({
      isShown : true,
      message,
      type
    })
  }

  // Function to handle image upload
  const handleImageUpload = async (file) => {
    try {
      if (!file) {
        showToastMessage("Please select an image", "error");
        return;
      }

      // Prepare form data for image upload
      const formData = new FormData();
      formData.append('image', file);

      // Upload image
      const response = await axiosInstance.post('/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // If image upload is successful, open the Add/Edit Notes modal with the image URL
      if(response.data && response.data.imageUrl) {
        setOpenAddEditModal({
          isShown: true, 
          type: "add", 
          data: {
            content: `\n![Image](${response.data.imageUrl})\n\nAdd your notes here...`,
            title: ""
          }
        });
      }
    } catch (error) {
      // Handle errors during image upload
      if(error.response && error.response.status === 400) {
        showToastMessage("Bad request. Please check the file format.", "error");
      } else {
        showToastMessage("Failed to upload image", "error");
      }
    }
  }

  // Function to get user information
  const getUserInfo = async () => {
    try {
      // Fetch user information
      const response = await axiosInstance.get(`get-user`);
      if(response.data && response.data.user){
        setUserInfo(response.data.user);
      }
    } catch (error) {
        // Handle errors during user information fetch
        if(error.response.status === 401){
          localStorage.clear();
          navigate("/log-in");
        } else if(error.response.status === 400) {
          showToastMessage("Bad request. Please check your credentials.", "error");
        }
    }
  }

  // Function to get all notes
  const getAllNotes = async ()=>{
    try {
      // Fetch all notes
      const response = await axiosInstance.get("get-all-notes")
      console.log("Notes response:", response.data) // Log the response to debug

      // Update state with fetched notes
      if(response.data && response.data.notes){
        setAllNotes(response.data.notes)
      } else {
        console.log("No notes found in response:", response.data)
      }
    } catch (error) {
      // Handle errors during notes fetch
      console.error("Error fetching notes:", error)
      console.log("An unexpected error occurred. Please try again") 
    }
  }

  // Function to handle audio recording
  const handleRecordAudio = async () => {
    const text = handleOnRecord()
    try {
      // Open the Add/Edit Notes modal with the recorded audio text
      setOpenAddEditModal({
        isShown: true, 
        type: "add", 
        data: {
          content: text,
          title: ""
        }
      });
    } catch (error) {
      console.error("Error handling audio recording:", error);
    }
  }

  // Function to handle recording
  function handleOnRecord() {
    const recognitionRef = useRef();

    const [isActive, setIsActive] = useState(false);
    const [text, setText] = useState('');
    const [isSpeechDetected, setIsSpeechDetected] = useState(false);

    if (isActive) {
      recognitionRef.current?.stop();
      setIsActive(false);
      setIsSpeechDetected(false); // Added to reset speech detection state
      return;
    }

    speak(' ');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    recognitionRef.current.onstart = function() {
      setIsActive(true);
      setIsSpeechDetected(true); // Added to set speech detection state
    }

    recognitionRef.current.onend = function() {
      setIsActive(false);
      setIsSpeechDetected(false); // Added to reset speech detection state
    }

    recognitionRef.current.onresult = async function(event) {
      const transcript = event.results[0][0].transcript;

      setText(transcript);

      speak(transcript);
    }

    recognitionRef.current.start();
  }

  // Function to delete a note
  const deleteNote = async (data)=>{
    const noteId = data._id
    try {
        // Delete the note
        const response = await axiosInstance.delete("/delete-note/"+ noteId)

        // If deletion is successful, fetch all notes again
        if(response.data && !response.data.error){
            getAllNotes()
            
        }
    } catch (error) {
        // Handle errors during note deletion
        if(
            error.response && 
            error.response.data &&
            error.response.data.message
        ){
        console.log("An error occurred while deleting the note:")
        }
    }
  }

  // Function to search notes
  const onSearchNote = async (query)=>{
    try {
      // Fetch notes based on search query
      const response = await axiosInstance.get("/search-notes", {
        params : {query}
      })

      // If search is successful, update state with search results
      if(response.data && response.data.notes){
        setSearchResults(true)
        setAllNotes(response.data.notes)
      }
    } catch (error) {
      // Handle errors during search
      console.error("Error searching notes:", error)
    }
  }

  // Function to clear search results
  const handleClearSearch = ()=>{
    setSearchResults(false)
    getAllNotes()
  }

  // Function to handle favourite note action
  const handleFavouriteNote = async (data)=>{
    const noteId = data._id
    
    try {
      // Update the favourite status of the note
      const response = await axiosInstance.put("/update-note-favourite/"+ noteId ,{isFavourite: !data.isFavourite})
      if(response.data && !response.data.error){ 
        getAllNotes()
      }
    } catch (error) {
      // Handle errors during favourite note update
      console.error("Error updating favourite note:", error)
    }
  }

  // UseEffect to fetch all notes and user information on component mount
  useEffect(()=>{
    getAllNotes()
    getUserInfo()
    return ()=>{}
  }, [])

  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch}/>
      <div className='container mx-auto'>
        <div className='grid grid-cols-3 gap-4 mt-8'>
        {allNotes && allNotes.length > 0 ? (
          allNotes.map((item, index)=> (
            <NoteCard key={item._id}
            title={item.title}
            date={item.createdOn}
            content={item.content}
            isFavourite={item.isFavourite}
            onEdit={()=>handleEdit(item)}
            onDelete={()=>{deleteNote(item)}}
            onFavouriteNote={()=>{handleFavouriteNote(item)}}
            />
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-500">
            No notes found. Click the + button to add a new note.
          </div>
        )}
        </div>
      </div>

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
      onClose={()=>{setOpenAddEditModal({isShown: false, type:"add", data: null})}} getAllNotes={getAllNotes}/>
      </Modal>
      
      <Toast 
      isShown={showToastMsg.isShown}
      message= {showToastMsg.message}
      type={showToastMsg.type}
      onClose={handleCloseToast}
      />

      <Footer 
        onEdit={() => {
          setOpenAddEditModal({isShown: true, type:"add", data: null})
        }}
        onImage={() => {
          document.getElementById('imageInput').click()
          handleImageUpload()
        }}
        onRecording={() => {
         <AddSpeech onClick={handleOnRecord} />
         }}
        
      />
    </>
  )
}

export default Home
