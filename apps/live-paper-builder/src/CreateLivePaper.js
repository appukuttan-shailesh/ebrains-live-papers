import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import { withSnackbar } from "notistack";

import { withStyles } from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import HelpIcon from "@material-ui/icons/Help";
import IconButton from "@material-ui/core/IconButton";
import AcUnitIcon from "@material-ui/icons/AcUnit";
import TimelineIcon from "@material-ui/icons/Timeline";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import LocalPlayIcon from "@material-ui/icons/LocalPlay";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CloseIcon from "@material-ui/icons/Close";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import axios from "axios";
import axiosRetry from "axios-retry";
import showdown from "showdown";
import showdownKatex from "showdown-katex";

import ContextMain from "./ContextMain";
import DynamicTablePerson from "./DynamicTablePerson";
import SingleSelect from "./SingleSelect";
import MultipleSelect from "./MultipleSelect";
import SectionMorphology from "./SectionMorphology";
import SectionTraces from "./SectionTraces";
import SectionModels from "./SectionModels";
import SectionGeneric from "./SectionGeneric";
import SectionCustom from "./SectionCustom";
import SwitchMultiWay from "./SwitchMultiWay";
import SaveModal from "./SaveModal";
import SubmitModal from "./SubmitModal";
import ModalDialog from "./ModalDialog";
import MarkdownLatexExample from "./MarkdownLatexExample";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import { livePaperPlatformUrl, livePaperDocsUrl, lp_tool_version, updateHash } from "./globals";
import { showNotification, compareArrayoOfObjectsByOrder } from "./utils";

import nunjucks from "nunjucks";
import LivePaper_v01 from "./templates/LivePaper_v0.1.njk";

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
  backgroundColor: "#DCEDC8",
  fontSize: "20px",
  color: "black",
  textAlign: "center",
  position: "fixed",
  left: "50%",
  transform: "translateX(-50%)",
  bottom: "0",
  height: "80px",
  zIndex: "1000",
  paddingBottom: "75px",
};

const phantomStyle = {
  display: "block",
  padding: "20px",
  height: "60px",
};

function Footer({ children }) {
  return (
    <div style={{ zIndex: "2147483638" }}>
      <div style={phantomStyle} className="mycontainer" />
      <div style={footerStyle} className="mycontainer">
        {children}
      </div>
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
      id: "",
      lp_tool_version: lp_tool_version,
      standalone: false,
      modified_date: new Date(),
      authors: [{ firstname: "", lastname: "", affiliation: "" }],
      corresponding_author: [{ firstname: "", lastname: "", affiliation: "" }], // "email" removed
      created_author: [{ firstname: "", lastname: "", affiliation: "" }], // "email" removed
      approved_author: { firstname: "", lastname: "", affiliation: "" }, // "email" removed
      year: new Date()
        .toISOString()
        .replace(
          /^(?<year>\d+)-(?<month>\d+)-(?<day>\d+)T.*$/,
          "$<year>-$<month>-$<day>"
        ),
      associated_paper_title: "",
      live_paper_title: "",
      doi: null,
      paper_published: true,
      journal: "",
      url: "",
      citation: "",
      associated_paper_doi: "",
      abstract: "",
      license: null,
      collab_id: "",
      resources_description: "",
      resources: [],
      saveOpen: false,
      submitOpen: false,
      showDescHelp: false,
      lastSaved: null,
    };
    this.state = {
      ...this.state,
      ...props.data,
      standalone:
        props.data.live_paper_title !== "" &&
        props.data.associated_paper_title === "",
    };
    // const [authContext,] = this.context.auth;

    this.handleClose = this.handleClose.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleSaveOpen = this.handleSaveOpen.bind(this);
    this.handleSaveClose = this.handleSaveClose.bind(this);
    this.handleSubmitOpen = this.handleSubmitOpen.bind(this);
    this.handleSubmitClose = this.handleSubmitClose.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleStandaloneChange = this.handleStandaloneChange.bind(this);
    this.handlePublishedChange = this.handlePublishedChange.bind(this);
    this.handleYearChange = this.handleYearChange.bind(this);
    this.handleAuthorsChange = this.handleAuthorsChange.bind(this);
    this.handleCreatedAuthorChange = this.handleCreatedAuthorChange.bind(this);
    this.makePageTitleString = this.makePageTitleString.bind(this);
    this.makeAuthorsAndAffiliationsString =
      this.makeAuthorsAndAffiliationsString.bind(this);
    this.makeCreatedAuthorsString = this.makeCreatedAuthorsString.bind(this);
    this.makeCorrespondingAuthorsString =
      this.makeCorrespondingAuthorsString.bind(this);
    this.handleAddSection = this.handleAddSection.bind(this);
    this.storeSectionInfo = this.storeSectionInfo.bind(this);
    this.removeExcessData = this.removeExcessData.bind(this);
    this.addDerivedData = this.addDerivedData.bind(this);
    this.setID = this.setID.bind(this);
    this.setCollabID = this.setCollabID.bind(this);
    this.setLivePaperTitle = this.setLivePaperTitle.bind(this);
    this.setLivePaperModifiedDate = this.setLivePaperModifiedDate.bind(this);
    this.verifyDataBeforeSubmit = this.verifyDataBeforeSubmit.bind(this);
    this.checkPersonInStateAuthors = this.checkPersonInStateAuthors.bind(this);
    this.deleteResourceSection = this.deleteResourceSection.bind(this);
    this.moveDownResourceSection = this.moveDownResourceSection.bind(this);
    this.moveUpResourceSection = this.moveUpResourceSection.bind(this);
    this.clickDescHelp = this.clickDescHelp.bind(this);
    this.handleDescHelpClose = this.handleDescHelpClose.bind(this);
  }

  clickDescHelp() {
    this.setState({
      showDescHelp: true,
    });
  }

  handleDescHelpClose() {
    this.setState({
      showDescHelp: false,
    });
  }

  deleteResourceSection(order) {
    console.log("Delete resource with order: " + order);

    let temp_resources = this.state.resources;

    // delete specified resource section
    temp_resources = temp_resources.filter(function (res) {
      return res.order !== order;
    });

    // re-order remaining resource sections
    temp_resources = temp_resources.map(function (res) {
      if (res.order > order) {
        res.order = res.order - 1;
      }
      return res;
    });

    this.setState({
      resources: temp_resources,
    });

    showNotification(
      this.props.enqueueSnackbar,
      this.props.closeSnackbar,
      "Section deleted!",
      "success"
    );
  }

  moveDownResourceSection(order) {
    console.log("Move down resource with order: " + order);
    const maxOrder = Object.keys(this.state.resources).length - 1;

    if ((order || order === 0) && order < maxOrder) {
      let temp_resources = this.state.resources;

      temp_resources = temp_resources.map(function (res) {
        if (res.order === order) {
          res.order = order + 1;
        } else if (res.order === order + 1) {
          res.order = order;
        }
        return res;
      });
      // sort resource sections by order #
      temp_resources.sort(compareArrayoOfObjectsByOrder);

      this.setState({
        resources: temp_resources,
      });
    }
  }

  moveUpResourceSection(order) {
    console.log("Move up resource with order: " + order);

    if ((order || order === 0) && order > 0) {
      let temp_resources = this.state.resources;

      temp_resources = temp_resources.map(function (res) {
        if (res.order === order) {
          res.order = order - 1;
        } else if (res.order === order - 1) {
          res.order = order;
        }
        return res;
      });
      // sort resource sections by order #
      temp_resources.sort(compareArrayoOfObjectsByOrder);

      this.setState({
        resources: temp_resources,
      });
    }
  }

  checkPersonInStateAuthors(person) {
    if (typeof person === "string") {
      return this.state.authors.find(
        (author) =>
          author.firstname + " " + author.lastname === person &&
          person.trim().length > 0
      );
    } else if (Array.isArray(person)) {
      if (typeof person[0] === "string") {
        // handle array of strings
        // used for corresponding_author
        let context = this;
        return person.map(function (entry) {
          return context.state.authors.find(
            (author) =>
              author.firstname + " " + author.lastname === entry &&
              entry.trim().length > 0
          );
        });
      } else {
        // handle array of dicts
        let context = this;
        return person.map(function (entry) {
          return context.state.authors.find(
            (author) =>
              author.firstname === entry.firstname &&
              author.firstname !== "" &&
              author.lastname === entry.lastname &&
              author.lastname !== ""
          );
        });
      }
    } else {
      // if object with keys firstname and lastname
      return this.state.authors.find(
        (author) =>
          author.firstname === person.firstname &&
          author.firstname !== "" &&
          author.lastname === person.lastname &&
          author.lastname !== ""
      );
    }
  }

  removeExcessData() {
    let req_data = JSON.parse(JSON.stringify(this.state)); // copy by value
    let remove_keys = ["saveOpen", "submitOpen", "lastSaved"];
    remove_keys.forEach((k) => delete req_data[k]);

    // remove from within resources objects
    for (let res of req_data.resources) {
      let remove_keys = [
        "dataOk",
        "showEdit",
        "showKGInput",
        "expanded",
        "useTabs",
        "deleteOpen",
        "showDescHelp",
      ];
      remove_keys.forEach((k) => delete res[k]);
    }

    return req_data;
  }

  addDerivedData(data) {
    data["page_title"] = this.makePageTitleString();
    [data["authors_string"], data["affiliations_string"]] =
      this.makeAuthorsAndAffiliationsString();
    data["created_authors_string"] = this.makeCreatedAuthorsString();
    data["corresponding_authors_string"] =
      this.makeCorrespondingAuthorsString();

    let converter = new showdown.Converter({
      extensions: [
        showdownKatex({
          throwOnError: false,
          displayMode: true,
        }),
      ],
    });
    // handle potential markdown in top-level resource description
    data["resources_description"] = converter.makeHtml(
      data["resources_description"]
    );

    // check if resources use tabs; handle appropriately
    // also handle potential markdown in all descriptions
    data.resources.forEach(function (res, index) {
      if (res.type !== "section_custom") {
        let tabs = [];
        res.data.forEach(function (res_item, index) {
          tabs.push(res_item.tab_name || "");
        });
        // get only unique elements
        tabs = tabs.filter((x, i, a) => a.indexOf(x) === i);
        // replace empty string with "no tab name"
        tabs = tabs.map((item) => (item === "" ? "no tab name" : item));
        // add tab names to resource data
        res["tabs"] = tabs;

        // convert any potential markdown content to html
        res["description"] = converter.makeHtml(res["description"]);
      }
    });
    return data;
  }

  handleClose() {
    this.props.onClose();
  }

  handlePreview() {
    let lp_data = this.addDerivedData(this.removeExcessData(this.state));

    // same as in SaveModal.adjustForKGSchema()
    lp_data.resources.forEach(function (res, index) {
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

    // determine appropriate live paper template
    let LivePaper = null;
    const lp_version = parseFloat(lp_data.lp_tool_version);
    if (lp_version > 0.1) {
      // add handling for newer templates here as required
      LivePaper = LivePaper_v01;
    } else {
      LivePaper = LivePaper_v01;
    }

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
      this.props.closeSnackbar,
      "Preview generated...",
      "success"
    );
  }

  handleDownload() {
    let lp_data = this.addDerivedData(this.removeExcessData(this.state));

    // determine appropriate live paper template
    let LivePaper = null;
    const lp_version = parseFloat(lp_data.lp_tool_version);
    if (lp_version > 0.1) {
      // add handling for newer templates here as required
      LivePaper = LivePaper_v01;
    } else {
      LivePaper = LivePaper_v01;
    }

    const tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
    const timestamp = new Date(Date.now() - tzoffset)
      .toISOString()
      .replace(/T/, "_") // replace T with an underscore
      .replaceAll(":", "-") // replace : with -
      .replace(/\..+/, ""); // delete the dot and everything after

    function render(data, timestamp) {
      fetch(LivePaper)
        .then((r) => r.text())
        .then((source) => {
          var output = nunjucks.renderString(source, data);
          const element = document.createElement("a");
          const file = new Blob([output], { type: "text/html" });
          element.href = URL.createObjectURL(file);
          element.download = "livepaper_" + timestamp + ".html";
          document.body.appendChild(element); // Required for this to work in FireFox
          element.click();
        });
    }
    render(lp_data, timestamp);

    showNotification(
      this.props.enqueueSnackbar,
      this.props.closeSnackbar,
      "HTML file downloaded...",
      "success"
    );

    // create JSON object with live paper info
    lp_data = this.removeExcessData(this.state);
    let newDate = new Date();
    let lp_data_updated = {
      ...lp_data,
      modified_date: newDate,
    };

    const lp_data_formatted = JSON.stringify(lp_data_updated, null, 4);
    const blob = new Blob([lp_data_formatted], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.download = "livepaper_" + timestamp + ".lpp";
    link.href = url;
    link.click();

    showNotification(
      this.props.enqueueSnackbar,
      this.props.closeSnackbar,
      ".lpp file downloaded...",
      "success"
    );
    this.setState({
      modified_date: newDate,
    });
  }

  handleSaveOpen() {
    this.setState({
      saveOpen: true,
    });
  }

  handleSaveClose(flag) {
    this.setState((prevState) => ({
      saveOpen: false,
      lastSaved: flag ? new Date() : prevState.lastSaved,
    }));
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
    // console.log(name + " => " + value);
    if (name === "corresponding_author") {
      const c_authors = this.checkPersonInStateAuthors(value);
      // console.log(value);
      // console.log(c_authors);
      this.setState({
        corresponding_author: c_authors.map(function (c_author) {
          return {
            firstname: c_author.firstname,
            lastname: c_author.lastname,
            affiliation: c_author.affiliation,
          };
        }),
      });
    }
    // else if (name === "corresponding_author_email") {
    //   this.setState((prevState) => ({
    //     corresponding_author: {
    //       ...prevState.corresponding_author,
    //       email: value,
    //     },
    //   }));
    // }
    else if (name === "associated_paper_title") {
      if (
        this.state.live_paper_title === "" ||
        this.state.associated_paper_title === this.state.live_paper_title
      ) {
        this.setState({
          associated_paper_title: value,
          live_paper_title: value,
        });
      } else {
        this.setState({
          associated_paper_title: value,
        });
      }
    } else if (name === "created_author") {
      if (value === "-- Other --") {
        this.setState({
          created_author: [
            {
              firstname: "",
              lastname: "",
              affiliation: "",
              // email: "",
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
    else if (name === "license") {
      this.setState({
        license: value === "None" ? null : value,
      });
    }
    else {
      this.setState({
        [name]: value,
      });
    }
  }

  handleStandaloneChange(value) {
    console.log(value);
    this.setState({
      standalone: value === "Standalone Live Paper" ? true : false,
    });
    if (value === "Standalone Live Paper") {
      this.setState({
        associated_paper_title: "",
        year: new Date()
          .toISOString()
          .replace(
            /^(?<year>\d+)-(?<month>\d+)-(?<day>\d+)T.*$/,
            "$<year>-$<month>-$<day>"
          ),
        journal: "",
        url: "",
        citation: "",
        associated_paper_doi: "",
        abstract: "",
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

  handleAuthorsChange(author_data) {
    // remove all entries where firstname and lastname both are empty
    // function isNotEmpty(item) {
    //   if (item.firstname.trim() !== "" || item.lastname.trim() !== "") {
    //     return true;
    //   } else return false;
    // }
    // var author_data = data.filter(isNotEmpty);

    if (author_data.length === 0) {
      author_data = [{ firstname: "", lastname: "", affiliation: "" }];
    }
    this.setState(
      {
        authors: author_data,
      },
      () => {
        // if existing author affiliation changed, update same for ...
        // if existing author name changed, remove old matching author from ...

        // ... corresponding author
        const c_authors = this.checkPersonInStateAuthors(
          this.state.corresponding_author
        );
        if (c_authors[0]) {
          this.setState({
            corresponding_author: c_authors.map(function (c_author) {
              return {
                firstname: c_author.firstname,
                lastname: c_author.lastname,
                affiliation: c_author.affiliation,
              };
            }),
          });
        } else {
          this.setState({
            corresponding_author: [
              { firstname: "", lastname: "", affiliation: "" },
            ],
          });
        }

        // ... created author
        const context = this;
        const cr_authors = this.state.created_author.map(function (cr_auth) {
          return (
            context.state.authors.find(
              (author) =>
                author.firstname + " " + author.lastname ===
                cr_auth.firstname + " " + cr_auth.lastname
            ) || cr_auth
          );
        });

        if (cr_authors[0]) {
          this.setState({
            created_author: cr_authors,
          });
        } else {
          this.setState({
            created_author: [{ firstname: "", lastname: "", affiliation: "" }],
          });
        }

        // ... approved author
        const appr_author = this.checkPersonInStateAuthors(
          this.state.approved_author
        );
        if (appr_author) {
          this.setState({
            approved_author: {
              firstname: appr_author.firstname,
              lastname: appr_author.lastname,
              affiliation: appr_author.affiliation,
            },
          });
        } else {
          this.setState({
            approved_author: { firstname: "", lastname: "", affiliation: "" },
          });
        }
      }
    );
  }

  handleCreatedAuthorChange(created_author_data) {
    // remove all entries where firstname and lastname both are empty
    // function isNotEmpty(item) {
    //   if (item.firstname.trim() !== "" || item.lastname.trim() !== "") {
    //     return true;
    //   } else return false;
    // }
    // var created_author_data = data.filter(isNotEmpty);

    if (created_author_data.length === 0) {
      created_author_data = [{ firstname: "", lastname: "", affiliation: "" }];
    }
    this.setState({
      created_author: created_author_data,
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

  makeAuthorsAndAffiliationsString() {
    // first evaluate all unique affiliations
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
    let unique_affs_strings = [];
    unique_affs.forEach(function (aff, index) {
      unique_affs_strings.push((index + 1).toString().sup() + " " + aff);
    });
    var affiliations_string = unique_affs_strings.join(";; ");

    // now use the list of affiliations to appropriately create authors string
    var authors_string = "";
    this.state.authors.forEach(function (author, index) {
      if (author.firstname.trim() !== "" || author.lastname.trim() !== "") {
        if (authors_string !== "") {
          authors_string = authors_string + ", ";
        }
        var affs = author.affiliation.split(";").map(function (x) {
          return x.trim();
        });
        let author_affs = "";
        affs.forEach(function (aff) {
          if (author_affs !== "") {
            author_affs = author_affs + ",";
          }
          if (aff !== "" && unique_affs.includes(aff)) {
            author_affs =
              author_affs + (unique_affs.indexOf(aff) + 1).toString();
          }
        });

        authors_string =
          authors_string +
          author.firstname +
          " " +
          author.lastname +
          " " +
          author_affs.sup();
      }
    });
    return [authors_string, affiliations_string];
  }

  makeCreatedAuthorsString() {
    var created_authors_string = "";
    this.state.created_author.forEach(function (created_author, index) {
      if (
        created_author.firstname.trim() !== "" ||
        created_author.lastname.trim() !== ""
      ) {
        if (created_authors_string !== "") {
          created_authors_string = created_authors_string + ";; ";
        }
        created_authors_string =
          created_authors_string +
          created_author.firstname +
          " " +
          created_author.lastname;
        if (created_author.affiliation) {
          created_authors_string +=
            " (" + created_author.affiliation.italics() + ")";
        }
      }
    });
    return created_authors_string;
  }

  makeCorrespondingAuthorsString() {
    var corresponding_authors_string = "";
    this.state.corresponding_author.forEach(function (corresp_author, index) {
      if (
        corresp_author.firstname.trim() !== "" ||
        corresp_author.lastname.trim() !== ""
      ) {
        if (corresponding_authors_string !== "") {
          corresponding_authors_string = corresponding_authors_string + ", ";
        }
        corresponding_authors_string =
          corresponding_authors_string +
          corresp_author.firstname +
          " " +
          corresp_author.lastname;
        if (corresp_author.affiliation) {
          corresponding_authors_string +=
            " (" + corresp_author.affiliation.italics() + ")";
        }
      }
    });
    return corresponding_authors_string;
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

  setID(value) {
    console.log(value);
    this.setState({
      id: value,
    });
    updateHash(value);
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

  setLivePaperModifiedDate(value) {
    console.log(value);
    this.setState({
      modified_date: value,
    });
  }

  verifyDataBeforeSubmit() { }

  render() {
    console.log(this.state);
    // console.log(this.props.data);
    // console.log(this.context.auth[0].token);

    let saveModal = null;
    if (this.state.saveOpen) {
      saveModal = (
        <SaveModal
          data={{
            ...this.removeExcessData(this.state),
            modified_date: new Date(),
          }}
          open={this.state.saveOpen}
          onClose={this.handleSaveClose}
          setID={this.setID}
          setCollabID={this.setCollabID}
          setLivePaperTitle={this.setLivePaperTitle}
          setLivePaperModifiedDate={this.setLivePaperModifiedDate}
          enqueueSnackbar={this.props.enqueueSnackbar}
          closeSnackbar={this.props.closeSnackbar}
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
          enqueueSnackbar={this.props.enqueueSnackbar}
          closeSnackbar={this.props.closeSnackbar}
        />
      );
    }

    let lastSaveInfo = null;
    if (this.state.lastSaved) {
      lastSaveInfo = (
        <b>
          <i>
            Changes last saved to KG at{" "}
            {new Date(this.state.lastSaved).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </i>
        </b>
      );
    } else {
      lastSaveInfo = (
        <b>
          <i>No changes saved to KG during current session.</i>
        </b>
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
          <div className="mycontainer" style={{ textAlign: "left" }}>
            <div className="box rounded centered"
              style={{ marginTop: "0px", paddingTop: "0.25em", paddingBottom: "0.25em", marginBottom: "1em" }}>
              <div style={{ display: "flex" }}>
                <div style={{ flex: 1, textAlign: "left", paddingLeft: "25px", alignSelf: "center" }}>
                  <Tooltip title={"Open EBRAINS Homepage"}>
                    <a href="https://ebrains.eu/"
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
                <div style={{ flex: 1, textAlign: "right", paddingRight: "25px", alignSelf: "center" }}>
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
              <div className="title-solid-style" style={{ fontSize: 44 }}>EBRAINS Live Paper Builder</div>
              <div className="title-solid-style" style={{ fontSize: 32, color: "#00A595" }}>Quickly create and distribute interactive live papers</div>
            </div>
            <div style={{ marginBottom: "40px", }}>
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
                Live papers can be developed as interactive documents
                accompanying traditional journal publications (or manuscripts
                available on publicly accessible preprint repositories), or as
                standalone interactive documents for the purposes of publishing
                and sharing resources.
                <br />
                <br />
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
                    Does this live paper have an associated accessible
                    manuscript or journal publication?
                  </strong>
                  <br />
                  <i>
                    Articles submitted to publicly accessible preprint
                    repositories, such as bioRxiv, are considered as accessible
                    manuscripts.
                  </i>
                </p>
              </div>
              <form>
                <SwitchMultiWay
                  values={["Associated Publication", "Standalone Live Paper"]}
                  selected={
                    this.state.standalone
                      ? "Standalone Live Paper"
                      : "Associated Publication"
                  }
                  onChange={this.handleStandaloneChange}
                />
              </form>
              <br />
              {!this.state.standalone && (
                <div>
                  <div>
                    <p>
                      <strong>
                        Enter the complete title of your manuscript / paper:
                      </strong>
                    </p>
                  </div>
                  <div>
                    <TextField
                      label="Associated Paper Title"
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
                    <SwitchMultiWay
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
                </div>
              )}
              <div>
                <p>
                  <strong>Enter a title for your live paper:</strong>
                  {!this.state.standalone && (
                    <>
                      <br />
                      <i>
                        Live papers with associated publications generally use
                        the same title as the article for ease of
                        identification.
                      </i>
                    </>
                  )}
                </p>
              </div>
              <div>
                <TextField
                  label="Live Paper Title"
                  variant="outlined"
                  fullWidth={true}
                  name="live_paper_title"
                  value={this.state.live_paper_title}
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
                <DynamicTablePerson
                  items={this.state.authors}
                  onChangeValue={this.handleAuthorsChange}
                />
              </div>
              <br />
              <br />
              <div>
                <p>
                  <strong>
                    Specify the corresponding author(s):
                    {/* , along with their email address: */}
                  </strong>
                </p>
              </div>
              <div>
                <MultipleSelect
                  itemNames={this.state.authors
                    .filter(
                      (author) =>
                        author.firstname !== "" || author.lastname !== ""
                    )
                    .map(function (author) {
                      return author.firstname + " " + author.lastname;
                    })}
                  label="Corresponding Author(s)"
                  name="corresponding_author"
                  value={this.state.corresponding_author
                    .filter(
                      (author) =>
                        author.firstname !== "" || author.lastname !== ""
                    )
                    .map(function (author) {
                      return author.firstname + " " + author.lastname;
                    })}
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
                        .concat("-- Other --") // for an external creating author
                      : []
                  }
                  label="Created By"
                  name="created_author"
                  value={
                    !(
                      this.state.created_author.length === 1 &&
                      this.checkPersonInStateAuthors(
                        this.state.created_author[0]
                      )
                    )
                      ? "-- Other --"
                      : this.state.created_author[0].firstname +
                      " " +
                      this.state.created_author[0].lastname
                  }
                  handleChange={this.handleFieldChange}
                />
                <br />
              </div>
              {!(
                this.state.created_author.length === 1 &&
                this.checkPersonInStateAuthors(this.state.created_author[0])
              ) && (
                  <div>
                    <DynamicTablePerson
                      items={this.state.created_author}
                      onChangeValue={this.handleCreatedAuthorChange}
                    />
                  </div>

                  // // ------------------------------------
                  // <div>
                  //   <TextField
                  //     label="Creating Author First Name"
                  //     variant="outlined"
                  //     fullWidth={true}
                  //     name="created_author_other_firstname"
                  //     value={this.state.created_author[0].firstname}
                  //     onChange={this.handleFieldChange}
                  //     InputProps={{
                  //       style: {
                  //         padding: "5px 15px",
                  //       },
                  //     }}
                  //     style={{ width: "45%", marginRight: "2.5%" }}
                  //   />
                  //   <TextField
                  //     label="Creating Author Last Name"
                  //     variant="outlined"
                  //     fullWidth={true}
                  //     name="created_author_other_lastname"
                  //     value={this.state.created_author[0].lastname}
                  //     onChange={this.handleFieldChange}
                  //     InputProps={{
                  //       style: {
                  //         padding: "5px 15px",
                  //       },
                  //     }}
                  //     style={{ width: "45%" }}
                  //   />
                  //   <br />
                  //   <br />
                  //   <TextField
                  //     label="Creating Author Affiliation"
                  //     variant="outlined"
                  //     fullWidth={true}
                  //     name="created_author_other_affiliation"
                  //     value={this.state.created_author[0].affiliation}
                  //     onChange={this.handleFieldChange}
                  //     InputProps={{
                  //       style: {
                  //         padding: "5px 15px",
                  //       },
                  //     }}
                  //     style={{ width: "92.5%" }}
                  //   />
                  // </div>
                  // // -------------------------------------
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
              {!(
                this.state.created_author.length === 1 &&
                this.checkPersonInStateAuthors(this.state.created_author[0])
              ) && (
                  <div>
                    <div>
                      <p>
                        <strong>
                          Since the live paper is being created by persons who are
                          not authors on the article (as indicated above), the
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
                  </div>
                )}
              {!this.state.standalone && (
                <>
                  <div>
                    <p>
                      <strong>
                        Specify the journal in which paper is published (leave
                        empty if awaiting publication):
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
                        Provide the URL to access article (leave empty if
                        awaiting publication or link to publicly accessible preprint
                        repositories, such as bioRxiv, if available):
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
                        Indicate the DOI entry for article (leave empty if
                        awaiting publication):
                      </strong>
                    </p>
                  </div>
                  <div>
                    <TextField
                      label="Article DOI"
                      variant="outlined"
                      fullWidth={true}
                      name="associated_paper_doi"
                      value={this.state.associated_paper_doi}
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
                </>
              )}
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
                  value={this.state.license ? this.state.license : "None"}
                  handleChange={this.handleFieldChange}
                  helperText="For guidance on choosing a licence, see https://choosealicense.com"
                />
              </div>
              <br />
              <br />

              <div style={{ display: "flex", flexDirection: "row" }}>
                <div>
                  <h5>Resources</h5>
                </div>
                <div
                  style={{
                    width: "50px",
                    paddingLeft: "20px",
                    paddingTop: "15px",
                    justifyContent: "center",
                    alignItems: "baseline",
                  }}
                >
                  <Tooltip title="Click for help with description input format">
                    <HelpIcon
                      style={{ width: 30, height: 30 }}
                      onClick={this.clickDescHelp}
                    />
                  </Tooltip>
                </div>
              </div>

              <br />
              <div>
                <Grid item xs={12}>
                  <TextField
                    multiline
                    rows="4"
                    label="Description of resources (optional)"
                    variant="outlined"
                    fullWidth={true}
                    helperText="The description may be formatted with Markdown, LaTeX math and/or AsciiMath. Click on ? icon for help."
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
                        numResources={
                          Object.keys(this.state.resources).length
                        }
                        handleDelete={this.deleteResourceSection}
                        handleMoveDown={this.moveDownResourceSection}
                        handleMoveUp={this.moveUpResourceSection}
                        enqueueSnackbar={this.props.enqueueSnackbar}
                        closeSnackbar={this.props.closeSnackbar}
                      />
                    );
                  } else if (item["type"] === "section_traces") {
                    return (
                      <SectionTraces
                        key={index}
                        storeSectionInfo={this.storeSectionInfo}
                        data={item}
                        numResources={
                          Object.keys(this.state.resources).length
                        }
                        handleDelete={this.deleteResourceSection}
                        handleMoveDown={this.moveDownResourceSection}
                        handleMoveUp={this.moveUpResourceSection}
                        enqueueSnackbar={this.props.enqueueSnackbar}
                        closeSnackbar={this.props.closeSnackbar}
                      />
                    );
                  } else if (item["type"] === "section_models") {
                    return (
                      <SectionModels
                        key={index}
                        storeSectionInfo={this.storeSectionInfo}
                        data={item}
                        numResources={
                          Object.keys(this.state.resources).length
                        }
                        handleDelete={this.deleteResourceSection}
                        handleMoveDown={this.moveDownResourceSection}
                        handleMoveUp={this.moveUpResourceSection}
                        enqueueSnackbar={this.props.enqueueSnackbar}
                        closeSnackbar={this.props.closeSnackbar}
                      />
                    );
                  } else if (item["type"] === "section_generic") {
                    return (
                      <SectionGeneric
                        key={index}
                        storeSectionInfo={this.storeSectionInfo}
                        data={item}
                        numResources={
                          Object.keys(this.state.resources).length
                        }
                        handleDelete={this.deleteResourceSection}
                        handleMoveDown={this.moveDownResourceSection}
                        handleMoveUp={this.moveUpResourceSection}
                      />
                    );
                  } else if (item["type"] === "section_custom") {
                    return (
                      <SectionCustom
                        key={index}
                        storeSectionInfo={this.storeSectionInfo}
                        data={item}
                        numResources={
                          Object.keys(this.state.resources).length
                        }
                        handleDelete={this.deleteResourceSection}
                        handleMoveDown={this.moveDownResourceSection}
                        handleMoveUp={this.moveUpResourceSection}
                      />
                    );
                  } else {
                    return null;
                  }
                })
                : null}
              <br />
            </div>
            <br />
            <div
              style={{
                paddingLeft: "10%",
                paddingRight: "10%",
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
                    overflowX: "hidden"
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
                    overflowX: "hidden"
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
                    overflowX: "hidden"
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
                    overflowX: "hidden"
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
                    overflowX: "hidden"
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
            <div
              className="note rounded intro"
              style={{
                width: "50%",
                fontSize: 16,
                lineHeight: 1.75,
                textAlign: "center"
              }}
            >
              {lastSaveInfo}
            </div>
          </div>

          <Footer>
            <div style={{ height: "10px", backgroundColor: "#FFFFFF" }}></div>
            <div style={{ border: "1px solid #000000" }}>
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
                  height: "57.5px",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    width: "17.5%",
                    backgroundColor: "#00A595",
                    color: "#000000",
                    fontWeight: "bold",
                    border: "solid",
                    borderColor: "#000000",
                    borderWidth: "1px",
                    overflowX: "hidden"
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
                    backgroundColor: "#29B480",
                    color: "#000000",
                    fontWeight: "bold",
                    border: "solid",
                    borderColor: "#000000",
                    borderWidth: "1px",
                    overflowX: "hidden"
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
                    backgroundColor: "#61CA62",
                    color: "#000000",
                    fontWeight: "bold",
                    border: "solid",
                    borderColor: "#000000",
                    borderWidth: "1px",
                    overflowX: "hidden"
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
                    backgroundColor: "#9CE142",
                    color: "#000000",
                    fontWeight: "bold",
                    border: "solid",
                    borderColor: "#000000",
                    borderWidth: "1px",
                    overflowX: "hidden"
                  }}
                  onClick={this.handleSubmitOpen}
                >
                  Submit
                </Button>
              </div>
            </div>
          </Footer>
          {saveModal}
          {submitModal}
          {this.state.showDescHelp ? (
            <ModalDialog
              open={this.state.showDescHelp}
              title="Markdown / Latex Description Input Format"
              content={<MarkdownLatexExample />}
              handleClose={this.handleDescHelpClose}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    );
  }
}
export default withSnackbar(CreateLivePaper);
