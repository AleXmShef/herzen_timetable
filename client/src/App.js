import React, {Component} from "react";

import "./App.css";

import Header from "./components/Header";
import HomePage from "./components/home/HomePage";
import {Container} from "react-bootstrap";

class App  extends Component  {
    render() {
        return (
        <Container>
            <Header/>
            <HomePage/>
        </Container>
        )
    }
}

export default App;
