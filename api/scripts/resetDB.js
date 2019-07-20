const {
    db
  } = require('../models/index.js');
  
  const main = async () => {
    await db.drop();
    await db.sync({
      force: true
    });
    process.exit()
  }
  
  main();
  