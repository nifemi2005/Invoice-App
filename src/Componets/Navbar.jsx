import React from "react";
import Logo from "../assets/Logo.png";
import { BsMoon, BsSun } from "react-icons/bs";
import { useTheme } from "../Context/ThemeContext";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-(--bg-nav) w-full flex items-stretch h-18 transition-colors duration-200">
      <div className="bg-[#7C5CBF] rounded-br-2xl w-18 flex flex-col items-center justify-center shrink-0 relative overflow-hidden">
        <img src={Logo} alt="Logo" className="w-9 h-9 object-contain z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-[28%] bg-[#9277FF]/30 rounded-tl-2xl" />
      </div>

      <div className="flex-1" />

      <div className="flex items-center">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="px-6 flex items-center justify-center text-[#888EB0] hover:text-white transition-colors"
        >
          {theme === "light" ? <BsMoon size={18} /> : <BsSun size={20} />}
        </button>

        <div className="w-px h-full bg-white/10" />

        <div className="px-6 flex items-center justify-center">
          <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-[#7C5CBF]">
            <img
              src="https://i.pravatar.cc/150?img=52"
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
