import axios from "axios";

const network = process.env.NODE_ENV === "development" ? "ltctest" : "ltc";

const getUTXOs = (address, next) => {
  axios
    .get(`https://chain.so/api/v2/get_tx_unspent/${network}/${address}`)
    .then( ({data}) => {
      if (data.status === "success") {
        next(data.data.txs);
      }
    });
};

export const walletService = {
  getUTXOs
};
