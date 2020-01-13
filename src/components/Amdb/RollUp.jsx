import React, { Component } from 'react';

class RollUp extends Component {
    
    render() {
        const { 
            toRollUp, 
        } = this.props;
        
        return (
            <div>
                <button
                    className='btn btn-warning btn-sm'
                    onClick={()=>toRollUp()}
                >
                    Поднять таблицу
                </button>
            </div>
        );
       
        
    }
}

export default RollUp;