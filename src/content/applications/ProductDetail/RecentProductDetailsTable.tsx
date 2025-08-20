import { FC, useEffect, useState } from 'react';
import {
  Box,
  Card,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Divider,
  Stack,
  Paper,
  InputAdornment,
  Typography,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { LoadingButton } from '@mui/lab';
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
  isLoading: boolean;
  viewMode: 'list' | 'grid';
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
  { id: 3, label: "Thuộc tính" },
  // { id: 3, label: "Sản phẩm" },
  // { id: 4, label: "Màu sắc" },
  // { id: 5, label: "Size" },
  // { id: 6, label: "Chất liệu" },
  // { id: 7, label: "Thương hiệu" },
  // { id: 8, label: "Danh mục" },
  { id: 9, label: "Giá" },
  { id: 10, label: "Số lượng" },
  { id: 11, label: "Trạng thái" },
];

const RecentProductDetailsTable: FC<RecentProductDetailsTableProps> = ({
  listProductDetail,
  totalRecord,
  onClickPagination,
  isLoading,
  viewMode
}) => {
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
      <Box p={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                p: 0,
                mb: 3,
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              {/* Filter Header */}
              <Box
                sx={{
                  p: 2,
                  background: theme.palette.primary.main,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <FilterListIcon />
                <Typography variant="h5">Bộ lọc tìm kiếm</Typography>
              </Box>

              {/* Search Bar */}
              <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
                <TextField
                  fullWidth
                  placeholder="Tìm kiếm theo tên sản phẩm, mã sản phẩm..."
                  variant="outlined"
                  value={keySearch}
                  onChange={(e) => setKeySearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: keySearch && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setKeySearch('')}
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>

              {/* Filter Options */}
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4} lg={2}>
                    <DropDownComponent
                      arr={productOptions}
                      label="Sản phẩm"
                      value={productId}
                      handleStatusChange={handleProductChange}
                      type={0}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={2}>
                    <DropDownComponent
                      arr={categoryOptions}
                      label="Danh mục"
                      value={categoryId}
                      handleStatusChange={handleCategoryChange}
                      type={0}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={2}>
                    <DropDownComponent
                      arr={colorOptions}
                      label="Màu sắc"
                      value={colorId}
                      handleStatusChange={handleColorChange}
                      type={0}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={2}>
                    <DropDownComponent
                      arr={materialOptions}
                      label="Chất liệu"
                      value={materialId}
                      handleStatusChange={handleMaterialChange}
                      type={0}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={2}>
                    <DropDownComponent
                      arr={brandOptions}
                      label="Thương hiệu"
                      value={brandId}
                      handleStatusChange={handleBrandChange}
                      type={0}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={2}>
                    <DropDownComponent
                      arr={sizeOptions}
                      label="Kích cỡ"
                      value={sizeId}
                      handleStatusChange={handleSizeChange}
                      type={0}
                    />
                  </Grid>
                </Grid>

                {/* Active Filters */}
                {(productId !== -1 || categoryId !== -1 || colorId !== -1 || 
                  materialId !== -1 || brandId !== -1 || sizeId !== -1 || keySearch) && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Bộ lọc đang áp dụng:
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                      {keySearch && (
                        <Chip
                          label={`Tìm kiếm: ${keySearch}`}
                          onDelete={() => setKeySearch('')}
                          size="small"
                        />
                      )}
                      {productId !== -1 && (
                        <Chip
                          label={`Sản phẩm: ${productOptions.find(p => p.id === productId)?.name}`}
                          onDelete={() => setProductId(-1)}
                          size="small"
                        />
                      )}
                      {categoryId !== -1 && (
                        <Chip
                          label={`Danh mục: ${categoryOptions.find(c => c.id === categoryId)?.name}`}
                          onDelete={() => setCategoryId(-1)}
                          size="small"
                        />
                      )}
                      {colorId !== -1 && (
                        <Chip
                          label={`Màu sắc: ${colorOptions.find(c => c.id === colorId)?.name}`}
                          onDelete={() => setColorId(-1)}
                          size="small"
                        />
                      )}
                      {materialId !== -1 && (
                        <Chip
                          label={`Chất liệu: ${materialOptions.find(m => m.id === materialId)?.name}`}
                          onDelete={() => setMaterialId(-1)}
                          size="small"
                        />
                      )}
                      {brandId !== -1 && (
                        <Chip
                          label={`Thương hiệu: ${brandOptions.find(b => b.id === brandId)?.name}`}
                          onDelete={() => setBrandId(-1)}
                          size="small"
                        />
                      )}
                      {sizeId !== -1 && (
                        <Chip
                          label={`Kích cỡ: ${sizeOptions.find(s => s.id === sizeId)?.name}`}
                          onDelete={() => setSizeId(-1)}
                          size="small"
                        />
                      )}
                    </Stack>
                  </Box>
                )}

                {/* Action Buttons */}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    color="inherit"
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
                    startIcon={<ClearIcon />}
                  >
                    Xóa bộ lọc
                  </Button>
                  <LoadingButton
                    variant="contained"
                    onClick={() => {
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
                      );
                    }}
                    loading={false}
                    startIcon={<SearchIcon />}
                  >
                    Tìm kiếm
                  </LoadingButton>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h5">
                Danh sách chi tiết sản phẩm
                {totalRecord > 0 && (
                  <Chip
                    label={`${totalRecord} chi tiết`}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                )}
              </Typography>
              <Button
                variant="contained"
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
                Thêm mới
              </Button>
            </Box>
            <TableListProductDetail
              listProductDetail={listProductDetail}
              labelTable={labelTable}
              handleClickOpenStatus={handleClickOpenStatus}
              handleChangeStatus={handleChangeStatus}
              onRefresh={handleRefresh}
            />
            <Box p={2}>
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
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* ... existing dialogs ... */}
    </Card>
  );
};

export default RecentProductDetailsTable;
