import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Pagination
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

interface ProductSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  productDetails: any[];
  onSelect: (selected: { product_detail_id: number; quantity: number }[]) => void;
  selectedProducts: { product_detail_id: number; quantity: number }[];
}

const ITEMS_PER_PAGE = 6;

function ProductSelectionDialog({ open, onClose, productDetails, onSelect, selectedProducts }: ProductSelectionDialogProps) {
  const [filter, setFilter] = useState('');
  const [selectedMap, setSelectedMap] = useState<Record<number, number>>({});
  const [page, setPage] = useState(1);

  const toggleSelection = (id: number, stock: number) => {
    if (stock < 1) return;
    
    setSelectedMap((prev) =>
      prev[id] ? { ...prev, [id]: 0 } : { ...prev, [id]: 1 }
    );
  };

  const setQuantity = (id: number, quantity: number, maxStock: number) => {
    if (quantity > maxStock) return;
    setSelectedMap((prev) => ({ ...prev, [id]: quantity }));
  };

  const handleConfirm = () => {
    const selected = Object.entries(selectedMap)
      .filter(([_, quantity]) => quantity > 0)
      .map(([id, quantity]) => ({ product_detail_id: Number(id), quantity }));

    if (selected.length === 0) {
      onClose();
      return;
    }
    onSelect(selected);
    setSelectedMap({});
    onClose();
  };

  const filteredProducts = useMemo(() => {
    return productDetails.filter((pd) =>
      `${pd.name} ${pd.color} ${pd.size} ${pd.material}`.toLowerCase().includes(filter.toLowerCase())
    );
  }, [productDetails, filter]);

  const pageCount = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const totalPrice = Object.entries(selectedMap).reduce((sum, [id, qty]) => {
    const pd = productDetails.find((p) => p.id === Number(id));
    return sum + (pd?.price || 0) * qty;
  }, 0);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  // Tính toán số lượng tồn kho còn lại sau khi trừ đi số lượng đã chọn trong dialog và trong list đơn hàng
  const getRemainingStock = (productId: number, totalStock: number) => {
    const selectedInDialog = selectedMap[productId] || 0;
    const selectedInOrder = selectedProducts.find(p => p.product_detail_id === productId)?.quantity || 0;
    return totalStock - selectedInDialog - selectedInOrder;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Chọn sản phẩm</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Tìm kiếm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Grid container spacing={2}>
          {paginatedProducts.map((pd) => {
            const remainingStock = getRemainingStock(pd.id, pd.stock);
            return (
              <Grid item xs={12} md={6} key={pd.id}>
                <Box 
                  display="flex" 
                  gap={2} 
                  alignItems="center" 
                  border="1px solid #ccc" 
                  p={2} 
                  borderRadius={1}
                  sx={{
                    opacity: remainingStock < 1 ? 0.6 : 1,
                    position: 'relative'
                  }}
                >
                  {remainingStock < 1 && (
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bgcolor="rgba(0,0,0,0.05)"
                      zIndex={1}
                    >
                      <Typography 
                        variant="h6" 
                        color="error" 
                        fontWeight="bold"
                        sx={{ 
                          transform: 'rotate(-15deg)',
                          border: '2px solid red',
                          borderRadius: 1,
                          p: 1,
                          backgroundColor: 'rgba(255,255,255,0.8)'
                        }}
                      >
                        Hết hàng
                      </Typography>
                    </Box>
                  )}
                  <Box
                    component="img"
                    src={pd.image_url}
                    alt={pd.name}
                    sx={{ width: 80, height: 80, objectFit: 'contain', borderRadius: 1, border: '1px solid #eee' }}
                  />
                  <Box flexGrow={1}>
                    <Typography fontWeight={600}>{pd.name}</Typography>
                    <Typography variant="body2">{pd.color} | {pd.size} | {pd.material}</Typography>
                    <Typography variant="body2" color="text.secondary">Barcode: {pd.barcode || 'N/A'}</Typography>
                    <Typography variant="body2">Giá: {pd.price?.toLocaleString('vi-VN')}₫</Typography>
                    <Box>
                      <Typography 
                        variant="body2" 
                        color={remainingStock < 1 ? 'error' : 'text.secondary'}
                        fontWeight={remainingStock < 1 ? 'bold' : 'normal'}
                        component="span"
                        mr={1}
                      >
                        Tồn kho: {remainingStock}
                      </Typography>
                      {selectedMap[pd.id] > 0 && (
                        <Typography 
                          variant="body2" 
                          color="primary"
                          component="span"
                        >
                          (Đã chọn: {selectedMap[pd.id]})
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedMap[pd.id] > 0}
                        onChange={() => toggleSelection(pd.id, remainingStock)}
                        disabled={remainingStock < 1 && !selectedMap[pd.id]}
                      />
                    }
                    label="Chọn"
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                    {selectedMap[pd.id] > 0 && (
                      <TextField
                        type="number"
                        size="small"
                        label="SL"
                        value={selectedMap[pd.id]}
                        onChange={(e) => setQuantity(pd.id, Number(e.target.value), pd.stock)}
                        sx={{ width: 80 }}
                        inputProps={{ min: 1, max: pd.stock }}
                      />
                    )}
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>

        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, val) => setPage(val)}
            color="primary"
          />
        </Box>

        <Box mt={2}>
          <Typography fontWeight={600} textAlign="right">
            Tổng tạm tính: {totalPrice.toLocaleString('vi-VN')}₫
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleConfirm}>Thêm</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProductSelectionDialog;