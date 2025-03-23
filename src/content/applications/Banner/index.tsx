import { useState } from 'react';
import RecentBanners from './RecentBanners';
import PageHeader from './PageHeader';

function Banner() {
  const [changeData, setChangeData] = useState<boolean>(false);

  const handleChangeData = () => {
    setChangeData(!changeData);
  };

  return (
    <>
      <PageHeader onSuccess={handleChangeData} />
      <RecentBanners changeData={changeData} />
    </>
  );
}

export default Banner; 