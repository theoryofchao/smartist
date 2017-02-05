var csv = require('csv-parser')
var fs = require('fs')
const settings = require("../settings"); // settings.json
const knex = require('knex')({
  client: 'pg',
  connection: {
    host : settings.hostname,
    user : settings.user,
    password : settings.password,
    database : settings.database,
    port: settings.port,
    ssl: settings.ssl
  }
});

 fs.createReadStream('./seeder/movies_image.csv')
   .pipe(csv())
   .on('data', function (data) {
    console.log(data.title);
    knex('searches').insert({search_term: data.title, category : "movie" , url: data.url})
.then(function(response){
  //console.log(data.url);
})
.catch(function(error) { })
});

 fs.createReadStream('./seeder/books_image.csv')
   .pipe(csv())
   .on('data', function (data) {
    console.log(data.title);
    knex('searches').insert({search_term: data.title, category : "book" , url: data.url})
.then(function(response){
 // console.log(response);
})
.catch(function(error) { })
});