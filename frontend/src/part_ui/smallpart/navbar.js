import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
  Link,
} from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import pink from "@material-ui/core/colors/pink";

const primary = pink[900];
const textColor = "#ffffff";
const titleColor = "tan";

// CSS Styles
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },

  menuButton: {
    marginRight: theme.spacing(2),
  },

  title: {
    flexGrow: 1,
    color: titleColor,
  },

  menuSliderContainer: {
    width: 250,
    background: primary,
    height: "100%",
  },

  avatar: {
    display: "block",
    margin: ".5rem auto",
    width: theme.spacing(13),
    height: theme.spacing(13),
  },

  listStyle: {
    color: textColor,
  },
}));

export default function Navbar(props) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorEl2(null);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const classes = useStyles();

  return (
    <div>
      <Box component="nav" className={classes.root}>
        <AppBar position="static" style={{ background: primary }}>
          <Toolbar>
            <Typography variant="h5" className={classes.title}>
              Mini E-Wallet
            </Typography>

            <IconButton onClick={handleClick}>
              <AccountCircle style={{ color: textColor }} />
            </IconButton>

            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem>
                <Link color="inherit" href="/balance">
                  Our Balance
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClick2}>Language</MenuItem>
              <MenuItem onClick={props.logout.bind(this)}>Logout</MenuItem>
            </Menu>

            <Menu
              id="simple-menu2"
              anchorEl={anchorEl2}
              keepMounted
              open={Boolean(anchorEl2)}
              onClose={handleClose2}
              style={{ left: -50 }}
            >
              <MenuItem onClick={props.changeLang.bind(this, "en")}>
                English
              </MenuItem>
              <MenuItem onClick={props.changeLang.bind(this, "id")}>
                Indonesia
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}
