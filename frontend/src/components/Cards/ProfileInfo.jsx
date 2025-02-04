import { getInitials } from "../../utils/config";


const ProfileInfo = ({onLogout}) => {
    return (
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-mediu<m bg-slate-100">
                {getInitials("Robin Sharma")}
            </div>

            <div>
                <p className="text-sm font-medium">Robin Sharma</p>
                <button className="text-sm text-slate-700 underline " onClick={onLogout}>
                    Logout
                </button>
            </div>
        </div>
    )
}

export default ProfileInfo;
