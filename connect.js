import sqlite3 from 'sqlite3';
const sql3 = sqlite3.verbose();

const DB = new sql3.Database('./data.db', sqlite3.OPEN_READWRITE, connected);

function connected(err){
    if(err){
        console.error(err.message);
        return
    }
    console.log('Created to the database or SQLite3 does already exist');
}

let sql = `CREATE TABLE IF NOT EXISTS budget(
    budget_id INTEGER PRIMARY KEY,
    budget_name TEXT NOT NULL,
    budget_category TEXT NOT NULL,
    budget_amount DECIMAL(10,2) NOT NULL,
    budget_proportion DOUBLE NOT NULL
)`;

DB.run(sql, [], (err) => {
    //callback function
    if(err){
        console.error('error creating budget table');
        return;
    }
    console.log('BUDGET table created or already exists');
});

export { DB }