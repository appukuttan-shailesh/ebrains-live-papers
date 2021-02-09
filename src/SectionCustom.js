import React from "react";
import Grid from "@material-ui/core/Grid";
import MaterialIconSelector from "./MaterialIconSelector";
import HelpIcon from "@material-ui/icons/Help";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import ModalDialog from "./ModalDialog";
import { Converter } from "showdown";

function HelpContentCustom() {
  const example_markdown = `
    #### Sample Table

    | Tables        | Are           | Cool  |
    | ------------- |:-------------:| -----:|
    | col 3 is      | right-aligned | $1600 |
    | col 2 is      | centered      |   $12 |
    | zebra stripes | are neat      |    $1 |
    `;

  const example_html = `
    <h4 id="sampletable">Sample Table</h4>
    <table>
    <thead>
        <tr>
            <th>Tables</th>
            <th style="text-align:center;">Are</th>
            <th style="text-align:right;">Cool</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>col 3 is</td>
            <td style="text-align:center;">right-aligned</td>
            <td style="text-align:right;">$1600</td>
        </tr>
        <tr>
            <td>col 2 is</td>
            <td style="text-align:center;">centered</td>
            <td style="text-align:right;">$12</td>
        </tr>
        <tr>
            <td>zebra stripes</td>
            <td style="text-align:center;">are neat</td>
            <td style="text-align:right;">$1</td>
        </tr>
    </tbody>
    </table>`;

  return (
    <div>
      You can enter custom content using either Markdown syntax or HTML.
      <br />
      <br />
      <h6>
        <b>Example of Markdown input:</b>
      </h6>
      <pre>
        <code>{example_markdown}</code>
      </pre>
      <h6>
        <b>Example of HTML input:</b>
      </h6>
      <pre>
        <code>{example_html}</code>
      </pre>
    </div>
  );
}

export default class SectionCustom extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: null,
      type: "section_custom",
      title: "Custom Section",
      icon: "check_box_outline_blank",
      description: "",
      data: "",
      dataFormatted: "",
      showHelp: false,
      ...props.data
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.clickHelp = this.clickHelp.bind(this);
    this.handleHelpClose = this.handleHelpClose.bind(this);
    this.setIcon = this.setIcon.bind(this);
    this.handleDataInputOnBlur = this.handleDataInputOnBlur.bind(this);
  }

  componentDidMount() {
    this.props.storeSectionInfo(this.state);
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
    const converter = new Converter({ tables: true });
    let value = converter.makeHtml(this.state.data);

    this.setState(
      {
        dataFormatted: value,
      },
      () => {
        this.props.storeSectionInfo(this.state);
      }
    );
  }

  render() {
    return (
      <div>
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
            borderColor: "#525252",
            borderWidth: "2px",
            backgroundColor: "#D9D9D9",
            borderRadius: "20px",
            fontWeight: "bold",
            color: "#000000",
          }}
        >
          Section: Custom HTML / Markdown
        </div>
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
              },
            }}
          />
        </Grid>

        <br />

        <Grid item xs={12}>
          <TextField
            multiline
            rows="8"
            label="Input custom content"
            variant="outlined"
            fullWidth={true}
            helperText="Click on ? icon for info on input format."
            name="data"
            value={this.state.data}
            onChange={this.handleFieldChange}
            onBlur={this.handleDataInputOnBlur}
            InputProps={{
              style: {
                padding: "15px 15px",
                fontFamily:
                  "'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
              },
            }}
          />
        </Grid>
        <br />
        <br />
        {this.state.showHelp ? (
          <ModalDialog
            title="Custom Input"
            open={this.state.showHelp}
            handleClose={this.handleHelpClose}
            content={<HelpContentCustom />}
          />
        ) : null}
      </div>
    );
  }
}
