import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  CardHeader,
  Divider,
  TablePagination,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import TableListProductDetail from "./TableListProductDetail";
import productDetailApi from "src/services/API/ProductDetailApi";
import { ProductDetail } from "src/services/API/ProductDetailApi";
import Search from "src/components/Search/Search";
import DropDownComponent from "src/components/DropDownComponent/DropDownComponent";
import { statusOptions } from "src/utils/LabelTable";
import { PAGE_DEFAULT } from "src/utils/Constant";
import { Button } from '@mui/material';
import productApi from "src/services/API/ProductApi";
import categoryApi from "src/services/API/CategoryApi";
import colorApi from "src/services/API/ColorApi";
import materialApi from "src/services/API/MaterialApi";
import brandApi from "src/services/API/BrandApi";
import sizeApi from "src/services/API/SizeApi";

interface RecentProductDetailsTableProps {
  listProductDetail: ProductDetail[];
  totalRecord: number;
  onClickPagination: (
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
  ) => void;
}

const labelTable = [
  { id: 1, label: "ID" },
  { id: 2, label: "Tên chi tiết sản phẩm" },
  { id: 3, label: "Sản phẩm" },
  { id: 4, label: "Màu sắc" },
  { id: 5, label: "Size" },
  { id: 6, label: "Chất liệu" },
  // { id: 7, label: "Thương hiệu" },
  // { id: 8, label: "Danh mục" },
  { id: 9, label: "Giá" },
  { id: 10, label: "Số lượng" },
  { id: 11, label: "Trạng thái" },
];

function RecentProductDetailsTable({
  listProductDetail,
  totalRecord,
  onClickPagination,
}: RecentProductDetailsTableProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [status, setStatus] = useState<number>(-1);
  const [keySearch, setKeySearch] = useState<string>("");
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [selectedStatus, setSelectedStatus] = useState<number>(1);

  // Add state variables for the new filters
  const [productId, setProductId] = useState<number>(-1);
  const [categoryId, setCategoryId] = useState<number>(-1);
  const [colorId, setColorId] = useState<number>(-1);
  const [materialId, setMaterialId] = useState<number>(-1);
  const [brandId, setBrandId] = useState<number>(-1);
  const [sizeId, setSizeId] = useState<number>(-1);

  // State variables for dropdown options
  const [productOptions, setProductOptions] = useState<any[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
  const [colorOptions, setColorOptions] = useState<any[]>([]);
  const [materialOptions, setMaterialOptions] = useState<any[]>([]);
  const [brandOptions, setBrandOptions] = useState<any[]>([]);
  const [sizeOptions, setSizeOptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, brandRes, catRes, colorRes, sizeRes, matRes] = await Promise.all([
          productApi.findAll({ key_search: "", status: 1, page: 1, limit: 100 }),
          brandApi.findAll({ key_search: "", status: 1, page: 1, limit: 100 }),
          categoryApi.findAll({ key_search: "", status: 1, page: 1, limit: 100 }),
          colorApi.findAll({ key_search: "", status: 1, page: 1, limit: 100 }),
          sizeApi.findAll({ key_search: "", status: 1, page: 1, limit: 100 }),
          materialApi.findAll({ key_search: "", status: 1, page: 1, limit: 100 })
        ]);

        // Add "All" option with value -1 to all dropdowns
        const addAllOption = (options: any[], label: string) =>
          [{ id: -1, name: 'Tất cả', value: -1 }].concat(options);

        setProductOptions(addAllOption(productRes.data.list, 'Tất cả sản phẩm'));
        setBrandOptions(addAllOption(brandRes.data.list, 'Tất cả thương hiệu'));
        setCategoryOptions(addAllOption(catRes.data.list, 'Tất cả danh mục'));
        setColorOptions(addAllOption(colorRes.data.list, 'Tất cả màu sắc'));
        setSizeOptions(addAllOption(sizeRes.data.list, 'Tất cả kích cỡ'));
        setMaterialOptions(addAllOption(matRes.data.list, 'Tất cả chất liệu'));
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Không thể tải dữ liệu');
      }
    };

    fetchData();
  }, [keySearch]);

  const handleStatusChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const newStatus = Number(e.target.value);
    setStatus(newStatus);
    setPage(0);
    onClickPagination(
      keySearch,
      1,
      limit,
      newStatus,
      productId,
      categoryId,
      colorId,
      materialId,
      brandId,
      sizeId
    );
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newLimit = parseInt(event.target.value, 10);
    setLimit(newLimit);
    setPage(0);
  };

  useEffect(() => {
    onClickPagination(
      keySearch,
      page + 1,
      limit,
      status,
      productId,
      categoryId,
      colorId,
      materialId,
      brandId,
      sizeId
    );
  }, [page, productId, categoryId, colorId, materialId, brandId, sizeId, keySearch, limit, status]);

  useEffect(() => {
    onClickPagination(
      keySearch,
      PAGE_DEFAULT,
      limit,
      status,
      productId,
      categoryId,
      colorId,
      materialId,
      brandId,
      sizeId
    );
  }, [limit, status, productId, categoryId, colorId, materialId, brandId, sizeId, keySearch]);

  const handleChangeSearch = (value: string) => {
    setKeySearch(value);
    setPage(0);
    // Keep all filter values during search
    onClickPagination(
      value,
      1,
      limit,
      status,
      productId,
      categoryId,
      colorId,
      materialId,
      brandId,
      sizeId
    );
  };

  const handleClickOpenStatus = (id: number, status: number) => {
    setSelectedId(id);
    setSelectedStatus(status);
    setOpenStatusDialog(true);
  };

  const handleCloseStatus = () => {
    setOpenStatusDialog(false);
    setSelectedId(0);
  };

  const handleChangeStatus = (id: number) => {
    productDetailApi
      .changeStatus(id)
      .then(() => {
        onClickPagination(
          keySearch,
          page + 1,
          limit,
          status,
          productId,
          categoryId,
          colorId,
          materialId,
          brandId,
          sizeId
        );
        toast.success("Thay đổi trạng thái thành công!");
      })
      .catch((error) => {
        toast.error(error.response?.data?.message);
      });
    handleCloseStatus();
  };

  const handleRefresh = () => {
    onClickPagination(
      keySearch,
      page + 1,
      limit,
      status,
      productId,
      categoryId,
      colorId,
      materialId,
      brandId,
      sizeId
    );
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newProductId = Number(e.target.value);
    setProductId(newProductId);
    setPage(0);
    onClickPagination(
      keySearch,
      1,
      limit,
      status,
      newProductId,
      categoryId,
      colorId,
      materialId,
      brandId,
      sizeId
    );
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newCategoryId = Number(e.target.value);
    setCategoryId(newCategoryId);
    setPage(0);
    onClickPagination(
      keySearch,
      1,
      limit,
      status,
      productId,
      newCategoryId,
      colorId,
      materialId,
      brandId,
      sizeId
    );
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newColorId = Number(e.target.value);
    setColorId(newColorId);
    setPage(0);
    onClickPagination(
      keySearch,
      1,
      limit,
      status,
      productId,
      categoryId,
      newColorId,
      materialId,
      brandId,
      sizeId
    );
  };

  const handleMaterialChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newMaterialId = Number(e.target.value);
    setMaterialId(newMaterialId);
    setPage(0);
    onClickPagination(
      keySearch,
      1,
      limit,
      status,
      productId,
      categoryId,
      colorId,
      newMaterialId,
      brandId,
      sizeId
    );
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newBrandId = Number(e.target.value);
    setBrandId(newBrandId);
    setPage(0);
    onClickPagination(
      keySearch,
      1,
      limit,
      status,
      productId,
      categoryId,
      colorId,
      materialId,
      newBrandId,
      sizeId
    );
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newSizeId = Number(e.target.value);
    setSizeId(newSizeId);
    setPage(0);
    onClickPagination(
      keySearch,
      1,
      limit,
      status,
      productId,
      categoryId,
      colorId,
      materialId,
      brandId,
      newSizeId
    );
  };

  return (
    <Card>
      <ToastContainer />
      <CardHeader
        action={
          <Box width={900}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={12} sm={12} md={6} lg={6} sx={{ display: 'flex', alignItems: 'center' }}>
                <Search
                  valueSearch={keySearch}
                  setValueSearch={setKeySearch}
                  handleSubmitSearch={() =>
                    onClickPagination(
                      keySearch,
                      1,
                      limit,
                      status,
                      productId,
                      categoryId,
                      colorId,
                      materialId,
                      brandId,
                      sizeId
                    )
                  }
                  label="Tìm kiếm chi tiết sản phẩm"
                />
                <Button
                  variant="outlined"
                  sx={{ ml: 1 }}
                  onClick={() => {
                    setProductId(-1);
                    setCategoryId(-1);
                    setColorId(-1);
                    setMaterialId(-1);
                    setBrandId(-1);
                    setSizeId(-1);
                    setKeySearch("");
                    onClickPagination("", 1, limit, status, -1, -1, -1, -1, -1, -1);
                  }}
                >
                  Xóa bộ lọc
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <DropDownComponent
                  arr={statusOptions}
                  label="Trạng thái"
                  value={status}
                  handleStatusChange={handleStatusChange}
                  type={0}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <DropDownComponent
                  arr={productOptions}
                  label="Sản phẩm"
                  value={productId}
                  handleStatusChange={handleProductChange}
                  type={0}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <DropDownComponent
                  arr={categoryOptions}
                  label="Danh mục"
                  value={categoryId}
                  handleStatusChange={handleCategoryChange}
                  type={0}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <DropDownComponent
                  arr={colorOptions}
                  label="Màu sắc"
                  value={colorId}
                  handleStatusChange={handleColorChange}
                  type={0}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <DropDownComponent
                  arr={materialOptions}
                  label="Chất liệu"
                  value={materialId}
                  handleStatusChange={handleMaterialChange}
                  type={0}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <DropDownComponent
                  arr={brandOptions}
                  label="Thương hiệu"
                  value={brandId}
                  handleStatusChange={handleBrandChange}
                  type={0}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <DropDownComponent
                  arr={sizeOptions}
                  label="Kích cỡ"
                  value={sizeId}
                  handleStatusChange={handleSizeChange}
                  type={0}
                />
              </Grid>
            </Grid>
          </Box>
        }
        title="Danh sách chi tiết sản phẩm"
      />

      <Divider />

      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TableListProductDetail
                listProductDetail={listProductDetail}
                labelTable={labelTable}
                handleClickOpenStatus={handleClickOpenStatus}
                handleChangeStatus={handleChangeStatus}
                onRefresh={handleRefresh}
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <TablePagination
        component="div"
        count={totalRecord}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={limit}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Số hàng mỗi trang:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} trên ${count}`}
      />
    </Card>
  );
}

export default RecentProductDetailsTable;
