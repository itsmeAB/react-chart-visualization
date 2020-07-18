import React, { useState, useEffect } from 'react';
import moment from 'moment';
import './InfoBox.scss';

const InfoBox = (props) => {
  const [currentPrice, setCurrentPrice] = useState(null);
  const [monthChangeD, setMonthChangeD] = useState(null);
  const [monthChangeP, setMonthChangeP] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);

  const getData = () => {
    const { data } = props;
    const url = 'https://api.coindesk.com/v1/bpi/currentprice.json';

    fetch(url)
      .then((r) => r.json())
      .then((bitcoinData) => {
        const price = bitcoinData.bpi.USD.rate_float;
        const change = price - data[0].y;
        const changeP = ((price - data[0].y) / data[0].y) * 100;

        setCurrentPrice(bitcoinData.bpi.USD.rate_float);
        setMonthChangeD(
          change.toLocaleString('us-EN', {
            style: 'currency',
            currency: 'USD',
          })
        );
        setMonthChangeP(changeP.toFixed(2) + '%');
        setUpdatedAt(bitcoinData.time.updated);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getData();
    const refresh = setInterval(() => getData(), 90000);

    return () => {
      clearInterval(refresh);
    };
  });

  return (
    <div id='data-container'>
      {currentPrice ? (
        <div id='left' className='box'>
          <div className='heading'>
            {currentPrice.toLocaleString('us-EN', {
              style: 'currency',
              currency: 'USD',
            })}
          </div>
          <div className='subtext'>
            {'Updated ' + moment(updatedAt).fromNow()}
          </div>
        </div>
      ) : null}
      {currentPrice ? (
        <div id='middle' className='box'>
          <div className='heading'>{monthChangeD}</div>
          <div className='subtext'>Change Since Last Month (USD)</div>
        </div>
      ) : null}
      <div id='right' className='box'>
        <div className='heading'>{monthChangeP}</div>
        <div className='subtext'>Change Since Last Month (%)</div>
      </div>
    </div>
  );
};

export default InfoBox;
