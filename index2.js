import express from "express";
import bodyParser from "body-parser";
import sql from "msnodesqlv8";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { signUp,login, continueSignUp, getData, addData, delData, checkSignUp, getTableName } from "./database.js";
import { error } from "console";
const __dirname = dirname(fileURLToPath(import.meta.url));
var accessStatus;
var signAccessStatus;
async function getTableData(loginid){
    tabledata=await getData(loginid);
}  
async function  getLogin(LoginId,password){
    accessStatus= await login(LoginId,password);
} 
async function checkSignUpResult(loginid){
    signAccessStatus= await checkSignUp(loginid);
}

const connectionString="Server=localhost\SQLEXPRESS;Database=Pharmacity;Trusted_Connection=True;";
var storeLoginId;
var password;
var tabledata;
const port=3000;
const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port,(req,res)=>{
    console.log(`Server running on port ${port}`);
});
app.get("/",(req,res)=>{
    res.render("index.ejs");
});
app.get("/login",(req,res)=>{
    res.render("login.ejs");
});
app.post("/userlogin",(req,res)=>{
    storeLoginId=req.body["id"];
    password=req.body["pass"];
    getLogin(storeLoginId,password);
    
    if(accessStatus==="access denied"){
        res.send("<script>window.location.replace('/login');alert('Wrong login details please try again');</script>");
    }
    else if(accessStatus==="access granted"){
        getTableData(storeLoginId);
        res.render("displaydata.ejs",{data:tabledata})
    }
});
app.get("/signup",(req,res)=>{
    res.render("signup.ejs");
});
app.post("/user",(req,res)=>{
    storeLoginId=req.body["id"];
    checkSignUpResult(storeLoginId);
    if(signAccessStatus==="Cant signup"){
        res.send("<script>window.location.replace('/signup');alert('Login Id already exists Please try again');</script>");
    }
    else if(signAccessStatus==="Can signup"){
        signUp(req.body["id"],req.body["pass"]);
        res.render("continue.ejs");
    }
});
app.post("/user/signup",(req,res)=>{
    continueSignUp(storeLoginId,req.body["strname"],req.body["addr"],req.body["contact"]);
    res.send("<script>window.location.replace('/login');alert('Signup successful! Please login again to continue');</script>")
})
app.post("/loginuser/newentry/enterdata",(req,res)=>{
    addData(storeLoginId,req.body["medname"],req.body["price"],req.body["stock"]);
    res.send("<script>window.location.replace('/userlogin');alert('Data Inserted successfully! Plese refresh pge');</script>");
})
app.post("/loginuser/delentry/deldata",(req,res)=>{
    delData(storeLoginId,req.body["delmedname"]);
    res.send("<script>window.location.replace('/userlogin');alert('Data Deleted Successfully! Please refresh page');</script>");
})
app.get("/userlogin",(req,res)=>{
    getTableData(storeLoginId);
    res.render("displaydata.ejs",{data:tabledata})
})
app.get("/search",(req,res)=>{
    res.render("search.ejs");
})
app.post("/search",(req,res)=>{
    async function recievedStoreDetails(city,medname){
        tabledata= await getTableName(city,medname);    
        console.log(tabledata)
    }
    recievedStoreDetails(req.body["citysearch"],req.body["medsearch"]);
    res.render("search.ejs",{data:tabledata});
});