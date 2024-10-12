const express = require('express')
const bodyParser = require('body-parser')
const app = express()
var mysql = require('mysql')
const port = 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json())
app.use((req,res,next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  
  next();
})

var con = mysql.createConnection({
  host: "korawit.ddns.net",
  user: "webapp",
  password: "secret2024",
  port:"3307",
  database: "shop",
  
})


app.get('/api/products', function(req, res){
  con.query("SELECT * FROM products", function(err, result, fields){
    if(err) {
      return res.status(400).send('Not found');
    }
    console.log(result);
    res.send(result);
  });
})

app.get('/api/products/:id',function(req,res){
  const id = req.params.id;

  con.query("SELECT * FROM products where id="+id, function (err, result, fields){
    if (err) throw err;
    let products =result;
    if(products.length>0) {
      res.send(products);
    }else{
      res.status(400).send('Not found product for'+id);
    }
  })
})

// const products=[
//   {id:0,name:"Notebook Acer Swift",price:45900,img:"https://img.advice.co.th/images_nas/pic_product4/A0147295/A0147295_s.jpg"},
//   {id:1,name:"Notebook Asus Vivo",price:19900,img:"https://img.advice.co.th/images_nas/pic_product4/A0146010/A0146010_s.jpg"},
//   {id:2,name:"Notebook Lenovo Ideapad",price:32900,img:"https://img.advice.co.th/images_nas/pic_product4/A0149009/A0149009_s.jpg"},
//   {id:3,name:"Notebook MSI Prestige",price:54900,img:"https://img.advice.co.th/images_nas/pic_product4/A0149954/A0149954_s.jpg"},
//   {id:4,name:"Notebook DELL XPS",price:99900,img:"https://img.advice.co.th/images_nas/pic_product4/A0146335/A0146335_s.jpg"},
//   {id:5,name:"Notebook HP Envy",price:46900,img:"https://img.advice.co.th/images_nas/pic_product4/A0145712/A0145712_s.jpg"}];



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/products',(req,res)=>{
  if(products.length>0)
    res.send(products);
  else
    res.status(400).send("Not found");

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
