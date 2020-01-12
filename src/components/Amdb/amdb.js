export function toTables(obj) {
 
     let counter = 0;
     const db = [];
 
     const req = (node, tab = '->', pk = '->', fld = '') => {
 
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
 
                    const tabChild = [tab, key].join('.');
                    let fk = [pk, key + "[0]"].join('.');
 
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