const db= require('./db');
let  accountDetails 
={
    1001:{name:"user1", acno:1001, pin:1234, password:'userone', balance:3000,transactions:[]},
    1002:{name:"user2", acno:1002, pin:2345, password:'usertwo', balance:2500,transactions:[]},
    1003:{name:"user3", acno:1003, pin:3456, password:'userthree', balance:3500,transactions:[]},
    1004:{name:"user4", acno:1004, pin:4567, password:'userfour', balance:4000,transactions:[]},
    1005:{name:"user5", acno:1005, pin:5678, password:'userfive', balance:5000,transactions:[]},
};
let currentUser;

const register=(name,acno,pin,password)=>{
  return db.User.findOne({
    acno
  })
  .then(user=>{
    console.log(user);
    if(user){
      return{
        status:false,
          statusCode:422,
          message:'account already exists,please login' 
      }
      }
const newUser = new db.User({
  name,
  acno,
  pin,
  password,
  balance:0,
  transactions:[]
});
newUser.save();
return{
  status:true,
    statusCode:200,
    message:'successfully rgistered,please login'
};
});
}
    
const logout=(req)=>{
  req.session.currentUser="";
  return;
}
  
  

const login=(req,acno1,password)=>{
  var acno=parseInt(acno1);
  return db.User.findOne({
    acno,
    password
  })
  .then(user=>{
    //.then is a promise for asynchronous operation in mongoose
    if(user){
      req.session.currentUser=acno;
      return{
        status:true,
              statusCode:200,
              message:'logged in',
              name:user.name
      }
    };
    return{
      status:false,
      statusCode:422,
      message:'invalid credentials'
  };
  });
}
//     var data=accountDetails;
//         var acno=parseInt(acno1);
        
//     if (acno in data){
//         var pwd = data[acno].password
//         if (pwd==password){
//          req.session.currentUser=data[acno];
//          // this.saveDetails();
//           return {
//               status:true,
//               statusCode:200,
//               message:'logged in'
//           }
//   }
// }
// return{
//     status:false,
//     statusCode:422,
//     message:'invalid credentials'
// }
  
  const deposit=(acno1,pin,amt)=>{
    return db.User.findOne({
      acno:acno1,
      pin
    })
    .then(user=>{
      if(!user){
        return{
          status:false,
            message:'incorrect accout number',
            statusCode:422
        }
      }
      user.balance+= parseInt(amt);
      user.transactions.push({
        amount:amt,
        typeOfTransaction:'credit',
       
      });
      user.save();
      return{
        status:true,
        message:("account has been credited"),
        balance:user.balance,
        statusCode:200
      }
    })
  }
//     var data=accountDetails;
      
//       if (acno1 in data){
//           var mpin = data[acno1].pin
//           if (pin==mpin){
             
//              // this.saveDetails();
//               return{
               
              
              
//           }
//         }
//       }
//       else{
//           return{
            
//           }
//       }        

// }
const withdraw=(req,acno1,pin,amt)=>{
  return db.User.findOne({
    acno:acno1,
    pin
  })
  .then(user=>{
    if(req.session.currentUser!=acno1){
      return{
        status:false,
          message:'you are not allowed to make this transaction',
          statusCode:422
      }
    }
    if(!user){
      return{
        status:false,
          message:'incorrect accout number',
          statusCode:422
      }
    }
   
    if(user.balance<parseInt(amt)){
      return{
        status:false,
        message:'insufficient balance',
        statusCode:422
      }
    }
    user.balance-= parseInt(amt);
    user.transactions.push({
      amount:amt,
      typeOfTransaction:'debit',
     
    });
    user.save();
    return{
      status:true,
      message:("the account has been debited"),
      balance:user.balance,
      statusCode:200
    }
  })
}

    // var data=accountDetails;
    // if(acno1 in data){
    // if(data[acno1].balance<parseInt(amt)){
    //   return{
    //     status:false,
    //     message:'insufficient balance',
    //     statusCode:422
    //   }
    // }
    //   else if(data[acno1].pin==pin){
    //     data[acno1].balance-=parseInt(amt);
    //     data[acno1].transactions.push({
    //       amount:amt,
    //       type:'debit',
    //       id:Math.floor( Math.random()*100000)
    //     })
    //     //this.saveDetails();
    //     return{
    //       status:true,
    //       message:'the amount has been debited',
    //       balance:data[acno1].balance,
    //       statusCode:200
    //     }
    //   }
    // }
    // else{
    //   return{
    //     status:false,
    //     message:'incorrect account number',
    //     statusCode:422
    //   }
    // }
        

        
    //   }
    
const getTransactions= (req) =>{
    return db.User.findOne({
acno:req.session.currentUser
    })
    .then(user=>{
      return{
        status:true,
        statusCode:200,
        transactions:user.transactions
      }
    })
}
    



const deleteTransactions=(req,id)=>{
  return db.User.findOne({
    acno:req.session.currentUser
  })
  .then(user=>{
    
user.transactions=user.transactions.filter(t=>{
  if(t._id==id){
    return false;
  }
  return true;
})
user.save();
return{
  status:true,
  statusCode:200,
  message:'transaction deleted successfully'
}
    
  })
}
//   let transactions=accountDetails[req.session.currentUser.acno].transactions;
//   transactions=transactions.filter(t=>{
//     if(t.id==id){
//       return false;
//     }
//   return true;
//   })
//   accountDetails[req.session.currentUser.acno].transactions=transactions;
//   return{
//     status:true,
//     statusCode:200,
//     message:'transaction deleted successfully'
//   }

  
// }
module.exports={
    register,
    logout,
    login,
    deposit,
    withdraw,
   getTransactions,
   deleteTransactions
}