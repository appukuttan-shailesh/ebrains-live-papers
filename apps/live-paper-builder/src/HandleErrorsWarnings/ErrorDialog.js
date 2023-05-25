import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const addLineBreaks = (string) =>
  string.split("\n").map((text, index) => (
    <React.Fragment key={`${text}-${index}`}>
      {text}
      <br />
    </React.Fragment>
  ));

function reformatErrorMessage(errorResponse) {
  let output = "Error code = " + errorResponse.status;
  if (typeof errorResponse.data === "string") {
    output += "\n\n" + errorResponse.data;
  } else if (typeof errorResponse.data.detail === "string") {
    output += "\n\n" + errorResponse.data.detail;
  } else {
    // presuming keys 'loc' and 'msg' exist; update func if necessary to handle other cases
    errorResponse.data.detail.forEach(function (entry, index) {
      let error_loc = entry.loc.join(" -> ");
      let error_msg = entry.msg;
      output += "\n\n";
      output += "Error source #" + (index + 1) + ": " + error_loc;
      output += "\nError message: " + error_msg;
    });
  }
  return output;
}

export default function ErrorDialog(props) {
  return (
    <Dialog
      open={props.open}
      onClose={props.handleErrorDialogClose}
      aria-labelledby="simple-ErrorDialog-title"
      // fullWidth={true}
      maxWidth="sm"
    >
      <DialogTitle style={{ backgroundColor: "#00A595" }}>
        <span style={{ fontWeight: "bolder", fontSize: 18 }}>
          There seems to be a problem...
        </span>
      </DialogTitle>
      <DialogContent>
        <Box my={2}>
          <Typography variant="body1" gutterBottom>
            {props.error
              ? typeof props.error === "string"
                ? addLineBreaks(props.error)
                : addLineBreaks(reformatErrorMessage(props.error))
              : "Please report this error at:\nhttps://github.com/appukuttan-shailesh/live-paper-builder/issues"}
          </Typography>
          {
            // props.whileDevelop is true only via SaveModal and SubmitModal
            (props.error === "Token verification failed" ||
              props.error.status === 401) && (
              <div>
                <br />
                <hr />
                <br />
                Your session seems to have expired.
                <br />
                <br />
                {props.whileDevelop && (
                  <span>
                    To start a new session, please take a backup of your work by
                    clicking 'Download' on the bottom toolbar, and then refresh
                    this page.
                    <br />
                    <br />
                    After reloading the page, you can load the downloaded '.lpp'
                    file to resume working where you left off.
                  </span>
                )}
                {!props.whileDevelop && (
                  <span>To start a new session, please refresh this page.</span>
                )}
              </div>
            )
          }
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleErrorDialogClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
