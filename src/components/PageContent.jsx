import React, { Component } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

class PageContent extends Component {
  render() {
    const { header, children, } = this.props;
    return (
        <Container>
            <Row>
             <Col md={12}>
              <h4>{ header }</h4>
             </Col>
                <Col md={12}>
                    { children }
                </Col>
            </Row>
        </Container>
    );
  }
}

export default PageContent;