import { useMemo } from "react";
import { Row } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { ToastContainer } from "react-toastify";
import * as Realm from "realm-web";
import "./App.css";
import ArtWorks from "./art-works";
import LogoutBtn from "./components/logout-btn";
import { MongoContextProvider } from "./context/mongo-context";
import logo from "./logo.svg";

function App() {
  // Initiate mongo connection
  const mongoRealm = useMemo(
    () => new Realm.App({ id: process.env.REACT_APP_REALM_APP_ID }),
    []
  );

  console.log(mongoRealm)

  return (
    <Container fluid className="app-page bg-dark">
      <MongoContextProvider app={mongoRealm}>
        <Navbar
          expand="lg"
          bg="dark"
          variant="dark"
          className="justify-content-evenly"
        >
          <Container className="font-monospace m-1 p-2 d-flex">
            <span>
              <img src={logo} style={{ height: '3.5rem' }} alt="art logo" />
            </span>
            <LogoutBtn />
          </Container>
        </Navbar>
        <Row className="justify-content-md-center p-lg-4">
          <ArtWorks />
        </Row>
        <ToastContainer autoClose={2000} />
        {/* Footer Section */}
        <footer className="text-center text-white bg-dark py-3">
          <p className="f-80">&copy; {new Date().getFullYear()} <b className="h-3">BV FINNESE CONSULTANTS LTD. </b>
            All rights reserved.</p>
        </footer>
      </MongoContextProvider>
    </Container>
  );
}

export default App;
