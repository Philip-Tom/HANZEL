import React, { useState } from "react";
import styled from "styled-components";
import { Menu, Input, Icon, Sidebar } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";


const Navbar = () => {
  const [activeItem, setActiveItem] = useState("home");
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
    setSidebarVisible(false);
  };

  const handleToggle = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const isSmallOrMediumScreen = useMediaQuery({ maxWidth: 992 });

  return (
    <>
      {isSmallOrMediumScreen ? (
        // Sidebar for small and medium screens
        <>
          <Menu secondary>
            <Menu.Menu position="right">
              {/* Toggle button for small and medium screens */}
              <Menu.Item onClick={handleToggle}>
                <Icon name="bars"  style={{ color: 'white' }}/>
              </Menu.Item>
            </Menu.Menu>
          </Menu>

          <Sidebar
            as={Menu}
            animation="overlay"
            direction="right"
            visible={sidebarVisible}
            onHide={() => setSidebarVisible(false)}
            inverted
            vertical
            ref={nodeRef}
          >
            <Menu.Item
              name="home"
              active={activeItem ? "home" : undefined}
              onClick={handleItemClick}
              as={Link}
              to="/"
            >
              Home
            </Menu.Item>
            <Menu.Item
              name="login"
              active={activeItem === "login"}
              onClick={handleItemClick}
              as={Link}
              to="/login"
            >
              Login
            </Menu.Item>
          
            <Menu.Item
              name="cart"
              active={activeItem === "cart"}
              onClick={handleItemClick}
              as={Link}
              to="/cart"
            >
              <Icon name="cart" style={{ color: 'white' }}/>
              Cart
            </Menu.Item>
            <Menu.Item
              name="logout"
              active={activeItem === "logout"}
              onClick={handleItemClick}
              as={Link}
              to="/logout"
            >
              Logout
            </Menu.Item>
          </Sidebar>
        </>
      ) : (
        // Top menu for large screens
        <Menu secondary>
          <Menu.Item
            name="home"
            active={activeItem === "home"}
            onClick={handleItemClick}
            as={Link}
            to="/"
            style={{ color: 'white' }}
          >
            Home
          </Menu.Item>
          <Menu.Item
            name="login"
            active={activeItem === "login"}
            onClick={handleItemClick}
            as={Link}
            to="/login"
            style={{ color: 'white' }}
          >
            Login
          </Menu.Item>
          
          <Menu.Menu position="right">
            <Menu.Item>
              <Input icon="search" placeholder="Search..." />
            </Menu.Item>
            <Menu.Item
              name="cart"
              active={activeItem === "cart"}
              onClick={handleItemClick}
              as={Link}
              to="/cart"
              style={{ color: 'white' }}
            >
            <Icon name="cart" style={{ color: 'white' }}/>
            </Menu.Item>
            <Menu.Item
              name="logout"
              active={activeItem === "logout"}
              onClick={handleItemClick}
              as={Link}
              to="/logout"
              style={{ color: 'white' }}
            >
              Logout
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      )}
    </>
  );
};

export default Navbar;
