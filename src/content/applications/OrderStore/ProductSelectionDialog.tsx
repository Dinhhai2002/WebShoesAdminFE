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
  }
  
  const ITEMS_PER_PAGE = 6;
  
  function ProductSelectionDialog({ open, onClose, productDetails, onSelect }: ProductSelectionDialogProps) {
    const [filter, setFilter] = useState('');
    const [selectedMap, setSelectedMap] = useState<Record<number, number>>({});
    const [page, setPage] = useState(1);
  
    const toggleSelection = (id: number) => {
      setSelectedMap((prev) =>
        prev[id] ? { ...prev, [id]: 0 } : { ...prev, [id]: 1 }
      );
    };
  
    const setQuantity = (id: number, quantity: number) => {
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
            {paginatedProducts.map((pd) => (
              <Grid item xs={12} md={6} key={pd.id}>
                <Box display="flex" gap={2} alignItems="center" border="1px solid #ccc" p={2} borderRadius={1}>
                  <Box
                    component="img"
                    src={pd.image_url}
                    alt={pd.name}
                    sx={{ width: 80, height: 80, objectFit: 'contain', borderRadius: 1, border: '1px solid #eee' }}
                  />
                  <Box flexGrow={1}>
                    <Typography fontWeight={600}>{pd.name}</Typography>
                    <Typography variant="body2">{pd.color} | {pd.size} | {pd.material}</Typography>
                    <Typography variant="body2">Giá: {pd.price?.toLocaleString('vi-VN')}₫</Typography>
                    <Typography variant="body2" color="text.secondary">Tồn kho: {pd.stock}</Typography>
                  </Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedMap[pd.id] > 0}
                        onChange={() => toggleSelection(pd.id)}
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
                        onChange={(e) => setQuantity(pd.id, Number(e.target.value))}
                        sx={{ width: 80 }}
                        inputProps={{ min: 1, max: pd.stock }}
                      />
                    )}
                  </Box>
                </Box>
              </Grid>
            ))}
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
