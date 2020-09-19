import React from "react";
import {Container} from "react-bootstrap";


function Footer () {
    return(
        <footer className='footer' style={{paddingBottom: 10}}>
            <Container className='d-flex justify-content-center'>
                © 2020 Aleksandr Shafir ИВТ 1 курс
            </Container>
        </footer>
    )
}

export default Footer;