import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import parse from "html-react-parser";
import {Link} from "react-router-dom";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon style={{ color: "#000000" }} />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default class DialogConfirm extends React.Component {
  render() {
    return (
      <div>
        <Dialog
          onClose={() => this.props.handleClose(false)}
          aria-labelledby="customized-dialog-title"
          open={this.props.open}
          fullWidth={true}
          maxWidth={this.props.size || "md"}
          disableBackdropClick={true}
          disableEscapeKeyDown={true}
        >
          <DialogTitle
            id="customized-dialog-title"
            onClose={() => this.props.handleClose(false)}
            style={{ backgroundColor: this.props.headerBgColor || "#ffd180" }}
          >
            <span style={{ fontWeight: "bolder", fontSize: 18 }}>
              {this.props.title}
            </span>
          </DialogTitle>
          <DialogContent dividers>
            {typeof this.props.content === "string" ? (
              <Typography gutterBottom>{parse(this.props.content)}</Typography>
            ) : (
              this.props.content
            )}
          </DialogContent>
          <DialogActions>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                paddingLeft: "2.5%",
                paddingRight: "2.5%",
                paddingTop: "20px",
                paddingBottom: "20px",
                width: "100%",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                style={{
                  width: "150px",
                  backgroundColor: "#8b0d0d",
                  color: "#ffffff",
                  fontWeight: "bold",
                  border: "solid",
                  borderColor: "#000000",
                  borderWidth: "1px",
                }}
                onClick={() => this.props.handleClose(false)}
              >
                Cancel
              </Button>
              <br />
              <br />
              {this.props.clickHelp && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      width: "150px",
                      backgroundColor: "#01579B",
                      color: "#FFFFFF",
                      fontWeight: "bold",
                      border: "solid",
                      borderColor: "#000000",
                      borderWidth: "1px",
                    }}
                    onClick={this.props.clickHelp}
                  >
                    Help
                  </Button>
                  <br />
                  <br />
                </>
              )}
              {this.props.bulkEntry && (
                <>
                  <Link to={{pathname: "/BulkEntryWizard", hash: this.props.bulkEntry }} target="_blank" >
                    <Button
                      variant="contained"
                      color="primary"
                      style={{
                        width: "150px",
                        backgroundColor: "#FF9800",
                        color: "#000000",
                        fontWeight: "bold",
                        border: "solid",
                        borderColor: "#000000",
                        borderWidth: "1px",
                      }}
                    >
                      Input Tool
                    </Button>
                  </Link>
                  <br />
                  <br />
                </>
              )}
              <Button
                variant="contained"
                color="primary"
                style={{
                  width: "150px",
                  backgroundColor: "#8BC34A",
                  color: "#000000",
                  fontWeight: "bold",
                  border: "solid",
                  borderColor: "#000000",
                  borderWidth: "1px",
                }}
                onClick={() => this.props.handleClose(true)}
              >
                Proceed
              </Button>
            </div>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
