import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import MuiDialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import parse from "html-react-parser";
import { Link } from "react-router-dom";


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
            top: 1,
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
          disableEscapeKeyDown={true}
        >
          <DialogTitle
            id="customized-dialog-title"
            onClose={() => this.props.handleClose(false)}
            style={{ backgroundColor: this.props.headerBgColor || "#00A595" }}
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
                      backgroundColor: "#525252",
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
                  <Link
                    to={{
                      pathname: window.location.pathname + "BulkEntryWizard",
                      hash: this.props.bulkEntry,
                    }}
                    target="_blank"
                  >
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
                  backgroundColor: "#4DC26D",
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
