import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import { withSnackbar } from "notistack";

import { withStyles } from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AcUnitIcon from "@material-ui/icons/AcUnit";
import TimelineIcon from "@material-ui/icons/Timeline";
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import LocalPlayIcon from "@material-ui/icons/LocalPlay";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CloseIcon from "@material-ui/icons/Close";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import axios from "axios";
import axiosRetry from "axios-retry";

import ContextMain from "./ContextMain";
import DynamicTable from "./DynamicTable";
import SingleSelect from "./SingleSelect";
import SectionMorphology from "./SectionMorphology";
import SectionTraces from "./SectionTraces";
import SectionModels from "./SectionModels";
import SectionGeneric from "./SectionGeneric";
import SectionCustom from "./SectionCustom";
import SwitchTwoWay from "./SwitchTwoWay";

import nunjucks from "nunjucks";
import LivePaper from "./LivePaper.njk";
import SaveModal from "./SaveModal";
import SubmitModal from "./SubmitModal";
import { baseUrl, lp_tool_version } from "./globals";
import { showNotification } from "./utils";

axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000;
  },
});

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
  border: "1px solid #000000",
  textAlign: "center",
  position: "fixed",
  left: "50%",
  transform: "translateX(-50%)",
  bottom: "0",
  height: "70px",
  width: "70%",
  zIndex: "1",
  paddingBottom: "75px",
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
  signal = axios.CancelToken.source();
  static contextType = ContextMain;

  constructor(props, context) {
    super(props, context);

    this.state = {
      authors: [{ firstname: "", lastname: "", affiliation: "" }],
      corresponding_author: { firstname: "", lastname: "", affiliation: "" }, // "email" removed
      created_author: [{ firstname: "", lastname: "", affiliation: "" }], // "email" removed; currently only one creating author permitted
      approved_author: { firstname: "", lastname: "", affiliation: "" }, // "email" removed
      year: new Date()
        .toISOString()
        .replace(
          /^(?<year>\d+)-(?<month>\d+)-(?<day>\d+)T.*$/,
          "$<year>-$<month>-$<day>"
        ),
      associated_paper_title: "",
      live_paper_title: "",
      paper_published: true,
      journal: "",
      url: "",
      citation: "",
      doi: "",
      abstract: "",
      license: "None",
      collab_list: null,
      collab_id: "",
      resources_description: "",
      resources: [],
      saveOpen: false,
      submitOpen: false,
    };
    this.state = { ...this.state, ...props.data };

    // const [authContext,] = this.context.auth;

    this.handleClose = this.handleClose.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleSaveOpen = this.handleSaveOpen.bind(this);
    this.handleSaveClose = this.handleSaveClose.bind(this);
    this.handleSubmitOpen = this.handleSubmitOpen.bind(this);
    this.handleSubmitClose = this.handleSubmitClose.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handlePublishedChange = this.handlePublishedChange.bind(this);
    this.handleYearChange = this.handleYearChange.bind(this);
    this.handleAuthorsChange = this.handleAuthorsChange.bind(this);
    this.makePageTitleString = this.makePageTitleString.bind(this);
    this.makeAuthorsString = this.makeAuthorsString.bind(this);
    this.makeAffiliationsString = this.makeAffiliationsString.bind(this);
    this.handleAddSection = this.handleAddSection.bind(this);
    this.storeSectionInfo = this.storeSectionInfo.bind(this);
    this.removeExcessData = this.removeExcessData.bind(this);
    this.addDerivedData = this.addDerivedData.bind(this);
    this.getCollabList = this.getCollabList.bind(this);
    this.setCollabID = this.setCollabID.bind(this);
    this.setLivePaperTitle = this.setLivePaperTitle.bind(this);
    this.verifyDataBeforeSubmit = this.verifyDataBeforeSubmit.bind(this);
    this.checkPersonInStateAuthors = this.checkPersonInStateAuthors.bind(this);
  }

  componentDidMount() {
    this.getCollabList();
  }

  checkPersonInStateAuthors(person) {
    if (typeof person === "string") {
      return this.state.authors.find(
        (author) => author.firstname + " " + author.lastname === person
      );
    } else {
      // if object with keys firstname and lastname
      return this.state.authors.find(
        (author) =>
          author.firstname === person.firstname &&
          author.lastname === person.lastname
      );
    }
  }

  removeExcessData() {
    let req_data = JSON.parse(JSON.stringify(this.state)); // copy by value
    let remove_keys = [
      "saveOpen",
      "submitOpen",
      "collab_list",
      "paper_published",
    ];
    remove_keys.forEach((k) => delete req_data[k]);

    // remove from within resources objects
    for (let res of req_data.resources) {
      let remove_keys = ["dataOk", "showHelp"];
      remove_keys.forEach((k) => delete res[k]);
    }

    return req_data;
  }

  addDerivedData(data) {
    data["page_title"] = this.makePageTitleString();
    data["authors_string"] = this.makeAuthorsString();
    data["affiliations_string"] = this.makeAffiliationsString();
    return data;
  }

  handleClose() {
    this.props.onClose();
  }

  handlePreview() {
    let lp_data = this.addDerivedData(this.removeExcessData(this.state));

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
    console.log(lp_data);
    render(lp_data);

    showNotification(
      this.props.enqueueSnackbar,
      "Preview generated...",
      "info"
    );
  }

  handleDownload() {
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
          const timestamp = new Date()
            .toISOString()
            .replace(/T/, "_") // replace T with a space
            .replaceAll(":", "-") // replace : with -
            .replace(/\..+/, ""); // delete the dot and everything after
          element.download = "livepaper_" + timestamp + ".html";
          document.body.appendChild(element); // Required for this to work in FireFox
          element.click();
        });
    }
    render(this.removeExcessData(this.state));

    showNotification(
      this.props.enqueueSnackbar,
      "HTML file downloaded...",
      "success"
    );

    // create JSON object with live paper info
    let data = {
      lp_tool_version: lp_tool_version,
      modified_date: new Date(),
      ...this.removeExcessData(this.state),
    };
    const lp_data = JSON.stringify(data, null, 4);
    const blob = new Blob([lp_data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const timestamp = new Date()
      .toISOString()
      .replace(/T/, "_") // replace T with a space
      .replaceAll(":", "-") // replace : with -
      .replace(/\..+/, ""); // delete the dot and everything after
    link.download = "livepaper_" + timestamp + ".lpp";
    link.href = url;
    link.click();

    showNotification(
      this.props.enqueueSnackbar,
      ".lpp file downloaded...",
      "success"
    );
  }

  handleSaveOpen() {
    this.setState({
      saveOpen: true,
    });
  }

  handleSaveClose(flag) {
    this.setState({
      saveOpen: false,
    });
    if (flag) {
      showNotification(
        this.props.enqueueSnackbar,
        "Live Paper has been saved on KG!",
        "info"
      );
    }
  }

  handleSubmitOpen() {
    // verifyDataBeforeSubmit() - check all fields as required
    this.setState({
      submitOpen: true,
    });
  }

  handleSubmitClose() {
    this.setState({
      submitOpen: false,
    });
  }

  handleFieldChange(event) {
    const target = event.target;
    let value = target.value;
    const name = target.name;
    console.log(name + " => " + value);
    if (name === "corresponding_author") {
      const c_author = this.checkPersonInStateAuthors(value);
      this.setState((prevState) => ({
        corresponding_author: {
          ...prevState.corresponding_author,
          firstname: c_author.firstname,
          lastname: c_author.lastname,
          affiliation: c_author.affiliation,
        },
      }));
    }
    // else if (name === "corresponding_author_email") {
    //   this.setState((prevState) => ({
    //     corresponding_author: {
    //       ...prevState.corresponding_author,
    //       email: value,
    //     },
    //   }));
    // }
    else if (name === "created_author") {
      if (value === "-- Other Person --") {
        this.setState({
          created_author: [
            {
              firstname: "",
              lastname: "",
              affiliation: "",
              //   email: "",
            },
          ],
          approved_author: {
            firstname: "",
            lastname: "",
            affiliation: "",
            // email: "",
          },
        });
      } else {
        const author = this.checkPersonInStateAuthors(value);
        // let author_email = null;
        // if (
        //   value ===
        //   this.state.corresponding_author.firstname +
        //     " " +
        //     this.state.corresponding_author.lastname
        // ) {
        //   author_email = this.state.corresponding_author.email;
        // }
        this.setState((prevState) => ({
          created_author: [
            {
              firstname: author.firstname,
              lastname: author.lastname,
              affiliation: author.affiliation,
              //   email: author_email ? author_email : "",
            },
          ],
          approved_author: {
            firstname: author.firstname,
            lastname: author.lastname,
            affiliation: author.affiliation,
            // email: author_email ? author_email : "",
          },
        }));
      }
    } else if (name === "created_author_other_firstname") {
      this.setState((prevState) => ({
        created_author: [
          {
            ...prevState.created_author[0],
            firstname: value,
          },
        ],
      }));
    } else if (name === "created_author_other_lastname") {
      this.setState((prevState) => ({
        created_author: [
          {
            ...prevState.created_author[0],
            lastname: value,
          },
        ],
      }));
    } else if (name === "created_author_other_affiliation") {
      this.setState((prevState) => ({
        created_author: [
          {
            ...prevState.created_author[0],
            affiliation: value,
          },
        ],
      }));
    }
    // else if (name === "created_author_email") {
    //   if (this.checkPersonInStateAuthors(this.state.created_author[0])) {
    //     this.setState((prevState) => ({
    //       created_author: [
    //         {
    //           ...prevState.created_author[0],
    //           email: value,
    //         },
    //       ],
    //       approved_author: {
    //         ...prevState.approved_author,
    //         email: value,
    //       },
    //     }));
    //   } else {
    //     this.setState((prevState) => ({
    //       created_author: [
    //         {
    //           ...prevState.created_author[0],
    //           email: value,
    //         },
    //       ],
    //     }));
    //   }
    // }
    else if (name === "approved_author") {
      const author_match = this.checkPersonInStateAuthors(value);
      //   let author_email = null;
      //   if (
      //     value ===
      //     this.state.corresponding_author.firstname +
      //       " " +
      //       this.state.corresponding_author.lastname
      //   ) {
      //     author_email = this.state.corresponding_author.email;
      //   }
      this.setState({
        approved_author: {
          firstname: author_match.firstname,
          lastname: author_match.lastname,
          affiliation: author_match.affiliation,
          //   email: author_email ? author_email : "",
        },
      });
    }
    // else if (name === "approved_author_email") {
    //   this.setState((prevState) => ({
    //     approved_author: {
    //       ...prevState.approved_author,
    //       email: value,
    //     },
    //   }));
    // }
    else {
      this.setState({
        [name]: value,
      });
    }
  }

  handlePublishedChange(value) {
    console.log(value);
    this.setState({
      paper_published: value === "Published" ? true : false,
      year:
        value === "Published"
          ? new Date()
              .toISOString()
              .replace(
                /^(?<year>\d+)-(?<month>\d+)-(?<day>\d+)T.*$/,
                "$<year>-$<month>-$<day>"
              )
          : new Date("9999-01-01")
              .toISOString()
              .replace(
                /^(?<year>\d+)-(?<month>\d+)-(?<day>\d+)T.*$/,
                "$<year>-$<month>-$<day>"
              ),
    });
  }

  handleYearChange(value) {
    console.log(value);
    this.setState({
      year: value
        .toISOString()
        .replace(
          /^(?<year>\d+)-(?<month>\d+)-(?<day>\d+)T.*$/,
          "$<year>-$<month>-$<day>"
        ),
    });
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
  }

  makePageTitleString() {
    const year = new Date(this.state.year).getFullYear();
    const author_data = this.state.authors;
    var page_title = "";
    if (author_data.length === 0) {
      page_title = "";
    } else if (author_data.length === 1) {
      page_title =
        author_data[0].lastname +
        " " +
        (year === 9999 ? "(unpublished)" : year);
    } else if (author_data.length === 2) {
      page_title =
        author_data[0].lastname +
        " & " +
        author_data[1].lastname +
        " " +
        (year === 9999 ? "(unpublished)" : year);
    } else {
      page_title =
        author_data[0].lastname +
        " et al. " +
        (year === 9999 ? "(unpublished)" : year);
    }
    return page_title;
  }

  makeAuthorsString() {
    var authors_string = "";
    this.state.authors.forEach(function (author, index) {
      if (authors_string !== "") {
        authors_string = authors_string + ", ";
      }
      if (author.firstname.trim() !== "" || author.lastname.trim() !== "") {
        authors_string =
          authors_string +
          author.firstname +
          " " +
          author.lastname +
          " " +
          (index + 1).toString().sup();
      }
    });
    return authors_string;
  }

  makeAffiliationsString() {
    var unique_affs = [];
    this.state.authors.forEach(function (item) {
      var affs = item.affiliation.split(";").map(function (x) {
        return x.trim();
      });
      affs.forEach(function (aff) {
        if (aff !== "" && !unique_affs.includes(aff)) {
          unique_affs.push(aff);
        }
      });
    });
    // add superscript numbering to each affiliation
    unique_affs.forEach(function (aff, index) {
      this[index] = (index + 1).toString().sup() + " " + aff;
    }, unique_affs);
    var affiliations_string = unique_affs.join(", ");
    return affiliations_string;
  }

  handleAddSection(section_type) {
    this.setState((prevState) => ({
      resources: [
        ...prevState.resources,
        { order: prevState.resources.length, type: section_type },
      ],
    }));
  }

  storeSectionInfo(data_dict) {
    const resources_items = this.state.resources.slice();
    resources_items[data_dict["order"]] = data_dict;
    this.setState({
      resources: resources_items,
    });
  }

  getCollabList() {
    const url = baseUrl + "/projects";
    const config = {
      cancelToken: this.signal.token,
      headers: { Authorization: "Bearer " + this.context.auth[0].token },
    };
    axios
      .get(url, config)
      .then((res) => {
        let editableProjects = [];
        res.data.forEach((proj) => {
          if (proj.permissions.UPDATE) {
            editableProjects.push(proj.project_id);
          }
        });
        editableProjects.sort();
        this.setState({
          collab_list: editableProjects,
        });
      })
      .catch((err) => {
        console.log("Error: ", err.message);
      });
  }

  setCollabID(value) {
    console.log(value);
    this.setState({
      collab_id: value,
    });
  }

  setLivePaperTitle(value) {
    console.log(value);
    this.setState({
      live_paper_title: value,
    });
  }

  verifyDataBeforeSubmit() {}

  render() {
    console.log(this.state);
    // console.log(this.context.auth[0].token);

    let saveModal = null;
    if (this.state.saveOpen) {
      saveModal = (
        <SaveModal
          data={{
            lp_tool_version: lp_tool_version,
            modified_date: new Date(),
            ...this.removeExcessData(this.state),
          }}
          open={this.state.saveOpen}
          onClose={this.handleSaveClose}
          setCollabID={this.setCollabID}
          setLivePaperTitle={this.setLivePaperTitle}
          collab_list={this.state.collab_list}
        />
      );
    }

    let submitModal = null;
    if (this.state.submitOpen) {
      submitModal = (
        <SubmitModal
          data={this.state}
          open={this.state.submitOpen}
          onClose={this.handleSubmitClose}
        />
      );
    }

    return (
      <Dialog
        fullScreen
        disableBackdropClick
        disableEscapeKeyDown
        onClose={this.handleClose}
        aria-labelledby="simple-dialog-title"
        open={this.props.open || false}
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
                Follow the steps listed below to create the live paper. You can
                preview the live paper and/or download it at any time by
                clicking on the buttons on the bottom of the page. It also
                provides you an option to save your work online before
                proceeding. Once completed you can submit for publishing the
                live paper online.
                <br />
                <br />
                When downloading, an HTML version of the live paper and a file
                with extension '.lpp' both will be downloaded. You can upload
                the latter file at any point to update the live paper contents.
                Please do not manually edit these files, as it could render them
                unreadable by this tool.
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
                  name="associated_paper_title"
                  value={this.state.associated_paper_title}
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
                  <strong>Specify the status of the article:</strong>
                  <br />
                  <i>
                    Articles submitted to preprint repositories, such as
                    bioRxiv, are considered as unpublished.
                  </i>
                </p>
              </div>
              <form>
                <SwitchTwoWay
                  values={["Published", "Unpublished"]}
                  selected={
                    this.state.paper_published ? "Published" : "Unpublished"
                  }
                  onChange={this.handlePublishedChange}
                />
              </form>
              <br />
              {this.state.paper_published && (
                <div>
                  <div>
                    <p>
                      <strong>Enter the year of publication:</strong>
                    </p>
                  </div>
                  <div>
                    <div>
                      <MuiPickersUtilsProvider utils={MomentUtils}>
                        <DatePicker
                          label="Year"
                          inputVariant="outlined"
                          views={["year"]}
                          name="year"
                          value={new Date(this.state.year)}
                          minDate={new Date("2010-01-01")}
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
                </div>
              )}
              <div>
                <p>
                  <strong>
                    Enter details of all authors in the required order:
                  </strong>
                  <br />
                  <br />
                  <i>
                    You can enter multiple affiliations per author by separating
                    each with a semi-colon ( ; ). Note that an affiliation must
                    be input identically across multiple authors, for it to be
                    identified as the same affliation.
                  </i>
                </p>
                <br />
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
                    Specify the corresponding author:
                    {/* , along with their email address: */}
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
                    this.state.corresponding_author.firstname
                      ? this.state.corresponding_author.firstname +
                        " " +
                        this.state.corresponding_author.lastname
                      : ""
                  }
                  handleChange={this.handleFieldChange}
                />
              </div>
              {/* <br />
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
              </div> */}
              <br />
              <br />
              <div>
                <p>
                  <strong>
                    Specify the person creating this live paper:
                    {/* , along with their email address: */}
                  </strong>
                </p>
              </div>
              <div>
                <SingleSelect
                  itemNames={
                    this.state.authors
                      ? this.state.authors
                          .map(function (author) {
                            return author.firstname + " " + author.lastname;
                          })
                          .concat("-- Other Person --") // for an external creating author
                      : []
                  }
                  label="Created By"
                  name="created_author"
                  value={
                    this.checkPersonInStateAuthors(this.state.created_author[0])
                      ? this.state.created_author[0].firstname +
                        " " +
                        this.state.created_author[0].lastname
                      : "-- Other Person --"
                  }
                  handleChange={this.handleFieldChange}
                />
                <br />
              </div>
              {!this.checkPersonInStateAuthors(
                this.state.created_author[0]
              ) && (
                <div>
                  <TextField
                    label="Creating Author First Name"
                    variant="outlined"
                    fullWidth={true}
                    name="created_author_other_firstname"
                    value={this.state.created_author[0].firstname}
                    onChange={this.handleFieldChange}
                    InputProps={{
                      style: {
                        padding: "5px 15px",
                      },
                    }}
                    style={{ width: "45%", marginRight: "2.5%" }}
                  />
                  <TextField
                    label="Creating Author Last Name"
                    variant="outlined"
                    fullWidth={true}
                    name="created_author_other_lastname"
                    value={this.state.created_author[0].lastname}
                    onChange={this.handleFieldChange}
                    InputProps={{
                      style: {
                        padding: "5px 15px",
                      },
                    }}
                    style={{ width: "45%" }}
                  />
                  <br />
                  <br />
                  <TextField
                    label="Creating Author Affiliation"
                    variant="outlined"
                    fullWidth={true}
                    name="created_author_other_affiliation"
                    value={this.state.created_author[0].affiliation}
                    onChange={this.handleFieldChange}
                    InputProps={{
                      style: {
                        padding: "5px 15px",
                      },
                    }}
                    style={{ width: "92.5%" }}
                  />
                </div>
              )}
              {/* <br />
              <div>
                <TextField
                  label="Creating Author Email"
                  variant="outlined"
                  fullWidth={true}
                  name="created_author_email"
                  value={this.state.created_author[0].email}
                  onChange={this.handleFieldChange}
                  InputProps={{
                    style: {
                      padding: "5px 15px",
                    },
                  }}
                  style={{ width: "92.5%" }}
                />
              </div> */}
              <br />
              <br />
              {!this.checkPersonInStateAuthors(
                this.state.created_author[0]
              ) && (
                <div>
                  <div>
                    <p>
                      <strong>
                        Since the live paper is being created by a person who
                        isn't an author on the article (as indicated above), the
                        live paper needs to be approved by one of the original
                        authors. Specify the authorising author:{" "}
                        {/* , along with their email address: */}
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
                      label="Approved By"
                      name="approved_author"
                      value={
                        this.state.approved_author.firstname
                          ? this.state.approved_author.firstname +
                            " " +
                            this.state.approved_author.lastname
                          : ""
                      }
                      handleChange={this.handleFieldChange}
                    />
                  </div>
                  {/* <br />
                  <div>
                    <TextField
                      label="Approving Author Email"
                      variant="outlined"
                      fullWidth={true}
                      name="approved_author_email"
                      value={this.state.approved_author.email}
                      onChange={this.handleFieldChange}
                      InputProps={{
                        style: {
                          padding: "5px 15px",
                        },
                      }}
                      style={{ width: "92.5%" }}
                    />
                  </div> */}
                  <br />
                  <br />
                </div>
              )}
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
              <br />
              <div>
                <p>
                  <strong>
                    Provide the URL to access article (leave empty if awaiting
                    publication or link to bioRxiv, if available):
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
              <br />
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
              <br />
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
              <br />
              <div>
                <Grid item xs={12}>
                  <TextField
                    multiline
                    rows="4"
                    label="Description of resources (optional)"
                    variant="outlined"
                    fullWidth={true}
                    helperText="The description may be formatted with Markdown"
                    name="resources_description"
                    value={this.state.resources_description}
                    onChange={this.handleFieldChange}
                    InputProps={{
                      style: {
                        padding: "15px 15px",
                      },
                    }}
                  />
                </Grid>
              </div>

              {Object.keys(this.state.resources).length > 0
                ? Object.values(this.state.resources).map((item, index) => {
                    // console.log(item);
                    if (item["type"] === "section_morphology") {
                      return (
                        <SectionMorphology
                          key={index}
                          storeSectionInfo={this.storeSectionInfo}
                          data={item}
                          numResources={Object.keys(this.state.resources).length}
                        />
                      );
                    } else if (item["type"] === "section_traces") {
                      return (
                        <SectionTraces
                          key={index}
                          storeSectionInfo={this.storeSectionInfo}
                          data={item}
                          numResources={Object.keys(this.state.resources).length}
                        />
                      );
                    } else if (item["type"] === "section_models") {
                      return (
                        <SectionModels
                          key={index}
                          storeSectionInfo={this.storeSectionInfo}
                          data={item}
                          numResources={Object.keys(this.state.resources).length}
                        />
                      );
                    } else if (item["type"] === "section_generic") {
                      return (
                        <SectionGeneric
                          key={index}
                          storeSectionInfo={this.storeSectionInfo}
                          data={item}
                          numResources={Object.keys(this.state.resources).length}
                        />
                      );
                    } else if (item["type"] === "section_custom") {
                      return (
                        <SectionCustom
                          key={index}
                          storeSectionInfo={this.storeSectionInfo}
                          data={item}
                          numResources={Object.keys(this.state.resources).length}
                        />
                      );
                    } else {
                      return null;
                    }
                  })
                : null}
              <br />
            </div>

            <div
              style={{
                paddingLeft: "0%",
                paddingRight: "0%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  paddingLeft: "2.5%",
                  paddingRight: "2.5%",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  borderStyle: "solid",
                  borderColor: "#0D47A1",
                  borderWidth: "2px",
                  backgroundColor: "#01579B",
                  //   borderRadius: "20px",
                  fontWeight: "bold",
                  borderBottom: "None",
                  color: "#FFFFFF",
                }}
              >
                Click to add a resource section:
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  paddingLeft: "2.5%",
                  paddingRight: "2.5%",
                  paddingTop: "20px",
                  paddingBottom: "20px",
                  borderStyle: "solid",
                  borderColor: "#0D47A1",
                  borderWidth: "2px",
                  backgroundColor: "#BED3F3",
                  //   borderRadius: "20px",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    width: "17.5%",
                    backgroundColor: "#FFD54F",
                    color: "#000000",
                    fontWeight: "bold",
                    border: "solid",
                    borderColor: "#000000",
                    borderWidth: "1px",
                  }}
                  startIcon={<AcUnitIcon style={{ width: 30, height: 30 }} />}
                  onClick={() => this.handleAddSection("section_morphology")}
                >
                  Morphology
                </Button>
                <br />
                <br />
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    width: "17.5%",
                    backgroundColor: "#8BC34A",
                    color: "#000000",
                    fontWeight: "bold",
                    border: "solid",
                    borderColor: "#000000",
                    borderWidth: "1px",
                  }}
                  startIcon={<TimelineIcon style={{ width: 30, height: 30 }} />}
                  onClick={() => this.handleAddSection("section_traces")}
                >
                  Traces
                </Button>
                <br />
                <br />
                <Button
                  variant="contained"
                  color="secondary"
                  style={{
                    width: "17.5%",
                    backgroundColor: "#E5B8B3",
                    color: "#000000",
                    fontWeight: "bold",
                    border: "solid",
                    borderColor: "#000000",
                    borderWidth: "1px",
                  }}
                  startIcon={
                    <LocalPlayIcon style={{ width: 30, height: 30 }} />
                  }
                  onClick={() => this.handleAddSection("section_models")}
                >
                  Models
                </Button>
                <br />
                <br />
                <Button
                  variant="contained"
                  color="secondary"
                  style={{
                    width: "17.5%",
                    backgroundColor: "#B39DDB",
                    color: "#000000",
                    fontWeight: "bold",
                    border: "solid",
                    borderColor: "#000000",
                    borderWidth: "1px",
                  }}
                  startIcon={
                    <FormatListBulletedIcon style={{ width: 30, height: 30 }} />
                  }
                  onClick={() => this.handleAddSection("section_generic")}
                >
                  Generic
                </Button>
                <br />
                <br />
                <Button
                  variant="contained"
                  color="secondary"
                  style={{
                    width: "17.5%",
                    backgroundColor: "#D9D9D9",
                    color: "#000000",
                    fontWeight: "bold",
                    border: "solid",
                    borderColor: "#000000",
                    borderWidth: "1px",
                  }}
                  startIcon={
                    <CheckBoxOutlineBlankIcon
                      style={{ width: 30, height: 30 }}
                    />
                  }
                  onClick={() => this.handleAddSection("section_custom")}
                >
                  Custom
                </Button>
              </div>
            </div>
            <br />
            <br />
          </div>

          <Footer>
            <div
              className="rainbow-row"
              style={{ borderBottom: "1px solid #000000" }}
            >
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
                  width: "17.5%",
                  backgroundColor: "#FF9800",
                  color: "#000000",
                  fontWeight: "bold",
                  border: "solid",
                  borderColor: "#000000",
                  borderWidth: "1px",
                }}
                onClick={this.handlePreview}
              >
                Preview
              </Button>
              <br />
              <br />
              <Button
                variant="contained"
                color="primary"
                style={{
                  width: "17.5%",
                  backgroundColor: "#009688",
                  color: "#000000",
                  fontWeight: "bold",
                  border: "solid",
                  borderColor: "#000000",
                  borderWidth: "1px",
                }}
                onClick={this.handleDownload}
              >
                Download
              </Button>
              <br />
              <br />
              <Button
                variant="contained"
                color="secondary"
                style={{
                  width: "17.5%",
                  backgroundColor: "#01579b",
                  fontWeight: "bold",
                  border: "solid",
                  borderColor: "#000000",
                  borderWidth: "1px",
                }}
                onClick={this.handleSaveOpen}
              >
                Save
              </Button>
              <br />
              <br />
              <Button
                variant="contained"
                color="secondary"
                style={{
                  width: "17.5%",
                  backgroundColor: "#8b0d0d",
                  fontWeight: "bold",
                  border: "solid",
                  borderColor: "#000000",
                  borderWidth: "1px",
                }}
                onClick={this.handleSubmitOpen}
              >
                Submit
              </Button>
            </div>
          </Footer>
          {saveModal}
          {submitModal}
        </DialogContent>
      </Dialog>
    );
  }
}
export default withSnackbar(CreateLivePaper);
