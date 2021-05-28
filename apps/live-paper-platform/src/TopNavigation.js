import React from "react";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import BuildIcon from '@material-ui/icons/Build';
import { livePaperBuilderUrl, livePaperDocsUrl } from "./globals";

export default class TopNavigation extends React.Component {
  render() {
    return (
      <Grid container direction="row">
        <Grid item>
          <Tooltip title={"Open Live Paper Builder"}>
            <a
              href={livePaperBuilderUrl}
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
              href={livePaperDocsUrl}
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
