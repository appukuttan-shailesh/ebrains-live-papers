import React from "react";
import Grid from "@material-ui/core/Grid";
import MaterialIconSelector from "./MaterialIconSelector";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import ModalDialog from "./ModalDialog";
import DialogConfirm from "./DialogConfirm";
import DynamicTableItems from "./DynamicTableItems";
import ToggleSwitch from "./ToggleSwitch";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ForwardIcon from "@material-ui/icons/Forward";
import UnfoldMoreIcon from "@material-ui/icons/UnfoldMore";
import UnfoldLessIcon from "@material-ui/icons/UnfoldLess";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import styled from "styled-components";

function HelpContent() {
  const list_of_dicts = `
    [
        {
          url: "https://www.datasource.com/listing/file_idB.dat",
          label: "file_A",
        },
        {
          url: "https://www.datasource.com/listing/file_idC.dat",
          label: "file_B",
        },
        {
          url: "https://www.datasource.com/listing/file_idF.dat",
          label: "file_C",
        },
        {
          url: "https://www.datasource.com/listing/file_idG.dat",
          label: "file_D",
        },
        {
          url: "https://www.datasource.com/listing/file_idH.dat",
          label: "file_E",
        },
      ]`;

  return (
    <div>
      The listing data can be input in the following format:
      <br />
      <br />
      <h6>
        <b>List of dicts/objects</b>
      </h6>
      This format allows you to specify the labels for each entry. Each dict in
      the list should have keys named 'url' and 'label'.
      <i>Example:</i>
      <br />
      <pre>
        <code>{list_of_dicts}</code>
      </pre>
    </div>
  );
}

export class SectionGenericEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showHelp: false,
      dataOk: true,
      data: props.data,
    };

    this.clickHelp = this.clickHelp.bind(this);
    this.handleHelpClose = this.handleHelpClose.bind(this);
    this.handleDataInputOnBlur = this.handleDataInputOnBlur.bind(this);
    this.handleSaveData = this.handleSaveData.bind(this);
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

      // check if list of dicts in required format
      function checkIfObject(item) {
        return (
          typeof item === "object" &&
          item !== null &&
          "url" in item &&
          "label" in item &&
          "tab_name" in item &&
          typeof item["url"] === "string" &&
          typeof item["label"] === "string" &&
          typeof item["tab_name"] === "string"
        );
      }

      if (Array.isArray(data_json) && data_json.every(checkIfObject)) {
        // data is a list of dicts
        console.log("Input: JSON - list of dicts");
        this.setState({
          dataOk: true,
          data: data_json,
        });
      } else {
        console.log("Input: JSON - invalid format");
        this.setState({
          dataOk: false,
        });
      }
    } else {
      console.log("Data not in proper format!");
      this.setState({
        dataOk: false,
      });
    }
  }

  handleSaveData(flag) {
    if (flag) {
      console.log(flag);
      if (this.state.dataOk) {
        console.log("Saved");
        this.props.onChangeValue(this.state.data);
        this.props.handleClose();
      } else {
        console.log("Error");
        console.log("Edited data not in proper format!");
      }
    } else {
      this.props.handleClose();
    }
  }

  renderContent() {
    return (
      <div>
        <Grid item xs={12}>
          <TextField
            multiline
            rows="8"
            label="Edit source code for listing:"
            variant="outlined"
            fullWidth={true}
            helperText={"Click 'Help' for info on input format."}
            name="data"
            defaultValue={JSON.stringify(this.state.data, null, 4)}
            onBlur={this.handleDataInputOnBlur}
            error={!this.state.dataOk}
            InputProps={{
              style: {
                padding: "15px 15px",
                backgroundColor: "#FFFFFF",
              },
            }}
          />
          {!this.state.dataOk && (
            <div style={{ color: "red", paddingTop: "10px" }}>
              <strong>
                Data not in expected format! Click on 'Help' for more info.
              </strong>
            </div>
          )}
        </Grid>
        {this.state.showHelp ? (
          <ModalDialog
            open={this.state.showHelp}
            title="Data Input"
            headerBgColor="#AA91D7"
            content={<HelpContent />}
            handleClose={this.handleHelpClose}
          />
        ) : null}
      </div>
    );
  }

  render() {
    console.log(this.props);
    return (
      <DialogConfirm
        open={this.props.open}
        title={"Edit Source: " + this.props.title}
        headerBgColor="#AA91D7"
        content={this.renderContent()}
        handleClose={this.handleSaveData}
        clickHelp={this.clickHelp}
      />
    );
  }
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

export default class SectionGeneric extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: null,
      type: "section_generic",
      title: "Listing Title",
      icon: "format_list_bulleted",
      description: "",
      dataOk: true,
      dataFormatted: [],
      showEdit: false,
      deleteOpen: false,
      expanded: true,
      ...props.data,
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.clickEdit = this.clickEdit.bind(this);
    this.handleEditClose = this.handleEditClose.bind(this);
    this.setIcon = this.setIcon.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleMoveDown = this.handleMoveDown.bind(this);
    this.handleMoveUp = this.handleMoveUp.bind(this);
    this.toggleExpanded = this.toggleExpanded.bind(this);
    this.handleItemsChange = this.handleItemsChange.bind(this);
    this.toggleUseTabs = this.toggleUseTabs.bind(this);
  }

  componentDidMount() {
    this.props.storeSectionInfo(this.state);
  }

  handleItemsChange(items_data) {
    // remove all entries where label and url are all empty
    // function isNotEmpty(item) {
    //   if (
    //     item.label.trim() !== "" ||
    //     item.url.trim() !== ""
    //   ) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }
    // var items_data = data.filter(isNotEmpty);
    // console.log(items_data);
    if (items_data.length === 0) {
      items_data = [
        {
          type: "URL",
          label: "",
          url: "",
          identifier: null,
          tab_name: "",
        },
      ];
    }

    this.setState(
      {
        dataFormatted: items_data,
      },
      () => {
        this.props.storeSectionInfo(this.state);
      }
    );
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

  clickEdit() {
    this.setState({
      showEdit: true,
    });
  }

  handleEditClose() {
    this.setState({
      showEdit: false,
    });
  }

  toggleUseTabs() {
    if (this.state.useTabs) {
      // if turning off, then erase all tabs data
      let dataFormatted = this.state.dataFormatted;
      dataFormatted.forEach(function (item, index) {
        item.tab_name = "";
      });
      this.setState({
        dataFormatted: dataFormatted,
        useTabs: false,
      });
    } else {
      this.setState({
        useTabs: true,
      });
    }
  }

  render() {
    // console.log(this.state.dataFormatted);
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
              borderColor: "#311B92",
              borderWidth: "2px",
              backgroundColor: "#AA91D7",
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
                  fontSize: 16,
                  color: "#000000",
                }}
              >
                <span style={{ verticalAlign: "middle" }}>
                  Section: Generic Listing
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
                backgroundColor: "#EAE3F5",
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
                </div>
                <br />
                <Grid item xs={12}>
                  <TextField
                    multiline
                    rows="2"
                    label="Description (optional)"
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
                <Grid
                  item
                  xs={12}
                  style={{ paddingLeft: "10px", paddingBottom: "20px" }}
                >
                  <span style={{ paddingRight: "10px" }}>
                    Do you wish to use tabs to group items in this section?
                  </span>
                  <ToggleSwitch
                    id="genericTabs"
                    checked={this.state.useTabs}
                    onChange={this.toggleUseTabs}
                  />
                </Grid>
                {this.state.useTabs && (
                  <Grid
                    item
                    xs={12}
                    style={{ paddingLeft: "10px", paddingBottom: "20px" }}
                  >
                    <em>
                      Note: All items to be grouped together should be assigned
                      the same tab name.
                    </em>
                  </Grid>
                )}
                <DynamicTableItems
                  items={this.state.dataFormatted}
                  onChangeValue={this.handleItemsChange}
                  handleEdit={this.clickEdit}
                  numCols={2}
                  useTabs={this.state.useTabs}
                />
                <br />
                <br />
                {this.state.showEdit ? (
                  <SectionGenericEdit
                    open={this.state.showEdit}
                    title={this.state.title}
                    data={this.state.dataFormatted}
                    onChangeValue={this.handleItemsChange}
                    handleClose={this.handleEditClose}
                  />
                ) : null}
              </div>
              <DialogConfirm
                open={this.state.deleteOpen}
                title="Please confirm to delete!"
                headerBgColor="#AA91D7"
                content={
                  "Do you wish to delete the generic resource section with title: <b>" +
                  this.state.title +
                  "</b>"
                }
                handleClose={this.handleDelete}
                size="xs"
                onChangeValue={this.handleItemsChange}
              />
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }
}
