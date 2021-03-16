import React from "react";
import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import axios from "axios";
import SwitchTwoWay from "./SwitchTwoWay";
import ErrorDialog from "./ErrorDialog";
import Link from "@material-ui/core/Link";
import { showNotification } from "./utils";

export default class SubmitModal extends React.Component {
  signal = axios.CancelToken.source();

  constructor(props) {
    super(props);

    this.state = {
      data: props.data,
      mode: props.mode || "Public",
      password: "",
      error: null,
    };

    this.mailTo = React.createRef();
    this.mailSubject = React.createRef();
    this.mailBodyRef = React.createRef();

    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleModeChange = this.handleModeChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleCancel() {
    this.props.onClose();
  }

  handleSubmit() {
    console.log("TODO: Handle Submit!");
  }

  handleModeChange(mode) {
    this.setState({ mode: mode, password: "" });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorDialog
          open={Boolean(this.state.error)}
          handleErrorDialogClose={this.handleErrorDialogClose}
          error={this.state.error.message || this.state.error}
        />
      );
    } else {
      return (
        <Dialog
          onClose={this.handleClose}
          aria-labelledby="simple-dialog-title"
          open={this.props.open}
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle style={{ backgroundColor: "#ffd180" }}>
            <span style={{ fontWeight: "bolder", fontSize: 18 }}>
              Submit Live Paper
            </span>
          </DialogTitle>
          <DialogContent>
            <Box my={2}>
              Verify that you have entered all the required info in the live
              paper before proceeding.
            </Box>
            <Box my={2}>
              <strong>
                Please specify the visibility mode for this live paper:
              </strong>
              <Box my={2} style={{ marginBottom: "30px" }}>
                <form>
                  <SwitchTwoWay
                    values={["Password-Protected", "Public"]}
                    selected={this.state.mode}
                    onChange={this.handleModeChange}
                  />
                </form>
              </Box>
            </Box>
            {this.state.mode === "Password-Protected" && (
              <Box my={2}>
                <div>
                  <p>
                    <strong>
                      Please specify a password for accessing this live paper:
                    </strong>
                  </p>
                </div>
                <div>
                  <TextField
                    label="password"
                    variant="outlined"
                    fullWidth={true}
                    name="password"
                    type="password"
                    value={this.state.password}
                    onChange={this.handlePasswordChange}
                    InputProps={{
                      style: {
                        padding: "5px 15px",
                        width: "75%",
                      },
                    }}
                  />
                </div>
              </Box>
            )}
            {this.state.mode === "Public" && (
              <Box my={2}>
                <div>
                  <strong>
                    To request publication of the live paper, do one of the
                    following:
                  </strong>
                  <div
                    style={{
                      marginLeft: "25px",
                      paddingTop: "10px",
                      display: "list-item",
                    }}
                  >
                    Click on "Send Email" to open the draft email in your
                    default email client. Send the email without editing any of
                    its contents.
                  </div>
                  <div
                    style={{
                      marginLeft: "25px",
                      marginRight: "25px",
                      paddingTop: "10px",
                      display: "list-item",
                    }}
                  >
                    Alternatively, copy the content below and email it to:{" "}
                    <strong
                      ref={this.mailTo}
                      onClick={() =>
                        navigator.clipboard.writeText(
                          this.mailTo.current.innerText
                        )
                      }
                      style={{ cursor: "pointer" }}
                    >
                      lucaleonardo.bologna@cnr.it
                    </strong>{" "}
                    with the following subject:{" "}
                    <strong
                      ref={this.mailSubject}
                      onClick={() =>
                        navigator.clipboard.writeText(
                          this.mailSubject.current.innerText
                        )
                      }
                      style={{ cursor: "pointer" }}
                    >
                      Request to publish Live Paper
                    </strong>
                    <div
                      style={{
                        marginTop: "10px",
                        padding: "20px",
                        border: "dashed",
                        borderColor: "#000000",
                        borderWidth: "2px",
                        backgroundColor: "#D9D9D9",
                        cursor: "pointer",
                      }}
                      ref={this.mailBodyRef}
                      onClick={() => {
                        navigator.clipboard.writeText(
                          this.mailBodyRef.current.innerText
                        );
                        showNotification(
                          this.props.enqueueSnackbar,
                          this.props.closeSnackbar,
                          "Copied to clipboard!",
                          "info"
                        );
                      }}
                    >
                      We would like to request the publication of our live
                      paper.
                      <br />
                      The details are as follows:
                      <br />
                      <br />
                      ID: AAf2e856-27a8-4b8d-9ec3-4e2581c546AA
                      <br />
                      Title: Some title here
                    </div>
                  </div>
                </div>
              </Box>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                paddingLeft: "2.5%",
                paddingRight: "2.5%",
                paddingTop: "20px",
                paddingBottom: "20px",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                style={{
                  width: "20%",
                  backgroundColor: "#FF9800",
                  color: "#000000",
                  fontWeight: "bold",
                  border: "solid",
                  borderColor: "#000000",
                  borderWidth: "1px",
                }}
                onClick={this.handleCancel}
              >
                Cancel
              </Button>
              <br />
              <br />
              {this.state.mode === "Public" && (
                <Link
                  style={{ width: "20%" }}
                  target="_blank"
                  rel="noreferrer"
                  underline="none"
                  href="mailto:lucaleonardo.bologna@cnr.it, shailesh.appukuttan@cnrs.fr?subject=Request%20to%20publish%20Live%20Paper&body=We%20would%20like%20to%20request%20the%20publication%20of%20our%20live%20paper.%0AThe%20details%20are%20as%20follows%3A%0A%0AID%3A%20AAf2e856-27a8-4b8d-9ec3-4e2581c546AA%0ATitle%3A%20Some%20title%20here"
                >
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      width: "100%",
                      backgroundColor: "#8BC34A",
                      color: "#000000",
                      fontWeight: "bold",
                      border: "solid",
                      borderColor: "#000000",
                      borderWidth: "1px",
                    }}
                  >
                    Send Email
                  </Button>
                </Link>
              )}
              {this.state.mode === "Password-Protected" && (
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    width: "20%",
                    backgroundColor: "#8BC34A",
                    color: "#000000",
                    fontWeight: "bold",
                    border: "solid",
                    borderColor: "#000000",
                    borderWidth: "1px",
                  }}
                  onClick={this.handleSubmit}
                >
                  Submit
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      );
    }
  }
}

SubmitModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
