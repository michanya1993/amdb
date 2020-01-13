export const ROOT = '->';
export const DELIMITER = '.';

export function toTables(obj) {
 
     let counter = 0;
     const db = [];
 
     const req = (node, tab = ROOT, pk = ROOT, fld = '') => {
 
         if(typeof(node) === 'object' && node) {
             if(Array.isArray(node)) {
                let isNodeString = true; 
                node.forEach((subNode, i)=>{
                     req(
                        subNode, 
                         tab, 
                         [pk, fld + "["+i+"]"].join('.'), 
                         fld
                    );
                     if(typeof(subNode) === 'object') {
                        isNodeString = false;
                     }
                 });

                 if(isNodeString && node.length !== 0) {
                    req(
                        node.map(a=>({[fld]: a})), 
                        tab, 
                        pk, 
                        fld,
                    );
                 }
             }
             else {
                 const row = {};
                 for(const key of Object.keys(node)) {
                    const item = node[key] ? node[key] : "";
 
                    const tabChild = [tab, key].join(DELIMITER);
                    let fk = [pk, key + "[0]"].join(DELIMITER);
 
                     if(typeof(item) === 'object') {
                        row[key] = {
                            key,
                            tab: tabChild,
                            fk,
                        };

                         if(Array.isArray(item)) {
                            fk = pk;
                         }
                     } else {
                         row[key] = item;
                     }
                    req(item, tabChild, fk, key);
                 }
                 db.push({
                    row, 
                    rowNun: counter, 
                    tab, 
                    pk, 
                    fld,
                });
                counter++;
             }
         }
     };
     req(obj)
     return db.reverse();
 }

 export function rollUp(obj, activeTab) {

    const createObj = (a) =>{
        return typeof(a) === 'object' ? 
         (Array.isArray(a) ? {childTab: a} : a) : {childField: a};
    }

    const createRow = (prtn, clild)=>{
        const prtnKeys = Object.keys(prtn);
        const rtn = prtn;
        for(const key of Object.keys(clild)) {
            const nkey = key + (prtnKeys.includes(key) ? '_1' : '');
            rtn[nkey] = clild[key];
        }
        return rtn;
    }

   const concat = (row, childItem) =>{
        if(typeof(childItem) === 'object') {
            if(Array.isArray(childItem)) {
                return childItem.map( a=> {
                    return createRow(row, createObj(a))
                })
            }
            else {
                return createRow(row, childItem)
            }
        }
        return {
            ...row,
            childField: childItem,
        };
   }
    
    const req = (node, tab = ROOT) => {

        if(typeof(node) === 'object' && node) {
            
            if(Array.isArray(node)) {
                
                return node.map( a => {
                    return typeof(a) === 'object' ?
                        req(a) : a;
                }).flat();
                
            } else {
                const row = {};
                let seachKey;
                for(const key of Object.keys(node)) {
                    const item = node[key] ? node[key] : "";
                    const tabChild = [tab, key].join(DELIMITER);

                    if(tabChild === activeTab) {
                        seachKey = key;
                    }
                    
                    if(typeof(item) === 'object') {
                         if(Array.isArray(item)) {
                            row[key] = item.map( a=>req(a, tabChild)).flat();
                         } else {
                            row[key] = req(item, tabChild);
                         }
                     } else {
                         row[key] = item;
                     }

                }

                if(seachKey) {
                    const childItem = row[seachKey];
                    delete row[seachKey];
                    return concat(row, childItem);
                }

                return row;
                    
            }
        }
        
        return node;
    }

    return req(obj);
 }