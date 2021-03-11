import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import AddToQueueIcon from "@material-ui/icons/AddToQueue";
import RemoveFromQueueIcon from "@material-ui/icons/RemoveFromQueue";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import Chip from "@material-ui/core/Chip";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import Typography from "@material-ui/core/Typography";
import MaterialTable, { MTableToolbar } from "@material-table/core";
import ErrorDialog from "./ErrorDialog";
import LoadingIndicator from "./LoadingIndicator";
import ContextMain from "./ContextMain";
import axios from "axios";
import Tooltip from "@material-ui/core/Tooltip";
import Link from "@material-ui/core/Link";
import { nar_baseUrl, querySizeLimit } from "./globals";

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

const DialogTitle = withStyles(styles)((props) => {
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
          <CloseIcon style={{ color: "#000000" }} />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

// define the columns for the material data table
const TABLE_COLUMNS = [
  {
    field: "id",
    title: "ID",
    hidden: true,
  },
  {
    field: "label",
    title: "Label",
  },
  {
    field: "modality",
    title: "Modality",
  },
  {
    field: "stimulation",
    title: "Stimulation",
  },
  {
    field: "timestamp",
    title: "Timestamp",
    hidden: true,
  },
  {
    field: "species",
    title: "Species",
    hidden: true,
  },
  {
    field: "cell_type",
    title: "Cell Type",
    hidden: true,
  },
  {
    field: "location",
    title: "Location",
    hidden: true,
    hiddenByColumnsButton: true,
  },
  {
    field: "view_url",
    title: "View URL",
    hidden: true,
    hiddenByColumnsButton: true,
  },
  {
    field: "parent_name",
    title: "Parent Name",
    hidden: true,
    hiddenByColumnsButton: true,
  },
  {
    field: "parent_id",
    title: "Parent ID",
    hidden: true,
    hiddenByColumnsButton: true,
  },
];

function IncludeButton(props) {
  //   console.log(props);
  if (props.includeFlag) {
    return (
      <Tooltip title="Remove trace instance from collection" placement="top">
        <Button
          variant="contained"
          style={{
            backgroundColor: "#FF5722",
            border: "solid",
            borderColor: "#000000",
            borderWidth: "1px",
            width: "150px",
          }}
          startIcon={<RemoveFromQueueIcon />}
          onClick={() =>
            props.removeInstanceCollection(props.trace_id, props.instance_id)
          }
        >
          Remove
        </Button>
      </Tooltip>
    );
  } else {
    return (
      <Tooltip title="Add trace instance to collection" placement="top">
        <Button
          variant="contained"
          style={{
            backgroundColor: "#81C784",
            border: "solid",
            borderColor: "#000000",
            borderWidth: "1px",
            width: "150px",
          }}
          startIcon={<AddToQueueIcon />}
          onClick={() =>
            props.addInstanceCollection(
              props.trace_id,
              props.trace_name,
              props.instance_id,
              props.instance_name,
              props.source_url,
              props.view_url
            )
          }
        >
          Add
        </Button>
      </Tooltip>
    );
  }
}

function InstanceParameter(props) {
  return (
    <div style={{ width: "1000px" }}>
      <Grid container>
        <Grid item xs={9}>
          <Box
            component="div"
            my={2}
            bgcolor="white"
            overflow="scroll"
            border={1}
            borderColor="grey.500"
            borderRadius={10}
            style={{
              padding: 10,
              cursor: "pointer",
            }}
            whiteSpace="nowrap"
          >
            {props.value || ""}
          </Box>
        </Grid>
        {/* <Grid item xs={3}>
        <Box component="div" my={2}>
          <Button
            variant="contained"
            style={{
              textTransform: "none",
            }}
            //   onClick={() => doSomething(props.value)}
          >
            MyButton
          </Button>
        </Box>
      </Grid> */}
      </Grid>
    </div>
  );
}

class TraceVersion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedParam: "location",
    };
  }

  render() {
    return (
      <Box
        my={2}
        pb={0}
        style={{ backgroundColor: "#FFF1CC", marginBottom: "20px" }}
        key={this.props.ind}
      >
        <Grid
          container
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#FFD180",
          }}
        >
          <Grid item xs={6}>
            <Box px={2} display="flex" flexDirection="row">
              <p variant="subtitle2">
                Record #:{" "}
                <span style={{ cursor: "pointer", fontWeight: "bold" }}>
                  {this.props.ind + 1}
                </span>
              </p>
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={3} alignItems="flex-end">
          <Grid item xs={9}>
            <div style={{ padding: "10px 0px 0px 10px" }}>
              <div>
                {["description", "location"].map((param, ind) => (
                  <Chip
                    icon={
                      this.state.selectedParam === param ? (
                        <RadioButtonCheckedIcon />
                      ) : (
                        <RadioButtonUncheckedIcon />
                      )
                    }
                    key={ind}
                    label={param}
                    clickable
                    onClick={() => this.setState({ selectedParam: param })}
                    variant="outlined"
                    style={{ color: "#000000", marginRight: "10px" }}
                  />
                ))}
              </div>
              <InstanceParameter
                label={"param"}
                value={this.props.instance[this.state.selectedParam]}
              />
            </div>
          </Grid>
          <Grid item xs={3} style={{ paddingBottom: "35px" }}>
            <IncludeButton
              includeFlag={this.props.checkInstanceInCollection(
                this.props.trace_id,
                this.props.ind.toString()
              )}
              trace_id={this.props.trace_id}
              trace_name={this.props.trace_name}
              instance_id={this.props.ind.toString()}
              instance_name={this.props.ind.toString()}
              source_url={this.props.instance.location}
              view_url={this.props.view_url}
              addInstanceCollection={this.props.addInstanceCollection}
              removeInstanceCollection={this.props.removeInstanceCollection}
            />
          </Grid>
        </Grid>
      </Box>
    );
  }
}

class TraceVersionsPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedParam: "source",
    };
  }

  render() {
    // console.log(this.props);
    return (
      <Grid item style={{ backgroundColor: "#CFD8DC", padding: "20px" }}>
        <Grid container direction="row">
          <Grid
            item
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              verticalAlign: "middle",
            }}
          >
            <Typography variant="subtitle1">
              <b>Versions</b>
            </Typography>
            <Link
              href={this.props.data.view_url}
              target="_blank"
              underline="none"
            >
              <Button
                variant="contained"
                style={{ color: "#455A64" }}
                startIcon={<OpenInNewIcon />}
              >
                Open Page
              </Button>
            </Link>
          </Grid>
        </Grid>
        {this.props.data.instances.length === 0 ? (
          <div style={{ fontSize: 14 }}>
            <br />
            No records have yet been registered for this trace.
          </div>
        ) : (
          this.props.data.instances.map((instance, ind) => (
            <div style={{ marginBottom: "25px" }} key={ind}>
              <TraceVersion
                trace_id={this.props.data.id}
                trace_name={this.props.data.label}
                instance={instance}
                view_url={this.props.data.view_url}
                ind={ind}
                addInstanceCollection={this.props.addInstanceCollection}
                removeInstanceCollection={this.props.removeInstanceCollection}
                checkInstanceInCollection={this.props.checkInstanceInCollection}
              />
            </div>
          ))
        )}
      </Grid>
    );
  }
}

export class KGContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRows: [],
      filtering: false,
    };
  }

  render() {
    return (
      <MaterialTable
        title="Electrophysiological Recordings"
        data={this.props.data}
        columns={TABLE_COLUMNS}
        options={{
          columnsButton: true,
          search: true,
          paging: false,
          filtering: this.state.filtering,
          sorting: true,
          //   selection: true,
          exportButton: false,
          maxBodyHeight: "60vh",
          headerStyle: {
            position: "sticky",
            top: 0,
            backgroundColor: "#FFF",
            fontWeight: "bolder",
            fontSize: 15,
          },
          rowStyle: (rowData) => ({
            backgroundColor: this.state.selectedRows.includes(
              rowData.tableData.id
            )
              ? "#FFD180"
              : "#EEEEEE",
          }),
        }}
        actions={[
          {
            icon: "filter_list",
            onClick: () => this.setState({ filtering: !this.state.filtering }),
            position: "toolbar",
            tooltip: "Show Filters",
          },
        ]}
        detailPanel={(rowData) => {
          return (
            <TraceVersionsPanel
              data={rowData}
              addInstanceCollection={this.props.addInstanceCollection}
              removeInstanceCollection={this.props.removeInstanceCollection}
              checkInstanceInCollection={this.props.checkInstanceInCollection}
            />
          );
        }}
        onRowClick={(event, selectedRow, togglePanel) => {
          togglePanel();
        }}
        components={{
          Toolbar: (props) => (
            <div
              style={{
                backgroundColor: "#FFD180",
                fontWeight: "bolder !important",
              }}
            >
              <MTableToolbar {...props} />
            </div>
          ),
        }}
      />
    );
  }
}

export default class KGInputTraces extends React.Component {
  signal = axios.CancelToken.source();
  static contextType = ContextMain;

  constructor(props, context) {
    super(props, context);

    this.state = {
      loading: false,
      list_traces: [],
      error: null,
      trace_collection: {},
    };

    this.getListTraces = this.getListTraces.bind(this);
    this.handleErrorDialogClose = this.handleErrorDialogClose.bind(this);
    this.addInstanceCollection = this.addInstanceCollection.bind(this);
    this.removeInstanceCollection = this.removeInstanceCollection.bind(this);
    this.checkInstanceInCollection = this.checkInstanceInCollection.bind(this);
    this.countTotalInstances = this.countTotalInstances.bind(this);
  }

  componentDidMount() {
    this.getListTraces();
  }

  getListTraces() {
    let config = {
      cancelToken: this.signal.token,
      headers: {
        Authorization: "Bearer " + this.context.auth[0].token,
      },
    };
    let url =
      nar_baseUrl +
      "/recordings/?summary=false&size=" +
      querySizeLimit +
      "&from_index=0";
    this.setState({ loading: true });
    axios
      .get(url, config)
      .then((res) => {
        console.log(res.data.results);
        let traces = [];
        res.data.results.forEach((item) =>
          traces.push({
            id: item.identifier,
            label: item.label,
            modality: item.modality,
            stimulation: item.stimulation,
            timestamp: item.timestamp,
            species: item.recorded_from ? item.recorded_from.species : null,
            cell_type: item.recorded_from ? item.recorded_from.cell_type : null,
            instances: item.data_location,
            view_url: item.part_of ? item.part_of.uri : null,
            parent_name: item.part_of ? item.part_of.name : null,
            parent_id: item.part_of ? item.part_of.identifier : null,
          })
        );

        console.log(traces);
        this.setState({
          list_traces: traces,
          loading: false,
          error: null,
        });
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("errorUpdate: ", err.message);
        } else {
          // Something went wrong. Save the error in state and re-render.
          this.setState({
            loading: false,
            error: err,
          });
        }
      });
  }

  handleErrorDialogClose() {
    this.setState({ error: null });
  }

  addInstanceCollection(
    trace_id,
    trace_name,
    instance_id,
    instance_name,
    source_url,
    view_url
  ) {
    console.log("Add");

    let trace_collection = this.state.trace_collection;
    if (Object.keys(trace_collection).includes(trace_id)) {
      if (!Object.keys(trace_collection[trace_id]).includes(instance_id)) {
        trace_collection[trace_id][instance_id] = {
          label: trace_name + " (" + instance_name + ")",
          source_url: source_url,
          view_url: view_url,
        };
      }
    } else {
      trace_collection[trace_id] = {
        [instance_id]: {
          label: trace_name + " (" + instance_name + ")",
          source_url: source_url,
          view_url: view_url,
        },
      };
    }

    this.setState({
      trace_collection: trace_collection,
    });
  }

  removeInstanceCollection(trace_id, instance_id) {
    console.log("Remove");

    let trace_collection = this.state.trace_collection;
    if (Object.keys(trace_collection).includes(trace_id)) {
      if (Object.keys(trace_collection[trace_id]).includes(instance_id)) {
        delete trace_collection[trace_id][instance_id];
      }
      if (Object.keys(trace_collection[trace_id]).length === 0) {
        delete trace_collection[trace_id];
      }
    }

    this.setState({
      trace_collection: trace_collection,
    });
  }

  checkInstanceInCollection(trace_id, instance_id) {
    let flag = false;
    let trace_collection = this.state.trace_collection;
    console.log(trace_collection);
    console.log(trace_id);
    console.log(instance_id);
    if (Object.keys(trace_collection).includes(trace_id)) {
      if (Object.keys(trace_collection[trace_id]).includes(instance_id)) {
        flag = true;
      }
    }
    console.log(flag);
    return flag;
  }

  countTotalInstances() {
    let total = 0;
    let trace_collection = this.state.trace_collection;
    for (const trace_id in trace_collection) {
      total += Object.keys(trace_collection[trace_id]).length;
    }
    return total;
  }

  render() {
    console.log(this.state.trace_collection);
    if (this.state.error) {
      return (
        <ErrorDialog
          open={Boolean(this.state.error)}
          handleErrorDialogClose={this.handleErrorDialogClose}
          error={this.state.error.message || this.state.error}
        />
      );
    }
    return (
      <div>
        <Dialog
          onClose={() => this.props.handleClose(false)}
          aria-labelledby="customized-dialog-title"
          open={this.props.open}
          fullWidth={true}
          maxWidth={"xl"}
          //   disableBackdropClick={true}
          //   disableEscapeKeyDown={true}
        >
          <DialogTitle
            id="customized-dialog-title"
            onClose={() => this.props.handleClose(false)}
            style={{ backgroundColor: "#ffd180" }}
          >
            <span style={{ fontWeight: "bolder", fontSize: 18 }}>
              KG Data Input
            </span>
          </DialogTitle>
          <DialogContent dividers>
            {this.state.loading ? (
              <LoadingIndicator />
            ) : (
              <KGContent
                data={this.state.list_traces}
                addInstanceCollection={this.addInstanceCollection}
                removeInstanceCollection={this.removeInstanceCollection}
                checkInstanceInCollection={this.checkInstanceInCollection}
              />
            )}
          </DialogContent>
          <DialogActions>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                paddingLeft: "2.5%",
                paddingRight: "2.5%",
                paddingTop: "10px",
                paddingBottom: "20px",
                width: "100%",
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
                }}
                onClick={() => this.props.handleClose(false, null)}
              >
                Cancel
              </Button>
              <br />
              <br />
              <span>
                <h6>
                  {"Number of trace instances selected: " +
                    this.countTotalInstances()}
                </h6>
              </span>
              <br />
              <br />
              <Button
                variant="contained"
                color="primary"
                style={{
                  width: "150px",
                  backgroundColor: "#8BC34A",
                  color: "#000000",
                  fontWeight: "bold",
                  border: "solid",
                  borderColor: "#000000",
                  borderWidth: "1px",
                }}
                onClick={() =>
                  this.props.handleClose(true, this.state.trace_collection)
                }
              >
                Proceed
              </Button>
            </div>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
