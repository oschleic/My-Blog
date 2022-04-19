const express = require("express")
const app = express()
const path = require('path');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./blogdb.sqlite');

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get("/api", function(req, res) {
    db.serialize(function () {
        db.all("SELECT * FROM posts", function(err, rows) {
            console.log(err);
            res.send(rows)
        });
    });
})


app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
  
app.listen(3000, () => {
    console.log("app listening on port 3000")
})
