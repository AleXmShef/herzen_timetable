import React, {Component} from 'react';
import {Navbar, Image, Nav} from "react-bootstrap";

class Header extends Component {
    render() {
        return (
            <Navbar expand="lg" bg="dark" variant="dark" fixed="top">
                <Navbar.Brand href="#home">Расписание РГПУ им. А. И. Герцена</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="#features">Главная</Nav.Link>
                        <Nav.Link href="#pricing">Мое расписание</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link href="#pricing">О проекте</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Header;
