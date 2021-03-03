import React from "react";
import Grid from "@material-ui/core/Grid";
import MaterialIconSelector from "./MaterialIconSelector";
import HelpIcon from "@material-ui/icons/Help";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import ModalDialog from "./ModalDialog";
import DialogConfirm from "./DialogConfirm";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ForwardIcon from "@material-ui/icons/Forward";
import UnfoldMoreIcon from "@material-ui/icons/UnfoldMore";
import UnfoldLessIcon from "@material-ui/icons/UnfoldLess";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import styled from "styled-components";

function HelpContentTraces() {
  return (
    <div>
      The traces data can be input in any one of the following formats:
      <br />
      <br />
      <h6>
        <b>One URL per line</b>
      </h6>
      You should enter a single URL per line. This format will automatically use
      the file names as labels for each entry.
      <i>Example:</i>
      <br />
      <code>
        https://www.datasource.com/traces/oh140807_A0_idB.abf
        https://www.datasource.com/traces/oh140807_A0_idC.abf
        https://www.datasource.com/traces/oh140807_A0_idF.abf
        https://www.datasource.com/traces/oh140807_A0_idG.abf
        https://www.datasource.com/traces/oh140807_A0_idH.abf
      </code>
      <br />
      <br />
      <h6>
        <b>List of URLs</b>
      </h6>
      This format will automatically use the file names as labels for each
      entry.
      <i>Example:</i>
      <br />
      <code>
        [ "https://www.datasource.com/traces/oh140807_A0_idB.abf",
        "https://www.datasource.com/traces/oh140807_A0_idC.abf",
        "https://www.datasource.com/traces/oh140807_A0_idF.abf",
        "https://www.datasource.com/traces/oh140807_A0_idG.abf",
        "https://www.datasource.com/traces/oh140807_A0_idH.abf", ]
      </code>
      <br />
      <br />
      <h6>
        <b>List of sub-lists with two elements</b>
      </h6>
      This format allows you to specify the labels for each entry. The first
      item in sub-list is the URL and the second item is the label.
      <i>Example:</i>
      <br />
      <code>
        {JSON.stringify([
          ["https://www.datasource.com/traces/oh140807_A0_idB.abf", "file_A"],
          ["https://www.datasource.com/traces/oh140807_A0_idC.abf", "file_B"],
          ["https://www.datasource.com/traces/oh140807_A0_idF.abf", "file_C"],
          ["https://www.datasource.com/traces/oh140807_A0_idG.abf", "file_D"],
          ["https://www.datasource.com/traces/oh140807_A0_idH.abf", "file_E"],
        ])}
      </code>
      <br />
      <br />
      <h6>
        <b>List of dicts/objects</b>
      </h6>
      This format allows you to specify the labels for each entry. Each dict in
      the list should have keys named 'url' and 'label'.
      <i>Example:</i>
      <br />
      <code>
        {JSON.stringify([
          {
            url: "https://www.datasource.com/traces/oh140807_A0_idB.abf",
            label: "file_A",
          },
          {
            url: "https://www.datasource.com/traces/oh140807_A0_idC.abf",
            label: "file_B",
          },
          {
            url: "https://www.datasource.com/traces/oh140807_A0_idF.abf",
            label: "file_C",
          },
          {
            url: "https://www.datasource.com/traces/oh140807_A0_idG.abf",
            label: "file_D",
          },
          {
            url: "https://www.datasource.com/traces/oh140807_A0_idH.abf",
            label: "file_E",
          },
        ])}
      </code>
    </div>
  );
}

const Icon = styled((props) => (
  <div {...props} style={{ color: "#000000" }}>
    <div className="y">
      <span style={{ verticalAlign: "middle" }}>
        <UnfoldMoreIcon />
      </span>
    </div>
    <div className="n">
      <span style={{ verticalAlign: "middle" }}>
        <UnfoldLessIcon />
      </span>
    </div>
  </div>
))`
  & > .y {
    display: block;
  }
  & > .n {
    display: none;
  }
  .Mui-expanded & > .n {
    display: block;
  }
  .Mui-expanded & > .y {
    display: none;
  }
`;

export default class SectionTraces extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: null,
      type: "section_traces",
      title: "Recordings / Traces",
      icon: "timeline",
      description: "",
      data: "",
      dataOk: true,
      dataFormatted: [],
      showHelp: false,
      deleteOpen: false,
      expanded: true,
      ...props.data,
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.clickHelp = this.clickHelp.bind(this);
    this.handleHelpClose = this.handleHelpClose.bind(this);
    this.setIcon = this.setIcon.bind(this);
    this.handleDataInputOnBlur = this.handleDataInputOnBlur.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleMoveDown = this.handleMoveDown.bind(this);
    this.handleMoveUp = this.handleMoveUp.bind(this);
    this.toggleExpanded = this.toggleExpanded.bind(this);
  }

  componentDidMount() {
    this.props.storeSectionInfo(this.state);
  }

  toggleExpanded() {
    console.log(this.state.expanded);
    this.setState(
      (prevState) => ({
        expanded: !prevState.expanded,
      }),
      () => {
        this.props.storeSectionInfo(this.state);
      }
    );
  }

  handleDelete(flag) {
    console.log(flag);
    this.setState({ deleteOpen: false });
    if (flag) {
      this.props.handleDelete(this.state.order);
    }
  }

  handleMoveDown(event) {
    event.stopPropagation();
    this.props.handleMoveDown(this.state.order);
  }

  handleMoveUp(event) {
    event.stopPropagation();
    this.props.handleMoveUp(this.state.order);
  }

  handleFieldChange(event) {
    console.log(event);
    const target = event.target;
    let value = target.value;
    const name = target.name;
    // console.log(name + " => " + value);
    this.setState(
      {
        [name]: value,
      },
      () => {
        this.props.storeSectionInfo(this.state);
      }
    );
  }

  setIcon(icon_name) {
    this.setState(
      {
        icon: icon_name,
      },
      () => {
        this.props.storeSectionInfo(this.state);
      }
    );
  }

  clickHelp() {
    this.setState({
      showHelp: true,
    });
  }

  handleHelpClose() {
    this.setState({
      showHelp: false,
    });
  }

  handleDataInputOnBlur(event) {
    // check data input format
    console.log(event.target.value);

    function IsJsonString(str) {
      try {
        var json = JSON.parse(str);
        return typeof json === "object";
      } catch (e) {
        return false;
      }
    }

    if (IsJsonString(event.target.value)) {
      console.log("Input: JSON");
      // input is a JSON
      var data_json = JSON.parse(event.target.value);

      // check if it is a list of lists, or a list of dicts
      function checkIfArrayUrlLabel(item) {
        return (
          Array.isArray(item) &&
          item.length === 2 &&
          typeof item[0] === "string" &&
          typeof item[1] === "string"
        );
      }
      function checkIfArrayOnlyUrl(item) {
        return typeof item === "string";
      }
      function checkIfObject(item) {
        return (
          typeof item === "object" &&
          item !== null &&
          "url" in item &&
          "label" in item &&
          typeof item["url"] === "string" &&
          typeof item["label"] === "string"
        );
      }

      if (Array.isArray(data_json) && data_json.every(checkIfArrayUrlLabel)) {
        // data is a list of lists with both url and label
        console.log("Input: JSON - list of lists - URL, label");
        let data_formatted = [];
        data_json.forEach(function (item) {
          data_formatted.push({
            url: item[0].trim(),
            label: item[1].trim(),
          });
        });
        this.setState(
          {
            dataFormatted: data_formatted,
            dataOk: true,
          },
          () => {
            this.props.storeSectionInfo(this.state);
          }
        );
      } else if (
        Array.isArray(data_json) &&
        data_json.every(checkIfArrayOnlyUrl)
      ) {
        // data is a list of lists with only url
        console.log("Input: JSON - list of lists - only URL");
        let data_formatted = [];
        data_json.forEach(function (item) {
          console.log(item);
          data_formatted.push({
            url: item.trim(),
            label: item.match(/([^/]+)(?=\.\w+$)/)[0].trim(),
          });
        });
        this.setState(
          {
            dataFormatted: data_formatted,
            dataOk: true,
          },
          () => {
            this.props.storeSectionInfo(this.state);
          }
        );
      } else if (Array.isArray(data_json) && data_json.every(checkIfObject)) {
        // data is a list of dicts
        console.log("Input: JSON - list of dicts");
        this.setState(
          {
            dataFormatted: data_json,
            dataOk: true,
          },
          () => {
            this.props.storeSectionInfo(this.state);
          }
        );
      } else {
        console.log("Input: JSON - invalid format");
        this.setState(
          {
            dataFormatted: [],
            dataOk: false,
          },
          () => {
            this.props.storeSectionInfo(this.state);
          }
        );
      }
    } else {
      // input is just string
      // Aim: convert to list of dicts with keys "url" and "label"
      let data_formatted = [];
      // break string into lines
      try {
        var items = event.target.value.match(/[^\r\n]+/g);
        if (items) {
          items.forEach(function (item) {
            let part_url = item.split(",")[0];
            let part_label = item.split(",")[1];
            console.log(part_url, part_label);
            if (!part_label) {
              part_label = item.match(/([^/]+)(?=\.\w+$)/)[0];
            }
            console.log(part_url, part_label);
            data_formatted.push({
              url: part_url.trim(),
              label: part_label.trim(),
            });
          });
        }
        this.setState(
          {
            dataOk: true,
            dataFormatted: items ? data_formatted : [],
          },
          () => {
            this.props.storeSectionInfo(this.state);
          }
        );
      } catch (error) {
        console.error(error);
        this.setState(
          {
            dataFormatted: [],
            dataOk: false,
          },
          () => {
            this.props.storeSectionInfo(this.state);
          }
        );
      }
    }
  }

  render() {
    return (
      <div style={{ width: "100%", paddingTop: "25px", paddingBottom: "25px" }}>
        <Accordion
          expanded={this.state.expanded}
          onChange={this.toggleExpanded}
        >
          <AccordionSummary
            expandIcon={<Icon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderStyle: "solid",
              borderColor: "#194D1B",
              borderWidth: "2px",
              backgroundColor: "#70BF73",
              fontWeight: "bold",
              color: "#000000",
              width: "100%",
              paddingRight: "25px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
                width: "100%",
              }}
            >
              <div
                style={{
                  fontWeight: "bolder",
                  color: "#000000",
                }}
              >
                <span style={{ verticalAlign: "middle" }}>
                  Section: Recordings / Traces
                </span>
              </div>
              <div>
                <Tooltip title="Delete this section">
                  <DeleteForeverIcon
                    style={{
                      height: "25px",
                      width: "25px",
                      marginRight: "30px",
                      color: "#000000",
                    }}
                    onClick={(event) => {
                      event.stopPropagation();
                      this.setState({ deleteOpen: true });
                    }}
                    onFocus={(event) => event.stopPropagation()}
                  />
                </Tooltip>
                <Tooltip title="Move section down">
                  <ForwardIcon
                    stroke={"#000000"}
                    strokeWidth={1}
                    style={{
                      marginRight: "30px",
                      transform: `rotate(90deg)`,
                      color:
                        this.state.order === this.props.numResources - 1
                          ? "#A1887F"
                          : "#000000",
                    }}
                    onClick={(event) => this.handleMoveDown(event)}
                    onFocus={(event) => event.stopPropagation()}
                  />
                </Tooltip>
                <Tooltip title="Move section up">
                  <ForwardIcon
                    stroke={"#000000"}
                    strokeWidth={1}
                    style={{
                      marginRight: "20px",
                      transform: `rotate(270deg)`,
                      color: this.state.order === 0 ? "#A1887F" : "#000000",
                    }}
                    onClick={(event) => this.handleMoveUp(event)}
                    onFocus={(event) => event.stopPropagation()}
                  />
                </Tooltip>
              </div>
            </div>
          </AccordionSummary>
          <AccordionDetails
            style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}
          >
            <div
              style={{
                backgroundColor: "#E2F2E3",
                width: "100%",
              }}
            >
              <div
                style={{
                  marginLeft: "10px",
                  marginRight: "10px",
                }}
              >
                <br />
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div style={{ width: "50px" }}>
                    <MaterialIconSelector
                      size="35px"
                      icon={this.state.icon}
                      setIcon={this.setIcon}
                    />
                  </div>
                  <div style={{ paddingLeft: "20px", flexGrow: 1 }}>
                    <TextField
                      label="Section Title"
                      variant="outlined"
                      fullWidth={true}
                      name="title"
                      value={this.state.title}
                      onChange={this.handleFieldChange}
                      InputProps={{
                        style: {
                          padding: "5px 15px",
                          backgroundColor: "#FFFFFF",
                        },
                      }}
                    />
                  </div>
                  <div
                    style={{
                      width: "50px",
                      paddingLeft: "20px",
                      paddingTop: "10px",
                      paddingBottom: "10px",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Tooltip title="Click for info on input format">
                      <HelpIcon
                        style={{ width: 30, height: 30 }}
                        onClick={this.clickHelp}
                      />
                    </Tooltip>
                  </div>
                </div>
                <br />

                <Grid item xs={12}>
                  <TextField
                    multiline
                    rows="2"
                    label="Description of electrophysiological traces (optional)"
                    variant="outlined"
                    fullWidth={true}
                    helperText="The description may be formatted with Markdown"
                    name="description"
                    value={this.state.description}
                    onChange={this.handleFieldChange}
                    InputProps={{
                      style: {
                        padding: "15px 15px",
                        backgroundColor: "#FFFFFF",
                      },
                    }}
                  />
                </Grid>

                <br />

                <Grid item xs={12}>
                  <TextField
                    multiline
                    rows="8"
                    label="Input all electrophysiological traces (with labels optionally)"
                    variant="outlined"
                    fullWidth={true}
                    helperText={
                      this.state.dataOk
                        ? "Click on ? icon for info on input format."
                        : "Data not in expected format! Click on '?' for more info."
                    }
                    name="data"
                    value={this.state.data}
                    onChange={this.handleFieldChange}
                    onBlur={this.handleDataInputOnBlur}
                    error={!this.state.dataOk}
                    InputProps={{
                      style: {
                        padding: "15px 15px",
                        backgroundColor: "#FFFFFF",
                      },
                    }}
                  />
                </Grid>
                <br />
                <br />
                {this.state.showHelp ? (
                  <ModalDialog
                    title="Electrophysiological Traces Input"
                    open={this.state.showHelp}
                    handleClose={this.handleHelpClose}
                    content={<HelpContentTraces />}
                  />
                ) : null}
              </div>
              <DialogConfirm
                open={this.state.deleteOpen}
                title="Please confirm to delete!"
                text={
                  "Do you wish to delete the traces resource section with title: <b>" +
                  this.state.title +
                  "</b>"
                }
                handleClose={this.handleDelete}
                size="xs"
              />
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }
}
