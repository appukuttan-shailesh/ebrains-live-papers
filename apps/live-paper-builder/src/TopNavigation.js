import React from "react";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import { livePaperPlatformUrl, livePaperDocsUrl } from "./globals";

export default class TopNavigation extends React.Component {
  render() {
    return (
      <Grid container direction="row">
        <Grid item>
          <Tooltip title={"See Live Papers"}>
            <a
              href={livePaperPlatformUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton aria-label="See Live Papers">
                <LibraryBooksIcon fontSize="large" />
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
