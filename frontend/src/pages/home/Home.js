
import * as React from 'react';
import './Home.css';
import { useNavigate } from "react-router-dom";
import Navbar from '../../components/Navbar';
import Box from '@mui/material/Box';
import CopyToClipboardButton from './components/CopyToClipboardButton';
import BalanceGroup from './components/BalanceGroup';
import ActionButtonGroup from './components/ActionButtonGroup';
import ActivitiesTable from './components/ActivitiesTable';
import BuyModal from './components/BuyModal';
import SendModal from './components/SendModal';
import ChangeWalletModal from './components/ChangeWalletModal';
import { useDispatch, useSelector } from 'react-redux';
import { getCoinBalance, getFiatBalance, accountSelector, clearState, closeWallet } from './accountSlice';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import toast from 'react-hot-toast';

function Home() {
  const navigate = useNavigate();
  const onLogOut = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  const { isFetching, isError, errorMessage, isSuccess, currency } = useSelector(
    accountSelector
  );
  const dispatch = useDispatch();

  const [openBuy, setOpenBuy] = React.useState(false);
  const handleOpenBuy = () => setOpenBuy(true);
  const handleCloseBuy = () => setOpenBuy(false);

  const [openChangeWallet, setOpenChangeWallet] = React.useState(false);
  const handleOpenChangeWallet = () => setOpenChangeWallet(true);
  const handleCloseChangeWallet = () => setOpenChangeWallet(false);

  const [openSell, setOpenSell] = React.useState(false);
  const handleOpenSell = () => setOpenSell(true);
  const handleCloseSell = () => setOpenSell(false);
  const dispatchBalance = () => {
    if(currency.type == "coin") {
      dispatch(getCoinBalance({currency: currency.name}));
    }
    else {
      dispatch(getFiatBalance({currency: currency.name}));
    }
  }

  const handleCloseWallet = () => {
    dispatch(closeWallet({
      success: onLogOut
    }))
  }

  React.useEffect(() => {
    if(currency.name) dispatchBalance();
  }, [currency.name])

  React.useEffect(() => {
    if (isError) {
      toast.error(errorMessage);
      dispatch(clearState());
    }
    if (isSuccess) {
      dispatch(clearState());
    }
  }, [isError, isSuccess]);
  
  return (
    <>
      <nav className="navbar">
        <Navbar onLogOut={onLogOut} onOpenChangeWallet={handleOpenChangeWallet} onCloseWallet={handleCloseWallet} />
      </nav>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 10 }}
        open={isFetching}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <React.Fragment>
        <Box className="copyboard_bar" sx={{textAlign: 'center'}}>
          <CopyToClipboardButton  />
        </Box>
        <BalanceGroup />
        <ActionButtonGroup 
          className="actions_bar" 
          onClickBuy={handleOpenBuy} 
          onClickSell={handleOpenSell} 
        />
        <ActivitiesTable/>
        <BuyModal 
          open={openBuy} 
          onClose={handleCloseBuy} 
          onAfterSend={dispatchBalance}
        />
        <SendModal 
          open={openSell} 
          onClose={handleCloseSell} 
          onAfterSend={dispatchBalance}
        />
        <ChangeWalletModal 
          open={openChangeWallet} 
          onClose={handleCloseChangeWallet} 
        />
      </React.Fragment>
    </>
  );
}

export default Home;
