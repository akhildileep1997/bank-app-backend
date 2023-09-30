
// 1 import express
const express = require('express');
// 4 import cors
const cors = require('cors');
// 10 import logic
const logic = require('./services/logic')

// import jsonweb token
const jwt = require('jsonwebtoken')

// 2 create a server application using express
const server = express()
// 5 use cors
server.use(cors({
    origin:'http://localhost:4200'
}))

// 6  // returns middleware that only parses json
server.use(express.json())  

// 3 setup port for server application
server.listen(5000,()=>{
    console.log('server listening on port 5000');
})

//7 API call to resolve   // localhost/5000
server.get('/',(req,res)=>{
    res.send("welcome to backend")
})   
// 8 beruthei cheytheyaaa
server.post('/',(req,res)=>{
    res.send("server post")
}) 

// // Application-level Middleware      // just manasilakkan vendi cheytheyaaa 
//  const appMiddleware = (req,res,next)=>{
//     console.log('application level-middleware');
//      next();
//  }
//  server.use(appMiddleware) //  just called the above function

// Router level middleware
 const jwtMiddleware = (req,res,next)=>{
    console.log('router level middleware');
    try{
    const token = req.headers['verify-token'] // this indicates token is in the header of the request
    console.log(token);
    const data = jwt.verify(token,'superkey2023')
    console.log(data);
    req.currentAcno=data.loginAcno
    next();
       }
       catch{
        res.status(401).json({message:"Please Login"})
       }
 }

// API calls for our projects
// 9 Register:localhost:5000/register
server.post('/register',(req,res)=>{
    console.log("inside register API call");
    console.log(req.body);
    // logic to resolve register request
    //11
    logic.register(req.body.username,req.body.acno,req.body.password).then((response)=>{
        res.status(response.statusCode).json(response)

    })
})
// 12 login-localhost:5000/login
server.post('/login',(req,res)=>{
    console.log('Inside login api call');
    console.log(req.body);
    // logic to resolve login request
    logic.login(req.body.acno,req.body.password).then((response)=>{
        res.status(response.statusCode).json(response)
    })
})


// 13 balance:localhost:5000/balance
server.get('/getbalance/:acno',jwtMiddleware,(req,res)=>{
    console.log('Inside balance API call');
    console.log(req.params); //http://localhost:5000/getbalance/100
    logic.getBalance(req.params.acno).then((response)=>{
        res.status(response.statusCode).json(response)
    })
})


//fund transfer:localhost:5000/fund transfer
server.post('/fundtransfer',jwtMiddleware,(req,res)=>{
console.log('Inside fundtransffer api call');
console.log(req.body);
// checking logic
logic.fundTransfer(req.currentAcno,req.body.password,req.body.toAcno,req.body.amount).then((response)=>{
    res.status(response.statusCode).json(response)
})
})

//transactions:localhost:localhost:5000/transactions  
server.get('/transactions',jwtMiddleware,(req,res)=>{
    console.log('inside transaction api call');
    logic.transactionHistory(req.currentAcno).then((response)=>{
        res.status(response.statusCode).json(response)
    })
})

//  deleting account from db
server.delete('/deleteAccount',jwtMiddleware,(req,res)=>{
    console.log('inside delete api');
    logic.deleteAccount(req.currentAcno).then((response)=>{
        res.status(response.statusCode).json(response)
    })
})