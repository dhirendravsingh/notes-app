const BACKEND_URL = "http://localhost:8000"

export {BACKEND_URL}

export const getInitials = (name)=>{
    if(!name) return ""

    const words = name.split(" ")
    let initials = ""

    for(let i=0 ; i< Math.min(words.length, 2); i++){
        initials += words[i][0]
    }

    return initials.toUpperCase()
}