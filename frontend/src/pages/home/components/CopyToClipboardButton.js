import { useState } from "react";
import { IconButton, Snackbar, Typography } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import { accountSelector } from '../accountSlice';

const CopyToClipboardButton = () => {
  const [open, setOpen] = useState(false);
  const { balance } = useSelector(
    accountSelector
  );

  const handleClick = () => {
    setOpen(true);
    navigator.clipboard.writeText(balance.address);
  };

  return (
    <Box onClick={handleClick}>
      <Typography sx={{ minWidth: 100, fontSize: "25px" }}>{localStorage.getItem('wallet_name')}</Typography>
      <Box>
        <Typography sx={{ minWidth: 100, fontSize: "17px", opacity: 0.6 }}>
          {(balance.address || '').slice(0, 10)}...
          <IconButton color="primary">
            <ShareIcon />
          </IconButton>
        </Typography>
        <Snackbar
          message="Copied to clibboard"
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={2000}
          onClose={() => setOpen(false)}
          open={open}
        />
      </Box>
    </Box>
  );
};

export default CopyToClipboardButton;
