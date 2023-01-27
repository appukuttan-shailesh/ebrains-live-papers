import React from "react";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Paper from "@mui/material/Paper";
import { withSnackbar } from "notistack";
import { withStyles } from "@mui/styles";
import MuiDialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CreateLivePaper from "./CreateLivePaper";
import LoadingIndicatorModal from "./LoadingIndicatorModal";
import ErrorDialog from "./ErrorDialog";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { livePaperPlatformUrl, livePaperDocsUrl } from "./globals";

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
      loadPDF: true, // default state
      selectedPDF: null,
      dataExtracted: {},
      loadDOI: false,
      articleDOI: "",
      loading: false,
    };

    this.loadPDFRef = React.createRef();
    this.handleClose = this.handleClose.bind(this);
    this.browseForPDF = this.browseForPDF.bind(this);
    this.acceptDOI = this.acceptDOI.bind(this);
    this.onPDFSelect = this.onPDFSelect.bind(this);
    this.cancelSelectPDF = this.cancelSelectPDF.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.retrieveDOI = this.retrieveDOI.bind(this);
    this.cancelDOI = this.cancelDOI.bind(this);
    this.uploadPDF = this.uploadPDF.bind(this);
    this.displayDataExtracted = this.displayDataExtracted.bind(this);
    this.proceed = this.proceed.bind(this);
    this.skipContinue = this.skipContinue.bind(this);
    this.handleErrorDialogClose = this.handleErrorDialogClose.bind(this);
  }

  handleClose() {
    this.props.onClose();
  }

  browseForPDF() {
    this.setState(
      {
        loadDOI: false,
        loadPDF: true,
      },
      () => {
        this.loadPDFRef.current.click();
      }
    );
  }

  acceptDOI() {
    this.setState({
      loadDOI: true,
      loadPDF: false,
      selectedPDF: null,
      dataExtracted: {},
    });
  }

  onPDFSelect(event) {
    if (event.target.files.length === 1) {
      this.setState({
        selectedPDF: event.target.files[0],
      });
    } else {
      this.setState({ selectedPDF: null, dataExtracted: {} });
    }
  }

  cancelSelectPDF() {
    this.loadPDFRef.current.value = "";
    this.setState({
      selectedPDF: null,
      dataExtracted: {},
    });
  }

  handleFieldChange(event) {
    const target = event.target;
    let value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  retrieveDOI() {
    this.setState({ loading: true }, () => {
      let scope = this;
      axios
        .get(
          "https://api.crossref.org/works/" +
            this.state.articleDOI.split(".org/")[1]
        )
        .then((res) => {
          console.log(res);
          let result = res.data.message;
          let data = {};
          data["associated_paper_title"] = result["title"][0];
          data["live_paper_title"] = result["title"][0];
          data["associated_paper_doi"] = "https://doi.org/" + result["DOI"];

          let author_data = [];
          result["author"].forEach(function (item) {
            author_data.push({
              firstname: item.given,
              lastname: item.family,
              affiliation: item.affiliation[0] || "",
            });
          });
          data["authors"] = author_data;

          data["journal"] = result["container-title"][0];
          data["associated_paper_volume"] = result["volume"];
          data["associated_paper_issue"] = result["issue"];
          data["associated_paper_pagination"] = result["page"];

          data["year"] = result["created"]["date-time"];

          data["url"] = result["link"][0]["URL"];

          scope.setState({ dataExtracted: data, loading: false });
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

  cancelDOI() {
    this.setState({
      articleDOI: "",
      dataExtracted: {},
      loadDOI: false,
      loadPDF: true, // default state
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
              data["associated_paper_title"] =
                result["TEI"]["teiHeader"][0]["fileDesc"][0]["titleStmt"][0][
                  "title"
                ][0]["_"];
              data["live_paper_title"] =
                result["TEI"]["teiHeader"][0]["fileDesc"][0]["titleStmt"][0][
                  "title"
                ][0]["_"];

              data["abstract"] = "";
              if (
                Object.prototype.hasOwnProperty.call(
                  result["TEI"]["teiHeader"][0]["profileDesc"][0][
                    "abstract"
                  ][0],
                  "p"
                )
              ) {
                data["abstract"] =
                  result["TEI"]["teiHeader"][0]["profileDesc"][0][
                    "abstract"
                  ][0]["p"][0];
              }

              data["associated_paper_doi"] =
                "https://doi.org/" +
                result["TEI"]["teiHeader"][0]["fileDesc"][0]["sourceDesc"][0][
                  "biblStruct"
                ][0]["idno"][0]["_"];

              let author_dict =
                result["TEI"]["teiHeader"][0]["fileDesc"][0]["sourceDesc"][0][
                  "biblStruct"
                ][0]["analytic"][0]["author"];

              let author_data = [];
              let corresp_author = [];
              author_dict.forEach(function (item) {
                // console.log(item);
                let aff = "";
                try {
                  if ("affiliation" in item) {
                    aff = item["affiliation"]
                      .map(function (elem) {
                        // remove commas and semicolons from the end of the string
                        return elem["note"][0]["_"]
                          .replace(/,\s*$/, "")
                          .replace(/;\s*$/, "");
                      })
                      .join("; ");
                  }
                } catch (error) {
                  // do nothing
                }
                if ("$" in item && item["$"]["role"] === "corresp") {
                  corresp_author.push({
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
                    // email: "email" in item ? item["email"][0] : "",
                    affiliation: aff,
                  });
                }
                author_data.push({
                  firstname:
                    "persName" in item &&
                    "forename" in item["persName"][0] &&
                    item["persName"][0]["forename"].length > 0
                      ? item["persName"][0]["forename"].length === 1
                        ? item["persName"][0]["forename"][0]["_"]
                        : item["persName"][0]["forename"][0]["_"] +
                          " " +
                          item["persName"][0]["forename"][1]["_"]
                            .split(" ")
                            .join(".") +
                          "."
                      : "",
                  lastname:
                    "persName" in item &&
                    "surname" in item["persName"][0] &&
                    item["persName"][0]["surname"].length > 0
                      ? item["persName"][0]["surname"][0]
                      : "",
                  affiliation: aff,
                });
              });

              data["authors"] = author_data;
              data["corresponding_author"] = corresp_author;

              data["journal"] = "";
              if (
                Object.prototype.hasOwnProperty.call(
                  result["TEI"]["teiHeader"][0]["fileDesc"][0]["sourceDesc"][0][
                    "biblStruct"
                  ][0]["monogr"][0],
                  "title"
                )
              ) {
                data["journal"] = result["TEI"]["teiHeader"][0]["fileDesc"][0][
                  "sourceDesc"
                ][0]["biblStruct"][0]["monogr"][0]["title"].find(
                  (element) => element["$"]["type"] === "main"
                )["_"];
              }

              // volume, issue
              let vol_iss_page =
                result["TEI"]["teiHeader"][0]["fileDesc"][0]["sourceDesc"][0][
                  "biblStruct"
                ][0]["monogr"][0]["imprint"][0]["biblScope"];
              data["associated_paper_volume"] = vol_iss_page[0];
              data["associated_paper_issue"] = vol_iss_page[1];
              data["associated_paper_pagination"] = vol_iss_page[2];

              try {
                //   date also available at:
                // result["TEI"]["teiHeader"][0]["fileDesc"][0]["sourceDesc"][0][
                //    "biblStruct"][0]["monogr"][0]["imprint"][0]["date"][0]["$"]["when"]
                data["year"] = new Date(
                  result["TEI"]["teiHeader"][0]["fileDesc"][0][
                    "publicationStmt"
                  ][0]["date"][0]["$"]["when"]
                )
                  .toISOString()
                  .replace(
                    /^(?<year>\d+)-(?<month>\d+)-(?<day>\d+)T.*$/,
                    "$<year>-$<month>-$<day>"
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

              scope.setState({ dataExtracted: data, loading: false });
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

  displayDataExtracted() {
    console.log(this.state.dataExtracted);
    return (
      <div
        style={{
          marginTop: "40px",
          marginBottom: "40px",
        }}
      >
        <h6>
          {this.state.loadPDF ? (
            <strong>Data extracted from selected PDF</strong>
          ) : (
            <strong>Data extracted using DOI</strong>
          )}
        </h6>
        {this.state.loadPDF && (
          <div>
            <strong>Note: </strong>We make use of{" "}
            <i>
              <a href="https://github.com/kermitt2/grobid">GROBID</a>
            </i>{" "}
            for extracting the required info from the uploaded PDF file. As this
            is an automated process, it could result in certain discrepancies.
            We urge you to verify the extracted info, and rectify them wherever
            necessary on the live paper creation page (after clicking
            'Proceed').
          </div>
        )}

        <Paper
          variant="outlined"
          elevation={3}
          style={{
            marginTop: "30px",
            padding: "20px",
            backgroundColor: "#EFF7E5",
          }}
        >
          {"associated_paper_title" in this.state.dataExtracted && (
            <div>
              <strong>Title: </strong>
              {this.state.dataExtracted["associated_paper_title"]}
              <br />
              <br />
            </div>
          )}
          {"authors" in this.state.dataExtracted ? (
            <div>
              <strong>Authors </strong>
              (count = {this.state.dataExtracted["authors"].length})
              <br />
              <br />
              {this.state.dataExtracted["authors"].map((entry, i) => (
                <div key={i}>
                  <strong>
                    <i>{i + 1})</i>
                  </strong>
                  &nbsp;&nbsp;
                  <strong>FirstName: </strong>
                  {entry.firstname === "" ? (
                    <span style={{ color: "red" }}>
                      <i>Missing!</i>
                    </span>
                  ) : (
                    entry.firstname
                  )}
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <strong>LastName: </strong>
                  {entry.lastname === "" ? (
                    <span style={{ color: "red" }}>
                      <i>Missing!</i>
                    </span>
                  ) : (
                    entry.lastname
                  )}
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
          {"corresponding_author" in this.state.dataExtracted && (
            <div>
              <strong>Corresponding Author: </strong>
              <br />
              {
                this.state.dataExtracted["corresponding_author"]["firstname"] +
                  " " +
                  this.state.dataExtracted["corresponding_author"]["lastname"]
                //  +
                // " (" +
                // this.state.dataExtracted["corresponding_author"]["email"] +
                // ")"
              }
              <br />
              <br />
            </div>
          )}
          {"journal" in this.state.dataExtracted && (
            <div>
              <strong>Journal: </strong>
              <br />
              {this.state.dataExtracted["journal"]}
              <br />
              <br />
            </div>
          )}
          {"associated_paper_volume" in this.state.dataExtracted && (
            <div>
              <strong>Volume: </strong>
              <br />
              {this.state.dataExtracted["associated_paper_volume"]}
              <br />
              <br />
            </div>
          )}
          {"associated_paper_issue" in this.state.dataExtracted && (
            <div>
              <strong>Issue: </strong>
              <br />
              {this.state.dataExtracted["associated_paper_issue"]}
              <br />
              <br />
            </div>
          )}
          {"associated_paper_pagination" in this.state.dataExtracted && (
            <div>
              <strong>Pagination: </strong>
              <br />
              {this.state.dataExtracted["associated_paper_pagination"]}
              <br />
              <br />
            </div>
          )}
          {"year" in this.state.dataExtracted && (
            <div>
              <strong>Year: </strong>
              <br />
              {this.state.dataExtracted["year"].slice(0, 4)}
              <br />
              <br />
            </div>
          )}
          {"abstract" in this.state.dataExtracted && (
            <div>
              <strong>Abstract: </strong>
              <br />
              {this.state.dataExtracted["abstract"] === "" ? (
                <span style={{ color: "red" }}>
                  <i>Missing!</i>
                </span>
              ) : (
                this.state.dataExtracted["abstract"]
              )}
              <br />
              <br />
            </div>
          )}
          {"associated_paper_doi" in this.state.dataExtracted && (
            <div>
              <strong>Article DOI: </strong>
              <br />
              {this.state.dataExtracted["associated_paper_doi"]}
              <br />
              <br />
            </div>
          )}
          {"url" in this.state.dataExtracted && (
            <div>
              <strong>Article URL: </strong>
              <br />
              {this.state.dataExtracted["url"]}
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
                  width: "150px",
                  backgroundColor: "#4DC26D",
                  color: "#000000",
                  fontWeight: "bold",
                  padding: "10px",
                  border: "solid",
                  borderColor: "#000000",
                  borderWidth: "1px",
                }}
                onClick={this.proceed}
              >
                Proceed
              </Button>
            </div>
          </div>
        </div>
        <br />
      </div>
    );
  }

  proceed() {
    this.setState({
      loadData: true,
    });
  }

  skipContinue() {
    console.log(this.state);
    this.setState({
      loadPDF: false,
      loadDOI: false,
      dataExtracted: {},
      selectedPDF: null,
      articleDOI: "",
    });
  }

  handleErrorDialogClose() {
    this.setState({ showError: false });
  }

  render() {
    // console.log(this.state);
    var errorMessage = "";
    if (this.state.showError) {
      errorMessage = (
        <ErrorDialog
          open={Boolean(this.state.showError)}
          handleErrorDialogClose={this.handleErrorDialogClose}
          error={
            this.state.articleDOI
              ? "We were unable to extract info from the specified DOI.\n\nPlease report this at:\nhttps://github.com/appukuttan-shailesh/live-paper-builder/issues"
              : "We were unable to extract info from the specified PDF.\n\nPlease report this at:\nhttps://github.com/appukuttan-shailesh/live-paper-builder/issues"
          }
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
                    width: "150px",
                    backgroundColor: "#4DC26D",
                    color: "#000000",
                    fontWeight: "bold",
                    padding: "10px",
                    border: "solid",
                    borderColor: "#000000",
                    borderWidth: "1px",
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
                    width: "150px",
                    backgroundColor: "#525252",
                    color: "#FFFFFF",
                    fontWeight: "bold",
                    padding: "10px",
                    border: "solid",
                    borderColor: "#000000",
                    borderWidth: "1px",
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
            {Object.keys(this.state.dataExtracted).length > 1
              ? this.displayDataExtracted()
              : ""}
          </div>
          <br />
          <br />
        </div>
      );
    }

    var showInputDOI = "";
    if (this.state.loadDOI) {
      showInputDOI = (
        <div>
          <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
            <TextField
              label="Specify DOI"
              variant="outlined"
              fullWidth={true}
              name="articleDOI"
              value={this.state.articleDOI}
              onChange={this.handleFieldChange}
              InputProps={{
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
                    width: "150px",
                    backgroundColor: "#4DC26D",
                    color: "#000000",
                    fontWeight: "bold",
                    padding: "10px",
                    border: "solid",
                    borderColor: "#000000",
                    borderWidth: "1px",
                  }}
                  onClick={this.retrieveDOI}
                >
                  Retrieve
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
                    width: "150px",
                    backgroundColor: "#525252",
                    color: "#FFFFFF",
                    fontWeight: "bold",
                    padding: "10px",
                    border: "solid",
                    borderColor: "#000000",
                    borderWidth: "1px",
                  }}
                  onClick={this.cancelDOI}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
          <br />
          <br />
          <div>
            {Object.keys(this.state.dataExtracted).length > 1
              ? this.displayDataExtracted()
              : ""}
          </div>
          <br />
          <br />
        </div>
      );
    }

    if (
      (!this.state.loadData && this.state.loadPDF) ||
      (!this.state.loadData && this.state.loadDOI)
    ) {
      return (
        <Dialog
          fullScreen
          disableEscapeKeyDown
          onClose={this.handleClose}
          aria-labelledby="simple-dialog-title"
          open={this.props.open}
        >
          <MyDialogTitle onClose={this.handleClose} />
          <DialogContent>
            <LoadingIndicatorModal open={this.state.loading} />

            <div className="mycontainer" style={{ textAlign: "left" }}>
              <div
                className="box rounded centered"
                style={{
                  marginTop: "0px",
                  paddingTop: "0.25em",
                  paddingBottom: "0.25em",
                  marginBottom: "1em",
                }}
              >
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "left",
                      paddingLeft: "25px",
                      alignSelf: "center",
                    }}
                  >
                    <Tooltip title={"Open EBRAINS Homepage"}>
                      <a
                        href="https://ebrains.eu/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textAlign: "center" }}
                      >
                        <img
                          src="./imgs/General_logo_Landscape_White.svg"
                          alt="EBRAINS logo"
                          style={{ height: "70px", cursor: "pointer" }}
                        />
                      </a>
                    </Tooltip>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "right",
                      paddingRight: "25px",
                      alignSelf: "center",
                    }}
                  >
                    <Tooltip title={"See Live Papers"}>
                      <a
                        href={livePaperPlatformUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ paddingRight: "10px" }}
                      >
                        <IconButton aria-label="See Live Papers">
                          <LibraryBooksIcon fontSize="large" />
                        </IconButton>
                      </a>
                    </Tooltip>
                    <Tooltip title={"Open Documentation"}>
                      <a
                        href={livePaperDocsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <IconButton aria-label="Open Documentation">
                          <HelpOutlineIcon fontSize="large" />
                        </IconButton>
                      </a>
                    </Tooltip>
                  </div>
                </div>
              </div>
              <div
                style={{
                  paddingLeft: "5%",
                  paddingRight: "5%",
                  textAlign: "justify",
                  fontSize: 16,
                  lineHeight: 1.75,
                  paddingBottom: "20px",
                }}
              >
                <div className="title-solid-style" style={{ fontSize: 44 }}>
                  EBRAINS Live Paper Builder
                </div>
                <div
                  className="title-solid-style"
                  style={{ fontSize: 32, color: "#00A595" }}
                >
                  Quickly create and distribute interactive live papers
                </div>
              </div>
              <div style={{ marginBottom: "40px" }}>
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
              </div>
              <div
                style={{
                  paddingLeft: "5%",
                  paddingRight: "5%",
                  textAlign: "justify",
                }}
              >
                <div>
                  You can start the live paper creation process by either
                  specifying the DOI of the associated publication, or uploading
                  its PDF file. We will use this to try auto-extracting the
                  required metadata.
                  <br />
                  <ul className="collection">
                    <li
                      className="collection-item"
                      style={{ backgroundColor: "#EFF7E5" }}
                    >
                      To extract the metadata using the DOI, click on{" "}
                      <strong>Specify DOI</strong>, input the DOI of the
                      associated publication, and then click 'Retrieve' to fetch
                      the metadata.
                    </li>
                    <li
                      className="collection-item"
                      style={{ backgroundColor: "#EFF7E5" }}
                    >
                      To extract the metadata using the PDF file, click on{" "}
                      <strong>Upload PDF</strong>, select the PDF file in the
                      file browser pop-up, and then click 'Upload' to begin the
                      extraction process.
                    </li>
                  </ul>
                  When completed, the extracted info is displayed on the page
                  for you to verify. You can then click 'Proceed' (scroll to
                  bottom of page) to be redirected to the live paper creation
                  page with the extracted info auto-populated into their
                  respective fields.
                  <br />
                  <br />
                  Alternatively, if the info extracted is not helpful or you
                  wish to enter all the info manually, you can click on 'Skip'
                  to start the live paper creation process with an empty
                  template.
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
                      width: "27.5%",
                      backgroundColor: "#00A595",
                      color: "#000000",
                      fontWeight: "bold",
                      border: "solid",
                      borderColor: "#000000",
                      borderWidth: "1px",
                    }}
                    onClick={this.acceptDOI}
                  >
                    Specify DOI
                  </Button>
                  <br />
                  <br />
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      width: "27.5%",
                      backgroundColor: "#4DC26D",
                      color: "#000000",
                      fontWeight: "bold",
                      border: "solid",
                      borderColor: "#000000",
                      borderWidth: "1px",
                    }}
                    onClick={this.browseForPDF}
                  >
                    Upload PDF
                  </Button>
                  <br />
                  <br />
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{
                      width: "27.5%",
                      backgroundColor: "#9CE142",
                      color: "#000000",
                      fontWeight: "bold",
                      border: "solid",
                      borderColor: "#000000",
                      borderWidth: "1px",
                    }}
                    onClick={this.skipContinue}
                  >
                    Skip
                  </Button>
                </div>
                <br />
                <br />
                {showSelectedPDF}
                {showInputDOI}
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
              ? { ...this.state.data, ...this.state.dataExtracted } // for loading PDF data
              : {} // no data to be loaded
          }
          loadData={this.state.loadData}
        />
      );
    }
  }
}
export default withSnackbar(CreateLivePaperLoadPDFData);
