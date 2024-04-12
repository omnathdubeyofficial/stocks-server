/**
 * @author 
 */

//Import the date format module
//import dateFormat from 'dateformat';
import moment from 'moment';
const setDateUser= (obj,crud,username)=>
{

    let newObj={...obj}
 
   
    if(crud=="I" || crud=="i")
    {

        newObj.cdate=sysdate_yyyymmdd();
        newObj.ctime=systime_hh24mmss();
        newObj.cuser=username;
        return  newObj;
    }
    else if(crud=="U" || crud=="u")
    {

        newObj.udate=sysdate_yyyymmdd();
        newObj.utime=systime_hh24mmss();
        newObj.uuser=username;
        return  newObj;
    }
    else if(crud=="D" || crud=="d")
    {

        newObj.ddate=sysdate_yyyymmdd();
        newObj.dtime=systime_hh24mmss();
        newObj.duser=username;
        return  newObj;
    }
    else
    {
        return  newObj;
    }

}

// Get sysdate [yyyymmdd]
let sysdate_yyyymmdd = () => 
{
    // Get current timestamp
    //let now = new Date();
    //return dateFormat(now,'yyyymmdd');

    // Get current timestamp
    let now = moment();
    //console.log(now.format("YYYYMMDD"));

    return now.format("YYYYMMDD");
    

}

// Get systime [HHMMss]
let systime_hh24mmss = () => 
{
    // Get current timestamp
    //let now = new Date();
    //return dateFormat(now,'HHMMss');

    // Get current timestamp
    let now = moment();
    //console.log(now.format("HHmmss"));

    return now.format("HHmmss");
}

// Check date
let checkDate = (dateString, format) =>
{
    try 
    {        
        //let dateObj = moment("20181501", "YYYYMMDD").isValid();
        let isValidDate = moment(dateString, format).isValid();

        if(isValidDate) return true;
        else return false;
    } 
    catch (error) 
    {
        throw error;
    }
}

// Export
export default {
    sysdate_yyyymmdd,
    systime_hh24mmss,
    checkDate,
    setDateUser
};