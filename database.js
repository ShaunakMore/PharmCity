import mysql from "mysql2";

const pool= mysql.createPool({
    host:"localhost",
    user:"root",
    password:"samushon9904",
    database:"PharmacyCity"
}).promise()

export async function signUp(id,pass){
    const [result]=await pool.query(`insert into
    loginInfo(loginId,pass) values
    (?,?) `,[id,pass])
    const rowAffected=result.affectedRows;
    return rowAffected;
}

export async  function login(id,passw){
    const [result]= await pool.query(`select * 
    from loginInfo where
    loginId=?`,[id])
    var access=""
    if(result[0]===undefined){
       access="access denied";
    }
    else if(result[0].loginId===id && result[0].pass===passw){
        access="access granted";
    }
    return access;
}
export async function getName(id){
    const [result]=await pool.query(`select name from storeDetails where loginId=?`,[id]);
    return result[0].name;
}
export async function continueSignUp(loginid,name,add,cinfo){
    const [result]=await pool.query(`insert into
    storeDetails(loginId,name,address,contact) values
    (?,?,?,?) `,[loginid,name,add,cinfo])
    const rowsAffected=result.affectedRows;
    await pool.query(`create table 
    admin_${loginid}(srno int not null auto_increment primary key,medname varchar(50),price int,stockstatus varchar(50))`);
}
export async function getData(loginid){
    const [result]= await pool.query(`select
    * from admin_${loginid}`);
    return result;
}

export async function addData(loginid,medicine,medprice,stockstate){
    const [result]=await pool.query(`insert into
    admin_${loginid}(medname,price,stockstatus) values
    (?,?,?) `,[medicine,medprice,stockstate])
}
export async function delData(loginid,medicine){
    const [result]=await pool.query(`delete from
    admin_${loginid} where medname=?`,[medicine])
}
export async  function checkSignUp(id){
    const [result]= await pool.query(`select * 
    from loginInfo where
    loginId=?`,[id])
    var signal=""
    if(result[0]===undefined){
       signal="Can signup";
    }
    else if(result[0].loginId===id){
        signal="Cant signup";
    }
    return signal;
}
export async function getTableName(city,medname){
    const [result]=await pool.query(`select loginId from
    storedetails where address like '%${city}'`);
    
    var result3=[];
    var result2;
    for(var i=0;i<result.length;i++){
        result2= await pool.query(`select concat("${result[i].loginId}") as Field from admin_${result[i].loginId} where medname=? and stockstatus='in stock'`,[medname]);
        if(result2[0].length===0){
            continue;
        }
        else{
            result3.push(result2[0]);
        }
            }
            
    var result4;
    var result5=[];
    for(var i=0;i<result3.length;i++){
        result4=await pool.query(`select name,address,contact from storedetails where loginId='${result3[i][0].Field}'`);
        result5.push(result4[0][0]);
    }
   return result5;
}
