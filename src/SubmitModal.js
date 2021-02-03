import React from "react";
import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import axios from "axios";

import ThreeWaySwitch from "./ThreeWaySwitch";
export const validModes = ["Private", "Password-Protected", "Public"];

export default class SubmitModal extends React.Component {
  signal = axios.CancelToken.source();

  constructor(props) {
    super(props);

    this.state = {
      data: props.data,
      mode: props.mode || "Private",
      password: "",
      error: null,
    };

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

  renderError() {
    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="simple-dialog-title"
        open={this.props.open}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle>Error :-(</DialogTitle>
        <DialogContent>
          <div>Uh oh: {this.state.error.message}</div>
        </DialogContent>
      </Dialog>
    );
  }

  render() {
    if (this.state.error) {
      return this.renderError();
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
              <br />
              <em>(this can be changed in future, if required)</em>
              <br />
              <br />
              <Box>
                <form>
                  <ThreeWaySwitch
                    values={validModes}
                    selected={this.state.mode}
                    onChange={this.handleModeChange}
                  />
                </form>
              </Box>
            </Box>
            {this.state.mode == "Password-Protected" && (
              <Box my={2}>
                <div>
                  <p>
                    <strong>
                      Please specify a password for protecting this live paper:
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
