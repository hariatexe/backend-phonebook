// const mongoose = require('mongoose'); 

// if(process.argv.length < 3){
//     console.log("give password as argument"); 
//     process.exit(1); 
// }

//     const password = process.argv[2]; 
//     console.log(process.argv[0]);  

//     const uri =`mongodb+srv://ignacioariasexe:${password}@cluster0.2bsdnbo.mongodb.net/phonebook?retryWrites=true&w=majority`; 
//     mongoose.set('strictQuery',false); 

//     mongoose.connect(uri);
    

//     const personSchema = new mongoose.Schema({
//         name: String, 
//         number: Number
//     })

//     const personModel = new mongoose.model('Person',personSchema); 


//     if(process.argv.length == 3){
//         console.log('phonebook: '); 
//         personModel.find({}).then(res => {
//             res.forEach(res=>{
//                 console.log(res.name, res.number); 
//             })
//             mongoose.connection.close(); 
//         })
//     }else{
//         const newPerson = new personModel({
//             name: process.argv[3], 
//             number: process.argv[4]
//         })
    
    
//         newPerson.save().then(res=>{
//             console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`); 
//             mongoose.connection.close(); 
//         })
//     }

   