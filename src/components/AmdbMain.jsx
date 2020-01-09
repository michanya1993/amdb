/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import * as amdb from '../utils/amdb';

class AmdbMain extends Component {
    constructor(props) {
        super(props);
        this.formatCol = this.formatCol.bind(this);
        this.formatUP = this.formatUP.bind(this);
        this.rowClassName = this.rowClassName.bind(this);
        this.breadcrumps = this.breadcrumps.bind(this);
        this.state = {
            activeTab: "->",
            fk: "",
            showAllRows: true,
            pivot: false,
        };
    }

    tableItem(key) {
        return (
            <li 
            key={key}
            onClick={()=>{
                this.setState({ 
                    activeTab: key,
                    fk: "",
                    showAllRows: true
                });
            }}
            >
                <a 
                    className='text text-link'
                    href="#"
                >
                 {key}
                </a>
            </li>
        );
    }
    
    renderTablePivot(tab, keys) {

        const cols = [];
        const colsPk = [];
        const rows = [];
        const PK="pk";
        for(const rowKey of [PK, ...keys]) {
            const row = {
                rowKey,
            };
            for(let i=0; i<tab.length; i++) {
                const col = Number(tab[i].rowNun).toString();
                cols.push(col);
                colsPk[col] = tab[i][PK];
                row[PK] = {
                    pk: tab[i][PK],
                    fld: tab[i]["fld"],
                };
                row["tab"] = tab[i]["tab"];
                const val = tab[i][rowKey];
                row[col] = typeof(val) === 'object' ? 
                    {...val, pk: tab[i][PK]}
                    : val;
            }
            rows.push(row);
        }

        const options = {
            sizePerPage: 50,
            hideSizePerPage: true,
            noDataText: 'нет данных',
            expandRowBgColor: 'rgb(251, 254, 236)',
            expandBy: 'column',
        };

        const selectRowProperties = {

        };

        return (
            <BootstrapTable
                data={rows}
                options={options}
                hover
                condensed
                pagination
                selectRow={selectRowProperties}
                key={this.state.activeTab+'_pivot'}
            >
                <TableHeaderColumn
                    isKey
                    dataField="rowKey"
                    dataAlign="center"
                    columnClassName={'alert alert-secondary'}
                    dataFormat={(cell, row) => row.rowKey === PK ? 
                        "UP" : cell
                    }
                    dataSort
                    heigth='10px'
                >
                    key
                </TableHeaderColumn>
                {
                    [...new Set(cols)].map(fld => {
                        return (
                            <TableHeaderColumn
                                dataField={fld}
                                key={fld}
                                columnClassName={()=>this.rowClassName({pk: colsPk[fld]})}
                                dataFormat={(cell, row) => {
                                    let pk;
                                    try {
                                        pk = cell.pk;
                                    } catch(e) {
                                        pk = '';
                                    }
                                    return row.rowKey === PK ? 
                                     this.formatUP(cell, {tab: row.tab, pk: cell, fld: row[PK].fld})
                                    : this.formatCol(cell, {...row, pk})
                                }}
                                dataSort
                                heigth='10px'
                            >
                                {fld}
                            </TableHeaderColumn>
                        )
                    })
                }
            </BootstrapTable>
        );
    }

    renderTable(tab, keys) {
        const options = {
            sizePerPage: 50,
            hideSizePerPage: true,
            noDataText: 'нет данных',
            expandRowBgColor: 'rgb(251, 254, 236)',
            expandBy: 'column',
        };

        const selectRowProperties = {

        };
        return (
            <BootstrapTable
                data={tab}
                options={options}
                hover
                condensed
                pagination
                selectRow={selectRowProperties}
                trClassName={this.rowClassName}
                key={this.state.activeTab}
            >
                <TableHeaderColumn
                    isKey
                    dataField="rowNun"
                    dataAlign="center"
                    dataSort
                >
                    ID
                </TableHeaderColumn>
                {
                    keys.map(fld => {
                        return (
                            <TableHeaderColumn
                                dataField={fld}
                                key={fld}
                                dataFormat={this.formatCol}
                                dataSort
                            >
                                {fld}
                            </TableHeaderColumn>
                        )
                    })
                }
                <TableHeaderColumn
                    dataField="pk"
                    dataFormat={this.formatUP}
                >
                    UP
                </TableHeaderColumn>
            </BootstrapTable>
        );
    }

    formatUP (cell, row) {
        const getPrnt = (i) => i.split('.').slice(0,-1).join('.');
        return row.fld === "" ? '' : (
            <button
                className='btn btn-success btn-sm'
                onClick={()=>{
                    this.setState({
                        activeTab: getPrnt(row.tab),
                        fk: getPrnt(row.pk),
                    });

                }}
            >
                UP
            </button>
        );
    }

    formatCol (cell, row) {
        return typeof(cell) === 'object' ? (
            <div 
                className='btn btn-link'
                onClick={()=>{
                    this.setState({
                        activeTab: cell.tab,
                        fk: row.pk,
                    });
                }}
            >
                {cell.key}
            </div>
        ) : cell;
    }

    isRowSelected(row) {
        const len = row.pk.split(this.state.fk).length;
        return len === 2;
    }
    
    rowClassName(row) {
        return this.isRowSelected(row) ? 'alert alert-success' : '';
    }

    breadcrumps() {
        const path = this
            .state
            .activeTab
            .split('.');

        let current;
        let counter = 0;

        const liks = path
            .map( a => {
                current=[current, a]
                    .filter(a=>a)
                    .join(".");
                
                counter++;

                return {
                    text: a,
                    path: current,
                    counter,
                };
            });
        
        return liks.map(a => {
            
            return (
                // eslint-disable-next-line react/jsx-no-comment-textnodes
                <span key={a.path}>
                    <a
                        href='#'
                        className='text text-link'
                        onClick={()=>{
                            this.setState({
                                activeTab: a.path,
                                fk: "",
                                showAllRows: true
                            });
        
                        }}
                    >
                        {a.text}
                     </a>
                     {path.length === a.counter? "" : " \\ "}
                </span>
            );
        });
        
    }
    
    render() {
        let { data } = this.props;
        const { showAllRows, pivot } = this.state;
        const db = amdb.toTables(data);
        const tabs = [...new Set(db.map(a=>a.tab))];
        let tabKeys = [];
        const tab = db
            .filter(a=> a.tab === this.state.activeTab)
            .filter(a=> showAllRows || this.isRowSelected(a))
            .map(({
                rowNun,
                row,
                tab, 
                pk, 
                fld,
            })=>{
                tabKeys.push(...Object.keys(row));
                return {
                    rowNun,
                    tab, 
                    pk, 
                    fld,
                    ...row,
                }
            });
        
        tabKeys = [...new Set(tabKeys)];

        return (
            <div>
            <b>Таблица: {this.breadcrumps()}</b>
            <p>
                <label>
                    <input 
                        type="checkbox"
                        checked={showAllRows}
                        onChange={()=>{
                            this.setState({
                                showAllRows: !showAllRows
                            });
                        }}
                    />
                    Отображать неактивные записи
                </label>
                <button
                    className='btn btn-success btn-sm'
                    onClick={()=>{
                        this.setState({
                            pivot: !pivot
                        });
                    }}
                >
                    Повернуть таблицу
                </button>
            </p>
                {   pivot ?
                    this.renderTablePivot(tab, tabKeys) : 
                    this.renderTable(tab, tabKeys) 
                }
            <b>Все таблицы</b>
            <ul>
                {
                    tabs.map(a=> this.tableItem(a))
                }
            </ul>
            </div>
        );
    }
}

export default AmdbMain;