import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import MuiDialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";


const DialogTitle = (props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography sx={{ margin: 0, padding: 2 }} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          sx={{
            position: "absolute",
            right: 1,
            top: 1
            //color: theme.palette.grey[500],
          }}
          onClick={onClose}
        >
          <CloseIcon style={{ color: "#000000" }} />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
};

export default class ModalDialog extends React.Component {
  render() {
    return (
      <Dialog
        onClose={this.props.handleClose}
        aria-labelledby="customized-dialog-title"
        open={this.props.open}
        fullWidth={true}
        maxWidth={"md"}
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={this.props.handleClose}
          style={{ backgroundColor: this.props.headerBgColor || "#00A595" }}
        >
          <b>{this.props.title}</b>
        </DialogTitle>
        <DialogContent dividers>{this.props.content}</DialogContent>
        <DialogActions>
          <Button autoFocus onClick={this.props.handleClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
