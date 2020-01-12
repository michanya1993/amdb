import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import AmdbMain from './Amdb/AmdbMain';
import OpenData from './OpenData';
import PageContent from './PageContent';
import { xml2json } from 'xml-js';

class Main extends Component {
  constructor(props) {
      super(props);
      this.getData = this.getData.bind(this);
      this.state = {
          data: {},
          hasData: false,
      };
  }
  
  getData({type, value}) {

    const error = {error: "Не удалось обработать данные"};

    const toObj = value =>{
      try {
        return JSON.parse(value);
      }
      catch(e) {
        return error;
      }
    };

    const toXML = value => {
      try {
        const xmlProps = {compact: true, spaces: 4};
        return toObj(xml2json(value, xmlProps));
      } catch(e) {
        return error;
      }
    }

    const data = type === 'json' ? toObj(value) : toXML(value);
    this.setState({
        data,
        hasData: true,
    });

  }
  
  render() {

    const { data, hasData } = this.state;

    return (
      <div className="App">
        <Navbar bg="dark" variant="dark" expand="lg">
          <Navbar.Brand>XML/JSON Tabel viewer</Navbar.Brand>
        </Navbar>
        {
          hasData ? 
          <PageContent header="Просмотр данных">
              <AmdbMain data={data} />
          </PageContent>
          
          :

          <PageContent header="Открыть данные">
              <OpenData evtSubmit={this.getData} />
          </PageContent>
          
        }
      </div>
    );
  }
}

export default Main;