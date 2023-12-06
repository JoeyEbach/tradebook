import React, { useEffect, useRef, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useRouter } from 'next/router';
// eslint-disable-next-line import/no-extraneous-dependencies
import { DownloadTableExcel } from 'react-export-table-to-excel';
import { getTradesByStrategyId } from '../../../api/trades';
import { viewStrategy } from '../../../api/strategies';

export default function TradesTable() {
  const [trades, setTrades] = useState([]);
  const [wins, setWins] = useState([]);
  const [losses, setLosses] = useState([]);
  const [strategy, setStrategy] = useState({});
  const router = useRouter();
  const { firebaseKey } = router.query;
  const tableRef = useRef(null);

  useEffect(() => {
    getTradesByStrategyId(firebaseKey)?.then((tradesArray) => {
      setTrades(tradesArray);
      setWins(tradesArray?.filter((trade) => trade.status === 'Win'));
      setLosses(tradesArray?.filter((trade) => trade.status === 'Loss'));
      viewStrategy(firebaseKey)?.then(setStrategy);
    });
  }, []);

  console.warn(strategy);

  return (
    <div className="tableDiv">
      <h4>{strategy.name}</h4>
      <DownloadTableExcel
        filename={strategy.name}
        sheet="Trades"
        currentTableRef={tableRef.current}
      >

        <Button className="export rounded-0">Export Excel</Button>

      </DownloadTableExcel>

      <Table ref={tableRef} striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Asset</th>
            <th>Entry</th>
            <th>Stop</th>
            <th>Target</th>
            <th>Status</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {trades?.map((trade, index) => (
            (
              <tr>
                <td>{index + 1}</td>
                <td>{trade.date}</td>
                <td>{trade.asset}</td>
                <td>{trade.entry}</td>
                <td>{trade.stop}</td>
                <td>{trade.target}</td>
                <td>{trade.status}</td>
                <td>{trade.notes}</td>
              </tr>
            )
          ))}
        </tbody>
        <thead>
          <tr>
            <th>Total Wins</th>
            <th>Total Losses</th>
          </tr>
        </thead>
        <tbody>
          <td>{wins.length}</td>
          <td>{losses.length}</td>
        </tbody>
      </Table>
    </div>
  );
}
