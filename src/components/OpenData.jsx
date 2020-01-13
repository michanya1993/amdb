import React, { Component } from 'react';
import { data } from '../data';

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
               <form
                  onSubmit={this.handleSubmit}
               >
                    <div className="form-group">
                        <label for="formatType">Тип данных</label>
                        <select className="form-control" id="formatType">
                            <option value="json">json</option>
                            <option value="xml">xml</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label for="data">Тип данных</label>
                        <textarea 
                            className="form-control"
                            id="data"
                            value={data}
                        />
                    </div>
                    <button className="btn btn-primary" type="submit">
                        Применить
                    </button>
                </form>
            </div>
        );
    }
}

export default OpenData;