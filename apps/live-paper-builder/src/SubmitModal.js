import React from "react";
import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import axios from "axios";
import SwitchMultiWay from "./SwitchMultiWay";
import ContextMain from "./ContextMain";
import LoadingIndicatorModal from "./LoadingIndicatorModal";
import ErrorDialog from "./ErrorDialog";
import ModalDialog from "./ModalDialog";
import Link from "@material-ui/core/Link";
import { baseUrl } from "./globals";
import { showNotification } from "./utils";
import saltedMd5 from "salted-md5";

export default class SubmitModal extends React.Component {
  signal = axios.CancelToken.source();
  static contextType = ContextMain;

  constructor(props, context) {
    super(props, context);

    this.state = {
      data: props.data,
      mode: props.mode || "Public",
      password: "",
      error: null,
      loading: false,
      showProtectedSummary: false,
    };

    this.mailTo1 = React.createRef();
    this.mailTo2 = React.createRef();
    this.mailSubject = React.createRef();
    this.mailBodyRef = React.createRef();

    this.handleCancel = this.handleCancel.bind(this);
    this.handleProtectedSubmit = this.handleProtectedSubmit.bind(this);
    this.handleModeChange = this.handleModeChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleErrorDialogClose = this.handleErrorDialogClose.bind(this);
    this.handleProtectedSummaryClose =
      this.handleProtectedSummaryClose.bind(this);
  }

  handleCancel() {
    this.props.onClose();
  }

  handleProtectedSubmit() {
    // check if live paper already saved on KG
    var lp_id = this.props.data.id;
    var context = this;
    console.log(lp_id);
    if (!lp_id) {
      this.setState({
        error: "You need to 'Save' the live paper before proceeding!",
      });
    } else if (!this.state.password || this.state.password.length < 6) {
      return;
    } else {
      let url = baseUrl + "/livepapers/" + lp_id + "/access_code";
      let config = {
        cancelToken: this.signal.token,
        headers: {
          Authorization: "Bearer " + this.context.auth[0].token,
          "Content-type": "application/json",
        },
      };
      this.setState({ loading: true }, async () => {
        let hash = saltedMd5(this.state.password, lp_id).toString();
        console.log(hash);
        // save password
        console.log("Saving hash on KG");
        axios
          .put(url, { value: hash }, config)
          .then((res) => {
            console.log("Password saved to KG!");
            console.log(res);
            context.setState({ loading: false, showProtectedSummary: true });
            showNotification(
              context.props.enqueueSnackbar,
              context.props.closeSnackbar,
              "Password has been set!",
              "success"
            );
          })
          .catch((err) => {
            if (axios.isCancel(err)) {
              console.log("Error: ", err.message);
            } else {
              console.log(err);
              console.log(err.response);
              context.setState({
                error: err.response,
              });
            }
            context.setState({ loading: false });
          });
      });
    }
  }

  handleModeChange(mode) {
    this.setState({ mode: mode, password: "" });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  handleErrorDialogClose() {
    this.setState({ error: false });
    this.props.onClose(false);
  }

  handleProtectedSummaryClose() {
    this.setState({
      showProtectedSummary: false,
    });
    this.props.onClose(true);
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorDialog
          open={Boolean(this.state.error)}
          handleErrorDialogClose={this.handleErrorDialogClose}
          error={this.state.error.message || this.state.error}
          whileDevelop={true}
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
          <DialogTitle style={{ backgroundColor: "#00A595" }}>
            <span style={{ fontWeight: "bolder", fontSize: 18 }}>
              Submit Live Paper
            </span>
          </DialogTitle>
          <DialogContent>
            <LoadingIndicatorModal open={this.state.loading} />
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
                  <SwitchMultiWay
                    values={["Password-Protected", "Public"]}
                    selected={this.state.mode}
                    onChange={this.handleModeChange}
                  />
                </form>
              </Box>
            </Box>
            {this.state.mode === "Password-Protected" && (
              <>
                <Box my={2}>
                  <div>
                    <p>
                      <strong>
                        Please specify a password for restricting access to this
                        live paper:
                      </strong>
                    </p>
                  </div>

                  <div>
                    <TextField
                      label="password"
                      variant="outlined"
                      fullWidth={true}
                      name="password"
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
                {(!this.state.password || this.state.password.length < 6) && (
                  <div style={{ color: "red" }}>
                    <strong>
                      Please specify a password with minimum 6 characters!
                    </strong>
                  </div>
                )}
                {!this.props.data.id &&
                  <span style={{ color: "red" }}>
                    <strong>
                      You need to 'Save' the live paper before proceeding!
                    </strong>
                  </span>
                }
              </>
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
                      ref={this.mailTo1}
                      onClick={() => {
                        navigator.clipboard.writeText(
                          this.mailTo1.current.innerText
                        );
                        showNotification(
                          this.props.enqueueSnackbar,
                          this.props.closeSnackbar,
                          "Copied to clipboard!",
                          "success"
                        );
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      support@ebrains.eu
                    </strong> or{" "}
                    <strong
                      ref={this.mailTo2}
                      onClick={() => {
                        navigator.clipboard.writeText(
                          this.mailTo2.current.innerText
                        );
                        showNotification(
                          this.props.enqueueSnackbar,
                          this.props.closeSnackbar,
                          "Copied to clipboard!",
                          "success"
                        );
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      shailesh.appukuttan@cnrs.fr
                    </strong>
                    {" "}
                    with the following subject:{" "}
                    <strong
                      ref={this.mailSubject}
                      onClick={() => {
                        navigator.clipboard.writeText(
                          this.mailSubject.current.innerText
                        );
                        showNotification(
                          this.props.enqueueSnackbar,
                          this.props.closeSnackbar,
                          "Copied to clipboard!",
                          "success"
                        );
                      }}
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
                        backgroundColor: "#DCEDC8",
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
                          "success"
                        );
                      }}
                    >
                      We would like to request the publication of our live
                      paper.
                      <br />
                      The details are as follows:
                      <br />
                      <br />
                      ID:{" "}
                      {this.props.data.id ? (
                        this.props.data.id
                      ) : (
                        <span style={{ color: "red" }}>
                          <i>You need to 'Save' the live paper before proceeding!</i>
                        </span>
                      )}
                      <br />
                      Title: {this.props.data.live_paper_title}
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
                  backgroundColor: "#525252",
                  color: "#FFFFFF",
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
                  href={
                    this.props.data.id
                      ? "mailto:support@ebrains.eu, shailesh.appukuttan@cnrs.fr?subject=Request%20to%20publish%20Live%20Paper&body=We%20would%20like%20to%20request%20the%20publication%20of%20our%20live%20paper.%0AThe%20details%20are%20as%20follows%3A%0A%0AID%3A%20" +
                      escape(this.props.data.id) +
                      "%0AName%3A%20" +
                      escape(this.props.data.live_paper_title)
                      : null
                  }
                >
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      width: "100%",
                      backgroundColor: this.props.data.id
                        ? "#4DC26D"
                        : "#FFFFFF",
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
                    backgroundColor:
                      this.state.password && this.state.password.length >= 6
                        ? "#4DC26D"
                        : "#FFFFFF",
                    color: "#000000",
                    fontWeight: "bold",
                    border: "solid",
                    borderColor: "#000000",
                    borderWidth: "1px",
                  }}
                  onClick={this.handleProtectedSubmit}
                >
                  Submit
                </Button>
              )}
            </div>
            {this.state.showProtectedSummary ? (
              <ModalDialog
                open={this.state.showProtectedSummary}
                title="Password-Protected Live Paper"
                content={
                  <ProtectedSummary
                    id={this.props.data.id}
                    password={this.state.password}
                    enqueueSnackbar={this.props.enqueueSnackbar}
                    closeSnackbar={this.props.closeSnackbar}
                  />
                }
                handleClose={this.handleProtectedSummaryClose}
              />
            ) : null}
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

function ProtectedSummary(props) {
  return (
    <div
      style={{
        paddingLeft: "2.5%",
        paddingRight: "2.5%",
        textAlign: "justify",
      }}
    >
      <br />
      You can now share this live paper with others by sharing the following
      info:
      <br />
      <br />
      <div
        onClick={() => {
          navigator.clipboard.writeText(
            "https://live-papers.brainsimulation.eu/#" + props.id
          );
          showNotification(
            props.enqueueSnackbar,
            props.closeSnackbar,
            "Copied to clipboard!",
            "info"
          );
        }}
        style={{ cursor: "pointer" }}
      >
        URL:
        <h6>
          <b>{"https://live-papers.brainsimulation.eu/#" + props.id}</b>
        </h6>
      </div>
      <br />
      <div
        onClick={() => {
          navigator.clipboard.writeText(props.password);
          showNotification(
            props.enqueueSnackbar,
            props.closeSnackbar,
            "Copied to clipboard!",
            "info"
          );
        }}
        style={{ cursor: "pointer" }}
      >
        Password:
        <h6>
          <b>{props.password}</b>
        </h6>
      </div>
      <br />
      <strong>Note: </strong>
      <br />
      - The password cannot be recovered, so please note it down carefully!
      <br />
      - If you forget the password, simply set a new password.
      <br />
      - You can change the password at any time by repeating this process.
      <br />
      <br />
    </div>
  );
}
