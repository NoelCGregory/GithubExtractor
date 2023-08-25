const postgres = require('postgres');

const sql = postgres('postgres://postgres:Chungath@localhost:5432/postgres' )// will use psql environment variables

  
module.exports= {
  sql
}