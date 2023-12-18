const getMarketPrices = () => new Promise((resolve, reject) => {
  fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2C%20ethereum%2Cripple%2Cdogecoin%2Csolana%2Clitecoin%2Cbinancecoin%2Ctether%2Ccardano%2Cmatic-network%2Ckaspa%2Cchainlink%2Cavalanche-2%2Cshiba-inu%2Cvechain%2Calgorand%2Ctheta-token&vs_currencies=usd&include_24hr_change=true&precision=3.json', {
    method: 'GET',
    headers: {
      'x-cg-demo-api-key': 'CG-ShJLsU3zzJ8KdJE3yvh3RvDA',
      'cache-control': 'max-age=30,public,must-revalidate,s-maxage=60',
      'Content-Type': 'application/json; charset=utf-8',
    },
  }).then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

export default getMarketPrices;
