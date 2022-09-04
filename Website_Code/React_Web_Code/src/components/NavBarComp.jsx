import React, { Component } from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AGShuffleTab } from "./ag-shuffle/ag-shuffle-tab";
import { CustomShuffleTab } from "./custom-shuffle/custom-shuffle-tab";
import { HomeTab } from "./home/home-tab";
import { ShuffleExplanations } from "./Shuffle-Explanations/shuffle-explanations";

export class NavBarComp extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Navbar bg="dark" variant={"dark"} expand="lg">
            <Container>
              <Navbar.Brand>Mem-Deck Creator</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link as={Link} to={"/"}>
                    Home
                  </Nav.Link>
                  <Nav.Link as={Link} to={"/Auto-Generate-Shuffle"}>
                    Auto Generate Shuffle
                  </Nav.Link>
                  <Nav.Link as={Link} to={"/Custom-Shuffles"}>
                    Custom Shuffles
                  </Nav.Link>
                  {/* <NavDropdown title="Explanations" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">
                      Action
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">
                      Another action
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">
                      Something
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">
                      Separated link
                    </NavDropdown.Item>
                  </NavDropdown> */}
                  <Nav.Link as={Link} to={"/Shuffle-Explanations"}>
                    Shuffle Explanations
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </div>
        <div>
          <Routes>
            <Route path="/" element={<HomeTab />} />
            <Route path="/Auto-Generate-Shuffle" element={<AGShuffleTab />} />
            <Route path="/Custom-Shuffles" element={<CustomShuffleTab />} />
            <Route
              path="/Shuffle-Explanations"
              element={<ShuffleExplanations />}
            ></Route>
          </Routes>
        </div>
      </Router>
    );
  }
}
