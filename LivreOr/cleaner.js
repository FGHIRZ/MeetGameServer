let connection = require('./config/db')

let delayInMilliseconds = 10000; //1 second

function clean_dynamic_tables () {


  console.log("cleaning...")
  connection.query('DELETE FROM DYNAMIC_USER_TABLE WHERE TimeStampRefresh < (NOW() - INTERVAL 30 SECOND)', (err, result) => {
      if (err) throw err
  })

  setTimeout(clean_dynamic_tables, delayInMilliseconds);
}

console.log("starting clean")
setTimeout(clean_dynamic_tables, delayInMilliseconds);
