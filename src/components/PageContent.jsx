import React, { Component } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

class PageContent extends Component {
  render() {
    const { header, children, } = this.props;
    return (
          <Row>
            <Col md={12}>
            <h4>{ header }</h4>
            </Col>
              <Col md={12}>
                  { children }
              </Col>
          </Row>
    );
  }
}

export default PageContent;