
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
import { useDispatch, useSelector } from 'react-redux';
import { getCoinBalance, getFiatBalance, accountSelector, clearState } from './accountSlice';
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

  React.useEffect(() => {
    dispatchBalance();
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
        <Navbar onLogOut={onLogOut} />
      </nav>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
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
        />
        <SendModal 
          open={openSell} 
          onClose={handleCloseSell} 
          onAfterSend={dispatchBalance}
        />
      </React.Fragment>
    </>
  );
}

export default Home;
