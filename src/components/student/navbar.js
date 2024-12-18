import React, { useState } from 'react';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, cn} from "@nextui-org/react";

import './navbar.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faCogs,
  faTable,
  faList,
  faUser,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
    const [isNavbarVisible, setIsNavbarVisible] = useState(false);
    const [activeLink, setActiveLink] = useState("Dashboard");
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownState, setDropdownState] = useState(false);
    const [dropdownValue, setDropdownValue] = useState("");

    const handleTrigger = () => setIsOpen(!isOpen);

    const toggleNavbar = () => {
        setIsNavbarVisible(prevState => !prevState);
    };

    const handleLinkClick = (name) => {
        setActiveLink(name);
    };
   
    const handleDropdownClick = () => {
      setDropdownState(!dropdownState);
    };
    const handleSetDropdownValue = (value) => {
      setDropdownValue(value);
      setDropdownState(!dropdownState);
    };
    return (
        <div>
             <div className="container">
      <div>
       
        <div className='topbar'>
            <div></div>
        </div>
        <div
          className={`dropdown-items ${
            dropdownState ? "isVisible" : "isHidden"
          }`}
        >
          <div className="dropdown-item">
            <div
              className="dropdown__link"
              onClick={() => handleSetDropdownValue("value 01")}
            >
              Item 01
            </div>
          </div>
          <div className="dropdown-item">
            <div
              className="dropdown__link"
              onClick={() => handleSetDropdownValue("value 02")}
            >
              Item 02
            </div>
          </div>
          <div className="dropdown-item">
            <div
              className="dropdown__link"
              onClick={() => handleSetDropdownValue("value 03")}
            >
              Item 03
            </div>
          </div>
          <div className="dropdown-item">
            <div
              className="dropdown__link"
              onClick={() => handleSetDropdownValue("value 04")}
            >
              Item 04
            </div>
          </div>
        </div>
      </div>
    </div>
            <div className={`l-navbar ${isNavbarVisible ? "show" : ""}`} id="nav-bar">
                <nav className="nav">
                    <div>
                        <a href="#" className="nav_logo">
                            <i className="bx bx-layer nav_logo-icon"></i>
                            <span className="nav_logo-name">BBBootstrap</span>
                        </a>
                        <div className="nav_list">
                            {["Dashboard", "Users", "Messages", "Bookmark", "Files", "Stats"].map((link) => (
                                <a
                                    href="#"
                                    className={`nav_link ${activeLink === link ? "active" : ""}`}
                                    onClick={() => handleLinkClick(link)}
                                    key={link}
                                >
                                    <i className={`bx ${link === "Dashboard" ? "bx-grid-alt" : link === "Users" ? "bx-user" : link === "Messages" ? "bx-message-square-detail" : link === "Bookmark" ? "bx-bookmark" : link === "Files" ? "bx-folder" : "bx-bar-chart-alt-2"} nav_icon`}></i>
                                    <span className="nav_name">{link}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                    <a href="#" className="nav_link">
                        <i className="bx bx-log-out nav_icon"></i>
                        <span className="nav_name">Sign Out</span>
                    </a>
                </nav>
            </div>

          

            <div className="App">
                <div className="page">
                    

                    <div className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
                        <div className="trigger" onClick={handleTrigger}>
                            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
                        </div>

                        <div className="sidebar-position">
                            <FontAwesomeIcon icon={faUser} />
                            <span>Home</span>
                        </div>
                        <div className="sidebar-position">
                            <FontAwesomeIcon icon={faCogs} />
                            <span>Menu item 2</span>
                        </div>
                        <div className="sidebar-position">
                            <FontAwesomeIcon icon={faTable} />
                            <span>Menu item 3</span>
                        </div>

                        <div className="sidebar-position">
                            <FontAwesomeIcon icon={faList} />
                            <span>Position 4</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
