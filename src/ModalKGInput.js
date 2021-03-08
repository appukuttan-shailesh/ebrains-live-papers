import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import MaterialTable, { MTableToolbar } from "@material-table/core";
import ErrorDialog from "./ErrorDialog";
import LoadingIndicatorModal from "./LoadingIndicatorModal";
import ContextMain from "./ContextMain";
import axios from "axios";
import { baseUrl, querySizeLimit } from "./globals";
import { formatAuthors } from "./utils";

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
    hiddenByColumnsButton: true,
  },
  {
    field: "name",
    title: "Name",
  },
  {
    field: "alias",
    title: "Alias",
    hidden: true,
    hiddenByColumnsButton: true,
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
    hiddenByColumnsButton: true,
  },
  {
    field: "project_id",
    title: "Collab",
    hidden: true,
    hiddenByColumnsButton: true,
  },
  {
    field: "species",
    title: "Species",
    hidden: true,
    hiddenByColumnsButton: true,
  },
  {
    field: "brain_region",
    title: "Brain Region",
    hidden: true,
    hiddenByColumnsButton: true,
  },
  {
    field: "cell_type",
    title: "Cell Type",
    hidden: true,
    hiddenByColumnsButton: true,
  },
  {
    field: "model_scope",
    title: "Model Scope",
    hidden: true,
    hiddenByColumnsButton: true,
  },
  {
    field: "abstraction_level",
    title: "Abstraction Level",
    hidden: true,
    hiddenByColumnsButton: true,
  },
  {
    field: "owner",
    title: "Owner",
    render: (item) => formatAuthors(item.owner),
    hidden: true,
    hiddenByColumnsButton: true,
  },
  {
    field: "organization",
    title: "Organization",
    hidden: true,
    hiddenByColumnsButton: true,
  },
  {
    field: "date_created",
    title: "Created Date",
    hidden: true,
    hiddenByColumnsButton: true,
  },
];

export class KGContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRow: null,
      filtering: false,
    };
  }

  render() {
    return (
      <MaterialTable
        title="Models"
        data={this.props.data}
        columns={TABLE_COLUMNS}
        onRowClick={(evt, selectedRow) =>
          this.setState({ selectedRow: selectedRow.tableData.id })
        }
        options={{
          columnsButton: true,
          search: true,
          paging: false,
          filtering: this.state.filtering,
          sorting: true,
          selection: true,
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
            backgroundColor:
              this.state.selectedRow === rowData.tableData.id
                ? "#ffd180"
                : "#EEE",
          }),
        }}
        actions={[
          {
            icon: "filter_list",
            onClick: () => this.setState({ filtering: !this.state.filtering }),
            position: "toolbar",
          },
        ]}
        components={{
          Toolbar: (props) => (
            <div
              style={{
                backgroundColor: "#ffd180",
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
    };

    this.getListModels = this.getListModels.bind(this);
    this.handleErrorDialogClose = this.handleErrorDialogClose.bind(this);
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

  render() {
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
            <KGContent data={this.state.list_models} />
          </DialogContent>
          <DialogActions>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                paddingLeft: "2.5%",
                paddingRight: "2.5%",
                paddingTop: "20px",
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
