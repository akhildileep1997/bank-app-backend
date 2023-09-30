// import db
const db=require('./db')

// import jsonweb token
const jwt = require('jsonwebtoken')

// logic for register

const register=(username,acno,password)=>{
  return db.User.findOne({acno}).then((response)=>{
    console.log(response);
    if(response){
        return{
            statusCode:401,
            message:"Accout number already exist"
        }
    }
    else{
        const newUser=new db.User({
            username,
            acno,
            password,
            balance:2000,
            transactions:[]
        })
        // to store to mongodb
        newUser.save()
        // response send back to the client
        return {
            statusCode:200,
            message:"registration successfull"
        }
    }
  })
}

// logic for login
const login=(acno,password)=>{
  return db.User.findOne({acno,password}).then((response)=>{
    console.log(response);//full details
    if(response)
    {
         // generate token
         const token = jwt.sign({
            loginAcno:acno
         },'superkey2023')

        return{  // if present
            statusCode:200,
            message:"Login Successful",
            currentUser:response.username,//only getting username, send to front-end
            balance:response.balance,// to store balance
            token, // to get token for saving localstorage
            currentAcno:acno// to store current acno to local storage

        }
    }
    else{  // acno and password not present
        return{
            statusCode:402,
            message:"invalid login"
        }
    }
  })
}

//logicfgor getting balance
const getBalance=(acno)=>{
  return db.User.findOne({acno}).then((result)=>{
    if(result){
        return{
            statusCode:200,
            balance:result.balance
        }
    }
    else{
        return{
            statusCode:401,
            message:'Invalid Account Number'
        }
    }
  })
}


// logic for fund transffer
const fundTransfer=(fromAcno,frompswd,toAcno,amt)=>{
 // convert amt to a number
 let amount = parseInt(amt)
 // checking fromAcno and frompswd in mongodb
 return db.User.findOne({acno:fromAcno,password:frompswd}).then((debit)=>{
    if(debit){
        // check toAcno in mongodb
        return db.User.findOne({acno:toAcno}).then((credit)=>{
            //fund transfer
            if(credit){
                // checking if balance greater than sending amount
                if(debit.balance>=amount){
                    // changes in debit account
                    debit.balance-=amount
                    debit.transactions.push({
                        type:'Debit',
                        amount,
                        fromAcno,
                        toAcno
                    })   
                         //  save changes to database
                debit.save()
                // changes in credit account
              credit.balance+=amount
              credit.transactions.push({
                type:'Credit',
                amount,
                fromAcno,
                toAcno
              })
              // save changes to database
              credit.save()
              // send response back to client
              return{
                statusCode:200,
                message:'Fund transfer successful...'
              }

              
                }
                else{
                    return{
                        statusCode:401,
                        message:'Insufficient Balance'
                    }
                }

            }
            //     //  save changes to database
            //     debit.save()
            //     // changes in credit account
            //   credit.balance+=amount
            //   credit.transactions.push({
            //     type:'Credit',
            //     amount,
            //     fromAcno,
            //     toAcno
            //   })
            //   // save changes to database
            //   credit.save()
            //   // send response back to client
            //   return{
            //     statusCode:200,
            //     message:'Fund transfer successful...'
            //   }

            
            else{
                return{
                    statusCode:401,
                    message:'Invalid credit Details'
                }
            }
        })
    }
    else{
        return{
            statusCode:401,
            message:'Invalid debit Details'
        }
    }
 })
}

// logic for transaction history
const transactionHistory =(acno)=>{
return db.User.findOne({acno}).then((result)=>{
    if(result){
        return{
            statusCode:200,
            transactions:result.transactions
        }
    }
    else{
        return{
            statusCode:400,
            message:'Invalid data'
        }
    }
})
}

// to delete account from mongodb
const deleteAccount = (acno)=>{
   return db.User.deleteOne({acno}).then((result)=>{
    return{
        statusCode:200,
        message:"Account deleted succesfully"
    }
   }) 
}



module.exports={
    register,
    login,
    getBalance,
    fundTransfer,
    transactionHistory,
    deleteAccount
}