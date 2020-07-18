import React, { useState, useEffect } from 'react';
import './InfoBox.scss';

const InfoBox = (props) => {
  const [currentPrice, setCurrentPrice] = useState(null);

  useEffect(() => {
    const subscribe = {
      type: 'subscribe',
      channels: [
        {
          name: 'ticker',
          product_ids: ['BTC-USD'],
        },
      ],
    };
    const ws = new WebSocket('wss://ws-feed.pro.coinbase.com');
    ws.onopen = () => {
      ws.send(JSON.stringify(subscribe));
    };
    ws.onmessage = (e) => {
      const value = JSON.parse(e.data);
      setCurrentPrice(value.price);
    };
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div id='data-container'>
      {currentPrice ? (
        <div id='left' className='box'>
          <div className='heading'>
            {Number(currentPrice).toLocaleString('us-EN', {
              style: 'currency',
              currency: 'USD',
            })}
          </div>
          <div className='subtext'>Current rate</div>
        </div>
      ) : null}
    </div>
  );
};

export default InfoBox;
