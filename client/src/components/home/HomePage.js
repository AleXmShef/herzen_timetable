import React, {Component} from 'react';
import {Container, Col, Row, Accordion, Card, Spinner} from "react-bootstrap";

import TimetableCard from "./TimetableCard";
import Resources from "./Resources";

import axios from 'axios';

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stages: [
                "faculty",
                "type",
                "level",
                "program",
                "subprogram",
                "year",
                "group"
            ],
            requests: [
                "faculties",
                "types",
                "levels",
                "programs",
                "subprograms",
                "years",
                "groups"
            ],
            headers: [
                "Факультеты/институты",
                "Тип образования",
                "Уровень образования",
                "Программы обучения",
                "Направления подготовки",
                "Года поступления",
                "Группы"
            ],
            currentStage: -1,
            stagesData: []
        }
        this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        this.getData(0, undefined, undefined);
    }

    getData(senderStage, senderIndex, senderName) {
        let {stages, requests, currentStage, stagesData} = this.state;
        if(currentStage < senderStage) {
            if (senderStage >= 0 && senderStage <= 3) {
                let params = {};
                if(senderStage > 1)
                    params = {
                        [stages[currentStage - 1]]: stagesData[currentStage].holderName,
                        [stages[currentStage]]: senderName
                    }
                else if(senderStage > 0)
                    params = {
                        [stages[currentStage]]: senderName
                    }
                axios.get('/api/timetable/' + requests[senderStage], {
                    params: params
                }).then((res) => {
                    console.log(res.data);
                    stagesData.push({
                        data: res.data[requests[senderStage]],
                        holder: senderIndex,
                        holderName: senderName
                    });
                    this.setState({stagesData: stagesData, currentStage: senderStage}, () => {
                        console.log("Stage changed to: " + this.state.currentStage);
                    })
                }).catch((err) => {
                    console.log(err);
                });
            }
            else if (senderStage < 7) {
                let temp = [];
                let stagesData = this.state.stagesData;
                stagesData[senderStage - 1].data.forEach(element => {
                    console.log(element);
                    temp.push(element[this.state.requests[senderStage]]);
                })
                console.log(temp);
                stagesData.push({
                    data: temp[0],
                    holder: senderIndex,
                    holderName: senderName
                });
                console.log(stagesData);
                this.setState({stagesData: stagesData, currentStage: senderStage});
            }
            else {
                let group = this.state.stagesData[senderStage - 1].data[senderIndex-1];
                localStorage.setItem('group', JSON.stringify(group));
                this.props.history.push('/timetable');
            }
        }
        else if(this.state.currentStage === senderStage) {
            let stagesData = this.state.stagesData;
            stagesData.pop();
            this.setState({stagesData: stagesData, currentStage: senderStage - 1}, () => {
                this.getData(senderStage, senderIndex, senderName);
            });
        }
        else {
            let stagesData = this.state.stagesData;
            for(let i = this.state.currentStage; i >= senderStage; i--) {
                stagesData.pop();
            }
            this.setState({stagesData: stagesData, currentStage: senderStage - 1}, () => {
                this.getData(senderStage, senderIndex, senderName);
            });
        }
    }

    composeSelection() {
        let output = 0;
        for(let i = this.state.currentStage; i >= 0; i--) {
            if (this.state.stagesData[i]) {
                const children = output;
                output =
                    <React.Fragment>
                        <Card>
                            <Card.Header>
                                {this.state.headers[i]}
                            </Card.Header>
                        </Card>
                        {
                            this.state.stagesData[i].data.map(item => {
                                const itemIndex = this.state.stagesData[i].data.indexOf(item) + 1;
                                return (
                                    <TimetableCard
                                        header_name={item[this.state.stages[i]]}
                                        key={itemIndex} index={itemIndex}
                                        func_advance={this.getData}
                                        stage={i + 1}
                                    >
                                        {
                                            (children && this.state.stagesData[i + 1] &&
                                            this.state.stagesData[i + 1].holder === itemIndex) ? children : undefined
                                        }
                                    </TimetableCard>
                                )
                            })
                        }
                    </React.Fragment>
            }
        }
        return output;
    }

    render() {
        let output = this.composeSelection();
        return (
            <Container style={{marginTop: 150}}>
                <Row className="justify-content-md-center">
                    <Col md style={{'marginBottom': 50}}>
                        <Accordion>
                            {(output !== 0) ? output :
                                <div className='d-flex justify-content-center'>
                                    <Spinner style={{margin: 8, justifyContent: 'center'}} animation='border' variant='primary'/>
                                </div>
                            }
                        </Accordion>
                    </Col>
                    <Col md style={{'marginBottom': 50}}>
                        <Resources/>
                    </Col>
                </Row>
            </Container>
        );
    }
}

HomePage.propTypes = {

};

export default HomePage;
