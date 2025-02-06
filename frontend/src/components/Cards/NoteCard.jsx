import moment from "moment"
import {MdCreate, MdDelete, MdOutlineStar} from "react-icons/md"

const NoteCard=({
    title,
    date,
    content,
    isFavourite,
    onEdit,
    onDelete,
    onFavouriteNote
})=>{
    return (
        <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out">
            <div className="flex items-center justify-between">
                <div>
                    <h6 className="text-sm font-medium">{title}</h6>
                    <span className="text-xs text-slate-500">{moment(date).format('Do MMM YYYY')}</span>
                </div>

                <MdOutlineStar className={`icon-btn ${isFavourite? "text-yellow-400" : "text-slate-300"}`} onClick={()=>{isFavourite === true ? onFavouriteNote(false) : onFavouriteNote(true)}}/>
            </div>
            <p className="text-sx text-slate-600 mt-2">{content?.slice(0,60)}</p>

            <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2" >
                    <MdCreate className="icon-btn hover:text-green-600" onClick={onEdit}/>

                    <MdDelete className="icon-btn hover:text-red-500" onClick={onDelete}/>
                </div>
            </div>
        </div>
    )
}

export default NoteCard