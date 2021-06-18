const express = require("express");
const DB = require("./db/DB.js")
const db = new DB();
const app = express();
const metaRouter = express.Router();

app.use(express.urlencoded());
app.use(express.json());

app.get("/api/:tableName", async function(req, res){  
    const result = {};
    db.select(req.params["tableName"])
        .then(content => {
            result["ok"] = true;
            result["content"] = content[0];
            console.log(result);
            res.send(result);
        })
        .catch(err =>{
            result["ok"] = false;
            res.send(result["ok"]);
            console.log(err);
        });
    }
);

app.post("/api/delete", async function(req, res){  
    if(!req.body) return res.sendStatus(400);
    const result = {};
    console.log(req.body);
    db.delete(req.body.tableName, req.body.column, req.body.value)
        .then(() => {
            result["ok"] = true;
            res.send(result);
        })
        .catch(err =>{
            result["ok"] = false;
            res.send(result);
            console.log(err);
        });
    }
);

metaRouter.use("/getPK", async function(req, res){  
    if(!req.body) return res.sendStatus(400);
    const result = {};
    db.getPrimaryKey(req.body.tableName)
    .then((content) => {
        result["primaryKey"] = content[0];
        result["ok"] = true;
        console.log(result);
        res.send(result);
    })
        .catch(err =>{
            result["ok"] = false;
            res.send(result);
        });
    }
);

metaRouter.use("/getColumnNames", async function(req, res){  
    if(!req.body) return res.sendStatus(400);
    const result = {};
    db.getColumnNames(req.body.tableName)
    .then((content) => {
        result["columns"] = content[0];
        result["ok"] = true;
        console.log(result);
        res.send(result);
    })
        .catch(err =>{
            result["ok"] = false;
            res.send(result);
        });
    }
);

metaRouter.use("/getTableNames", async function(req, res){  
    const result = {};
    db.getTableNames()
    .then((content) => {
        result["tableNames"] = content[0];
        result["ok"] = true;
        res.send(result);
    })
        .catch(err =>{
            result["ok"] = false;
            res.send(result);
        });
    }
);

app.use("/api/meta", metaRouter);

app.post("/api/insert", async function(req, res){  
    if(!req.body) return res.sendStatus(400);
    const result = {};
    console.log(req.body);
    db.insert(req.body.tableName, req.body.data)
        .then(() => {
            result["ok"] = true;
            res.send(result);
        })
        .catch(err =>{
            result["ok"] = false;
            res.send(result);
            console.log(err);
        });
    }
);

app.post("/api/update", async function(req, res){  
    if(!req.body) return res.sendStatus(400);
    const result = {};
    console.log(req.body);
    db.insert(req.body.tableName, req.body.condition, req.body.data)
        .then(() => {
            result["ok"] = true;
            res.send(result);
        })
        .catch(err =>{
            result["ok"] = false;
            res.send(result);
            console.log(err);
        });
    }
);

app.post("/api/getColumnValue", async function(req, res){ //condition={column, value}
    if(!req.body) return res.sendStatus(400);
    const result = {};
    console.log(req.body);
    db.insert(req.body.tableName, req.body.condition)
        .then((value) => {
            result["ok"] = true;
            result["value"] = value[0];
            res.send(result);
        })
        .catch(err =>{
            result["ok"] = false;
            res.send(result);
            console.log(err);
        });
    }
);

app.listen(3001, function(){
    console.log("Сервер ожидает подключения...");
});