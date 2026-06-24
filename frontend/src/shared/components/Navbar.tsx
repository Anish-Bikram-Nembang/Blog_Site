import { NotebookPen } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <div className="shadow-lg bg-[#1c1c21] px-4 h-[60px] text-[#f8f9fa] w-full sticky top-0 z-99 flex items-center justify-between">
            <Link to="/" ><NotebookPen size={40} /></Link>
            <div className="flex items-center gap-4 text-[22px]">
                <div className="py-1 px-4 rounded-full border-1 border-[#adb5bd]">Create +</div>
                <div className="py-1 px-4 rounded-full bg-[#6a6b70]">Login</div>
            </div>
        </div>
    )

}
export default Navbar;
