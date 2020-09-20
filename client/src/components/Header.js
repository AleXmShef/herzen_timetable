import React, {Component} from 'react';
import {Navbar, Nav} from "react-bootstrap";
import {Link, withRouter} from 'react-router-dom'

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pos: 0,
            hidden: false
        }
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    handleScroll() {
        if(window.scrollY > 0 && window.scrollY < window.screen.height) {
            if (window.scrollY > this.state.pos) {
                if (!this.state.hidden)
                    this.setState({hidden: true})
            } else if (window.scrollY < this.state.pos - 10){
                if (this.state.hidden)
                    this.setState({hidden: false})
            }
            this.setState({pos: window.scrollY});
        }
    }

    render() {
        return (
            <Navbar
                collapseOnSelect
                expand="md"
                bg="dark"
                variant="dark"
                fixed="top"
                className={this.state.hidden && window.screen.width <= 766 ? 'scrolled-up' : 'scrolled-down'}
            >
                <Navbar.Brand as={Link} className='text-wrap' to='/'>Расписание РГПУ им. А. И. Герцена</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} eventKey='main' to='/' active={this.props.location.pathname === '/'}>Главная</Nav.Link>
                        <Nav.Link as={Link} eventKey='timetable' to='/timetable' active={this.props.location.pathname === '/timetable'}>Мое расписание</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link as={Link} eventKey='about' to='/about' active={this.props.location.pathname === '/about'}>О проекте</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default withRouter(Header);
