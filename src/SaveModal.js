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
import SingleSelect from "./SingleSelect";
import ErrorDialog from "./ErrorDialog";
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
    this.handleErrorDialogClose = this.handleErrorDialogClose.bind(this);
    this.setCollabID = this.setCollabID.bind(this);
  }

  handleCancel() {
    this.props.onClose(false);
  }

  checkRequirements(data) {
    let error = null;
    // a collab must be specified
    if (!data.collab_id) {
      error = "A Collab must be specified!";
    }

    if (error) {
      console.log(error);
      this.setState({
        error: error,
      });
      return false;
    } else {
      return true;
    }
  }

  handleErrorDialogClose() {
    this.setState({ error: false });
    this.props.onClose(false);
  }

  setCollabID(event) {
    let value = event.target.value;
    console.log(value);
    console.log(event);
    this.props.setCollabID(value);
  }

  handleSave() {
    this.setState({ loading: true }, () => {
      const payload = this.props.data;
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
            this.setState({ loading: false });
            this.props.onClose(true);
          })
          .catch((err) => {
            if (axios.isCancel(err)) {
              console.log("Error: ", err.message);
            } else {
              console.log(err);
              console.log(err.response);
              this.setState({
                error: err.response,
              });
            }
            this.setState({ loading: false });
          });
      } else {
        this.setState({ loading: false });
      }
    });
  }

  render() {
    console.log(this.props);
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
              Save Live Paper on EBRAINS Knowledge Graph
            </span>
          </DialogTitle>
          <DialogContent>
            <LoadingIndicatorModal open={this.state.loading} />
            <Box my={2}>
              Each live paper needs to be associated with a Collab on the
              EBRAINS Collaboratory, to handle access permissions for viewing
              live papers prior to their publication, and their editing in
              future. Accordingly, please specify a Collab for this live paper.
              You may need to create a new Collab if you don't already have
              access to one.{" "}
              <a
                href="https://wiki.ebrains.eu/bin/view/Collabs?clbaction=create"
                target="_blank"
                rel="noreferrer"
              >
                Click here
              </a>{" "}
              to create a new Collab.
            </Box>
            <Box my={2}>
              <SingleSelect
                name="project_id"
                itemNames={
                  this.props.collab_list
                    ? this.props.collab_list.length > 0
                      ? this.props.collab_list
                      : ["Please create a new Collab!"]
                    : ["Loading... please wait!"]
                }
                label="Collab"
                value={
                  this.props.collab_list
                    ? this.props.collab_list.length > 0
                      ? this.props.collab_id
                      : "Please create a new Collab!"
                    : "Loading... please wait!"
                }
                helperText="Select a host Collab for this live paper"
                handleChange={this.setCollabID}
                disabled={
                  !(this.props.collab_list && this.props.collab_list.length > 0)
                }
              />
            </Box>
            <br />
            <br />

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
