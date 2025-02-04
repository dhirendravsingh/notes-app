import { useState } from "react"
import { MdClose } from "react-icons/md"

const AddEditNotes = ({onClose, noteData, type})=>{
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")

    const [error, setError] = useState(null)

    const addNewNote= async()=>{}

    const editNote= async()=>{}


    const handleAddNote=()=>{
        if(!title){
            setError("Please enter the title")
            return
        }
        if(!content){
            setError("Please enter the content")
            return
        }
        setError("")

        if(type==="edit"){
            editNote()
        }else{
            addNewNote()
        }
    }

    return (
        <div className="relative">

            <button className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50" onClick={onClose}>
                <MdClose className="text-xl text-slate-400"/>
            </button>


            <div className="flex flex-col gap-2">
                <label className="input-label">TITLE</label>
                <input
                    type= "text"
                    className="text-2xl text-slate-950 outline-none"
                    placeholder="Go to the gym"
                    value={title}
                    onChange={({target})=>{
                        setTitle(target.value)
                    }}/>
            </div>
            <div className="flex flex-col gap-2 mt-4">
                <label className="input-label"> CONTENT</label>
                <textarea type="text" className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded" 
                placeholder="Content" 
                value={content}
                onChange={({target})=>{
                        setContent(target.value)}}
                rows={10}/>
            </div>

                    {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

                <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium mt-5 p-3 w-full" onClick={handleAddNote}>
                    ADD
                </button>
        </div>
    )
}

export default AddEditNotes