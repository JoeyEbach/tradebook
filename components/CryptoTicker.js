import React, { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import Marquee from 'react-fast-marquee';
import { Button, Card } from 'react-bootstrap';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  faCaretUp, faCaretDown, faEyeSlash, faEye,
} from '@fortawesome/free-solid-svg-icons';
import getMarketPrices from '../api/marketData';

export default function CryptoTicker() {
  const [market, setMarket] = useState([]);
  const [show, setShow] = useState(true);

  const getMarket = () => {
    getMarketPrices()?.then((assets) => {
      const list = Object.entries(assets);
      setMarket(list);
    });
  };

  const marqueeToggle = () => {
    setShow((prevState) => !prevState);
  };

  useEffect(() => {
    getMarket();
  }, [market, show]);

  return (
    <div>
      {show && (
      <Marquee loop={0} autoFill="true" pauseOnHover="true" className="marquee" style={{ color: 'white' }}>
        {market?.map((item) => (
          <Card className="tickerCard rounded-0">
            <span>
              {item[1].usd_24h_change > 0 ? <FontAwesomeIcon className="caret" icon={faCaretUp} style={{ color: '#8fc651' }} /> : <FontAwesomeIcon className="caret" icon={faCaretDown} style={{ color: '#ce4727' }} />}
              <p className="tickAsset" style={{ color: 'white' }}>{item[0]}</p>
              {item[1].usd_24h_change > 0 ? <p style={{ color: '#8fc651' }}>${item[1].usd.toFixed(3)}</p> : <p style={{ color: '#ce4727' }}>${item[1].usd.toFixed(3)}</p>}
            </span>
          </Card>
        ))}
      </Marquee>
      )}
      <Button onClick={marqueeToggle} className="marBtn rounded-0" variant="dark">{show ? (<FontAwesomeIcon className="marIcon" icon={faEyeSlash} style={{ color: '#a6a6a6' }} />) : (<FontAwesomeIcon className="marIcon" icon={faEye} style={{ color: '#a6a6a6' }} />)}</Button>
    </div>
  );
}
