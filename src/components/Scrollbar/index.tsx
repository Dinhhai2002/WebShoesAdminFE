import { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars-2';

import { Box, useTheme } from '@mui/material';

interface ScrollbarProps {
  className?: string;
  children?: ReactNode;
}

const Scrollbar: FC<ScrollbarProps> = ({ children, ...rest }) => {
  const theme = useTheme(); // Ensure useTheme() is imported correctly

  const renderThumbVertical = () => (
    <div>
      <Box
        sx={{
          width: 5,
          background: theme.colors.alpha.black[10],
          borderRadius: theme.general.borderRadiusLg,
          transition: theme.transitions.create(['background']),
          '&:hover': {
            background: theme.colors.alpha.black[30]
          }
        }}
      />
    </div>
  );

  return (
    <Scrollbars autoHide renderThumbVertical={renderThumbVertical} {...rest}>
      {children}
    </Scrollbars>
  );
};

// Scrollbar.propTypes = {
//   children: PropTypes.node,
//   className: PropTypes.string
// };

export default Scrollbar;
