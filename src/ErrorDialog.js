import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";

const addLineBreaks = (string) =>
  string.split("\n").map((text, index) => (
    <React.Fragment key={`${text}-${index}`}>
      {text}
      <br />
    </React.Fragment>
  ));

function reformatErrorMessage(errorResponse) {
  let output = "Error code = " + errorResponse.status;
  if (typeof errorResponse.data.detail === "string") {
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
  //   console.log("ErrorDialog: " + props.error);
  return (
    <Dialog
      open={props.open}
      onClose={props.handleErrorDialogClose}
      aria-labelledby="simple-ErrorDialog-title"
      // fullWidth={true}
      maxWidth="sm"
    >
      <DialogTitle style={{ backgroundColor: "#ffd180" }}>
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
