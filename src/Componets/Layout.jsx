import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => (
  <div className="min-h-screen bg-(--bg-body) transition-colors duration-200">
    <Navbar />
    {/* pt-18 offsets the top bar on mobile/tablet; lg:pt-0 + lg:pl-20 offsets the sidebar */}
    <div className="pt-18 lg:pt-0 lg:pl-20 min-h-screen">
      {children}
    </div>
  </div>
);

export default Layout;
