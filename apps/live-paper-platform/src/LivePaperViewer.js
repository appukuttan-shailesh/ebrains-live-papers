import React from "react";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { separator } from "./globals";
import {
  compareArrayoOfObjectsByOrder,
  replaceNullWithEmptyStrings,
} from "./utils";

import nunjucks from "nunjucks";
import LivePaper_v02 from "./templates/LivePaper_v0.2.njk";

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

export default class LivePaperViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lp_data: this.props.data,
      html_content: null,
    };

    this.handleClose = this.handleClose.bind(this);
    this.addDerivedData = this.addDerivedData.bind(this);
    this.makePageTitleString = this.makePageTitleString.bind(this);
    this.makeAuthorsAndAffiliationsString =
      this.makeAuthorsAndAffiliationsString.bind(this);
    this.makeCreatedAuthorsString = this.makeCreatedAuthorsString.bind(this);
  }

  componentDidMount() {
    let lp_data = this.state.lp_data;

    // along the lines of LivePaperBuilder.App.handleLoadProjectKGClose()
    //  + LivePaperBuilder.CreateLivePaper.addDerivedData()

    // replace null values with empty strings
    // avoids errors, e.g. `value` prop on `textarea` should not be null
    lp_data = replaceNullWithEmptyStrings(lp_data);

    // sort resource sections by order #
    lp_data.resources.sort(compareArrayoOfObjectsByOrder);

    // KG requires 'dataFormatted' value for SectionCustom in 'description' field
    // doing reverse mapping here
    lp_data.resources.forEach(function (res, index) {
      // creating extra copy here to handle problem with shallow copy of nested object
      let temp_res = JSON.parse(JSON.stringify(res));
      if (res.type === "section_custom") {
        res.dataFormatted = temp_res.description;
        delete res.description;
      }
    });

    // handle useTabs for resources
    // KG doesn't have a separate field for saving tabs_name;
    // this is handled by appending it to the label with a separator (#-#)
    // we do the reverse when loading LP project from KG
    lp_data.resources.forEach(function (res, index) {
      if (res.type !== "section_custom") {
        let tabs = [];
        res.dataFormatted.forEach(function (res_item, index) {
          let parts = res_item.label.split(separator);
          if (parts.length > 1) {
            tabs.push(parts[1] || "");
            res_item.label = parts[0];
            res_item.tab_name = parts[1];
          }
        });
        // get only unique elements
        tabs = tabs.filter((x, i, a) => a.indexOf(x) === i);
        // add tab names to resource data
        res["useTabs"] = tabs.length > 1 || tabs[0] !== "" ? true : false;
      }
    });

    // add additional derived data
    lp_data = this.addDerivedData(lp_data);

    // determine appropriate live paper template
    let LivePaper = null;
    const lp_version = parseFloat(lp_data.lp_tool_version)
    if (lp_version > 0.2) {
        // add handling for newer templates here as required
        console.log("ERROR: no appropriate template found");
        console.log("Fall back to template v0.2")
        LivePaper = LivePaper_v02
    } else {
        LivePaper = LivePaper_v02
    }


    fetch(LivePaper)
      .then((r) => r.text())
      .then((source) => {
        var output = nunjucks.renderString(source, lp_data);
        this.setState({
          html_content: output,
        });
        // var w = window.open("");
        // w.document.write(output);
        // w.document.close();
      });
  }

  handleClose() {
    this.props.onClose();
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

  makePageTitleString() {
    const year = new Date(this.state.lp_data.year).getFullYear();
    const author_data = this.state.lp_data.authors;
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
    this.state.lp_data.authors.forEach(function (item) {
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
    this.state.lp_data.authors.forEach(function (author, index) {
      if (author.firstname.trim() !== "" || author.lastname.trim() !== "") {
        if (authors_string !== "") {
          authors_string = authors_string + ", ";
        }
        var affs = author.affiliation.split(";").map(function (x) {
          return x.trim();
        });
        console.log(affs);
        console.log(unique_affs);
        let author_affs = "";
        affs.forEach(function (aff) {
          console.log(aff);
          if (author_affs !== "") {
            author_affs = author_affs + ",";
          }
          if (aff !== "" && unique_affs.includes(aff)) {
            author_affs =
              author_affs + (unique_affs.indexOf(aff) + 1).toString();
          }
        });
        console.log(author_affs);

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
    this.state.lp_data.created_author.forEach(function (created_author, index) {
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

  render() {
    // console.log(this.props);
    // console.log(this.state.html_content);
    return (
      <Dialog
        fullScreen
        onClose={this.handleClose}
        aria-labelledby="simple-dialog-title"
        open={this.props.open}
      >
        <MyDialogTitle onClose={this.handleClose} />
        <DialogContent>
          <div
            className="centered"
            style={{
              marginTop: "5px",
              paddingTop: "50px",
              paddingBottom: "50px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItem: "center",
              }}
            >
              <span style={{ fontSize: 16 }}>Loading... please wait</span>
            </div>
          </div>
          <iframe
            title={this.makePageTitleString()}
            srcDoc={this.state.html_content}
            style={{
              position: "fixed",
              top: 50,
              left: 0,
              bottom: 0,
              right: 0,
              width: "100%",
              height: "100%",
              border: "none",
              margin: 0,
              marginRight: 20,
              padding: 0,
              overflow: "hidden",
              zIndex: 999999,
            }}
          >
            Your browser doesn't support iframes
          </iframe>
        </DialogContent>
      </Dialog>
    );
  }
}
