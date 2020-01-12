/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';

class Breadcrumps extends Component {
    
    render() {
        const { path, changeTable } = this.props;

        let current;
        
        const liks = path
            .map( a => {
                current=[current, a]
                    .filter(a=>a)
                    .join(".");
                
                return {
                    text: a,
                    path: current,
                };
            });
        
        return liks.map((a, counter) => {
            
            return (
                // eslint-disable-next-line react/jsx-no-comment-textnodes
                <span key={a.path}>
                    <a
                        href='#'
                        className='text text-link'
                        onClick={()=>changeTable(a.path)}
                    >
                        {a.text}
                     </a>
                     {path.length === counter? "" : " \\ "}
                </span>
            );
        });
        
    }
}

export default Breadcrumps;