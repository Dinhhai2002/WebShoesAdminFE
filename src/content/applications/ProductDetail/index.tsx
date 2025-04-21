import { useState, useEffect, useRef } from 'react';
import { Container, Grid } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import RecentProductDetailsTable from './RecentProductDetailsTable';
import productDetailApi from 'src/services/API/ProductDetailApi';
import { ProductDetail } from 'src/services/API/ProductDetailApi';
import { toast } from 'react-toastify';

function ProductDetailManagement() {
  const [listProductDetail, setListProductDetail] = useState<ProductDetail[]>([]);
  const [totalRecord, setTotalRecord] = useState<number>(0);

  const fetchProductDetails = async (
    keySearch: string,
    page: number,
    limit: number,
    status: number,
    product_id?: number,
    category_id?: number,
    color_id?: number,
    material_id?: number,
    brand_id?: number,
    size_id?: number
  ) => {
    try {
      const response = await productDetailApi.findAll({
        key_search: keySearch,
        status,
        page,
        limit,
        product_id: product_id,
        category_id: category_id,
        color_id: color_id,
        material_id: material_id,
        brand_id: brand_id,
        size_id: size_id
      });
      setListProductDetail(response.data.list);
      setTotalRecord(response.data.total_record);
    } catch (error: any) {
      // Hiển thị toast lỗi rõ ràng khi gọi API thất bại
     toast.error('Không thể tải danh sách sản phẩm chi tiết!');
    }
  };

  const pageHeaderRef = useRef<any>(null);

  const handleRefresh = () => {
    // Lấy lại danh sách sản phẩm chi tiết với filter hiện tại
    fetchProductDetails('', 1, 10, -1);
  };

  useEffect(() => {
    fetchProductDetails('', 1, 10, -1);
  }, []);

  return (
    <>
      <Helmet>
        <title>Quản lý chi tiết sản phẩm</title>
      </Helmet>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <PageHeader onRefresh={handleRefresh} />
          </Grid>
          <Grid item xs={12}>
            <RecentProductDetailsTable
              listProductDetail={listProductDetail}
              totalRecord={totalRecord}
              onClickPagination={fetchProductDetails}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default ProductDetailManagement;
