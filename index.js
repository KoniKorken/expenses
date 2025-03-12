import { DB } from "./connect.js";
import express from 'express';
import bodyParser from 'body-parser'
import cors from 'cors';

const port = 4000;

const app = express();
app.use(cors() );
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(200);
    res.send('Budget service is online');
});

app.get('/api', (req, res) => {
    //get all budget lineItems
    res.set('content-type', 'application/json');
    const sql = 'SELECT * FROM budget';
    let data = {lineItem: []};
    try{
        DB.all(sql, [], (err, rows) => {
            if(err){
                throw err;
            }
            data.status = 'OK';
            rows.forEach(row => {
                data.lineItem.push({
                    id : row.lineItem_id, 
                    name: row.lineItem_name, 
                    category: row.lineItem_category, 
                    amount:row.lineItem_amount, 
                    lineItem_proportion: row.lineItem_proportion
                });
            });
            const content = JSON.stringify(data);
            res.send(content);
        })
    }catch(err){
        console.error(err.message);
        res.status(467);
        res.send(`{"code":467, "status":"${err.message}}`);
    }


});

app.post('/api', (req, res) => {
    console.log(req.body);
    res.set('content-type', 'application/json');
    const sql = 'INSERT INTO budget(lineItem_name, lineItem_category, lineItem_amount, lineItem_proportion) VALUES (?, ?, ?, ?)';
    let newId;  
    try{
        DB.run(sql, [req.body.name, req.body.category, req.body.amount,req.body.proportion], function(err){
            if(err){
                throw err;
            }
            newId = this.lastID;
            res.status(201);
            let data = {status: 201, message: `lineItem ${newId} has been saved.`}
            let content = JSON.stringify(data);
            res.send(content);
        })
    }catch(err){
        console.error(err.message);
        res.status(468);
        res.send(`{"code":468, "status":"${err.message}}`);
    }
});

app.delete('/api', (req, res) => {
    res.set('content-type', 'application/json');
    const sql = 'DELETE FROM budget WHERE lineItem_id = ?';
    try{
        DB.run(sql, [req.query.id], function(err){
            if(err) throw err;
            if(this.changes === 1){
                //one item deleted
                res.status(200);
                res.send(`{"message":"lineItem ${req.query.id} was removed from list"}`);

            }else{
                //no delete done
                res.status(200);
                res.send(`{"message":"No operation needed"}`);
            }
        })
    }catch(err){
        console.error(err.message);
        res.status(468);
        res.send(`{"code":468, "status":"${err.message}}`);
    }
});

app.listen(port, (err) => {
    if(err){
        console.error('ERROR: ', err.message);
        return;
    }
    console.log(`Listening on port ${port}`);
});