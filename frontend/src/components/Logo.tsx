import { useNavigate } from "react-router-dom";

const Logo = () => {
    const navigate = useNavigate();

    return <div className="flex flex-col justify-center items-center  bg-black/40 border-b-[1px] border-neutral-900 backdrop-blur-lg" 
    onClick={() => {navigate("/")}}>
        <div className="text-3xl text-white pt-8 font-semibold">
            Whisper
        </div>
        <div className="text-slate-300 text-sm font-light py-5">
            Websockets101
        </div>
    </div>
}

export default Logo;