/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';

class FieldsFilter extends Component {
    
    render() {
        const { fileds, activeTab, changeFilterVal } = this.props;
        
        return (
            <div>
            {
                fileds.map(
                    ({key, val}) => {
                        return (
                            <label 
                                key={key}
                                style={{padding: '4px'}}
                            >
                                <input 
                                    className='text text-link'
                                    type="checkbox"
                                    checked={val}
                                    onClick={()=>changeFilterVal(!val, key, activeTab)}
                                />
                                {key}
                            </label>
                        );
                    }
                )
            }
        </div>
        );
       
        
    }
}

export default FieldsFilter;