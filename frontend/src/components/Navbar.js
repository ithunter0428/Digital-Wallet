import * as React from 'react';
import './Navbar.css';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { currencies } from '../currencies';
import { useDispatch, useSelector } from 'react-redux';
import { accountSelector, setCurrency } from '../pages/home/accountSlice';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

function Navbar({ onLogOut, onOpenChangeWallet, onCloseWallet }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const dispatch = useDispatch();
    const { currency } = useSelector(
      accountSelector
    );  
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const handleCurrencyChange = (e) => {
      dispatch(setCurrency(e.target.value));
    }
    return (
      <React.Fragment>
        <Box className="navbarContainer">
          <Typography className='logoTitle'>Wallet</Typography>
          {onLogOut && <Box sx={{ minWidth: 300, display: 'flex' }}>
            <Box sx={{ width: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Currency</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={currency.name}
                  label="Currency"
                  onChange={handleCurrencyChange}
                >
                  {currencies.map(item => 
                    <MenuItem value={item.name} key={item.name}>
                      <span className="color-indicator__inner-circle" style={{ backgroundColor: item.color}}></span>{item.name}
                    </MenuItem>)}
                </Select>
              </FormControl>
            </Box>
            <Tooltip title="Account settings">
                <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                >
                <Avatar sx={{ width: 32, height: 32 }}>{(localStorage.getItem('username') || '').slice(0, 1)}</Avatar>
                </IconButton>
            </Tooltip>
          </Box>}
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={onOpenChangeWallet}>
            <Avatar><AccountBalanceWalletIcon /></Avatar>
             Change Wallet
          </MenuItem>
          <MenuItem onClick={onCloseWallet}>
            <Avatar /> Close Account
          </MenuItem>
          <Divider />
          <MenuItem onClick={onLogOut}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </React.Fragment>
    );
}

export default Navbar;