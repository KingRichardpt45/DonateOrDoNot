import { useState } from "react";
import "./components.css";

const SideMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  console.log("SideMenu rendered");
  return (
    <div className="side-menu">
      <button className="menu-toggle" onClick={toggleMenu}>
        <span className="menu-icon">
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </span>
      </button>
      <nav className={`side-menu-nav ${isOpen ? "open" : ""}`}>
        <ul>
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">Search</a>
          </li>
          <li>
            <a href="#">Store</a>
          </li>
          <li>
            <a href="#">Biggest Donors</a>
          </li>
          <li>
            <a href="#">Most Frequent Donors</a>
          </li>
          <li>
            <a href="#">Most Donations</a>
          </li>
          <li>
            <a href="#">My Donations</a>
          </li>
          <li>
            <a href="#">Profile</a>
          </li>
          <li>
            <a href="#">Log out</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideMenu;
