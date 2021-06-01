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

import ContextMain from "./ContextMain";
import DynamicTablePerson from "./DynamicTablePerson";
import SingleSelect from "./SingleSelect";
import SectionMorphology from "./SectionMorphology";
import SectionTraces from "./SectionTraces";
import SectionModels from "./SectionModels";
import SectionGeneric from "./SectionGeneric";
import SectionCustom from "./SectionCustom";
import SwitchMultiWay from "./SwitchMultiWay";
import TopNavigation from "./TopNavigation";
import SaveModal from "./SaveModal";
import SubmitModal from "./SubmitModal";
import {
  baseUrl,
  lp_tool_version,
  modelDB_baseUrl,
  neuromorpho_baseUrl,
  biomodels_baseUrl,
  corsProxy,
  filterModelDBKeys,
  filterNeuroMorphoKeys,
  filterBioModelsKeys,
} from "./globals";
import { showNotification, compareArrayoOfObjectsByOrder } from "./utils";

import nunjucks from "nunjucks";
import LivePaper_v02 from "./templates/LivePaper_v0.2.njk";

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
  backgroundColor: "#FFD180",
  fontSize: "20px",
  color: "black",
  textAlign: "center",
  position: "fixed",
  left: "50%",
  transform: "translateX(-50%)",
  bottom: "0",
  height: "80px",
  zIndex: "1",
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
      modified_date: new Date(),
      authors: [{ firstname: "", lastname: "", affiliation: "" }],
      corresponding_author: { firstname: "", lastname: "", affiliation: "" }, // "email" removed
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
      validKGFilterValues: null,
      validModelDBFilterValues: null,
      validNeuroMorphoFilterValues: null,
      validBioModelsFilterValues: null,
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
    this.handleCreatedAuthorChange = this.handleCreatedAuthorChange.bind(this);
    this.makePageTitleString = this.makePageTitleString.bind(this);
    this.makeAuthorsAndAffiliationsString =
      this.makeAuthorsAndAffiliationsString.bind(this);
    this.makeCreatedAuthorsString = this.makeCreatedAuthorsString.bind(this);
    this.handleAddSection = this.handleAddSection.bind(this);
    this.storeSectionInfo = this.storeSectionInfo.bind(this);
    this.removeExcessData = this.removeExcessData.bind(this);
    this.addDerivedData = this.addDerivedData.bind(this);
    this.getCollabList = this.getCollabList.bind(this);
    this.setID = this.setID.bind(this);
    this.setCollabID = this.setCollabID.bind(this);
    this.setLivePaperTitle = this.setLivePaperTitle.bind(this);
    this.setLivePaperModifiedDate = this.setLivePaperModifiedDate.bind(this);
    this.verifyDataBeforeSubmit = this.verifyDataBeforeSubmit.bind(this);
    this.checkPersonInStateAuthors = this.checkPersonInStateAuthors.bind(this);
    this.deleteResourceSection = this.deleteResourceSection.bind(this);
    this.moveDownResourceSection = this.moveDownResourceSection.bind(this);
    this.moveUpResourceSection = this.moveUpResourceSection.bind(this);
    this.retrieveKGFilterValidValues =
      this.retrieveKGFilterValidValues.bind(this);
    this.retrieveModelDBFilterValidValues =
      this.retrieveModelDBFilterValidValues.bind(this);
    this.retrieveNeuroMorphoFilterValidValues =
      this.retrieveNeuroMorphoFilterValidValues.bind(this);
    this.retrieveBioModelsFilterValidValues =
      this.retrieveBioModelsFilterValidValues.bind(this);
  }

  componentDidMount() {
    this.getCollabList();
    this.retrieveKGFilterValidValues();
    this.retrieveModelDBFilterValidValues();
    this.retrieveNeuroMorphoFilterValidValues();
    this.retrieveBioModelsFilterValidValues();
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
      "info"
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
      "validKGFilterValues",
      "validBioModelsFilterValues",
      "validModelDBFilterValues",
      "validNeuroMorphoFilterValues",
    ];
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

    // check if resources use tabs; handle appropriately
    data.resources.forEach(function (res, index) {
      if (res.type !== "section_custom") {
        let tabs = [];
        res.dataFormatted.forEach(function (res_item, index) {
          tabs.push(res_item.tab_name || "");
        });
        // get only unique elements
        tabs = tabs.filter((x, i, a) => a.indexOf(x) === i);
        // replace empty string with "no tab name"
        tabs = tabs.map((item) => (item === "" ? "no tab name" : item));
        // add tab names to resource data
        res["tabs"] = tabs;
      }
    });
    return data;
  }

  handleClose() {
    this.props.onClose();
  }

  handlePreview() {
    let lp_data = this.addDerivedData(this.removeExcessData(this.state));

    // determine appropriate live paper template
    let LivePaper = null;
    const lp_version = parseFloat(lp_data.lp_tool_version);
    if (lp_version > 0.2) {
      // add handling for newer templates here as required
      console.log("ERROR: no appropriate template found");
      console.log("Fall back to template v0.2");
      LivePaper = LivePaper_v02;
    } else {
      LivePaper = LivePaper_v02;
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
      "info"
    );
  }

  handleDownload() {
    let lp_data = this.addDerivedData(this.removeExcessData(this.state));

    // determine appropriate live paper template
    let LivePaper = null;
    const lp_version = parseFloat(lp_data.lp_tool_version);
    if (lp_version > 0.2) {
      // add handling for newer templates here as required
      console.log("ERROR: no appropriate template found");
      console.log("Fall back to template v0.2");
      LivePaper = LivePaper_v02;
    } else {
      LivePaper = LivePaper_v02;
    }

    const tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
    const timestamp = new Date(Date.now() - tzoffset)
      .toISOString()
      .replace(/T/, "_") // replace T with an underscore
      .replaceAll(":", "-") // replace : with -
      .replace(/\..+/, ""); // delete the dot and everything after

    function render(data, timestamp) {
      fetch(LivePaper_v02)
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

  handleSaveClose() {
    this.setState({
      saveOpen: false,
    });
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
    this.setState({
      authors: author_data,
    });
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
    var affiliations_string = unique_affs_strings.join(", ");

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
          created_authors_string = created_authors_string + ", ";
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
    console.log("===================================================");
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

  setID(value) {
    console.log(value);
    this.setState({
      id: value,
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

  setLivePaperModifiedDate(value) {
    console.log(value);
    this.setState({
      modified_date: value,
    });
  }

  verifyDataBeforeSubmit() {}

  retrieveKGFilterValidValues() {
    let url = baseUrl + "/vocab/";
    let config = {
      cancelToken: this.signal.token,
      headers: { Authorization: "Bearer " + this.context.auth[0].token },
    };
    axios
      .get(url, config)
      .then((res) => {
        this.setState({
          validKGFilterValues: res.data,
        });
      })
      .catch((err) => {
        console.log("Error: ", err.message);
      });
  }

  retrieveModelDBFilterValidValues() {
    let modelDBReqs = [];
    for (let item of filterModelDBKeys) {
      let url = corsProxy + modelDB_baseUrl + "/" + item + "/name";
      modelDBReqs.push(axios.get(url));
    }
    const context = this;

    Promise.all(modelDBReqs).then(function (res) {
      console.log(res);
      let data_dict = {};

      filterModelDBKeys.forEach(function (item, i) {
        data_dict[item] = res[i].data;
      });
      context.setState({
        validModelDBFilterValues: data_dict,
      });
    });
  }

  retrieveNeuroMorphoFilterValidValues() {
    let neuroMorphoReqs = [];
    for (let item of filterNeuroMorphoKeys) {
      let url = corsProxy + neuromorpho_baseUrl + "/neuron/fields/" + item;
      neuroMorphoReqs.push(axios.get(url));
    }
    const context = this;

    Promise.all(neuroMorphoReqs).then(function (res) {
      console.log(res);
      let data_dict = {};

      filterNeuroMorphoKeys.forEach(function (item, i) {
        data_dict[item] = res[i].data.fields;
      });
      console.log(data_dict);
      context.setState({
        validNeuroMorphoFilterValues: data_dict,
      });
    });
  }

  retrieveBioModelsFilterValidValues() {
    let url = corsProxy + biomodels_baseUrl + "/search?query=*%3A*&format=json";
    axios
      .get(url)
      .then((res) => {
        // create list of shortlisted filters
        let filters = {};
        console.log(res);
        for (let item of res.data.facets) {
          if (filterBioModelsKeys.includes(item.id)) {
            filters[item.id] = [];
            for (let option of item.facetValues) {
              filters[item.id].push(option.value);
            }
          }
        }
        console.log(filters);
        this.setState({
          validBioModelsFilterValues: filters,
        });
      })
      .catch((err) => {
        console.log("Error: ", err.message);
      });
  }

  render() {
    console.log(this.state);
    console.log(
      this.state.collab_list ? this.state.collab_list.length : "not loaded"
    );
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
          collab_list={this.state.collab_list}
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
            <TopNavigation />
            <div className="box rounded centered" style={{ marginTop: "5px" }}>
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
                          className="ebrains-icon-small"
                          src="./imgs/ebrains_logo.png"
                          alt="EBRAINS logo"
                          style={{ width: "25px", height: "25px" }}
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
                          numResources={
                            Object.keys(this.state.resources).length
                          }
                          handleDelete={this.deleteResourceSection}
                          handleMoveDown={this.moveDownResourceSection}
                          handleMoveUp={this.moveUpResourceSection}
                          validNeuroMorphoFilterValues={
                            this.state.validNeuroMorphoFilterValues
                          }
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
                          validKGFilterValues={this.state.validKGFilterValues}
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
                          validKGFilterValues={this.state.validKGFilterValues}
                          validModelDBFilterValues={
                            this.state.validModelDBFilterValues
                          }
                          validBioModelsFilterValues={
                            this.state.validBioModelsFilterValues
                          }
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
