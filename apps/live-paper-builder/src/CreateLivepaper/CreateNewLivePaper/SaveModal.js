import React from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import axios from "axios";
import SwitchMultiWay from "../../Form/SwitchMultiWay";
import ContextMain from "../../ContextMain";
import LoadingIndicatorModal from "../../Form/LoadingIndicatorModal";
import TextField from "@mui/material/TextField";
import SingleSelect from "../../Form/SingleSelect";
import ErrorDialog from "../../HandleErrorsWarnings/ErrorDialog";
import { baseUrl, separator } from "../../globals";
import { replaceEmptyStringsWithNull, showNotification } from "../../utils";

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
      live_paper_title: props.data.live_paper_title,
      live_paper_title_unique: true,
      mode: props.data.id ? "Save to Existing" : null,
    };

    // const [authContext,] = this.context.auth;

    this.handleCancel = this.handleCancel.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.checkRequirementsOnPage = this.checkRequirementsOnPage.bind(this);
    this.checkRequirementsOnPayload =
      this.checkRequirementsOnPayload.bind(this);
    this.handleErrorDialogClose = this.handleErrorDialogClose.bind(this);
    this.handleCollabIDChange = this.handleCollabIDChange.bind(this);
    this.handleLivePaperNameChange = this.handleLivePaperNameChange.bind(this);
    this.checkLivePaperNameUnique = this.checkLivePaperNameUnique.bind(this);
    this.adjustForKGSchema = this.adjustForKGSchema.bind(this);
    this.handleModeChange = this.handleModeChange.bind(this);
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
    if (!this.state.live_paper_title) {
      console.log(this.state.live_paper_title);
      flag = false;
      this.setState({ live_paper_title_unique: false });
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
    // console.log(value);
    // console.log(event);
    this.setState({
      collab_id: value,
    });
  }

  handleLivePaperNameChange(event) {
    let value = event.target.value;
    // console.log(value);
    // console.log(event);
    this.setState({
      live_paper_title: value,
      live_paper_title_unique: null,
    });
  }

  async checkLivePaperNameUnique(name) {
    let flag = null;
    const url = baseUrl + "/livepapers/?name=" + name;
    const config = {
      cancelToken: this.signal.token,
      headers: { Authorization: "Bearer " + this.context.auth[0].token },
    };
    await axios
      .get(url, config)
      .then((res) => {
        console.log(res.data);
        let found = null;
        if (this.state.mode === "Save to Existing") {
          found = res.data.find(
            // allow if it is the existing LP entry with same name and id
            (item) =>
              item.live_paper_title === name && item.id !== this.props.data.id
          );
        } else {
          found = res.data.find((item) => item.live_paper_title === name);
        }
        console.log(found);
        if (found) {
          // duplicate
          this.setState({
            live_paper_title_unique: false,
          });
          flag = false;
        } else {
          // unique
          this.setState({
            live_paper_title_unique: true,
          });
          flag = true;
        }
      })
      .catch((err) => {
        console.log("Error: ", err.message);
        this.setState({
          error: err.response || err,
        });
        flag = false;
      });
    return flag;
  }

  handleSave() {
    this.setState(
      { loading: true, live_paper_title_unique: null },
      async () => {
        const payload = {
          ...this.adjustForKGSchema(this.props.data),
          collab_id: this.state.collab_id,
          live_paper_title: this.state.live_paper_title,
        };
        // as currently API does not allow `null` for `associated_paper_title`
        payload["associated_paper_title"] =
          this.props.data.associated_paper_title;
        console.log(payload);
        if (
          this.checkRequirementsOnPage() &&
          this.checkRequirementsOnPayload(payload)
        ) {
          let isUnique = await this.checkLivePaperNameUnique(
            this.state.live_paper_title
          );
          // console.log("isUnique: ", isUnique);
          if (isUnique) {
            let url = baseUrl + "/livepapers/";
            let config = {
              cancelToken: this.signal.token,
              headers: {
                Authorization: "Bearer " + this.context.auth[0].token,
                "Content-type": "application/json",
              },
            };

            if (this.state.mode === "Save to Existing") {
              console.log("PUT");
              url = url + this.props.data.id;
              axios
                .put(url, payload, config)
                .then((res) => {
                  // PUT returns null on success
                  // console.log(res);
                  // console.log("UUID = ", res.data.id);
                  // this.props.setID(res.data.id);
                  this.props.setCollabID(this.state.collab_id);
                  this.props.setLivePaperTitle(this.state.live_paper_title);
                  this.props.setLivePaperModifiedDate(payload.modified_date);
                  this.setState({ loading: false });
                  showNotification(
                    this.props.enqueueSnackbar,
                    this.props.closeSnackbar,
                    "Saved to KG!",
                    "success"
                  );
                  this.props.onClose(true);
                })
                .catch((err) => {
                  if (axios.isCancel(err)) {
                    console.log("Error: ", err.message);
                  } else {
                    console.log(err.response || err);
                    this.setState({
                      error: err.response || err,
                    });
                  }
                  this.setState({ loading: false });
                });
            } else {
              console.log("POST");
              // Set id to null for creating new entry via POST
              payload.id = null;
              console.log(payload);
              axios
                .post(url, payload, config)
                .then((res) => {
                  console.log(res);
                  console.log("UUID = ", res.data.id);
                  this.props.setID(res.data.id);
                  this.props.setCollabID(this.state.collab_id);
                  this.props.setLivePaperTitle(this.state.live_paper_title);
                  this.props.setLivePaperModifiedDate(payload.modified_date);
                  this.setState({ loading: false });
                  showNotification(
                    this.props.enqueueSnackbar,
                    this.props.closeSnackbar,
                    "Saved to KG!",
                    "success"
                  );
                  this.props.onClose(true);
                })
                .catch((err) => {
                  if (axios.isCancel(err)) {
                    console.log("Error: ", err.message);
                  } else {
                    console.log(err.response || err);
                    this.setState({
                      error: err.response || err,
                    });
                  }
                  this.setState({ loading: false });
                });
            }
          } else {
            this.setState({ loading: false });
          }
        } else {
          this.setState({ loading: false });
        }
      }
    );
  }

  adjustForKGSchema(data) {
    let payload = JSON.parse(JSON.stringify(data)); // copy by value

    // KG requires all 'url' field in resource sections to have a valid URL
    payload.resources.forEach(function (res, index) {
      if (res.type !== "section_custom") {
        res.data.forEach(function (res_item, index) {
          if (res_item.url === "" && res_item.view_url !== "") {
            res_item.url = res_item.view_url;
          } else if (res_item.url === "" && res_item.view_url === "") {
            // both url and view_url should never be both empty!
            res_item.url = "http://www.MissingInfo.com";
          }
        });
      }
    });

    // handle useTabs for resources
    // KG doesn't have a separate field for saving tabs_name;
    // this is handled by appending it to the label with a separator (#-#)
    console.log(payload);
    payload.resources.forEach(function (res, index) {
      if (res.type !== "section_custom") {
        // console.log(res);
        res.data.forEach(function (res_item, index) {
          if (res_item.tab_name) {
            res_item.label = res_item.label + separator + res_item.tab_name;
          }
        });
      }
    });

    // console.log(replaceEmptyStringsWithNull(payload));
    return replaceEmptyStringsWithNull(payload);
  }

  handleModeChange(mode) {
    this.setState({ mode: mode });
  }

  render() {
    // console.log(this.props);
    // console.log(this.state);
    const [collabList] = this.context.collabList;
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
              Save Live Paper On EBRAINS Knowledge Graph
            </span>
          </DialogTitle>
          <DialogContent>
            <LoadingIndicatorModal open={this.state.loading} />
            <Box my={2}>
              Each Live Paper needs to be associated with a Collab on the
              EBRAINS Collaboratory, to handle access permissions for Live
              Papers prior to their publication, and any further editing in
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
              <br />
              <br />
              <strong>Note:</strong> Please select a{" "}
              <strong>private Collab</strong> to ensure that the live paper
              content is viewable only to Live Paper owners prior to
              publication.
            </Box>
            <Box my={2}>
              <SingleSelect
                name="project_id"
                itemNames={
                  collabList
                    ? collabList.length > 0
                      ? collabList
                      : ["Please create a new Collab!"]
                    : ["Loading... please wait!"]
                }
                label="Collab"
                value={
                  collabList
                    ? collabList.length > 0
                      ? this.state.collab_id
                      : "Please create a new Collab!"
                    : "Loading... please wait!"
                }
                helperText="Select a host Collab for this live paper"
                handleChange={this.handleCollabIDChange}
                disabled={!(collabList && collabList.length > 0)}
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
                  <strong>Live paper title:</strong>
                  <br />
                  The live paper title would be used for identifying this live
                  paper when loading existing projects. If, during development,
                  you wish to create multiple versions of the same live paper,
                  please use different live paper titles for each.
                </p>
              </div>
              <div>
                <TextField
                  label="Live Paper Title"
                  variant="outlined"
                  fullWidth={true}
                  name="password"
                  value={this.state.live_paper_title}
                  onChange={this.handleLivePaperNameChange}
                  InputProps={{
                    style: {
                      padding: "5px 15px",
                      width: "75%",
                    },
                  }}
                />
              </div>
              {!this.state.live_paper_title && (
                <div style={{ color: "red", paddingTop: "10px" }}>
                  <strong>A Live Paper title must be specified!</strong>
                </div>
              )}
              {this.state.live_paper_title &&
                this.state.live_paper_title_unique === false && (
                  <div style={{ color: "red", paddingTop: "10px" }}>
                    <strong>
                      The live paper title '
                      <pre style={{ display: "inline" }}>
                        {this.state.live_paper_title}
                      </pre>
                      ' is already us use by another live paper. Please enter a
                      different name.
                    </strong>
                  </div>
                )}
            </Box>
            {this.props.data.id && (
              <Box my={3}>
                <div>
                  <p>
                    <strong>
                      This live paper has previously been saved on the Knowledge
                      Graph. Overwrite the existing entry, or save as new entry:
                    </strong>
                  </p>
                </div>
                <div>
                  <SwitchMultiWay
                    values={["Save to Existing", "Save as New"]}
                    selected={this.state.mode}
                    onChange={this.handleModeChange}
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
              <Button
                variant="contained"
                color="primary"
                style={{
                  width: "20%",
                  backgroundColor:
                    this.state.collab_id && this.state.live_paper_title
                      ? "#4DC26D"
                      : "#FFFFFF",
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
