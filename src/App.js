import Routes from "./Routes";
import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import "./App.css";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";
import { AppContext } from "./libs/contextLib";
import { Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";
import { onError } from "./libs/errorLib";

function App() {
  const history = useHistory();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  let [userInformation, setUserInformation] = useState("");

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    //Extrai sessão atual e dados do usuário atual
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
      const { attributes } = await Auth.currentAuthenticatedUser();
      setUserInformation(attributes);
    } catch (e) {
      if (e !== "No current user") {
        onError(e);
      }
    }

    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();

    userHasAuthenticated(false);

    history.push("/");
  }

  return (
    !isAuthenticating && (
      <div className="App container py-3">
        <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
          <LinkContainer to="/">
            <Navbar.Brand className="font-weight-bold text-muted">
              Post-It: A Coisa
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav activeKey={window.location.pathname}>
              {isAuthenticated ? (
                <><LinkContainer to="/profile">
                  {/* Se o usuário estiver logado, recebe outras opções no menu e o seu nome impresso */}
                  <Nav.Link>
                    Olá,{" "}
                    {userInformation.name
                      ? userInformation.name.split(" ")[0]
                      : "Usuário"}
                    !
                  </Nav.Link>
                </LinkContainer>
                  <LinkContainer to="/order/new">
                    <Nav.Link>Comprar</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/myorders">
                    <Nav.Link>Pedidos</Nav.Link>
                  </LinkContainer>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </>
              ) : (
                <>
                  <LinkContainer to="/signup">
                    <Nav.Link>Cadastro</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <Nav.Link>Login</Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
          <Routes />
        </AppContext.Provider>
      </div>
    )
  );
}

export default App;
