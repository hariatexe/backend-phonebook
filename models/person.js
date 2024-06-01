const mongoose = require('mongoose'); 

mongoose.set('strictQuery',false); 

const uri = process.env.MONGODB_URI; 

console.log('connecting to ',uri); 

mongoose.connect(uri)
    .then(res => {
        console.log('connected to MONGODB'); 
    })
    .catch(err => {
        console.log('error connecting to MONGODB: ', err.message);  
    })


    const personSchema = new mongoose.Schema({
        name: {
            type: String, 
            minLength: 3, 
            required: true
        }, 
        number: {
            type: String, 
            minLength: [8, 'Phone number must be at least 8 characteres long'], 
            validate: {
                validator: function(v){
                    return /(^\d{2}[-]\d{5})|(^\d{3}[-]\d{4})/.test(v); 
                },  
                message: props => `${props.value} is not a valid phone number! Use one of following formats: xx-xxxxx xxx-xxxx `
            },
            required: [true, 'Phone number is required']
        }, 
    })

    //formatear el esquema 
    personSchema.set('toJSON',{
        transform : (document, returnedObject) =>{
            returnedObject.id = returnedObject._id.toString(); 
            delete returnedObject._id; 
            delete returnedObject.__v; 
        }
    })

    module.exports = mongoose.model('person',personSchema);
