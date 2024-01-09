
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const hbs = require("hbs");

const templatepath = path.join(__dirname, "../templates");
app.set("view engine", "hbs");
app.set("views", templatepath);
app.use(bodyParser.urlencoded({ extended: false }));

// Define routes for login and signup
app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});


app.post("/login",(req,res)=>{
    const user=req.body.useremail;
     const url = "mongodb://0.0.0.0:27017"; 
     const client=new MongoClient(url);

     client.connect().then(()=>{
        const dbname=client.db("paramshah");
        const collection=dbname.collection("paramdata");
        return collection.findOne({Email:user})
     }).then((data)=>{
        if(!data){
            res.end("user not found")
        }
        if(data && data.password===req.body.loginuserpassword){
            res.render("home");
        }
        else{
            res.end("invalid")
        }

        client.close()
     })
})

app.post("/signup", async (req, res) => {

    const data = {
        Email: req.body.useremail,
        password: req.body.userpassword // Ensure proper password hashing before storage
    };

    const url = "mongodb://0.0.0.0:27017";
    const client = new MongoClient(url);

    try {
        await client.connect();
        const dbname = client.db("paramshah");
        const collection = dbname.collection("paramdata");
        await collection.insertOne(data);

        client.close();
        res.render("home"); // Render the home view after the operation completes
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("Error occurred");
    }
});

// Start the server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
