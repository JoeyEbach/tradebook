import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { viewStrategy } from '../../../api/strategies';
import StrategyForm from '../../../components/forms/StrategyForm';

export default function EditStrategy() {
  const [editItem, setEditItem] = useState({});
  const router = useRouter();
  const { firebaseKey } = router.query;

  useEffect(() => {
    viewStrategy(firebaseKey).then(setEditItem);
  }, [firebaseKey]);

  return (<StrategyForm strategyObj={editItem} />);
}
