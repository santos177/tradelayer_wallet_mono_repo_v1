const cron = require('node-cron');
const { findNewBlocks } = require('./find-new-blocks');


const findNewBlockTask = cron.schedule('30 * * * * *', () => {
    findNewBlocks();
})

module.exports = {
    findNewBlockTask
};