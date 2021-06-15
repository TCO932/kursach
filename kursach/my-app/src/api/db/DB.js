const mysql = require("mysql2");
class DB {
    constructor() {
        this.connection = mysql.createConnection({
            host: "localhost",
            user: "mysql",
            database: "university",
            password: "mysql"
          }).promise();
    }
    async select(tableName) {
        return this.connection.query("SELECT * FROM " + tableName)
    }

    insert(tableName, data) { //data = {columns:[], values:[[]]}
        this.connection.query(`insert into ${tableName} (${data.columns}) values ?`, [data.values],
            function(err, results, fields) {
                console.log(err);
                console.log(results); // собственно данные
        });
    }

    update(tableName, condition, data){// condition = {column, value}; data = {column, value}
        this.connection.query(`update ${tableName} set ${data.column} = ? where ${condition.column} = ?`,
            [data.value, condition.value],
            function(err, results, fields) {
                console.log(err);
                console.log(results); // собственно данные
        });
    }

    delete(tableName, condition) {
        this.connection.query(`delete from ${tableName} where ${condition.column} = ?`, condition.value,
            function(err, results, fields) {
                console.log(err);
                console.log(results); // собственно данные
        });
    }
    
}
module.exports = DB;
//const db = new DB();
//db.select("subject");
//db.insert("subject", {columns: ["subject_name"], values:[["fst"], ["scnd"]]});
//db.update("subject", {column: "subject_name", value: "fst"}, {column: "subject_name", value: "changed"});
//db.delete("subject", {column: "subject_name", value: "scnd"});