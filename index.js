const express = require('express');
const app = express();
const cors = require("cors");
const mysql = require("mysql");

const PORT = 3001;



let db;

const handleDisconnect = () => {
  
  db = mysql.createConnection(); // Recreate  connection
 

  db.connect( (err) => {             
    if(err) {                                     
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); //  delay before attempting to reconnect and 
    }                                       // process asynchronous requests in the meantime.
  });                                   
                                          
  db.on('error', (err) => {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
      handleDisconnect();                         
    } else {                                      
      throw err;                                 
    }
  });
}

handleDisconnect();




app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.post('/trans/insert',(req,res)=>{

    const type = req.body.type;
    const total = req.body.total;
    const isincome = req.body.isincome;
    const sqlInsert = "INSERT INTO transactions (type,total,isincome) VALUES (?,?,?)";
    db.query(sqlInsert,[type,total,isincome],(err,result)=>{
        
    })
});


app.post('/stocks/insert',(req,res) =>{

  const symbol = req.body.symbol;
  const price = req.body.price;
  const shares = req.body.shares;
  const sqlInsert = "INSERT INTO stocks (symbol,price,shares) VALUES (?,?,?)";
  db.query(sqlInsert,[symbol,price,shares],(err,result)=>{
    
  })

})

app.get('/trans/get',(req,res)=>{
    const sqlSelect = "SELECT * FROM transactions";
    db.query(sqlSelect,(err,result)=>{
        res.send(result);
    })
})

app.get('/stocks/get',(req,res)=>{
  const sqlSelect = "SELECT * FROM STOCKS"
  db.query(sqlSelect,(err,result)=>{
    res.send(result)
  })
})

app.delete('/trans/delete/:id',(req,res)=>{
    let sqlDelete = '';
    const data = req.params;
    if(data.id >0){
         sqlDelete = `DELETE FROM transactions WHERE trans_id = ${data.id}`;
    }
    else{
        sqlDelete = `DELETE FROM transactions WHERE type = '${data.id}'`;
    }
    db.query(sqlDelete,(err,result)=>{
        if(err)console.log(err);
    })
})

app.delete('/stocks/delete/:id',(req,res) =>{

  const data = req.params;
  const sqlDelete = `DELETE FROM stocks WHERE symbol = '${data.id}'`;
  db.query(sqlDelete,(err,result)=>{
    if(err)console.log(err)
  })

})


app.listen(process.env.PORT || PORT, ()=>{
    console.log(`running on ${PORT}`);
})

