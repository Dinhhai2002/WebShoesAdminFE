import {
  Box,
  Card,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  alpha,
  useTheme,
  styled
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
  ShoppingCart as ShoppingCartIcon,
  Comment as CommentIcon
} from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4]
  }
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(2)
}));

interface CancelOrderCardProps {
  cancelOrder: any;
  onViewDetails: () => void;
  onApprove: () => void;
  onReject: () => void;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'PENDING':
      return {
        color: 'warning',
        label: 'Chờ duyệt',
        bgColor: '#FFF4DE',
        textColor: '#FFA319'
      };
    case 'APPROVED':
      return {
        color: 'success',
        label: 'Đã duyệt',
        bgColor: '#E8F5E9',
        textColor: '#4CAF50'
      };
    case 'REJECTED':
      return {
        color: 'error',
        label: 'Từ chối',
        bgColor: '#FDECEA',
        textColor: '#F44336'
      };
    default:
      return {
        color: 'default',
        label: status,
        bgColor: '#F5F5F5',
        textColor: '#757575'
      };
  }
};

const CancelOrderCard = ({
  cancelOrder,
  onViewDetails,
  onApprove,
  onReject
}: CancelOrderCardProps) => {
  const theme = useTheme();
  const statusConfig = getStatusConfig(cancelOrder.status);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <StyledCard>
      <Box sx={{ p: 2 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" mb={2}>
          <IconWrapper sx={{ bgcolor: alpha(theme.colors.primary.main, 0.1) }}>
            <ShoppingCartIcon sx={{ color: theme.colors.primary.main }} />
          </IconWrapper>
          <Box flex={1}>
            <Typography variant="h5" gutterBottom>
              #{cancelOrder.order_id}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <AccessTimeIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {formatDate(cancelOrder.created_at)}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={statusConfig.label}
            sx={{
              bgcolor: statusConfig.bgColor,
              color: statusConfig.textColor,
              fontWeight: 'bold'
            }}
          />
        </Box>

        {/* Content */}
        <Box mb={2}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Lý do hủy:
          </Typography>
          <Typography variant="body1">
            {cancelOrder.cancel_reason}
          </Typography>
        </Box>

        {cancelOrder.admin_notes && (
          <Box mb={2}>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <CommentIcon fontSize="small" color="action" />
              <Typography variant="subtitle2" color="text.secondary">
                Ghi chú:
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {cancelOrder.admin_notes}
            </Typography>
          </Box>
        )}

        {/* Actions */}
        <Box
          sx={{
            pt: 2,
            mt: 'auto',
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1
          }}
        >
          <Tooltip title="Xem chi tiết">
            <IconButton
              size="small"
              onClick={onViewDetails}
              sx={{
                color: theme.colors.primary.main,
                '&:hover': { bgcolor: alpha(theme.colors.primary.main, 0.1) }
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>

          {cancelOrder.status === 'PENDING' && (
            <>
              <Tooltip title="Duyệt yêu cầu">
                <IconButton
                  size="small"
                  onClick={onApprove}
                  sx={{
                    color: theme.colors.success.main,
                    '&:hover': { bgcolor: alpha(theme.colors.success.main, 0.1) }
                  }}
                >
                  <CheckCircleIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Từ chối">
                <IconButton
                  size="small"
                  onClick={onReject}
                  sx={{
                    color: theme.colors.error.main,
                    '&:hover': { bgcolor: alpha(theme.colors.error.main, 0.1) }
                  }}
                >
                  <CancelIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </Box>
    </StyledCard>
  );
};

export default CancelOrderCard;

