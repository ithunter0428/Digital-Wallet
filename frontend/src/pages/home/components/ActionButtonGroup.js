import * as React from "react";
import { Button } from "@mui/material";
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import { Typography } from "@mui/material";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useSelector } from 'react-redux';
import { accountSelector } from '../accountSlice';

const ActionButtonGroup = ({ onClickBuy, onClickSell }) => {
  const { currency } = useSelector(
    accountSelector
  );
  return (
    <Box className="copyboard_bar" sx={{display: 'flex', justifyContent: 'center', marginTop: "20px"}}>
      {currency.type == "fiat" && <Box sx={{display: 'flex', flexDirection: "column", alignItems: "center"}} onClick={onClickBuy}>
        <Fab color="primary" aria-label="add">
          <ArrowDownwardIcon />
        </Fab>
        <Typography sx={{ minWidth: 100, fontSize: "17px", textAlign: "center", opacity: 0.6 }}>
          Funds
        </Typography>
      </Box>}
      <Box sx={{display: 'flex', flexDirection: "column", alignItems: "center"}} onClick={onClickSell}>
        <Fab color="primary" aria-label="add">
          <ArrowForwardIcon />
        </Fab>
        <Typography sx={{ minWidth: 100, fontSize: "17px", textAlign: "center", opacity: 0.6 }}>
          Send
        </Typography>
      </Box>
    </Box>
  );
};

export default ActionButtonGroup;
