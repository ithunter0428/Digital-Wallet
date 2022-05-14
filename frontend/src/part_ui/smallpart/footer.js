import React from "react";

import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
} from "@material-ui/core/";
import pink from "@material-ui/core/colors/pink";

const primary = pink[900];
const titleColor = "tan";

export default function Footer() {
  return (
    <Box>
      <AppBar position="static" style={{ background: primary }}>
        <Container>
          <Toolbar style={{ widht: "100%", justifyContent: "center" }}>
            <Typography variant="body1" style={{ color: titleColor }}>
              &copy; 2020 Mini E-Wallet
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
