import React, {Component} from 'react';
import {Container, Col, Row, Accordion, Card, Spinner} from "react-bootstrap";

import GeneralItem from "./GeneralItem";
import Resources from "./Resources";

class HomePage extends Component {

	constructor(props) {
		super(props);
		this.completeSelection = this.completeSelection.bind(this);
	}

	completeSelection() {
		this.props.history.push('/timetable');
	}

	render() {
		return (
			<Container style={{marginTop: 150}}>
				<Row className="justify-content-md-center">
					<Col md style={{'marginBottom': 50}}>
						<Accordion>
							<GeneralItem prevArgs={[]} stage={0} completeSelection={this.completeSelection}/>
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
