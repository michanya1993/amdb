import React from 'react';
import { DELIMITER } from './amdb';

export const options = {
    sizePerPage: 50,
    hideSizePerPage: true,
    noDataText: 'нет данных',
    expandRowBgColor: 'rgb(251, 254, 236)',
    expandBy: 'column',
};

export const selectRowProperties = {

};

export function rowClassName(pk, isSelect) {
    return isSelect(pk) ? 'alert alert-success' : '';
}

export function formatCol (cell, row, callBack) {
    return typeof(cell) === 'object' ? (
        <div 
            className='btn btn-link'
            onClick={() => callBack(cell.tab, row.pk,)}
        >
            {cell.key}
        </div>
    ) : cell;
}
export function getPrnt(i) {
    return i.split(DELIMITER).slice(0,-1).join(DELIMITER);
}

export function formatUP (row, callBack) {
    
    return row.fld === "" ? '' : (
        <button
            className='btn btn-success btn-sm'
            onClick={() => callBack(
                getPrnt(row.tab), 
                getPrnt(row.pk)
            )}
        >
            UP
        </button>
    );
}