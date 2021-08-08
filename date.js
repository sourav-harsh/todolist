

//experiment part of both module after line number 21 it is normal way of writing module
exports.getDate = function getDate(){

let today = new Date();

let option = {
  weekday:"long",
  day:"numeric",
  month:"long"
};

let day = today.toLocaleDateString("en-US",option);

return day;
}




module.exports.getDay = getDay;

function getDay(){

let today = new Date();

let option = {
  weekday:"long"
};

let day = today.toLocaleDateString("en-US",option);

return day;
}
