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
import LoadingIndicatorModal from "./LoadingIndicatorModal";
import ContextMain from "./ContextMain";
import axios from "axios";
import Tooltip from "@material-ui/core/Tooltip";
import Link from "@material-ui/core/Link";
import { baseUrl, mc_url, querySizeLimit } from "./globals";
import { formatAuthors, formatTimeStampToLongString } from "./utils";

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
    field: "name",
    title: "Name",
  },
  {
    field: "alias",
    title: "Alias",
    hidden: true,
  },
  {
    field: "author",
    title: "Author",
    render: (item) => formatAuthors(item.author),
  },
  {
    field: "private",
    title: "Visibility",
    render: (item) => (item.private ? "Private" : "Public"),
    hidden: true,
  },
  {
    field: "project_id",
    title: "Collab",
    hidden: true,
  },
  {
    field: "species",
    title: "Species",
    hidden: true,
  },
  {
    field: "brain_region",
    title: "Brain Region",
    hidden: true,
  },
  {
    field: "cell_type",
    title: "Cell Type",
    hidden: true,
  },
  {
    field: "model_scope",
    title: "Model Scope",
    hidden: true,
  },
  {
    field: "abstraction_level",
    title: "Abstraction Level",
    hidden: true,
  },
  {
    field: "owner",
    title: "Owner",
    render: (item) => formatAuthors(item.owner),
    hidden: true,
  },
  {
    field: "organization",
    title: "Organization",
    hidden: true,
  },
  {
    field: "date_created",
    title: "Created Date",
    hidden: true,
  },
  {
    field: "instances",
    title: "Instances",
    hidden: true,
    hiddenByColumnsButton: true,
  },
];

function IncludeIcon(props) {
  //   console.log(props);
  if (props.includeFlag) {
    return (
      <Tooltip title="Remove model instance from collection" placement="top">
        <IconButton
          aria-label="include model"
          onClick={() =>
            props.removeInstanceCollection(props.model_id, props.instance_id)
          }
        >
          <RemoveFromQueueIcon color="action" />
        </IconButton>
      </Tooltip>
    );
  } else {
    return (
      <Tooltip title="Add model instance to collection" placement="top">
        <IconButton
          aria-label="exclude model"
          onClick={() =>
            props.addInstanceCollection(props.model_id, props.instance_id)
          }
        >
          <AddToQueueIcon color="action" />
        </IconButton>
      </Tooltip>
    );
  }
}

function InstanceParameter(props) {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Box
          component="div"
          my={2}
          bgcolor="white"
          overflow="auto"
          border={1}
          borderColor="grey.500"
          borderRadius={10}
          style={{ padding: 10, minHeight: "50px" }}
          whiteSpace="nowrap"
        >
          {props.value || ""}
        </Box>
      </Grid>
    </Grid>
  );
}

class ModelVersion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedParam: "source",
    };
  }

  render() {
    return (
      <Box
        my={2}
        pb={0}
        style={{ backgroundColor: "#FFF1CC" }}
        key={this.props.instance.id}
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
                Version:{" "}
                <span style={{ cursor: "pointer", fontWeight: "bold" }}>
                  {this.props.instance.version}
                </span>
              </p>
              <IncludeIcon
                style={{ color: "#000000" }}
                includeFlag={this.props.checkInstanceInCollection(
                  this.props.instance.model_id,
                  this.props.instance.id
                )}
                model_id={this.props.instance.model_id}
                instance_id={this.props.instance.id}
                addInstanceCollection={this.props.addInstanceCollection}
                removeInstanceCollection={this.props.removeInstanceCollection}
              />
            </Box>
          </Grid>
          <Grid container item justify="flex-end" xs={6}>
            <Box
              px={2}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="body2" color="textSecondary">
                ID: <span>{this.props.instance.id}</span>
              </Typography>
              <Typography
                variant="body2"
                style={{ color: "#000000", paddingLeft: "25px" }}
              >
                {formatTimeStampToLongString(this.props.instance.timestamp)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Box p={2} style={{ width: "800px" }}>
          <div>
            {[
              "description",
              "source",
              "morphology",
              "parameters",
              "code_format",
              "license",
              "hash",
            ].map((param, ind) => (
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
        </Box>
      </Box>
    );
  }
}

class ModelVersionsPanel extends React.Component {
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
              href={mc_url + "/#model_id." + this.props.data.id}
              target="_blank"
              underline="none"
            >
              <Button
                variant="contained"
                style={{ color: "#455A64" }}
                startIcon={<OpenInNewIcon />}
              >
                Open Model
              </Button>
            </Link>
          </Grid>
        </Grid>
        {this.props.data.instances.length === 0 ? (
          <div style={{ fontSize: 14 }}>
            <br />
            No model instances have yet been registered for this model.
          </div>
        ) : (
          this.props.data.instances.map((instance, ind) => (
            <ModelVersion
              instance={instance}
              key={ind}
              addInstanceCollection={this.props.addInstanceCollection}
              removeInstanceCollection={this.props.removeInstanceCollection}
              checkInstanceInCollection={this.props.checkInstanceInCollection}
            />
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
        title="Models"
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
            <ModelVersionsPanel
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

export default class ModalKGInput extends React.Component {
  signal = axios.CancelToken.source();
  static contextType = ContextMain;

  constructor(props, context) {
    super(props, context);

    this.state = {
      loading: false,
      list_models: [],
      error: null,
      model_collection: {},
    };

    this.getListModels = this.getListModels.bind(this);
    this.handleErrorDialogClose = this.handleErrorDialogClose.bind(this);
    this.addInstanceCollection = this.addInstanceCollection.bind(this);
    this.removeInstanceCollection = this.removeInstanceCollection.bind(this);
    this.checkInstanceInCollection = this.checkInstanceInCollection.bind(this);
    this.countTotalInstances = this.countTotalInstances.bind(this);
  }

  componentDidMount() {
    this.getListModels();
  }

  getListModels() {
    let config = {
      cancelToken: this.signal.token,
      headers: {
        Authorization: "Bearer " + this.context.auth[0].token,
      },
    };
    let url = baseUrl + "/models/?size=" + querySizeLimit;
    this.setState({ loading: true });
    axios
      .get(url, config)
      .then((res) => {
        const models = res.data;
        console.log(models);
        this.setState({
          list_models: models,
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

  addInstanceCollection(model_id, instance_id) {
    console.log("Add");

    let model_collection = this.state.model_collection;
    if (Object.keys(model_collection).includes(model_id)) {
      if (!model_collection[model_id].includes(instance_id)) {
        model_collection[model_id].push(instance_id);
      }
    } else {
      model_collection[model_id] = [instance_id];
    }

    this.setState({
      model_collection: model_collection,
    });
  }

  removeInstanceCollection(model_id, instance_id) {
    console.log("Remove");

    let model_collection = this.state.model_collection;
    if (Object.keys(model_collection).includes(model_id)) {
      var index = model_collection[model_id].indexOf(instance_id);
      if (index !== -1) {
        model_collection[model_id].splice(index, 1);
      }
      if (model_collection[model_id].length === 0) {
        delete model_collection[model_id];
      }
    }

    this.setState({
      model_collection: model_collection,
    });
  }

  checkInstanceInCollection(model_id, instance_id) {
    console.log("Check");
    let flag = false;
    let model_collection = this.state.model_collection;
    if (Object.keys(model_collection).includes(model_id)) {
      if (model_collection[model_id].includes(instance_id)) {
        flag = true;
      }
    }
    return flag;
  }

  countTotalInstances() {
    let total = 0;
    let model_collection = this.state.model_collection;
    for (const model_id in model_collection) {
      total += model_collection[model_id].length;
    }
    return total;
  }

  render() {
    console.log(this.state.model_collection);

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
          disableBackdropClick={true}
          disableEscapeKeyDown={true}
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
            <LoadingIndicatorModal open={this.state.loading} />
            <KGContent
              data={this.state.list_models}
              addInstanceCollection={this.addInstanceCollection}
              removeInstanceCollection={this.removeInstanceCollection}
              checkInstanceInCollection={this.checkInstanceInCollection}
            />
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
                onClick={() => this.props.handleClose(false)}
              >
                Cancel
              </Button>
              <br />
              <br />
              <span>
                <h6>
                  {"Number of model instances selected: " +
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
                onClick={() => this.props.handleClose(true)}
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
