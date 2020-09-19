import React, {Component} from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

import "./App.css";

import Header from "./components/Header";
import HomePage from "./components/home/HomePage";
import TimetablePage from "./components/timetable/TimetablePage";
import About from "./components/about/About";
import Footer from "./components/Footer";

class App  extends Component  {
    render() {
        return (
        <Router>
            <Header/>
            <Switch>
                <Route exact path='/' component={HomePage}/>
                <Route path='/timetable' component={TimetablePage}/>
                <Route path='/about' component={About}/>
            </Switch>
            <Footer/>
        </Router>
        )
    }
}

export default App;
