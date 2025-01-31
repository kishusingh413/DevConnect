const Validator = require('validator') ;
const isEmpty = require('./is-empty') ;

module.exports = function validateRegisterInput(data){
    let errors = {} ;

    data.name = !isEmpty(data.name) ? data.name : '' ;
    data.email = !isEmpty(data.email) ? data.email : '' ;
    data.password = !isEmpty(data.password) ? data.password : '' ;
    data.password2 = !isEmpty(data.password2) ? data.password2 : '' ;
     
    if(!Validator.isLength(data.name, {min: 2, max: 30})){
        errors.name ='Name must be between 2 and 30 characters' ;
    }

    if(Validator.isEmpty(data.name)){
        errors.name = 'Name field is required';
    }

    if(Validator.isEmpty(data.email)){
        errors.email = 'Email field is required';
    }

    if(!Validator.isEmail(data.email)){
        errors.email = 'Email field is Invalid';
    }

    if(Validator.isEmpty(data.password)){
        errors.password = 'password field is required';
    }

    if(!Validator.islength(data.password, {min: 6, max: 30})){
        errors.password = 'Password must be atleast 6 characters';
    }

    if(Validator.isEmpty(data.password2)){
        errors.password2 = 'Password2 field is required';
    }

    if(!Validator.equal(data.password, data.password2)){
        errors.password2 = 'Passwords must match';
    }

    return {
        errors,
        isValid: isEmpty(errors) 
    };
};