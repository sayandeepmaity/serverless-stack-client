import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./Routes";
import { AppContext } from "./libs/contextLib";
import { Auth } from "aws-amplify";
import { FiSun, FiMoon } from "react-icons/fi"; // Icons from Feather Icons

function App() {
  const history = useHistory();
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  async function handleLogout() {
    await Auth.signOut();
    userHasAuthenticated(false);
    history.push("/Login");
  }

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        alert(e);
      }
    }
    setIsAuthenticating(false);
  }

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const contextValue = { isAuthenticated, userHasAuthenticated, isDarkMode };

  return (
    !isAuthenticating && (
      <div className="">
        <Router>
          <Navbar
            collapseOnSelect
            expand="md"
            style={{ backgroundColor: "white" }}
          >
            <LinkContainer to="/">
              <Navbar.Brand
                className="font-weight-bold text-muted"
                style={{ color: "black" }}
              >
                Wingnote
              </Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Nav activeKey={window.location.pathname}>
                {isAuthenticated ? (
                  <>
                   <LinkContainer to="/settings">
                      <Nav.Link>Settings</Nav.Link>
                    </LinkContainer>
                    <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                  </>
                ) : (
                  <>
                    <LinkContainer to="/Signup">
                      <Nav.Link>Signup</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/Login">
                      <Nav.Link>Login</Nav.Link>
                    </LinkContainer>
                  </>
                )}
                <Nav.Link onClick={toggleDarkMode} style={{ fontWeight: "bold" }}>
                  {isDarkMode ? <FiSun /> : <FiMoon />} {/* Different icons */}
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <AppContext.Provider value={contextValue}>
            <Routes />
          </AppContext.Provider>
        </Router>
      </div>
    )
  );
}

export default App;
