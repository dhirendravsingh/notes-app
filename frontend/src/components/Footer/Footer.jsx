import { MdEdit, MdImage, MdMic } from 'react-icons/md'
import Translator from '../../pages/home/AddSpeech'
const Footer = ({onEdit, onImage, onRecording}) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={onEdit}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
                        >
                            <MdEdit className="text-lg text-gray-600" />
                            <span className="text-gray-600">Write</span>
                        </button>

                        <button 
                            onClick={onImage}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
                        >
                            <MdImage className="text-lg text-gray-600" />
                            <span className="text-gray-600">Add Image</span>
                        </button>
                    </div>

                    <button 
                        onClick={onRecording}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 hover:bg-red-600"
                    >
                        <MdMic className="text-lg text-white" />
                        <span className="text-white">Start Recording</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Footer