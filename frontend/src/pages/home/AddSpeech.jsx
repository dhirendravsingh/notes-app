const AddSpeech = ({onClick}) => {
   // Changed from a constant to a state variable

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (activeVoice) {
      utterance.voice = activeVoice;
    };

    window.speechSynthesis.speak(utterance);
  

  return (
    <div className="mt-12 px-4">

      <div className="max-w-lg rounded-xl overflow-hidden mx-auto">
        <div className="bg-zinc-200 p-4 border-b-4 border-zinc-300">
         
        </div>

        <div className="bg-zinc-800 p-4 border-b-4 border-zinc-950">
          <p className="flex items-center gap-3">
            <span className={`block rounded-full w-5 h-5 flex-shrink-0 flex-grow-0 ${isActive ? 'bg-red-500' : 'bg-red-900'} `}>
              <span className="sr-only">{isActive ? 'Actively recording' : 'Not actively recording'}</span>
            </span>
            <span className={`block rounded w-full h-5 flex-grow-1 ${isSpeechDetected ? 'bg-green-500' : 'bg-green-900'}`}>
              <span className="sr-only">{isSpeechDetected ? 'Speech is being recorded' : 'Speech is not being recorded'}</span>
            </span>
          </p>
        </div>

        <div className="bg-zinc-800 p-4">
          <div className="grid sm:grid-cols-2 gap-4 max-w-lg bg-zinc-200 rounded-lg p-5 mx-auto">
          
            <p>
              <button
                className={`w-full h-full uppercase font-semibold text-sm  ${isActive ? 'text-white bg-red-500' : 'text-zinc-400 bg-zinc-900'} color-white py-3 rounded-sm`}
                onClick={onClick}
              >
                {isActive ? 'Stop' : 'Record'}
              </button>
            </p>
          </div>
        </div>
      </div>


     
     { text}
        

    </div>
  )
}

export default AddSpeech;