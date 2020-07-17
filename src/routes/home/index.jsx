import React, { useState, useEffect } from 'react';
import moment from 'moment';

const Home = (props) => {
  const [fetchingData, setFetchingData] = useState(false);
  const [data, setData] = useState(null);
  const [hoverLoc, setHoverLoc] = useState(null);
  const [activePoint, setActivePoint] = useState(null);

  const handleChartHover = (hoverLoc, activePoint) => {
    setHoverLoc(hoverLoc);
    setActivePoint(activePoint);
  };

  const getData = () => {
    const url = 'https://api.coindesk.com/v1/bpi/historical/close.json';

    fetch(url)
      .then((r) => r.json())
      .then((bitcoinData) => {
          console.log('bitCoinData', bitcoinData)
        const sortedData = [];
        let count = 0;
        for (let date in bitcoinData.bpi) {
          sortedData.push({
            d: moment(date).format('MMM DD'),
            p: bitcoinData.bpi[date].toLocaleString('us-EN', {
              style: 'currency',
              currency: 'USD',
            }),
            x: count, //previous days
            y: bitcoinData.bpi[date], // numerical price
          });
          count++;
        }
        setData(sortedData);
        setFetchingData(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    //   getData();
  }, []);

  return <div>Home</div>;
};

export default Home;
