import React, { Component } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

class OpenData extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
   
    handleSubmit(event) {

        event.preventDefault();
        event.stopPropagation();
        
        const { formatType, data  } = event.target.elements;
        this.props.evtSubmit({
            type: formatType.value,
            value: data.value
        });

        
      }
    
    render() {
        return (
            <div>
               <Form
                  onSubmit={this.handleSubmit}
               >
                  <Form.Group controlId="formatType">
                    <Form.Label>Тип данных</Form.Label>
                    <Form.Control as="select">
                      <option value="json">json</option>
                      <option value="xml">xml</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="data">
                    <Form.Label>Данные</Form.Label>
                    <Form.Control as="textarea" rows="3" />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Применить
                  </Button>
                </Form>
            </div>
        );
    }
}

export default OpenData;