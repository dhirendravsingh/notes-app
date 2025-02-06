import {LuCheck} from "react-icons/lu"

const Toast=({isShown, message, type, onClose})=>{
    return (
        <div>
            <div className="flex items-center gap-3 py-2 px-4">
                <div className={`w-10 h-10 flex items-center justify-center rounded-full`}>
                    <LuCheck className="text-xl text-green-500"/>
                </div>
            </div>
        </div>
    )
}

export default Toast