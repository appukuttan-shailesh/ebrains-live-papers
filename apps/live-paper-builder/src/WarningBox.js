import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import WarningIcon from "@mui/icons-material/Warning";

function WarningBox(props) {
  if (props.message && props.message !== "ok") {
    return (
      <Grid>
        <div className="box rounded centered warning" style={{ width: "95%" }}>
          <Typography variant="body1">
            <WarningIcon style={{ verticalAlign: "text-bottom" }} />
            &nbsp;
            {props.message}
          </Typography>
        </div>
      </Grid>
    );
  } else {
    return "";
  }
}

export default WarningBox;
