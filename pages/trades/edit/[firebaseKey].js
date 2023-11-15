import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { getTradeDetails } from '../../../api/mergedData';
import TradeForm from '../../../components/forms/TradeForm';

export default function EditTrade() {
  const [editItem, setEditItem] = useState({});
  const router = useRouter();
  const { firebaseKey } = router.query;

  useEffect(() => {
    getTradeDetails(firebaseKey).then(setEditItem);
  }, [firebaseKey]);

  return (<TradeForm tradeObj={editItem} />);
}
