import React from "react";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import BuildIcon from '@material-ui/icons/Build';

export default class TopNavigation extends React.Component {
  render() {
    return (
      <Grid container direction="row">
        <Grid item>
          <Tooltip title={"Open Live Paper Builder"}>
            <a
              href="https://live-paper-builder.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton aria-label="Open Live Paper Builder">
                <BuildIcon fontSize="large" />
              </IconButton>
            </a>
          </Tooltip>
          <Tooltip title={"Open Documentation"}>
            <a
              href="https://live-paper-docs.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton aria-label="Open Documentation">
                <HelpOutlineIcon fontSize="large" />
              </IconButton>
            </a>
          </Tooltip>
        </Grid>
      </Grid>
    );
  }
}
