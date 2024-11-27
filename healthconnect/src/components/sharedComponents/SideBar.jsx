import AssessmentIcon from "@mui/icons-material/Assessment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import MedicationIcon from "@mui/icons-material/Medication";
import PersonIcon from "@mui/icons-material/Person";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { useSelector, useDispatch } from "react-redux";
import { changepage } from "../../features/SharedData";

export default function SideBar({ isOpen, toggleSidebar }) {
  const dispatch = useDispatch();
  const page = useSelector((state => state.sharedData.page))
  const profile = useSelector((state => state.sharedData.profile.patient))

  const isScreenWidth767 = () => {
    return window.innerWidth;
  };

    const menuItems = [
        { icon: <AssessmentIcon />, text: "Dashboard", active: true },
        { icon: <CalendarMonthIcon />, text: "Appointments" },
        { icon: <TextSnippetIcon />, text: "Health Information" },
        { icon: <MedicationIcon />, text: "Prescriptions" },
        { icon: <PersonIcon />, text: "Account", category: "others" },
    ];
    menuItems.map(item => item.active = page === item.text.toLowerCase() ? true : false);

    const doctorMenuItems = [
        { icon: <AssessmentIcon />, text: "Dashboard", active: true },
        { icon: <CalendarMonthIcon />, text: "Appointments" },
        { icon: <MedicationIcon />, text: "Prescriptions" },
        { icon: <PersonIcon />, text: "Account", category: "others" },
    ];
    doctorMenuItems.map(item => item.active = page === item.text.toLowerCase() ? true : false);

    return (
        <div className={`flex flex-shrink-0 flex-col h-[100vh] shadow-2xl ${isOpen ? "bg-[#1681af5c] transition-all duration-500 w-[100vw] p-4 sm:w-64 translate-x-0" : "p-0 transition-all duration-500 overflow-hidden w-0 -translate-x-64"} gap-4 text-2xl sm:text-base text-nowrap sticky top-0`}>
            <div className="flex items-center gap-2 w-full mt-2">
                <span className="hidden sm:block sm:text-xl text-[#12B536] sm:ml-1">
                    <span className="text-[#2F4AD6]">Health</span>Connect
                </span>
                <MenuOpenIcon sx={{ fontSize: 30, cursor: "pointer" }} onClick={toggleSidebar} />
            </div>
            <hr />
            <div className={`flex flex-col gap-4 ${isOpen ? "transition-all duration-500" : "p-0 transition-all duration-500 -translate-x-64"}`}>
                <div className="ml-5 flex flex-col gap-4 sm:gap-3">
                    <span className="text-xl sm:text-lg">Menu</span>
                    {(profile.user.user_role !== "Health Professional" ? menuItems : doctorMenuItems).filter(item => !item.category).map(({ icon, text, active }, index) => (
                        <div
                            key={index}
                            className={`text-[#273240BB] flex gap-2 items-center px-6 py-2 -ml-6 rounded-md cursor-pointer ${active ? "text-[#5A6ACF] bg-[#707FDD66]" : "hover:bg-[#5A6ACF22] transition-all"}`}
                            onClick={() => {dispatch(changepage(text.toLowerCase())); if(isScreenWidth767() <= 767) {toggleSidebar()}}}
                        >
                            {icon}
                            <span>{text}</span>
                        </div>
                    ))}
                </div>
                <div className="others ml-5 flex flex-col gap-4 sm:gap-3">
                    <span className="text-xl sm:text-lg">Others</span>
                    {(profile.user.user_role !== "Health Professional" ? menuItems : doctorMenuItems).filter(item => item.category === "others").map(({ icon, text, active }, index) => (
                        <div
                            key={index}
                            className={`text-[#273240BB] flex gap-2 items-center px-6 py-2 -ml-6 rounded-md cursor-pointer hover:bg-[#5A6ACF22] transition-all ${active ? "text-[#5A6ACF] bg-[#707FDD66]" : "hover:bg-[#5A6ACF22] transition-all"}`}
                            onClick={() => dispatch(changepage(text.toLowerCase()))}
                        >
                            {icon}
                            <span>{text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
