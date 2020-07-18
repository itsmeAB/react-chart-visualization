import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Chart from '../../components/Chart';
import InfoBox from '../../components/InfoBox';
import ToolTip from '../../components/ToolTip';
import './home.scss';

const Home = (props) => {
  const [data, setData] = useState(null);
  const [hoverLoc, setHoverLoc] = useState(null);
  const [activePoint, setActivePoint] = useState(null);

  const handleChartHover = (hoverLoc, activePoint) => {
    setHoverLoc(hoverLoc);
    setActivePoint(activePoint);
  };

  const getData = () => {
    const today = new Date();
    const endDate = moment(today).format('YYYY-MM-DD');
    today.setMonth(today.getMonth() - 6);
    const startDate = moment(today).format('YYYY-MM-DD');

    const url = `https://api.coindesk.com/v1/bpi/historical/close.json?start=${startDate}&end=${endDate}`;

    fetch(url)
      .then((r) => r.json())
      .then((bitcoinData) => {
        console.log('bitCoinData', bitcoinData);
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
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
      getData();
  }, []);

  return (
    <div className='container'>
      <div className='row'>
        <h1>6 Month Bitcoin Price Chart</h1>
      </div>
      <div className='row'>
        {data ? <InfoBox data={data} /> : null}
      </div>
      <div className='row'>
        <div className='popup'>
          {hoverLoc ? (
            <ToolTip
              hoverLoc={hoverLoc}
              activePoint={activePoint}
            />
          ) : null}
        </div>
      </div>
      <div className='row'>
        <div className='chart'>
          {data ? (
            <Chart
              data={data}
              onChartHover={(a, b) => handleChartHover(a, b)}
            />
          ) : null}
        </div>
      </div>
      <div className='row'>
        <div id='coindesk'>
          {' '}
          Powered by <a href='http://www.coindesk.com/price/'>CoinDesk</a>
        </div>
      </div>
    </div>
  );
};

export default Home;
