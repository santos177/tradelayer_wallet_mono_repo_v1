
# env
You need to add/change the .evn file

env example: 

```
# PRODUCTION API URL/PORT AND SOCKET PORT
PROD_BASE_URL=http://localhost  
PROD_BASE_PORT=3002
PROD_SOCKET_PORT=75

# DEVELOPMENT API URL/PORT AND SOCKET PORT
DEV_BASE_URL=http://localhost
DEV_BASE_PORT=3002
DEV_SOCKET_PORT=75

# HOST AND PORT for running tha app (npm run dev)
HOST=localhost
PORT=8080
```

Also these are the default values (If .env file or current value is not found)

# vue-wallet

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at 
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
