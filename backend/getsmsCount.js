var request = require('request');
var options = {
  'method': 'POST',
  'url': 'https://bulksms.bsnl.in:5010/api/Get_SMS_Count',
  'headers': {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjEwMDQ5IDIiLCJuYmYiOjE3MDkxOTU2MzksImV4cCI6MTc0MDczMTYzOSwiaWF0IjoxNzA5MTk1NjM5LCJpc3MiOiJodHRwczovL2J1bGtzbXMuYnNubC5pbjo1MDEwIiwiYXVkIjoiMTAwNDkgMiJ9.v0lHU0Uax4xc0aMveZEUn4kIwOn1KksMdWagBEPjJ-o'
  }
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});