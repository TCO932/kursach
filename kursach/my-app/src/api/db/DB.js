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
        return this.connection.query("SELECT * FROM " + tableName);
    }

    async insert(tableName, data) { //data = {columns:[], values:[[]]}
        return this.connection.query(`insert into ${tableName} (${data.columns}) values ?`, [data.values]);
    }

    async update(tableName, condition, data){// condition = {column, value}; data = {column, value}
        return this.connection.query(`update ${tableName} set ${data.column} = ? where ${condition.column} = ?`,
            [data.value, condition.value]);
    }

    async delete(tableName, column, value) {
        console.log(tableName, column, value);
        return this.connection.query(`delete from ${tableName} where ${column} = ?`, value);
    }

    async getTableNames() {
        return this.connection.query(`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.tables
        where table_schema = "university" order by TABLE_NAME desc`);
    }

    async getColumnNames(tableName) {
        return this.connection.query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.columns
        where table_schema = "university" and table_name = ? order by ORDINAL_POSITION`, tableName);
    }

    async getPrimaryKey(tableName) {
        return this.connection.query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.columns
        where table_schema = "university" and COLUMN_KEY = "PRI" and table_name = ?`, tableName);
    }
    
}
module.exports = DB;
//const db = new DB();
//db.select("subject");
//db.insert("subject", {columns: ["subject_name"], values:[["fst"], ["scnd"]]});
//db.update("subject", {column: "subject_name", value: "fst"}, {column: "subject_name", value: "changed"});
//db.delete("subject", {column: "subject_name", value: "scnd"});