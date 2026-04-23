import React from "react";
import Logo from "../assets/Logo.png";
import { BsMoon, BsSun } from "react-icons/bs";
import { useTheme } from "../Context/ThemeContext";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className={[
      "fixed z-50 bg-(--bg-nav) transition-colors duration-200",
      // Mobile + tablet: horizontal top bar
      "top-0 left-0 right-0 h-18 flex flex-row items-stretch",
      // Desktop: vertical left sidebar
      "lg:right-auto lg:bottom-0 lg:w-20 lg:h-screen lg:flex-col lg:items-center lg:rounded-r-3xl",
    ].join(" ")}>

      {/* Logo */}
      <div className={[
        "flex items-center justify-center shrink-0 relative overflow-hidden",
        // Mobile: square, left-flush, rounded bottom-right only
        "w-18 h-18 rounded-br-2xl",
        // Desktop: full-width strip at top
        "lg:w-full lg:h-20 lg:rounded-br-2xl",
      ].join(" ")}>
        <img src={Logo} alt="Logo" className="w-18 h-18 object-contain z-10" />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Controls — row on mobile, column on desktop */}
      <div className="flex flex-row items-center lg:flex-col lg:w-full">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="px-6 text-[#888EB0] hover:text-white transition-colors lg:px-0 lg:py-7"
        >
          {theme === "light" ? <BsMoon size={18} /> : <BsSun size={20} />}
        </button>

        {/* Divider — vertical on mobile, horizontal on desktop */}
        <div className="w-px h-8 bg-white/10 lg:w-full lg:h-px" />

        {/* Avatar */}
        <div className="px-6 lg:px-0 lg:py-7">
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
