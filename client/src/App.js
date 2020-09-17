import React, {Component} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import "./App.css";

import Header from "./components/Header";
import HomePage from "./components/home/HomePage";
import TimetablePage from "./components/timetable/TimetablePage";
import {Container} from "react-bootstrap";

class App  extends Component  {
    render() {
        return (
        <Router>
            <Header/>
            <Switch>
                <Route exact path='/' component={HomePage}/>
                <Route path='/timetable' component={TimetablePage}/>
            </Switch>
        </Router>
        )
    }
}

export default App;
