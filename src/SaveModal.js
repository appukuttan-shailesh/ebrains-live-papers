import React from "react";
import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import axios from "axios";
import ContextMain from "./ContextMain";
import LoadingIndicatorModal from "./LoadingIndicatorModal";
import { baseUrl } from "./globals";

export default class SaveModal extends React.Component {
  signal = axios.CancelToken.source();
  static contextType = ContextMain;

  constructor(props, context) {
    super(props, context);

    this.state = {
      data: props.data,
      error: null,
      loading: false,
    };

    // const [authContext,] = this.context.auth;

    this.handleCancel = this.handleCancel.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.checkRequirements = this.checkRequirements.bind(this);
  }

  handleCancel() {
    this.props.onClose();
  }

  checkRequirements() {
    return true;
  }

  handleSave() {
    this.setState({ loading: true }, () => {
      const payload = this.props.lp_payload;
      console.log(payload);
      if (this.checkRequirements(payload)) {
        let url = baseUrl + "/livepapers/";
        let config = {
          cancelToken: this.signal.token,
          headers: {
            Authorization: "Bearer " + this.context.auth[0].token,
            "Content-type": "application/json",
          },
        };

        axios
          .post(url, payload, config)
          .then((res) => {
            console.log(res);
            console.log("YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY");
            this.setState({ loading: false });
            this.props.onClose();
          })
          .catch((err) => {
            if (axios.isCancel(err)) {
              console.log("Error: ", err.message);
            } else {
              console.log(err);
              console.log(err.response);
              console.log("NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN");
            }
            this.setState({ loading: false });
          });
      } else {
        this.setState({ loading: false });
      }
    });
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
              Save Live Paper on EBRAINS Knowledge Graph
            </span>
          </DialogTitle>
          <DialogContent>
            <LoadingIndicatorModal open={this.state.loading} />
            <Box my={2}>
              Verify that you have entered all the required info in the live
              paper before proceeding.
            </Box>
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
                onClick={this.handleSave}
              >
                Save to KG
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      );
    }
  }
}

SaveModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
