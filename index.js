const express = require('express');
const dataService=require('./services/data.service')
const session = require('express-session')
const cors =require('cors');
const app=express();
app.use(cors({
    origin:'http://localhost:4200',
     credentials:true
}))

app.use(session({
    secret:'randomsecurestring',
    resave:false,
    saveUninitialized:false,
}));
app.use(express.json());
const logMiddleware=(req,res,next)=>{
    console.log(req.body);
    next();
};
app.use(logMiddleware);

const authMiddleware =(req,res,next) =>{
    if(!req.session.currentUser){
        return res.json( {
            status:true,
            statusCode:401,
            message:'please login'

        });
    } if(!req.session.currentUser){
        return {
            status:true,
            statusCode:401,
            message:'please login'

        }
    }
    else{
        next();
    }
};

app.get('/',(req,res)=>{
    res.send("hello world");
})
app.post('/',(req,res)=>{
    res.send("post method");
})
app.post('/register',(req,res)=>{
    dataService.register(req.body.name,req.body.acno,req.body.pin,req.body.password)
    .then(result=>{
        res.status(result.statusCode).json(result);
    })
    //res.status(result.statusCode).json(result);
})
app.post('/login',(req,res)=>{
    dataService.login(req,req.body.acno1,req.body.password)
    
    .then(result=>{
        res.status(result.statusCode).json(result);
    })
    //res.status(result.statusCode).json(result);
})
app.post('/logout',(req,res)=>{
    dataService.logout(req);
    res.status(200).json({
        status:true,
        statusCode:200,
        message:'user logged out'
    });
})
app.post('/deposit',authMiddleware, (req,res)=>{
    
    dataService.deposit(req.body.acno1,req.body.pin,req.body.amt)
.then(result=>{
    res.status(result.statusCode).json(result);
})
    
})
app.post('/withdraw',authMiddleware, (req,res)=>{
    dataService.withdraw(req,req.body.acno1,req.body.pin,req.body.amt)
    .then(result=>{
        res.status(result.statusCode).json(result);
    })

})
app.get('/transactions',authMiddleware, (req,res)=>{
    dataService.getTransactions(req)
    .then(result=>{
        res.status(200).json(result);
    })
    
})
app.delete('/transactions/:id',authMiddleware, (req,res)=>{
    dataService.deleteTransactions(req,req.params.id)
    .then(result=>{
        res.status(200).json(result);
    })
    
})


app.patch('/',(req,res)=>{
    res.send("patch method");
})
const port = 3000
app.listen(port,()=>{
    console.log("server started at port "+port);
})