/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';

class LinksTable extends Component {
    
    render() {
        const { tabs, changeTable } = this.props;
        
        return (
            <ul>
            {
                tabs.map(
                    (key) => {
                        return (
                            <li key={key}>
                                <a 
                                    className='text text-link'
                                    href="#"
                                    onClick={()=>changeTable(key)}
                                >
                                 {key}
                                </a>
                            </li>
                        );
                    }
                )
            }
        </ul>
        );
       
        
    }
}

export default LinksTable;