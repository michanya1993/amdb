/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';

class Navigation extends Component {
    
    render() {
        const { 
            showAllRows, 
            changePivot, 
            changeView 
        } = this.props;
        
        return (
            <div>
                <label>
                    <input 
                        type="checkbox"
                        checked={showAllRows}
                        onChange={()=>changeView()}
                    />
                    Отображать неактивные записи
                </label>
                <button
                    className='btn btn-success btn-sm'
                    onClick={()=>changePivot()}
                >
                    Повернуть таблицу
                </button>
            </div>
        );
       
        
    }
}

export default Navigation;