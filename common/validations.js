/**
 * @author 
 */

// import section
import dateTime from '../services/dateTimeServices';

// Function to check null/empty/undefined value
const checkNull = (element, elementValue, errorMessage, validationObject) =>
{
    try 
    {
        if(typeof errorMessage === 'undefined' || errorMessage == null || errorMessage.trim().length == 0) 
            throw new Error("Error message is not provided for checking null value.");
    
        if(typeof elementValue === 'undefined' || elementValue == null || elementValue.trim().length == 0) 
        {
            element = "error"+element;
            validationObject[element] = errorMessage;
        }       
             
    } 
    catch (error) 
    {
        throw error;        
    }
}

// Function to check maximum length of value
const checkMaxLength = (element, elementValue, maxLength, errorMessage, validationObject) =>
{
    try 
    {
        if(typeof errorMessage === 'undefined' || errorMessage == null || errorMessage.trim().length == 0) 
            throw new Error("Error message is not provided for checking maximum length.");
        
        if(typeof maxLength === 'undefined' || maxLength == null|| isNaN(maxLength))
            throw new Error("Invalid maximum length specified.");

        if(typeof elementValue !== 'undefined' && elementValue != null && elementValue.trim().length != 0)
            if(elementValue.length > parseInt(maxLength))
            {
                element = "error"+element;
                validationObject[element] = errorMessage;                    
            }
    } 
    catch (error) 
    {
        throw error;        
    }
}


// Function to check minimum length of value
const checkMinLength = (element, elementValue, minLength, errorMessage, validationObject) =>
{
    try 
    {
        if(typeof errorMessage === 'undefined' || errorMessage == null || errorMessage.trim().length == 0) 
            throw new Error("Error message is not provided for checking minimum length.");
        
        if(typeof minLength === 'undefined' || minLength == null || isNaN(minLength))
            throw new Error("Invalid minimum length specified.");

        if(typeof elementValue !== 'undefined' && elementValue != null && elementValue.trim().length != 0)
            if(elementValue.length < parseInt(minLength))
            {
                element = "error"+element;
                validationObject[element] = errorMessage;                    
            }
    } 
    catch (error) 
    {
        throw error;        
    }
}


// Function to check number
const checkNumber = (element, elementValue, errorMessage, validationObject) =>
{
    try 
    {
        if(typeof errorMessage === 'undefined' || errorMessage == null || errorMessage.trim().length == 0) 
            throw new Error("Error message is not provided for checking number.");
        
        if(typeof elementValue !== 'undefined' && elementValue != null && elementValue.trim().length != 0 )
            if(isNaN(elementValue))
            {
                element = "error"+element;
                validationObject[element] = errorMessage;                    
            }
    } 
    catch (error) 
    {
        throw error;        
    }
}

// Function to check email
const checkEmail = (element, elementValue, errorMessage, validationObject) =>
{
    try 
    {
        if(typeof errorMessage === 'undefined' || errorMessage == null || errorMessage.trim().length == 0) 
            throw new Error("Error message is not provided for checking email.");
         
        // Regular expression for checking valid email    
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
        
        if(typeof elementValue !== 'undefined' && elementValue != null && elementValue.trim().length != 0)
            if(!re.test(elementValue))
            {
                element = "error"+element;
                validationObject[element] = errorMessage;                    
            }
    } 
    catch (error) 
    {
        throw error;        
    }
}

// Function to check number
const isDateGreater = (element1, element1Value, element2, element2Value, errorMessage, validationObject) =>
{
    try 
    {
        if(typeof errorMessage === 'undefined' || errorMessage == null || errorMessage.trim().length == 0) 
            throw new Error("Error message is not provided for checking greater date.");

        if(typeof element1Value === 'undefined' || element1Value == null || element1Value.trim().length == 0 || isNaN(element1Value))
        {
            let invalidDateMsg = element1 +" should be a date.";
            element1 = "error"+element1;
            validationObject[element1] = invalidDateMsg;
        }
        else if(typeof element2Value === 'undefined' || element2Value == null || element2Value.trim().length == 0 || isNaN(element2Value))
        {
            let invalidDateMsg = element2 +" should be a date.";
            element2 = "error"+element2;
            validationObject[element2] = invalidDateMsg;
        }
        else if(parseInt(element1Value) > parseInt(element2Value))
        {
            element1 = "error"+element1;
            validationObject[element1] = errorMessage;
        }
    } 
    catch (error) 
    {
        throw error;        
    }
}


// Function to check valid date
const checkDate = (element, elementValue, format, errorMessage, validationObject) =>
{
    try 
    {
        if(typeof errorMessage === 'undefined' || errorMessage == null || errorMessage.trim().length == 0) 
            throw new Error("Error message is not provided for checking date value.");
    
        if(!dateTime.checkDate(elementValue, format)) 
        {
            element = "error"+element;
            validationObject[element] = errorMessage;
        }       
             
    } 
    catch (error) 
    {
        throw error;        
    }
}


const errorName ={
    UNAUTHORIZED : 'UNAUTHORIZED'
}

const errorType ={

    UNAUTHORIZED :{
        message:'Authentication Required to get response',
        statusCode: 401
    }
}





    if (!context.request.user) {
        console.log(context.request.headers.origin);
        console.log('s4');
          throw new Error(errorName.UNAUTHORIZED);
    }
    else {
        console.log('s5');
       // return context.request.user;

       return   {CLNT: context.request.user.client ,LANG: context.request.user.lang ,USERNAME: context.request.user.username ,USERID: context.request.user.username ,AUTH:{GRPID:"EXUSRS",GRPNM:"EMPLOYEE GROUP",}};
    }




}


module.exports = {
    checkNull,
    checkMaxLength,
    checkMinLength,
    checkNumber,
    checkEmail,
    isDateGreater,
    checkDate,
   
}

//***** new comment added  *****/