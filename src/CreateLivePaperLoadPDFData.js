import React from "react";
import axios from "axios";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Paper from "@material-ui/core/Paper";
import { withSnackbar } from "notistack";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CreateLivePaper from "./CreateLivePaper";
import LoadingIndicatorModal from "./LoadingIndicatorModal";
import ErrorDialog from "./ErrorDialog";

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

// function showNotification(enqueueSnackbar, message, type = "default") {
//   // type: default, success, error, warning, info
//   enqueueSnackbar(message, {
//     variant: type,
//     anchorOrigin: {
//       vertical: "bottom",
//       horizontal: "right",
//     },
//   });
// }

const MyDialogTitle = withStyles(styles)((props) => {
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
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

class CreateLivePaperLoadPDFData extends React.Component {
  signal = axios.CancelToken.source();
  constructor(props) {
    super(props);

    this.state = {
      data: this.props.data,
      loadData: this.props.loadData,
      showError: false,
      loadPDF: true,
      selectedPDF: null,
      dataFromPDF: {},
      loading: false,
    };

    this.loadPDFRef = React.createRef();
    this.handleClose = this.handleClose.bind(this);
    this.browseForPDF = this.browseForPDF.bind(this);
    this.onPDFSelect = this.onPDFSelect.bind(this);
    this.cancelSelectPDF = this.cancelSelectPDF.bind(this);
    this.uploadPDF = this.uploadPDF.bind(this);
    this.displayDataPDF = this.displayDataPDF.bind(this);
    this.proceed = this.proceed.bind(this);
    this.skipContinue = this.skipContinue.bind(this);
    this.handleErrorDialogClose = this.handleErrorDialogClose.bind(this);
  }

  handleClose() {
    this.props.onClose();
  }

  browseForPDF() {
    this.setState({ loadPDF: true }, () => {
      this.loadPDFRef.current.click();
    });
  }

  onPDFSelect(event) {
    if (event.target.files.length === 1) {
      this.setState({
        selectedPDF: event.target.files[0],
      });
    } else {
      this.setState({ selectedPDF: null, dataFromPDF: {} });
    }
  }

  cancelSelectPDF() {
    this.loadPDFRef.current.value = "";
    this.setState({
      selectedPDF: null,
      dataFromPDF: {},
    });
  }

  uploadPDF() {
    this.setState({ loading: true }, () => {
      var formData = new FormData();
      formData.append("input", this.state.selectedPDF);
      formData.append("consolidateHeader", 1);
      formData.append("includeRawAffiliations", 1);

      let url =
        "https://cloud.science-miner.com/grobid/api/processHeaderDocument";
      let config = {
        cancelToken: this.signal.token,
        headers: {
          "Content-Type": "multipart/form-data",
          accept: "text/plain, */*",
        },
      };

      let scope = this;
      axios
        .post(url, formData, config)
        .then((res) => {
          var parseString = require("xml2js").parseString;
          parseString(
            res.data,
            { trim: true, preserveChildrenOrder: true },
            function (err, result) {
              console.log(result);

              let data = {};
              data["paper_title"] =
                result["TEI"]["teiHeader"][0]["fileDesc"][0]["titleStmt"][0][
                  "title"
                ][0]["_"];
              data["abstract"] =
                result["TEI"]["teiHeader"][0]["profileDesc"][0]["abstract"][0][
                  "p"
                ][0];
              data["doi"] =
                "https://doi.org/" +
                result["TEI"]["teiHeader"][0]["fileDesc"][0]["sourceDesc"][0][
                  "biblStruct"
                ][0]["idno"][0]["_"];

              let author_dict =
                result["TEI"]["teiHeader"][0]["fileDesc"][0]["sourceDesc"][0][
                  "biblStruct"
                ][0]["analytic"][0]["author"];

              let corresp_author = {
                firstname: "",
                lastname: "",
                email: "",
              };
              let author_data = [];
              author_dict.forEach(function (item) {
                console.log(item);
                let aff = "";
                if ("affiliation" in item) {
                  aff = item["affiliation"]
                    .map(function (elem) {
                      return elem["note"][0]["_"].replace(/,\s*$/, "");
                    })
                    .join("; ");
                }
                if ("$" in item && item["$"]["role"] === "corresp") {
                  corresp_author = {
                    firstname:
                      item["persName"][0]["forename"].length === 1
                        ? item["persName"][0]["forename"][0]["_"]
                        : item["persName"][0]["forename"][0]["_"] +
                          " " +
                          item["persName"][0]["forename"][1]["_"]
                            .split(" ")
                            .join(".") +
                          ".",
                    lastname: item["persName"][0]["surname"][0],
                    email: "email" in item ? item["email"][0] : "",
                  };
                }
                author_data.push({
                  firstname:
                    item["persName"][0]["forename"].length === 1
                      ? item["persName"][0]["forename"][0]["_"]
                      : item["persName"][0]["forename"][0]["_"] +
                        " " +
                        item["persName"][0]["forename"][1]["_"]
                          .split(" ")
                          .join(".") +
                        ".",
                  lastname: item["persName"][0]["surname"][0],
                  affiliation: aff,
                });
              });

              data["authors"] = author_data;
              data["corresponding_author"] = corresp_author;

              data["journal"] = result["TEI"]["teiHeader"][0]["fileDesc"][0][
                "sourceDesc"
              ][0]["biblStruct"][0]["monogr"][0]["title"].find(
                (element) => element["$"]["type"] === "main"
              )["_"];

              try {
                //   date also available at:
                // result["TEI"]["teiHeader"][0]["fileDesc"][0]["sourceDesc"][0][
                //    "biblStruct"][0]["monogr"][0]["imprint"][0]["date"][0]["$"]["when"]
                data["year"] = new Date(
                  result["TEI"]["teiHeader"][0]["fileDesc"][0][
                    "publicationStmt"
                  ][0]["date"][0]["$"]["when"]
                );
              } catch (error) {
                console.log("Could not identify year!");
              }

              try {
                data["url"] =
                  result["TEI"]["teiHeader"][0]["fileDesc"][0]["sourceDesc"][0][
                    "biblStruct"
                  ][0]["ptr"][0]["$"]["target"];
              } catch (error) {
                console.log("Could not identify download URL!");
              }

              scope.setState({ dataFromPDF: data, loading: false });
            }
          );
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            console.log("Error: ", err.message);
          } else {
            console.log(err);
            console.log(err.response);
            this.setState({ showError: true });
          }
          this.setState({ loading: false });
        });
    });
  }

  displayDataPDF() {
    return (
      <div
        style={{
          marginTop: "40px",
          marginBottom: "40px",
        }}
      >
        <h6>
          <strong>Data extracted from selected PDF</strong>
        </h6>
        <strong>Note: </strong>We make use of{" "}
        <i>
          <a href="https://github.com/kermitt2/grobid">GROBID</a>
        </i>{" "}
        for extracting the required info from the uploaded PDF file. As this is
        an automated process, it could result in certain discrepancies. We urge
        you to verify the extracted info, and rectify them wherever necessary on
        the live paper creation page (after clicking 'Proceed').
        <Paper
          variant="outlined"
          elevation={3}
          style={{
            marginTop: "30px",
            padding: "20px",
            backgroundColor: "#FBEFDD",
          }}
        >
          {"paper_title" in this.state.dataFromPDF && (
            <div>
              <strong>Title: </strong>
              {this.state.dataFromPDF["paper_title"]}
              <br />
              <br />
            </div>
          )}
          {"authors" in this.state.dataFromPDF ? (
            <div>
              <strong>Authors </strong>
              (count = {this.state.dataFromPDF["authors"].length})
              <br />
              <br />
              {this.state.dataFromPDF["authors"].map((entry, i) => (
                <div key={i}>
                  <strong>
                    <i>{i + 1})</i>
                  </strong>
                  &nbsp;&nbsp;
                  <strong>FirstName: </strong>
                  {entry.firstname}
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <strong>LastName: </strong>
                  {entry.lastname}
                  <br />
                  {entry.affiliation === "" ? (
                    <div style={{ color: "red", paddingLeft: "3em" }}>
                      <i>Could not identify affiliation(s)!</i>
                    </div>
                  ) : (
                    entry.affiliation.split("; ").map((aff, j) => (
                      <div
                        key={j}
                        style={{
                          paddingLeft: "3em",
                          paddingRight: "1.5em",
                          textIndent: "-1.5em",
                        }}
                      >
                        - {aff}
                      </div>
                    ))
                  )}
                  <br />
                </div>
              ))}
              <br />
            </div>
          ) : (
            ""
          )}
          {"corresponding_author" in this.state.dataFromPDF && (
            <div>
              <strong>Corresponding Author: </strong>
              <br />
              {this.state.dataFromPDF["corresponding_author"]["firstname"] +
                " " +
                this.state.dataFromPDF["corresponding_author"]["lastname"] +
                " (" +
                this.state.dataFromPDF["corresponding_author"]["email"] +
                ")"}
              <br />
              <br />
            </div>
          )}
          {"journal" in this.state.dataFromPDF && (
            <div>
              <strong>Journal: </strong>
              <br />
              {this.state.dataFromPDF["journal"]}
              <br />
              <br />
            </div>
          )}
          {"year" in this.state.dataFromPDF && (
            <div>
              <strong>Year: </strong>
              <br />
              {this.state.dataFromPDF["year"].getFullYear()}
              <br />
              <br />
            </div>
          )}
          {"abstract" in this.state.dataFromPDF && (
            <div>
              <strong>Abstract: </strong>
              <br />
              {this.state.dataFromPDF["abstract"]}
              <br />
              <br />
            </div>
          )}
          {"doi" in this.state.dataFromPDF && (
            <div>
              <strong>DOI: </strong>
              <br />
              {this.state.dataFromPDF["doi"]}
              <br />
              <br />
            </div>
          )}
          {"url" in this.state.dataFromPDF && (
            <div>
              <strong>Article URL: </strong>
              <br />
              {this.state.dataFromPDF["url"]}
              <br />
              <br />
            </div>
          )}
        </Paper>
        <div style={{ paddingRight: "20px" }}>
          <div
            style={{ flex: 1, flexDirection: "row-reverse", float: "right" }}
          >
            <div style={{ float: "right", paddingTop: "20px" }}>
              <Button
                variant="contained"
                color="primary"
                style={{
                  backgroundColor: "#3F51B5",
                  color: "#FFFFFF",
                  fontWeight: "bold",
                }}
                onClick={this.proceed}
              >
                Proceed
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  proceed() {
    this.setState({
      loadData: true,
    });
  }

  skipContinue() {
    this.setState({
      loadPDF: false,
    });
  }

  handleErrorDialogClose() {
    this.setState({ showError: false });
  }

  render() {
    console.log(this.state);

    var errorMessage = "";
    if (this.state.showError) {
      errorMessage = (
        <ErrorDialog
          open={Boolean(this.state.showError)}
          handleErrorDialogClose={this.handleErrorDialogClose}
          error={"We were unable to extract info from the specified PDF.\n\nPlease report this at:\nhttps://github.com/appukuttan-shailesh/live-paper-builder/issues"}
        />
      );
    }

    var fileExplorer = "";
    if (this.state.loadPDF) {
      fileExplorer = (
        <input
          id="fileInput"
          type="file"
          ref={this.loadPDFRef}
          style={{ display: "none" }}
          accept=".pdf"
          onChange={this.onPDFSelect}
        />
      );
    }

    var showSelectedPDF = "";
    if (this.state.selectedPDF) {
      showSelectedPDF = (
        <div>
          <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
            <TextField
              label="Selected PDF"
              variant="outlined"
              fullWidth={true}
              name="pdf_file"
              value={this.state.selectedPDF.name}
              onChange={this.handleFieldChange}
              InputProps={{
                readOnly: true,
                style: {
                  padding: "5px 15px",
                },
              }}
            />
          </div>
          <div style={{ paddingRight: "20px" }}>
            <div
              style={{ flex: 1, flexDirection: "row-reverse", float: "right" }}
            >
              <div style={{ float: "right", paddingTop: "10px" }}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    backgroundColor: "#3F51B5",
                    color: "#FFFFFF",
                    fontWeight: "bold",
                    padding: "10px",
                  }}
                  onClick={this.uploadPDF}
                >
                  Upload
                </Button>
              </div>
              <div
                style={{
                  float: "right",
                  paddingTop: "10px",
                  paddingRight: "20px",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    backgroundColor: "#E27300",
                    color: "#FFFFFF",
                    fontWeight: "bold",
                    padding: "10px",
                  }}
                  onClick={this.cancelSelectPDF}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
          <br />
          <br />
          <div>
            {Object.keys(this.state.dataFromPDF).length > 1
              ? this.displayDataPDF()
              : ""}
          </div>
          <br />
          <br />
        </div>
      );
    }

    if (!this.state.loadData && this.state.loadPDF) {
      return (
        <Dialog
          fullScreen
          disableBackdropClick
          disableEscapeKeyDown
          onClose={this.handleClose}
          aria-labelledby="simple-dialog-title"
          open={this.props.open}
        >
          <MyDialogTitle onClose={this.handleClose} />
          <DialogContent>
            <LoadingIndicatorModal open={this.state.loading} />
            <div className="container" style={{ textAlign: "left" }}>
              <div className="box rounded centered">
                <a
                  href="../../index.html"
                  className="waves-effect waves-light"
                  style={{ textAlign: "center", color: "black" }}
                >
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <img
                            className="hbp-icon-small"
                            src="./imgs/hbp_diamond_120.png"
                            alt="HBP logo"
                          />
                        </td>
                        <td>
                          <span
                            className="title-style subtitle"
                            style={{ paddingLeft: "5px" }}
                          >
                            EBRAINS Live Papers
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </a>
                <h5 className="title-style">Live Paper Builder</h5>
              </div>
              <div
                style={{
                  paddingLeft: "5%",
                  paddingRight: "5%",
                  textAlign: "justify",
                }}
              >
                <div>
                  You can start the live paper creation process by uploading the
                  PDF file of the corresponding paper. We will try to extract
                  required metadata such as title, author, affiliations,
                  abstract and DOI from the uploaded file. To do so click on
                  'Browse' and select the PDF file in the file browser pop-up.
                  Once selected, click 'Upload' to begin the extraction process.
                  When complete, the extracted info is displayed on the page for
                  you to verify. You can then click 'Proceed' (scroll to bottom
                  of page) to be redirected to the live paper creation page with
                  the extracted info auto-populated into their respective
                  fields.
                  <br />
                  <br />
                  Alternatively, you can click on 'Skip' to start the live paper
                  creation process with a blank slate.
                </div>
                <br />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      width: "40%",
                      backgroundColor: "#009688",
                      color: "#000000",
                      fontWeight: "bold",
                    }}
                    onClick={this.browseForPDF}
                  >
                    Browse
                  </Button>
                  <br />
                  <br />
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{
                      width: "40%",
                      backgroundColor: "#E57373",
                      color: "#000000",
                      fontWeight: "bold",
                    }}
                    onClick={this.skipContinue}
                  >
                    Skip
                  </Button>
                </div>
                <br />
                <br />
                {showSelectedPDF}
                <div className="rainbow-row">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <br />
                <br />
              </div>
              {fileExplorer}
              {errorMessage}
            </div>
          </DialogContent>
        </Dialog>
      );
    } else {
      return (
        <CreateLivePaper
          open={true}
          onClose={this.props.onClose}
          data={
            this.props.loadData
              ? this.state.data // for loading saved project data (.lpp file)
              : this.state.loadData
              ? { ...this.state.data, ...this.state.dataFromPDF } // for loading PDF data
              : {} // no data to be loaded
          }
          loadData={this.state.loadData}
        />
      );
    }
  }
}
export default withSnackbar(CreateLivePaperLoadPDFData);
