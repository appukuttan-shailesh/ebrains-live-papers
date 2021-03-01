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
import TextField from "@material-ui/core/TextField";
import SingleSelect from "./SingleSelect";
import ErrorDialog from "./ErrorDialog";
import { baseUrl } from "./globals";
import { replaceEmptyStringsWithNull } from "./utils";

export default class SaveModal extends React.Component {
  signal = axios.CancelToken.source();
  static contextType = ContextMain;

  constructor(props, context) {
    super(props, context);

    this.state = {
      data: props.data,
      error: null,
      loading: false,
      collab_id: props.data.collab_id,
      live_paper_name: props.data.live_paper_title,
      live_paper_name_unique: true,
    };

    // const [authContext,] = this.context.auth;

    this.handleCancel = this.handleCancel.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.checkRequirementsOnPage = this.checkRequirementsOnPage.bind(this);
    this.checkRequirementsOnPayload = this.checkRequirementsOnPayload.bind(
      this
    );
    this.handleErrorDialogClose = this.handleErrorDialogClose.bind(this);
    this.handleCollabIDChange = this.handleCollabIDChange.bind(this);
    this.handleLivePaperNameChange = this.handleLivePaperNameChange.bind(this);
    this.checkLivePaperNameUnique = this.checkLivePaperNameUnique.bind(this);
    this.adjustForKGSchema = this.adjustForKGSchema.bind(this);
  }

  handleCancel() {
    this.props.onClose(false);
  }

  checkRequirementsOnPage(dta) {
    let flag = true;
    // a collab must be specified
    if (!this.state.collab_id) {
      flag = false;
    }

    // a live paper name be specified
    if (!this.state.live_paper_name) {
      flag = false;
      this.setState({ live_paper_name_unique: false });
    }
    return flag;
  }

  checkRequirementsOnPayload(data) {
    // placeholder for future checks
    return true;

    // let error = null;
    // if (...) {
    //   error = "error message #1!";
    // }
    // if (...) {
    //   error = error ? error + "\n" : "";
    //   error += "error message #2!";
    // }
    // console.log(error);
    // if (error) {
    //   this.setState({
    //     error: error,
    //   });
    //   return false;
    // } else {
    // this.setState({
    //     error: null,
    //   });
    //   return true;
    // }
  }

  handleErrorDialogClose() {
    this.setState({ error: false });
    this.props.onClose(false);
  }

  handleCollabIDChange(event) {
    let value = event.target.value;
    console.log(value);
    console.log(event);
    this.setState({
      collab_id: value,
    });
  }

  handleLivePaperNameChange(event) {
    let value = event.target.value;
    console.log(value);
    console.log(event);
    this.setState({
      live_paper_name: value,
      live_paper_name_unique: null,
    });
  }

  async checkLivePaperNameUnique(name) {
    let flag = null;
    const url = baseUrl + "/livepapers/";
    const config = {
      cancelToken: this.signal.token,
      headers: { Authorization: "Bearer " + this.context.auth[0].token },
    };
    await axios
      .get(url, config)
      .then((res) => {
        // item.title to be changed in future to live_paper_title
        const found = res.data.find((item) => item.title === name);
        if (found) {
          // duplicate
          this.setState({
            live_paper_name_unique: false,
          });
          flag = false;
        } else {
          // unique
          this.setState({
            live_paper_name_unique: true,
          });
          flag = true;
        }
      })
      .catch((err) => {
        console.log("Error: ", err.message);
        flag = false;
      });
    return flag;
  }

  handleSave() {
    this.setState({ loading: true, live_paper_name_unique: null }, async () => {
      const payload = {
        ...this.adjustForKGSchema(this.props.data),
        collab_id: this.state.collab_id,
        live_paper_title: this.state.live_paper_name,
      };
      console.log(payload);
      if (
        this.checkRequirementsOnPage() &&
        this.checkRequirementsOnPayload(payload)
      ) {
        let isUnique = await this.checkLivePaperNameUnique(
          this.state.live_paper_name
        );
        console.log("isUnique: ", isUnique);
        if (isUnique) {
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
              console.log("UUID = ", res.data.id);
              this.props.setCollabID(this.state.collab_id);
              this.props.setLivePaperTitle(this.state.live_paper_name);
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
      } else {
        this.setState({ loading: false });
      }
    });
  }

  adjustForKGSchema(data) {
    let payload = JSON.parse(JSON.stringify(data)); // copy by value

    // KG requires 'dataFormatted' value for SectionCustom in 'description' field
    payload.resources.forEach(function (res, index) {
      // creating extra copy here to handle problem with shallow copy of nested object
      let temp_res = JSON.parse(JSON.stringify(res));
      if (res.type === "section_custom") {
        res.description = temp_res.dataFormatted;
        res.dataFormatted = [];
      }
    });

    // KG requires all 'url' field in resource sections to have a valid URL
    payload.resources.forEach(function (res, index) {
      if (res.type !== "section_custom") {
        res.dataFormatted.forEach(function (res_item, index) {
          if (res_item.url === "") {
            res_item.url = "http://www.ToBeFilled.com";
          }
        });
      }
    });

    console.log(replaceEmptyStringsWithNull(payload));
    return replaceEmptyStringsWithNull(payload);
  }

  render() {
    console.log(this.props);
    console.log(this.state);

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
              Save Live Paper On EBRAINS Knowledge Graph
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
                      ? this.state.collab_id
                      : "Please create a new Collab!"
                    : "Loading... please wait!"
                }
                helperText="Select a host Collab for this live paper"
                handleChange={this.handleCollabIDChange}
                disabled={
                  !(this.props.collab_list && this.props.collab_list.length > 0)
                }
              />
            </Box>
            {!this.state.collab_id && (
              <div style={{ color: "red" }}>
                <strong>A Collab must be specified!</strong>
              </div>
            )}
            <Box my={2}>
              <div>
                <p>
                  <strong>
                    Please specify a unique name to identify this live paper:
                  </strong>
                </p>
              </div>
              <div>
                <TextField
                  label="Live Paper Name"
                  variant="outlined"
                  fullWidth={true}
                  name="password"
                  value={this.state.live_paper_name}
                  onChange={this.handleLivePaperNameChange}
                  InputProps={{
                    style: {
                      padding: "5px 15px",
                      width: "75%",
                    },
                  }}
                />
              </div>
              {!this.state.live_paper_name && (
                <div style={{ color: "red", paddingTop: "10px" }}>
                  <strong>A Live Paper name must be specified!</strong>
                </div>
              )}
              {this.state.live_paper_name &&
                this.state.live_paper_name_unique === false && (
                  <div style={{ color: "red", paddingTop: "10px" }}>
                    <strong>
                      The live paper name '
                      <pre style={{ display: "inline" }}>
                        {this.state.live_paper_name}
                      </pre>
                      ' is already used by another live paper. Please enter a
                      different name.
                    </strong>
                  </div>
                )}
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
