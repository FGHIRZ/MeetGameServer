let connection = require('../config/db')

var delayInMilliseconds = 10000; //1 second

function clean_dynamic_tables () {

  let timestamp = new Date() - 10000

  console.log("cleaning...")
  connection.query('DELETE FROM DYNAMIC_USER_TABLE WHERE TimeStampRefresh < ?', [timestamp], (err, result) => {
      if (err) throw err
  })

  setTimeout(clean_dynamic_tables, delayInMilliseconds);
}

console.log("starting clean")
setTimeout(clean_dynamic_tables, delayInMilliseconds);
