
import React from "react";
import { useLocation } from 'react-router-dom'
import Spreadsheet, { createEmptyMatrix } from "react-spreadsheet";
import { updateHash } from "./globals";
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import Button from "@material-ui/core/Button";
import "./App.css";
import AceEditor from "react-ace";
import "ace-builds/webpack-resolver"
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-tomorrow";
import { copyToClipboard } from "./utils";
import { useSnackbar } from 'notistack';

class BulkEntryWizardComp extends React.Component {
  constructor() {
    super();
    // this.state = {data: [
    //     [{ value: "Vanilla" }, { value: "Chocolate" }],
    //     [{ value: "Strawberry" }, { value: "Cookies" }],
    //   ]
    // };
    this.state = {
      data: createEmptyMatrix(10, 3),
      data_full: createEmptyMatrix(10, 5),
      data_json: "",
      section_type: "",
      mode: "Basic",
      num_rows: 10
    };

    this.handleTableChange = this.handleTableChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  
  componentDidMount() {
    const { location } = this.props;
    console.log(location.hash);

    if (location.hash) {
      if (["Morphology", "Recordings/Traces", "Models", "Generic"].includes(location.hash.split("#")[1])) {
        this.setState({
          section_type: location.hash.split("#")[1]
        })
      } else {
        updateHash("")
      }
    }
  }

  handleTableChange(value) {
    console.log(value);
    // For consistency, we enforce this order in the listing:
    // "Type", "Label", "URL", "View URL", "Tab Name"
    // Basic has: "Label", "URL", "Tab Name"

    // adjust data for data_full and data_json
    let value_full = [];
    if (this.state.mode === "Basic") {
      value.forEach(row => {
        value_full.push([
          { value: "" },   // add Type field; changed to "URL" later 
          row[0],
          row[1],
          { value: "" },  // add View URL field; changed to null later
          row[2]
        ])
      });
    }
    else {
      value_full = value;
    }

    let value_cleaned = value_full;
    // remove all empty rows
    value_cleaned = value_cleaned.filter(row => { return row.some(cell => Boolean(cell) && Boolean(cell["value"])) });
    // replace undefined and empty strings with null
    value_cleaned = value_cleaned.map(row => { return row.map(cell => { return cell && cell["value"] && cell["value"]!=="null" ? cell["value"] : null }) });

    // method to generate JSON as required by Live Paper section
    const generateJSON = (data) => {
      let json = [];
      data.forEach(row => {
        json.push({
          "identifier": null,
          "type": row[0] || "URL",
          "label": row[1],
          "url": row[2],
          "view_url": row[3],
          "tab_name": row[4] || "", // as required by Live Paper section
        })
      });
      return json;
    }

    this.setState({
      data: value,
      data_full: value_full,
      data_json: JSON.stringify(generateJSON(value_cleaned), null, 2)
    });
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    }, () => {
      this.setState(prevState => ({
        data: createEmptyMatrix(prevState.num_rows, prevState.mode === "Basic" ? 3 : 5),
        data_full: createEmptyMatrix(prevState.num_rows, 5),
        data_json: ""
      }))
    });
  };

  render() {
    console.log(this.state);

    return (
      <div className="container" style={{ textAlign: "left" }}>
        <br/>
        <br/>
        <div className="box rounded centered"
          style={{ marginTop: "5px", paddingTop: "0.75em", paddingBottom: "0.75em" }}>
          <a
            href="https://ebrains.eu/"
            target="_blank"
            rel="noopener noreferrer"
            className="waves-effect waves-light"
            style={{ textAlign: "center", color: "black" }}
          >
            <table>
              <tbody>
                <tr>
                  <td
                    style={{ paddingTop: "0px",
                             paddingBottom: "0px" }}>
                    <img
                      className="ebrains-icon-small"
                      src="./imgs/ebrains_logo.svg"
                      alt="EBRAINS logo"
                      style={{ height: "60px" }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </a>
          <h5 className="title-style">Live Paper Multi-Input Tool</h5>
        </div>
        <div
          style={{
            paddingLeft: "5%",
            paddingRight: "5%",
            textAlign: "justify",
          }}
        >
          This tool helps input multiple entries at once into Live Paper sections.
          You can copy-paste content from a spreadsheet or a text file below.
          'Basic' mode only displays the minimally required fields, while the
          'Advanced' mode displays all fields.
          <br/><br/>

          <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingLeft: "2.5%",
                paddingRight: "2.5%",
                paddingTop: "20px",
                paddingBottom: "20px",
                width: "100%",
              }}
          >
            <FormControl variant="filled">
              <FormHelperText style={{color: "black", fontSize: 14, fontWeight: "bolder"}}>Section Type:</FormHelperText>
              <Select
                id="section_type"
                name="section_type"
                value={this.state.section_type}
                onChange={this.handleChange}
                label="Age"
                style={{ width: "200px" }}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value={"Morphology"}>Morphology</MenuItem>
                <MenuItem value={"Recordings/Traces"}>Recordings/Traces</MenuItem>
                <MenuItem value={"Models"}>Models</MenuItem>
                <MenuItem value={"Generic"}>Generic</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="filled">
              <FormHelperText style={{color: "black", fontSize: 14, fontWeight: "bolder"}}>Mode:</FormHelperText>
              <Select
                id="mode"
                name="mode"
                value={this.state.mode}
                onChange={this.handleChange}
                label="Mode"
                style={{ width: "200px" }}
              >
                <MenuItem value={"Basic"}>Basic</MenuItem>
                <MenuItem value={"Advanced"}>Advanced</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="filled">
              <FormHelperText style={{color: "black", fontSize: 14, fontWeight: "bolder"}}>Show Rows:</FormHelperText>
              <Select
                id="num_rows"
                name="num_rows"
                value={this.state.num_rows}
                onChange={this.handleChange}
                label="Show Rows"
                style={{ width: "100px" }}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={75}>75</MenuItem>
                <MenuItem value={100}>100</MenuItem>
                <MenuItem value={200}>200</MenuItem>
              </Select>
            </FormControl>
          </div>
          { this.state.section_type &&
            <div>
              <strong>Note: </strong>Changing any of the above options will reset the spreadsheet.
            If necessary, please copy the content in the spreadsheet first, then change the options, 
            and paste the content back.
            <br/>
            <br/>
            { this.state.mode === "Advanced"
              ?
                <div>
                  <strong>Tip: </strong>
                  'Type' and 'View URL' can be set to 'URL' and null, respectively. Alternatively, both can be set to empty strings.
                  'Tab Name' can be left empty if grouping is not required.
                  <br/><br/>
                </div>
              :
                <div>
                  <strong>Tip: </strong>
                  'Tab Name' can be left empty if grouping is not required.
                  <br/><br/>
                </div>
            } 
            <div>
              <Spreadsheet data={this.state.data}  onChange={this.handleTableChange} 
                HeaderRowProps={{ style: {color: "black", backgroundColor: "lightgrey"}}}
                columnLabels={this.state.mode === "Basic" ? ["Label", "URL", "Tab Name"] : ["Type", "Label", "URL", "View URL", "Tab Name"]}
              />
            </div>
            <br/>
            <h6 style={{fontWeight:"bolder"}}>Output Code:</h6>
            <strong>Note: </strong>Code will be auto-generated based on data in the table above.
            This can then be copy-pasted into the "Edit Source" window of the corresponding section
            in the live paper builder.
            <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
            >
              <Button
                variant="contained"
                color="primary"
                style={{
                  width: "150px",
                  backgroundColor: "#FF9800",
                  color: "#000000",
                  fontWeight: "bold",
                  border: "solid",
                  borderColor: "#000000",
                  borderWidth: "1px",
                  marginBottom: "20px",
                }}
                onClick={() =>
                  copyToClipboard(
                      this.state.data_json,
                      this.props.enqueueSnackbar,
                      this.props.closeSnackbar,
                      "Copied to clipboard!",
                      "success"
                  )
                }
              >
                Copy
              </Button>
            </div>
            <div>
              <AceEditor
                // placeholder="Code will be auto-generated here based on data in the table above"
                mode="python"
                theme="tomorrow"
                name="description"
                fontSize={18}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                value={this.state.data_json}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: false,
                  showLineNumbers: true,
                  tabSize: 2,
                  useWorker: false,
                  readOnly: true,
                }}
                width="100%"
                height={"500px"}
                style={{border:"1px solid #000000"}}
              />
            </div>
          </div>
        }
        <br/>
        <br/>
        <br/>
        <br/>
        </div>
      </div>
    );
  }
}

// based on this: https://reactnavigation.org/docs/use-navigation/
// You can wrap your class component in a function component to use the hook:
export default function BulkEntryWizard(props) {
  const location = useLocation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  return <BulkEntryWizardComp {...props} 
            enqueueSnackbar={enqueueSnackbar} 
            closeSnackbar={closeSnackbar} 
            location={location} 
          />;
}