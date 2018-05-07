
let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(':cashflow:');

const createDatabase = () => {
    return new Promise(async (resolve)=>{
        // region exec sql
        // region userType
        const userType = await new Promise((resolve)=>{
            db.run("CREATE TABLE IF NOT EXISTS userType (\n" +
                "  id INTEGER PRIMARY KEY AUTOINCREMENT,\n" +
                "  name text NOT NULL,\n" +
                "  permissions text NOT NULL\n" +
                ");", [], (err)=>{
                if(err){
                    resolve(false);
                }else{
                    resolve(true);
                }
            });
        });
        // endregion
        // region user
        const user = await new Promise((resolve)=>{
            db.run("CREATE TABLE IF NOT EXISTS user (\n" +
                "  id INTEGER PRIMARY KEY AUTOINCREMENT,\n" +
                "  username text NOT NULL,\n" +
                "  password text NOT NULL,\n" +
                "  userType int(11) NOT NULL,\n" +
                "  token TEXT UNIQUE, \n" +
                "  FOREIGN KEY (userType) REFERENCES userType(id)\n" +
                ");", [], (err)=>{
                if(err){
                    resolve(false);
                }else{
                    resolve(true);
                }
            });
        });
        // endregion
        // region paymentType
        const paymentType = await new Promise((resolve)=>{
            db.run("CREATE TABLE IF NOT EXISTS paymentType (\n" +
                "  id INTEGER PRIMARY KEY AUTOINCREMENT,\n" +
                "  name text NOT NULL\n" +
                ");", [], (err)=>{
                if(err){
                    resolve(false);
                }else{
                    resolve(true);
                }
            });
        });
        // endregion
        // region transaction
        const transaction = await new Promise((resolve)=>{
            db.run("CREATE TABLE IF NOT EXISTS transact (" +
                "  id INTEGER PRIMARY KEY AUTOINCREMENT,\n" +
                "  description text NOT NULL,\n" +
                "  amount float NOT NULL,\n" +
                "  paymentType int(11) NOT NULL,\n" +
                    "  transactionDate timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,\n" +
                "  user int(11) NOT NULL,\n" +
                "  FOREIGN KEY (paymentType) REFERENCES paymentType (id),\n" +
                "  FOREIGN KEY (user) REFERENCES user (id)\n" +
                ");", [], (err)=>{
                if(err){
                    resolve(false);
                }else{
                    resolve(true);
                }
            });
        });
        // endregion
        // endregion sql

        resolve(true);
    });
};

const createQuery = (action, target, params, filter) => {
    // region Inicio da query
    let sql = "";
    if(action === 'insert'){
        sql += "INSERT INTO " + target;
    }else if(action === 'update'){
        sql += "UPDATE " + target + " SET";
    }else if(action === 'delete'){
        sql += "DELETE FROM " + target;
    }else if(action === 'select'){
        sql += "SELECT * FROM " + target;
    }
    // endregion
    // region create params
    if(action !== 'delete' && action !== 'select') {
        let insertColumns = "(";
        let insertValues = " VALUES(";
        for (let i = 0; i < Object.keys(params).length; i++) {
            if (action === 'insert'){
                if(i===0){
                    if(params[Object.keys(params)[i]] !== undefined){
                        insertColumns +=Object.keys(params)[i];
                        insertValues +="'" + params[Object.keys(params)[i]] + "'";
                    }
                }else{
                    if(params[Object.keys(params)[i]] !== undefined){
                        insertColumns +=', '+Object.keys(params)[i];
                        insertValues +=", '" + params[Object.keys(params)[i]] + "'";
                    }
                }
            }else if(action === 'update'){
                if(i===0){
                    if(params[Object.keys(params)[i]] !== undefined) {
                        sql += " " + Object.keys(params)[i] + "='" + params[Object.keys(params)[i]] + "'";
                    }
                }else{
                    if(params[Object.keys(params)[i]] !== undefined) {
                        sql += ", " + Object.keys(params)[i] + "='" + params[Object.keys(params)[i]] + "'";
                    }
                }
            }
        }
        insertColumns += ")";
        insertValues += ")";
        if(action === 'insert'){
            sql += insertColumns + insertValues;
        }
    }
    // endregion
    // region Set filter
    if(action !== 'insert'){
        if(action !== 'select'){
            console.log(filter);
            sql += " WHERE " + Object.keys(filter)[0] + "='" + filter[Object.keys(filter)[0]] + "'";
        }else{
            for (let i = 0; i < Object.keys(filter).length; i++) {
                if(i===0){
                    if(filter[Object.keys(filter)[i]] !== undefined){
                        sql +=' WHERE '+Object.keys(filter)[i];
                        sql +="='" + filter[Object.keys(filter)[i]] + "'";
                    }
                }else{
                    if(filter[Object.keys(filter)[i]] !== undefined){
                        sql +=' AND '+Object.keys(filter)[i];
                        sql +="='" + filter[Object.keys(filter)[i]] + "'";
                    }
                }
            }
        }
    }
    // endregion
    return sql;
};

exports.populateDatabase =  async () => {
    await createDatabase();
    // region userType

    // Permisions: each digit is a permission to a different feature
    //  0: no access
    //  1: access
    //  2: create
    //  3: edit
    //  4: delete

    // Order of permissions: Dashboard;Transaction
    let userTypes = [
        {
            id: 1,
            name: "Manager",
            permissions: 14
        },
        {
            id: 2,
            name: "Employee",
            permissions: 12
        }
    ];
    let stmt = db.prepare("INSERT OR REPLACE INTO userType VALUES(?, ?, ?)");
    for(let userType of userTypes){
        stmt.run(userType.id, userType.name, userType.permissions);
    }

    // endregion
    // region user
    let users = [
        {
            id: 1,
            username: 'manager',
            password: 'Boss123',
            userType: 1,
            token: null,
        },
        {
            id: 2,
            username: 'employee',
            password: 'Employee123',
            userType: 2,
            token: null,
        }
    ];
    stmt = db.prepare("INSERT OR REPLACE INTO user VALUES(?, ?, ?, ?, ?)");
    for(let user of users){
        stmt.run(user.id, user.username, user.password, user.userType, user.token);
    }
    // endregion
    // region paymentType
    let paymentTypes = [
        {
            id: 1,
            name: "Credit card"
        },
        {
            id: 2,
            name: "Money"
        }
    ];
    stmt = db.prepare("INSERT OR REPLACE INTO paymentType VALUES(?, ?)");
    for(let paymentType of paymentTypes){
        stmt.run(paymentType.id, paymentType.name);
    }
    // endregion
};


exports.get = (action, target, params, filter) => {
    const sql = createQuery(action, target, params, filter);
    return new Promise((resolve)=>{
        db.get(sql, [], (err, rows)=>{
            if(err){
                resolve(false);
            }else{
                if(rows === undefined || rows.length === 0){
                    resolve(false);
                }else{
                    resolve(rows);
                }
            }
        });
    });
};

exports.delete = (action, target, params, filter) => {
    const sql = createQuery(action, target, params, filter);
    return new Promise((resolve)=>{
        db.run(sql, [], (err)=>{
            if(err){
                resolve(false);
            }else{
                resolve(true);
            }
        });
    });
};

exports.set = (action, target, params, filter) => {
    const sql = createQuery(action, target, params, filter);
    console.log(sql);
    return new Promise((resolve)=>{
        db.run(sql, [], (err)=>{
            if(err){
                resolve(err);
            }else{
                resolve(true);
            }
        });
    });
};

exports.fetchAll = (action, target, params, filter) => {
    const sql = createQuery(action, target, params, filter);
    return new Promise((resolve)=>{
        db.all(sql, [], (err, rows)=>{
            if(err){
                resolve(false);
            }else{
                console.log(rows);
                resolve(rows);
            }
        });
    });
};

exports.query = (query) => {
    return new Promise((resolve)=>{
        db.all(query, [], (err, rows)=>{
            if(err){
                resolve(false);
            }else{
                console.log(rows);
                resolve(rows);
            }
        });
    });
};


