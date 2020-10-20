// const { redisClient } = require('../../redis_client');

const blockTxnModule = (result) => {

    var jsonResult = JSON.parse(result);
    
    return new Promise((resolve, reject) => {

        if(jsonResult && jsonResult !== 0) {
            resolve({
                isResult: true,
                data: jsonResult,
            })
        }
        reject({
            isResult: false,
        })
    })
}

module.exports = blockTxnModule;