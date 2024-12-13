import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";

const HomePage = () => {
  const [newRoom, setNewRoom] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const navigate = useNavigate();



  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomId(e.target.value);
  };

  const createNewRoomID = () => {
    setShowAlert(false);
    const value = Math.random().toString(36).substring(8, 15).toUpperCase();
    setNewRoom(value);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(newRoom);
    setShowAlert(true);
  };

  const joinRoom = () => {
    if (roomId.trim()) {
      navigate(`/chat/${roomId}`); 
    }
  };


  return (
    <div className="flex flex-col justify-center h-screen bg-black">
      <Logo />
      <div className="flex justify-center h-[95vh]">
        <div className="flex flex-col justify-center">
        <div className="flex flex-col justify-center gap-8 border-[1px] py-32 px-16 border-neutral-700">
          <div className="flex gap-2">
            <input
              className="rounded-sm px-3 bg-slate-100 focus:outline-none focus:none focus:none"
              placeholder="Enter your Room ID"
              onChange={onInputChange}
            />
            <button className="bg-green-500 p-2 rounded-sm" onClick={joinRoom}>Enter!</button>
          </div>
          <div className="flex justify-center">
            <div className="flex flex-col justify-center">
              <button
                className="bg-violet-500 p-2 rounded-sm"
                onClick={createNewRoomID}
              >
                Create a new room
              </button>
              <div className={`text-neutral-300 text-center my-4 bg-neutral-800 py-2 ${newRoom.length > 0 ? "block" : "hidden"}`}>
                <div className={"flex justify-around items-center space-x-2"}>
                <div>{newRoom}</div>
                <button
                    className="bg-neutral-700 text-neutral-300 px-2 py-1 rounded-sm hover:bg-neutral-600"
                    onClick={copyToClipboard}
                >
                    Copy
                </button>
                </div>
              </div>
              <div
                className={`text-sm font-thin text-neutral-300 text-center ${
                  showAlert ? "block" : "hidden"
                }`}
              >
                Copied to clipboard
              </div>
            </div>
          </div>
        </div>
        </div>
        
      </div>
    </div>
  );
};

export default HomePage;
