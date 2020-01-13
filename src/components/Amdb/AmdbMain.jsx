import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import * as amdb from './amdb';
import * as tableProps from './tableProps';
import Breadcrumps from './Breadcrumps';
import LinksTable from './LinksTable';
import Navigation from './Navigation';
import FieldsFilter from './FieldsFilter';
import RollUp from './RollUp';

const { 
    DELIMITER,
    ROOT,
} = amdb;

class AmdbMain extends Component {
    constructor(props) {
        super(props);
        this.isRowSelected = this.isRowSelected.bind(this);
        this.changeTable = this.changeTable.bind(this);
        this.changeActiveTable = this.changeActiveTable.bind(this);
        this.changeFilterVal = this.changeFilterVal.bind(this);
        this.tablePivot = this.tablePivot.bind(this);
        this.tableUnPivot = this.tableUnPivot.bind(this);
        this.toRollUp = this.toRollUp.bind(this);
        this.state = {
            activeTab: ROOT,
            fk: "",
            showAllRows: true,
            pivot: false,
            
            tab: [], 
            tabKeys: [],
            tabs: [],

            tabsFields: {},

            data: {},
            
        };
    }

    componentWillMount(){
        const { data } = this.props;
        this.getDB(data, this.state.activeTab);
        this.setState({
            data,
        });
        
    }

    getDB(data, activeTab) {
        
        const { showAllRows, tabsFields } = this.state;
        const db = amdb.toTables(data);
        
        //const db =amdb.toTables(amdb.rollUp(data, '->.friends'));

        const tabs = [...new Set(db.map(a=>a.tab))];
        let tabKeys = [];
        const tab = db
            .filter(a=> a.tab === activeTab)
            .filter(({pk})=> showAllRows || this.isRowSelected(pk))
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

        const setFilterVal = (key, tab ) => {
            if(!tab) return true;
            const arr = tab.filter(a => a.key === key);
            if( arr.length === 1) {
               return arr[0].val; 
            }
            return true;
        }

        this.setState({
            tab, 
            tabKeys,
            tabs,
            tabsFields: {
                ...tabsFields,
                [activeTab]: tabKeys.map(key=>({
                    key,
                    val: setFilterVal(key, tabsFields[activeTab]),
                }))
            }
        });
    }
    
    tablePivot(tab, keys, activeTab) {

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

        const {
            options,
            selectRowProperties,
            rowClassName,
            formatCol,
            formatUP,
        } = tableProps;

        return (
            <BootstrapTable
                data={rows}
                options={options}
                pagination
                selectRow={selectRowProperties}
                key={activeTab+JSON.stringify(keys)+'_pivot'}
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
                >
                    key
                </TableHeaderColumn>
                {
                    [...new Set(cols)].map(fld => {
                        return (
                            <TableHeaderColumn
                                dataField={fld}
                                key={fld}
                                columnClassName={()=>rowClassName(colsPk[fld], this.isRowSelected)}
                                dataFormat={(cell, row) => {
                                    let pk;
                                    try {
                                        pk = cell.pk;
                                    } catch(e) {
                                        pk = '';
                                    }
                                    return row.rowKey === PK ? 
                                    formatUP(
                                        {tab: row.tab, pk: cell, fld: row[PK].fld},
                                        this.changeActiveTable
                                    )
                                    : formatCol(cell, {...row, pk}, this.changeActiveTable)
                                }}
                                dataSort
                            >
                                {fld}
                            </TableHeaderColumn>
                        )
                    })
                }
            </BootstrapTable>
        );
    }

    tableUnPivot(tab, keys, activeTab) {

        const {
            options,
            selectRowProperties,
            rowClassName,
            formatCol,
            formatUP,
        } = tableProps;

        return (
            <BootstrapTable
                data={tab}
                options={options}
                hover
                pagination
                selectRow={selectRowProperties}
                trClassName={({pk})=>rowClassName(pk, this.isRowSelected)}
                key={activeTab+JSON.stringify(keys)}
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
                                dataFormat={(cell, row)=>formatCol(cell, row, this.changeActiveTable)}
                                dataSort
                            >
                                {fld}
                            </TableHeaderColumn>
                        )
                    })
                }
                <TableHeaderColumn
                    dataField="pk"
                    dataFormat={(cell, row)=>formatUP(row, this.changeActiveTable)}
                >
                    UP
                </TableHeaderColumn>
            </BootstrapTable>
        );
    }

    isRowSelected(pk) {
        const len = pk.split(this.state.fk).length;
        return len === 2;
    }

    changeTable(activeTab) {
        this.setState({
            activeTab,
            fk: "",
            showAllRows: true
        });
        
        this.getDB(this.state.data, activeTab);
    }

    changeActiveTable(activeTab, fk) {
        this.setState({
            activeTab,
            fk,
        });
        this.getDB(this.state.data, activeTab);
    }

    changeFilterVal(newVal, filed, activeTab) {
        const { tabsFields } = this.state;
        this.setState({
            tabsFields: {
                ...tabsFields,
                [activeTab]: tabsFields[activeTab].map(({key, val})=>({
                    key,
                    val: filed === key ? newVal: val,
                }))
            }
        });
    }

    toRollUp() {
        const { activeTab } =this.state;
        const active = tableProps.getPrnt(activeTab);
        if(!active) return false;
        const newData = amdb.rollUp(this.state.data, activeTab);
        this.setState({
            data: newData,
        });
        setTimeout(()=>this.changeTable(active),10);
    }

    render() {
        const { 
            showAllRows, 
            pivot, 
            activeTab,
            tab, 
            tabs,
            tabsFields
         } = this.state;

         const fileds = tabsFields[activeTab];
         const displayFields = fileds
            .filter(({val})=>val)
            .map(({key})=>key);

        return (
            <div>
            <b>Таблица: 
                <Breadcrumps 
                    path = {activeTab.split(DELIMITER)}
                    changeTable={this.changeTable}
                />
            </b>
            <p>
                <Navigation 
                    showAllRows={showAllRows}
                    changePivot={()=>{
                        this.setState({
                            pivot: !pivot
                        });
                    }}
                    changeView={()=>{
                        this.setState({
                            showAllRows: !showAllRows
                        });
                    }}
                />
            </p>
            <b>Колонки</b>
            <p>
                <FieldsFilter
                    fileds = {fileds}
                    activeTab = {activeTab}
                    changeFilterVal={this.changeFilterVal}
                />
            </p>
            <div>
                {   pivot ?
                    this.tablePivot(tab, displayFields, activeTab) : 
                    this.tableUnPivot(tab, displayFields, activeTab) 
                }
            </div>
            <p>
                <RollUp
                    toRollUp={this.toRollUp}
                />
            </p>
            <b>Все таблицы</b>
            <LinksTable 
                tabs={tabs}
                changeTable={this.changeTable}
            />
            </div>
        );
    }
}

export default AmdbMain;