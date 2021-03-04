import React from "react";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";
import ForwardIcon from "@material-ui/icons/Forward";
import Tooltip from "@material-ui/core/Tooltip";
import arrayMove from "array-move";

export default class DynamicTablePerson extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: this.props.value,
    };
  }

  handleAdd() {
    var items = this.state.items;
    items.push({ firstname: "", lastname: "", affiliation: "" });

    this.setState({
      items: items,
    });
    this.props.onChangeValue(items);
  }

  handleItemChanged(i, event) {
    var items = this.state.items;
    items[i][event.target.name] = event.target.value;

    this.setState({
      items: items,
    });
    this.props.onChangeValue(items);
  }

  handleItemMoveDown(ind) {
    console.log("Move down item with index: " + ind);
    const maxInd = this.state.items.length;

    if (ind < maxInd) {
      var items = this.state.items;
      items = arrayMove(items, ind, ind + 1);
      this.setState({
        items: items,
      });
      this.props.onChangeValue(items);
    }
  }

  handleItemMoveUp(ind) {
    console.log("Move up item with index: " + ind);

    if (ind > 0) {
      var items = this.state.items;
      items = arrayMove(items, ind, ind - 1);

      this.setState({
        items: items,
      });
      this.props.onChangeValue(items);
    }
  }

  handleItemDeleted(ind) {
    var items = this.state.items;
    items.splice(ind, 1);

    this.setState({
      items: items,
    });
    this.props.onChangeValue(items);
  }

  renderRows() {
    var context = this;
    var items = this.state.items;

    return this.state.items.map(function (item, ind) {
      return (
        <tr key={"item-" + ind}>
          <td style={{ width: "25%", padding: "5px 10px" }}>
            <input
              name="firstname"
              type="text"
              value={item["firstname"]}
              onChange={context.handleItemChanged.bind(context, ind)}
            />
          </td>
          <td style={{ width: "25%", padding: "5px 10px" }}>
            <input
              name="lastname"
              type="text"
              value={item["lastname"]}
              onChange={context.handleItemChanged.bind(context, ind)}
            />
          </td>
          <td style={{ padding: "5px 10px" }}>
            <input
              name="affiliation"
              type="text"
              value={item["affiliation"]}
              onChange={context.handleItemChanged.bind(context, ind)}
            />
          </td>
          <td style={{ width: "100px", padding: "5px 0px 5px 10 px" }}>
            <div>
              <Tooltip title="Move down">
                <IconButton
                  color="primary"
                  size="small"
                  aria-label="move down"
                  component="span"
                  style={{ paddingRight: "5px" }}
                  onClick={context.handleItemMoveDown.bind(context, ind)}
                >
                  <ForwardIcon
                    stroke={"#000000"}
                    strokeWidth={1}
                    style={{
                      transform: `rotate(90deg)`,
                      color: ind === items.length - 1 ? "#A1887F" : "#000000",
                    }}
                    fontSize="small"
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title="Move up">
                <IconButton
                  color="primary"
                  size="small"
                  aria-label="move up"
                  component="span"
                  style={{ paddingRight: "5px" }}
                  onClick={context.handleItemMoveUp.bind(context, ind)}
                >
                  <ForwardIcon
                    stroke={"#000000"}
                    strokeWidth={1}
                    style={{
                      transform: `rotate(270deg)`,
                      color: ind === 0 ? "#A1887F" : "#000000",
                    }}
                    fontSize="small"
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  color="secondary"
                  size="small"
                  aria-label="delete"
                  component="span"
                  onClick={context.handleItemDeleted.bind(context, ind)}
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
          </td>
        </tr>
      );
    });
  }

  render() {
    // console.log(this.state.items);
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th style={{ padding: "5px 10px" }}>First Name</th>
              <th style={{ padding: "5px 10px" }}>Last Name</th>
              <th style={{ padding: "5px 10px" }}>Affiliation</th>
              <th style={{ padding: "5px 0px 5px 10 px" }}>
                {/* delete button */}
              </th>
            </tr>
          </thead>
          <tbody>{this.renderRows()}</tbody>
        </table>
        <div style={{width:"100%", display:"flex", justifyContent:"flex-end", paddingTop:"10px"}}>
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleAdd.bind(this)}
          style={{width:"110px"}}
        >
          Add
        </Button>
        </div>
        <hr />
      </div>
    );
  }
}
