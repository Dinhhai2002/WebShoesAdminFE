import { useContext } from 'react';
import { alpha, Box, Button, List, ListItem, ListSubheader, styled } from '@mui/material';
import { NavLink as RouterLink } from 'react-router-dom';
import { SidebarContext } from 'src/contexts/SidebarContext';

// Icons
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import BrightnessLowTwoToneIcon from '@mui/icons-material/BrightnessLowTwoTone';
import CategoryIcon from '@mui/icons-material/Category';
import ImageIcon from '@mui/icons-material/Image';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import StorefrontIcon from '@mui/icons-material/Storefront';
import StraightenIcon from '@mui/icons-material/Straighten';
import TextureIcon from '@mui/icons-material/Texture';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import DiscountIcon from '@mui/icons-material/Discount';
import BarChartIcon from '@mui/icons-material/BarChart';
import { RoleEnum } from 'src/utils/enum/RoleEnum';
import utils from 'src/utils/Utils';



// ========== Styled components ==========

const MenuWrapper = styled(Box)(
  ({ theme }) => `
  .MuiList-root {
    padding: ${theme.spacing(1)};
    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
    }
  }

  .MuiListSubheader-root {
    text-transform: uppercase;
    font-weight: bold;
    font-size: ${theme.typography.pxToRem(12)};
    color: ${theme.colors.alpha.trueWhite[50]};
    padding: ${theme.spacing(0, 2.5)};
    line-height: 1.4;
  }
`
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
  .MuiList-root {
    .MuiListItem-root {
      padding: 1px 0;

      .MuiButton-root {
        display: flex;
        color: ${theme.colors.alpha.trueWhite[70]};
        background-color: transparent;
        width: 100%;
        justify-content: flex-start;
        padding: ${theme.spacing(1.2, 3)};

        .MuiButton-startIcon,
        .MuiButton-endIcon {
          transition: ${theme.transitions.create(['color'])};
          .MuiSvgIcon-root {
            font-size: inherit;
            transition: none;
          }
        }
        .MuiButton-startIcon {
          color: ${theme.colors.alpha.trueWhite[30]};
          font-size: ${theme.typography.pxToRem(20)};
          margin-right: ${theme.spacing(1)};
        }
        .MuiButton-endIcon {
          color: ${theme.colors.alpha.trueWhite[50]};
          margin-left: auto;
          opacity: .8;
          font-size: ${theme.typography.pxToRem(20)};
        }
        &.active,
        &:hover {
          background-color: ${alpha(theme.colors.alpha.trueWhite[100], 0.06)};
          color: ${theme.colors.alpha.trueWhite[100]};
          .MuiButton-startIcon,
          .MuiButton-endIcon {
            color: ${theme.colors.alpha.trueWhite[100]};
          }
        }
      }
    }
  }
`
);

// ========== SidebarMenu component ==========

function SidebarMenu() {
  const { closeSidebar } = useContext(SidebarContext);
  const { currentUser, isCurrentUser } = utils.getCurrentUser();

  const userRole = currentUser.role
  return (
    <MenuWrapper>
      {/* Trang chủ: hiển thị cho mọi vai trò */}
      <List component="div">
        <SubMenuWrapper>
          <List component="div">
            <ListItem component="div">
              <Button
                disableRipple
                component={RouterLink}
                onClick={closeSidebar}
                to="/"
                startIcon={<BrightnessLowTwoToneIcon />}
              >
                Trang chủ
              </Button>
            </ListItem>
          </List>
        </SubMenuWrapper>
      </List>

      {/* ========== Quản lý (ADMIN có full quyền) ========== */}
      {userRole === RoleEnum.ADMIN && (
        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Quản lý
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/management/user"
                  startIcon={<PeopleAltTwoToneIcon />}
                >
                  Quản lý người dùng
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/management/category"
                  startIcon={<CategoryIcon />}
                >
                  Quản lý danh mục
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/management/brands"
                  startIcon={<StorefrontIcon />}
                >
                  Quản lý thương hiệu
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/management/banner"
                  startIcon={<ImageIcon />}
                >
                  Quản lý banner
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/management/product"
                  startIcon={<Inventory2OutlinedIcon />}
                >
                  Quản lý sản phẩm
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/management/product-detail"
                  startIcon={<ViewModuleIcon />}
                >
                  Quản lý chi tiết sản phẩm
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/management/size"
                  startIcon={<StraightenIcon />}
                >
                  Quản lý size
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/management/color"
                  startIcon={<PaletteOutlinedIcon />}
                >
                  Quản lý màu sắc
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/management/material"
                  startIcon={<TextureIcon />}
                >
                  Quản lý chất liệu
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/management/address-book"
                  startIcon={<LocationOnIcon />}
                >
                  Quản lý địa chỉ người dùng
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/management/order-staff"
                  startIcon={<PointOfSaleIcon />}
                >
                  Đặt hàng tại quầy
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/management/order"
                  startIcon={<ReceiptLongIcon />}
                >
                  Quản lý đơn hàng
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/management/return-request"
                  startIcon={<ReceiptLongIcon />}
                >
                  Quản lý đổi trả hàng
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/management/voucher"
                  startIcon={<DiscountIcon />}
                >
                  Quản lý Voucher
                </Button>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>
      )}

      {/* ========== Mục dành cho STAFF ========== */}
      {userRole === RoleEnum.STAFF && (
        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Chức năng (STAFF)
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              {/* Đặt hàng tại quầy */}
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/management/order-staff"
                  startIcon={<PointOfSaleIcon />}
                >
                  Đặt hàng tại quầy
                </Button>
              </ListItem>
              {/* Quản lý đơn hàng */}
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/management/order"
                  startIcon={<ReceiptLongIcon />}
                >
                  Quản lý đơn hàng
                </Button>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>
      )}

      {/* ========== Thống kê (Admin hoặc Staff) ========== */}
      {(userRole === RoleEnum.ADMIN || userRole === RoleEnum.STAFF) && (
        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Thống kê
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/statistical/amount"
                  startIcon={<BarChartIcon />}
                >
                  Doanh thu
                </Button>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>
      )}

      {/* ========== Tài khoản (Trang cá nhân) ========== */}
      <List
        component="div"
        subheader={
          <ListSubheader component="div" disableSticky>
            Tài khoản
          </ListSubheader>
        }
      >
        <SubMenuWrapper>
          <List component="div">
            <ListItem component="div">
              <Button
                disableRipple
                component={RouterLink}
                onClick={closeSidebar}
                to="/management/profile/details"
                startIcon={<AccountCircleTwoToneIcon />}
              >
                Trang cá nhân
              </Button>
            </ListItem>
          </List>
        </SubMenuWrapper>
      </List>
    </MenuWrapper>
  );
}

export default SidebarMenu;
