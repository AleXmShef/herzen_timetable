import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Accordion, Button, Card} from "react-bootstrap";

class Resources extends Component {
    render() {
        return (
            <Accordion>
                <Card>
                    <Card.Header>
                        Другие сервисы
                    </Card.Header>
                </Card>
                <Card>
                    <Card.Header>
                        <Button variant="link">
                            Расписание преподователей(в разработке)
                        </Button>
                    </Card.Header>
                </Card>
                <Card>
                    <Card.Header>
                        Полезные ссылки
                    </Card.Header>
                </Card>
                <Card>
                    <Card.Header>
                        <Button variant="link" href='https://www.herzen.spb.ru/' target='_blank'>
                            Официальный сайт Герцена
                        </Button>
                    </Card.Header>
                </Card>
                <Card>
                    <Card.Header>
                        <Button variant="link" href='https://guide.herzen.spb.ru/' target='_blank'>
                            Электронный справочник
                        </Button>
                    </Card.Header>
                </Card>
            </Accordion>
        );
    }
}

Resources.propTypes = {};

export default Resources;
