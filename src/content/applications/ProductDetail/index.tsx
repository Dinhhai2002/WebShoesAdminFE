import { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Grid, 
  Box, 
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  Divider,
  Button,
  Stack
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import RecentProductDetailsTable from './RecentProductDetailsTable';
import productDetailApi from 'src/services/API/ProductDetailApi';
import { ProductDetail } from 'src/services/API/ProductDetailApi';
import { toast } from 'react-toastify';
import AddIcon from '@mui/icons-material/Add';
import ViewListIcon from '@mui/icons-material/ViewList';
import GridViewIcon from '@mui/icons-material/GridView';
import RefreshIcon from '@mui/icons-material/Refresh';
import DialogCreateProductDetail from './DialogCreateProductDetail';
import DialogCreateMultipleProductDetail from './DialogCreateMultipleProductDetail';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-detail-tabpanel-${index}`}
      aria-labelledby={`product-detail-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ProductDetailManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [listProductDetail, setListProductDetail] = useState<ProductDetail[]>([]);
  const [totalRecord, setTotalRecord] = useState<number>(0);
  const [tabValue, setTabValue] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isLoading, setIsLoading] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openCreateMultipleDialog, setOpenCreateMultipleDialog] = useState(false);

  const getStatusFromTab = (tabIndex: number): { status: number, isOutOfStock?: boolean } => {
    switch (tabIndex) {
      case 1: // Đang kinh doanh
        return { status: 1 };
      case 2: // Ngừng kinh doanh
        return { status: 0 };
      case 3: // Hết hàng
        return { status: -1, isOutOfStock: true };
      default: // Tất cả
        return { status: -1 };
    }
  };

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
    setIsLoading(true);
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
      toast.error('Không thể tải danh sách sản phẩm chi tiết!');
    } finally {
      setIsLoading(false);
    }
  };

  const pageHeaderRef = useRef<any>(null);

  const handleRefresh = () => {
    const { status } = getStatusFromTab(tabValue);
    fetchProductDetails('', 1, 10, status);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    const { status, isOutOfStock } = getStatusFromTab(newValue);
    fetchProductDetails('', 1, 10, status);
  };

  useEffect(() => {
    const { status } = getStatusFromTab(0);
    fetchProductDetails('', 1, 10, status);
  }, []);

  return (
    <>
      <Helmet>
        <title>Quản lý chi tiết sản phẩm</title>
      </Helmet>
      <Box
        sx={{
          bgcolor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <Grid container spacing={3}>
            {/* Header Section */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h3" component="h3" gutterBottom>
                  Quản lý chi tiết sản phẩm
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setOpenCreateDialog(true);
                      }}
                    >
                      Thêm mới
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setOpenCreateMultipleDialog(true);
                      }}
                    >
                      Thêm danh sách
                    </Button>
                  </Stack>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={handleRefresh}
                  >
                    Làm mới
                  </Button>
                  <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                    <Button
                      variant={viewMode === 'list' ? 'contained' : 'outlined'}
                      onClick={() => setViewMode('list')}
                    >
                      <ViewListIcon />
                    </Button>
                    <Button
                      variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                      onClick={() => setViewMode('grid')}
                    >
                      <GridViewIcon />
                    </Button>
                  </Box>
                </Stack>
              </Box>
            </Grid>

            {/* Tabs Section */}
            <Grid item xs={12}>
              <Paper sx={{ width: '100%', mb: 2 }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant={isMobile ? "scrollable" : "fullWidth"}
                  scrollButtons={isMobile ? "auto" : false}
                  sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                  <Tab label="Tất cả sản phẩm" />
                  <Tab label="Đang kinh doanh" />
                  <Tab label="Ngừng kinh doanh" />
                  <Tab label="Hết hàng" />
                </Tabs>
              </Paper>
            </Grid>

            {/* Content Section */}
            <Grid item xs={12}>
              <TabPanel value={tabValue} index={0}>
                <RecentProductDetailsTable
                  listProductDetail={listProductDetail}
                  totalRecord={totalRecord}
                  onClickPagination={fetchProductDetails}
                  isLoading={isLoading}
                  viewMode={viewMode}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <RecentProductDetailsTable
                  listProductDetail={listProductDetail.filter(item => item.status === 1)}
                  totalRecord={totalRecord}
                  onClickPagination={fetchProductDetails}
                  isLoading={isLoading}
                  viewMode={viewMode}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <RecentProductDetailsTable
                  listProductDetail={listProductDetail.filter(item => item.status === 0)}
                  totalRecord={totalRecord}
                  onClickPagination={fetchProductDetails}
                  isLoading={isLoading}
                  viewMode={viewMode}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={3}>
                <RecentProductDetailsTable
                  listProductDetail={listProductDetail.filter(item => item.stock === 0)}
                  totalRecord={totalRecord}
                  onClickPagination={fetchProductDetails}
                  isLoading={isLoading}
                  viewMode={viewMode}
                />
              </TabPanel>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <DialogCreateProductDetail
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSuccess={() => {
          setOpenCreateDialog(false);
          const { status } = getStatusFromTab(tabValue);
          fetchProductDetails('', 1, 10, status);
        }}
      />

      <DialogCreateMultipleProductDetail
        open={openCreateMultipleDialog}
        onClose={() => setOpenCreateMultipleDialog(false)}
        onSuccess={() => {
          setOpenCreateMultipleDialog(false);
          const { status } = getStatusFromTab(tabValue);
          fetchProductDetails('', 1, 10, status);
        }}
      />
    </>
  );
}

export default ProductDetailManagement;
