import React, {Component} from 'react';
import {Navbar, Image, Nav} from "react-bootstrap";
import {Link} from 'react-router-dom'

class Header extends Component {
    render() {
        return (
            <Navbar expand="lg" bg="dark" variant="dark" fixed="top">
                <Navbar.Brand as={Link} to='/'>Расписание РГПУ им. А. И. Герцена</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to='/'>Главная</Nav.Link>
                        <Nav.Link as={Link} to='/timetable'>Мое расписание</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link as={Link} to='/'>О проекте</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Header;
