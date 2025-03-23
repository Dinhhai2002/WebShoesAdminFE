import { useState } from 'react';
import RecentProducts from './RecentProducts';
import PageHeader from './PageHeader';

function Product() {
  const [changeData, setChangeData] = useState(false);

  const handleChangeData = () => {
    setChangeData(!changeData);
  };

  return (
    <>
      <PageHeader onSuccess={handleChangeData} />
      <RecentProducts changeData={changeData} />
    </>
  );
}

export default Product; 