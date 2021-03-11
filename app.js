const express = require("express");
var cors = require('cors')
var sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(cors())
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");

var db = new sqlite3.Database('database.db');
db.run('CREATE TABLE IF NOT EXISTS data(id INT UNIQUE,item TEXT,name TEXT,description TEXT,link1 TEXT,link2 TEXT,link3 TEXT,link4 TEXT,link5 TEXT,link6 TEXT,link7 TEXT,link8 TEXT,price INT, booked BOOL)');

app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(morgan("tiny"));

app.get("/", (req, res) => {
  db.serialize(()=>{
    db.all('SELECT id,item,link1,price,booked from data', function(err,row){     
      if(err){
        res.send("Error encountered while displaying");
        return console.error(err.message);
      }
      res.json({row})
    });
  });
});


app.get("/:id", (req, res) => {
  db.serialize(()=>{
    db.each('SELECT * FROM data WHERE id =?', [req.params.id], function(err,row){     
      if(err){
        res.send("Error encountered while displaying");
        return console.error(err.message);
      }
      res.json({row});
    });
  });
});

app.post("/add", (req, res) => {
const {id,item,name,description,link1,link2,link3,link4,link5,link6,link7,link8,price,booked} = req.body
    db.serialize(()=>{
      db.run('INSERT INTO data(id,item,name,description,link1,link2,link3,link4,link5,link6,link7,link8,price,booked) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [id,item,name,description,link1,link2,link3,link4,link5,link6,link7,link8,price,false], function(err,data) {
        if (err) {
          res.status(400).json({error:"Cannot save the item to database"})
        }
        console.log("New employee has been added");
        res.send(data);
      });
  });
 
})

app.delete('/:id', function(req,res){
  db.serialize(()=>{
    db.run('DELETE FROM data WHERE id = ?', req.params.id, function(err) {
      if (err) {
        res.send("Error encountered while deleting");
        return console.error(err.message);
      }
      res.send("Entry deleted");
      console.log("Entry deleted");
    });
  });
});


app.get('/update/:id/:name', function(req,res){
  db.serialize(()=>{
    db.run('UPDATE data SET booked = 1, by = ?  WHERE id = ?', [req.params.id, req.params.name], function(err){
      if(err){
        res.send("Error encountered while updating");
        return console.error(err.message);
      }
      res.send("Entry updated successfully");
      console.log("Entry updated successfully");
    });
  });
});



app.listen(process.env.PORT || 8008, () => {
	console.log("server running");
});


