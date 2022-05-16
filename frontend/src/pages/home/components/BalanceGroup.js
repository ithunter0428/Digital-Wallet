import * as React from "react";
import { Typography } from "@mui/material";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useSelector } from 'react-redux';
import { accountSelector } from '../accountSlice';

const BalanceComponent = ({ title, value, current }) => {
  const { currency } = useSelector(
    accountSelector
  );

  const opacity = current? 0.6: 1;
  return (
    <Box>
      <Typography sx={{ minWidth: 100, fontSize: "30px", textAlign: "center", marginTop: "30px", opacity: opacity }}>
        {value} {currency.symbol}
      </Typography>
      <Typography sx={{ minWidth: 100, fontSize: "22px", textAlign: "center", marginTop: "10px", opacity: opacity }}>
        {title}
      </Typography>
    </Box>
  );
};

const BalanceGroupComponent = () => {
  const { currency, balance } = useSelector(
    accountSelector
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <BalanceComponent title={"Available Balance"} value={balance.available_balance} />
      </Grid>
      <Grid item xs={6}>
        <BalanceComponent title={currency.type == "coin"? "Pending Received Balance": "Current Balance"} value={balance.cur_balance} current/>
      </Grid>
    </Grid>
  );
};

export default BalanceGroupComponent;
