import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import { withSnackbar } from "notistack";

import { withStyles } from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

import DynamicTable from "./DynamicTable";
import SingleSelect from "./SingleSelect";

import nunjucks from "nunjucks";
import LivePaper from "./LivePaper.template";

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

const footerStyle = {
  backgroundColor: "#ffd180",
  fontSize: "20px",
  color: "black",
  borderTop: "1px solid #000000",
  textAlign: "center",
  position: "fixed",
  left: "50%",
  transform: "translateX(-50%)",
  bottom: "0",
  height: "70px",
  width: "70%",
  zIndex: "1",
};

const phantomStyle = {
  display: "block",
  padding: "20px",
  height: "60px",
  width: "70%",
};

function Footer({ children }) {
  return (
    <div style={{ zIndex: "2147483638" }}>
      <div style={phantomStyle} />
      <div style={footerStyle}>{children}</div>
    </div>
  );
}

function showNotification(enqueueSnackbar, message, type = "default") {
  // type: default, success, error, warning, info
  enqueueSnackbar(message, {
    variant: type,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "right",
    },
  });
}

function getFormattedTime() {
  var today = new Date();
  var y = today.getFullYear();
  // JavaScript months are 0-based.
  var m = today.getMonth() + 1;
  var d = today.getDate();
  var h = today.getHours();
  var mi = today.getMinutes();
  var s = today.getSeconds();
  return (
    y.toString() +
    m.toString() +
    d.toString() +
    "_" +
    h.toString() +
    mi.toString() +
    s.toString()
  );
}

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

const popular_licenses = [
  "None",
  "Apache License 2.0",
  'BSD 2-Clause "Simplified" License',
  'BSD 3-Clause "New" or "Revised" License',
  "Creative Commons Attribution 4.0 International",
  "Creative Commons Attribution Non Commercial 4.0 International",
  "Creative Commons Attribution Share Alike 4.0 International",
  "Creative Commons Zero v1.0 Universal",
  "GNU General Public License v2.0 or later",
  "GNU General Public License v3.0 or later",
  "GNU Lesser General Public License v3.0 or later",
  "MIT License",
];

class CreateLivePaper extends React.Component {
  constructor(props) {
    super(props);

    if (this.props.data === "") {
      this.state = {
        page_title: "",
        authors_string: "",
        affiliations_string: "",
        authors: [{ firstname: "", lastname: "", affiliation: "" }],
        corresponding_author: { firstname: "", lastname: "", email: "" },
        year: new Date(),
        paper_title: "",
        journal: "",
        url: "",
        citation: "",
        doi: "",
        license: "None",
        abstract: "",
      };
    } else {
      this.state = {
        ...props.data,
      };
    }

    this.handleClose = this.handleClose.bind(this);
    this.handleDownloadLivePaper = this.handleDownloadLivePaper.bind(this);
    this.handlePreviewLivePaper = this.handlePreviewLivePaper.bind(this);
    this.handleSaveProject = this.handleSaveProject.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleYearChange = this.handleYearChange.bind(this);
    this.handleAuthorsChange = this.handleAuthorsChange.bind(this);
    this.makePageTitleString = this.makePageTitleString.bind(this);
    this.makeAuthorsString = this.makeAuthorsString.bind(this);
    this.makeAffiliationsString = this.makeAffiliationsString.bind(this);
  }

  handleClose() {
    this.props.onClose();
  }

  handleDownloadLivePaper() {
    this.makeAuthorsString();
    this.makeAffiliationsString();

    function render(data) {
      fetch(LivePaper)
        .then((r) => r.text())
        .then((source) => {
          var output = nunjucks.renderString(source, data);

          const element = document.createElement("a");
          const file = new Blob([output], { type: "text/html" });
          element.href = URL.createObjectURL(file);
          element.download = "livepaper_" + getFormattedTime() + ".html";
          document.body.appendChild(element); // Required for this to work in FireFox
          element.click();
        });
    }
    render(this.state);

    showNotification(
      this.props.enqueueSnackbar,
      "Live Paper downloaded...",
      "success"
    );
  }

  async handlePreviewLivePaper() {
    let first = new Promise((resolve, reject) => {
      this.makeAuthorsString();
      resolve();
    });

    let second = new Promise((resolve, reject) => {
      this.makeAffiliationsString();
      resolve();
    });

    let third = new Promise((resolve, reject) => {
      this.makePageTitleString();
      resolve();
    });

    await Promise.all([first, second, third]);

    function render(data) {
      fetch(LivePaper)
        .then((r) => r.text())
        .then((source) => {
          var output = nunjucks.renderString(source, data);
          var w = window.open("");
          w.document.write(output);
          w.document.close();
        });
    }
    var data = this.state;
    render(data);

    showNotification(
      this.props.enqueueSnackbar,
      "Preview generated...",
      "info"
    );
  }

  handleSaveProject() {
    // create JSON object with live paper info
    const lp_data = JSON.stringify(this.state, null, 4);
    const blob = new Blob([lp_data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "livepaper_" + getFormattedTime() + ".lpp";
    link.href = url;
    link.click();

    showNotification(
      this.props.enqueueSnackbar,
      "Project downloaded...",
      "success"
    );
  }

  handleFieldChange(event) {
    console.log(event);
    const target = event.target;
    let value = target.value;
    const name = target.name;
    console.log(name + " => " + value);
    this.setState({
      [name]: value,
    });
  }

  handleYearChange(value) {
    this.setState({ year: value._d });
  }

  handleAuthorsChange(data) {
    // remove all entries where firstname and lastname both are empty
    function isNotEmpty(item) {
      if (item.firstname.trim() !== "" || item.lastname.trim() !== "") {
        return true;
      } else return false;
    }
    var author_data = data.filter(isNotEmpty);

    if (author_data.length === 0) {
      author_data = [{ firstname: "", lastname: "", affiliation: "" }];
    }
    this.setState({
      authors: author_data,
    });

    this.makePageTitleString();
    this.makeAuthorsString();
    this.makeAffiliationsString();
  }

  makePageTitleString() {
    return new Promise((resolve) => {
      const author_data = this.state.authors;
      var page_title = "";
      if (author_data.length === 0) {
        page_title = "";
      } else if (author_data.length === 1) {
        page_title =
          author_data[0].lastname + " " + this.state.year.getFullYear();
      } else if (author_data.length === 2) {
        page_title =
          author_data[0].lastname +
          " & " +
          author_data[1].lastname +
          " " +
          this.state.year;
      } else {
        page_title =
          author_data[0].lastname + " et al. " + this.state.year.getFullYear();
      }

      this.setState({
        page_title: page_title,
      });
    });
  }

  makeAuthorsString() {
    return new Promise((resolve) => {
      var data_string = "";
      this.state.authors.forEach(function (author, index) {
        if (index > 0) {
          data_string = data_string + ", ";
        }
        data_string =
          data_string +
          author.firstname +
          " " +
          author.lastname +
          " " +
          (index + 1).toString().sup();
      });
      this.setState({
        authors_string: data_string,
      });
    });
  }

  makeAffiliationsString() {
    return new Promise((resolve) => {
      var unique_affs = [];
      this.state.authors.forEach(function (item) {
        var affs = item.affiliation.split(";").map(function (x) {
          return x.trim();
        });
        affs.forEach(function (aff) {
          if (!unique_affs.includes(aff)) {
            unique_affs.push(aff);
          }
        });
      });
      // add superscript numbering to each affiliation
      unique_affs.forEach(function (aff, index) {
        this[index] = (index + 1).toString().sup() + " " + aff;
      }, unique_affs);
      var data_string = unique_affs.join(", ");
      this.setState({
        affiliations_string: data_string,
      });
    });
  }

  render() {
    // console.log(this.state.paper_title);

    return (
      <Dialog
        fullScreen
        onClose={this.handleClose}
        aria-labelledby="simple-dialog-title"
        // open={true}
        open={this.props.open}
      >
        <MyDialogTitle onClose={this.handleClose} />
        <DialogContent>
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
                Please enter the information in the fields below. You can
                generate the live paper and/or save the project at any time by
                clicking on the buttons on the bottom of the page.
                <br />
                <br />
                When saving the project, a file with extension '.lpp' will be
                downloaded. You can upload this file later to update the live
                paper contents. Please do not manually edit these files, as it
                could render them unreadable by this tool.
              </div>
              <br />
              <div>
                <p>
                  <strong>
                    Enter the complete title of your manuscript / paper:
                  </strong>
                </p>
              </div>
              <div>
                <TextField
                  label="Title"
                  variant="outlined"
                  fullWidth={true}
                  name="paper_title"
                  value={this.state.paper_title}
                  onChange={this.handleFieldChange}
                  InputProps={{
                    style: {
                      padding: "5px 15px",
                    },
                  }}
                />
              </div>
              <br />
              <div>
                <p>
                  <strong>
                    Enter the year of publication (if unpublished, leave
                    unchanged):
                  </strong>
                </p>
              </div>
              <div>
                <div>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DatePicker
                      label="Year"
                      inputVariant="outlined"
                      views={["year"]}
                      label="year"
                      value={this.state.year}
                      minDate={
                        new Date("2010", "01", "01", "00", "00", "00", "0")
                      }
                      maxDate={new Date()}
                      onChange={this.handleYearChange}
                      animateYearScrolling
                      InputProps={{
                        style: {
                          borderBottom: "0px",
                          padding: "5px 15px 5px 15px",
                          width: "100px",
                        },
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </div>
              </div>
              <br />
              <div>
                <p>
                  <strong>
                    Enter details of all authors in the required order:
                  </strong>
                </p>
              </div>
              <div>
                <DynamicTable
                  value={this.state.authors}
                  onChangeValue={this.handleAuthorsChange}
                />
              </div>
              <br />
              <br />
              <div>
                <p>
                  <strong>
                    Specify the corresponding author, along with their email
                    address:
                  </strong>
                </p>
              </div>
              <div>
                <SingleSelect
                  itemNames={
                    this.state.authors
                      ? this.state.authors.map(function (author) {
                          return author.firstname + " " + author.lastname;
                        })
                      : []
                  }
                  label="Corresponding Author"
                  name="corresponding_author"
                  value={
                    this.state.corresponding_author.firstname +
                    " " +
                    this.state.corresponding_author.lastname
                  }
                  handleChange={this.handleFieldChange}
                />
              </div>
              <br />
              <div>
                <TextField
                  label="Corresponding Author Email"
                  variant="outlined"
                  fullWidth={true}
                  name="corresponding_author_email"
                  value={this.state.corresponding_author.email}
                  onChange={this.handleFieldChange}
                  InputProps={{
                    style: {
                      padding: "5px 15px",
                    },
                  }}
                  style={{ width: 700 }}
                />
              </div>
              <br />
              <br />
              <div>
                <p>
                  <strong>
                    Specify the journal in which paper is published (leave empty
                    if awaiting publication):
                  </strong>
                </p>
              </div>
              <div>
                <TextField
                  label="Journal"
                  variant="outlined"
                  fullWidth={true}
                  name="journal"
                  value={this.state.journal}
                  onChange={this.handleFieldChange}
                  InputProps={{
                    style: {
                      padding: "5px 15px",
                    },
                  }}
                />
              </div>
              <div>
                <p>
                  <strong>
                    Provide the URL to access article (leave empty if awaiting
                    publication or link to bioRxiv, if relevant):
                  </strong>
                </p>
              </div>
              <div>
                <TextField
                  label="Article URL"
                  variant="outlined"
                  fullWidth={true}
                  name="url"
                  value={this.state.url}
                  onChange={this.handleFieldChange}
                  InputProps={{
                    style: {
                      padding: "5px 15px",
                    },
                  }}
                />
              </div>
              <div>
                <p>
                  <strong>
                    Specify the citation text to be used for article (leave
                    empty if awaiting publication):
                  </strong>
                </p>
              </div>
              <div>
                <TextField
                  multiline
                  rows="3"
                  label="Citation"
                  variant="outlined"
                  fullWidth={true}
                  name="citation"
                  value={this.state.citation}
                  onChange={this.handleFieldChange}
                  InputProps={{
                    style: {
                      padding: "15px 15px",
                    },
                  }}
                />
              </div>
              <div>
                <p>
                  <strong>
                    Indicate the DOI entry for article (leave empty if awaiting
                    publication):
                  </strong>
                </p>
              </div>
              <div>
                <TextField
                  label="DOI"
                  variant="outlined"
                  fullWidth={true}
                  name="doi"
                  value={this.state.doi}
                  onChange={this.handleFieldChange}
                  InputProps={{
                    style: {
                      padding: "5px 15px",
                    },
                  }}
                />
              </div>
              <br />
              <div>
                <p>
                  <strong>
                    Provide the abstract of your manuscript / paper:
                  </strong>
                </p>
              </div>
              <div>
                <Grid item xs={12}>
                  <TextField
                    multiline
                    rows="8"
                    label="Abstract"
                    variant="outlined"
                    fullWidth={true}
                    helperText="The description may be formatted with Markdown"
                    name="abstract"
                    value={this.state.abstract}
                    onChange={this.handleFieldChange}
                    InputProps={{
                      style: {
                        padding: "15px 15px",
                      },
                    }}
                  />
                </Grid>
              </div>
              <br />
              <br />
              <div>
                <p>
                  <strong>
                    Specify the license to be applied for the contents displayed
                    in this live paper:
                  </strong>
                </p>
              </div>
              <div>
                <SingleSelect
                  itemNames={popular_licenses}
                  label="License"
                  name="license"
                  value={this.state.license}
                  handleChange={this.handleFieldChange}
                  helperText="For guidance on choosing a licence, see https://choosealicense.com"
                />
              </div>

              <br />
              <br />

              <h5>Resources</h5>
              <p>Add a line of description:</p>
              <ul className="collapsible" data-collapsible="expandable">
                <li className="active">
                  <div className="collapsible-header amber lighten-5">
                    <i className="material-icons">settings_input_antenna</i>Add
                    heading
                  </div>
                  <div className="collapsible-body ">Add content here</div>
                </li>
                <li>
                  <div className="collapsible-header amber lighten-5">
                    <i className="material-icons">timeline</i>Add heading
                  </div>
                  <div className="collapsible-body">Add content here</div>
                </li>
                <li>
                  <div className="collapsible-header amber lighten-5">
                    <i className="material-icons">note_add</i>Add heading
                  </div>
                  <div className="collapsible-body">Add content here</div>
                </li>
                <li>
                  <div className="collapsible-header amber lighten-5">
                    <i className="material-icons">local_play</i>Add heading
                  </div>
                  <div className="collapsible-body">Add content here</div>
                </li>
              </ul>
              <br />
              <br />
            </div>
          </div>
          <Footer>
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
                  width: "25%",
                  backgroundColor: "#FF9800",
                  color: "#000000",
                  fontWeight: "bold",
                }}
                onClick={this.handlePreviewLivePaper}
              >
                Preview Live Paper
              </Button>
              <br />
              <br />
              <Button
                variant="contained"
                color="primary"
                style={{
                  width: "25%",
                  backgroundColor: "#009688",
                  color: "#000000",
                  fontWeight: "bold",
                }}
                onClick={this.handleDownloadLivePaper}
              >
                Download Live Paper
              </Button>
              <br />
              <br />
              <Button
                variant="contained"
                color="secondary"
                style={{
                  width: "25%",
                  backgroundColor: "#01579b",
                  fontWeight: "bold",
                }}
                onClick={this.handleSaveProject}
              >
                Save & Download Project
              </Button>
            </div>
          </Footer>
        </DialogContent>
      </Dialog>
    );
  }
}
export default withSnackbar(CreateLivePaper);
