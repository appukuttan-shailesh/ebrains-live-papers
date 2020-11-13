import React from "react";
import Button from "@material-ui/core/Button";

export default class DynamicTable extends React.Component {
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

  handleItemDeleted(i) {
    var items = this.state.items;

    items.splice(i, 1);

    this.setState({
      items: items,
    });
    this.props.onChangeValue(items);
  }

  renderRows() {
    var context = this;

    return this.state.items.map(function (item, ind) {
      return (
        <tr key={"item-" + ind}>
          <td style={{ width: "25%", padding: "5px 20px" }}>
            <input
              name="firstname"
              type="text"
              value={item["firstname"]}
              onChange={context.handleItemChanged.bind(context, ind)}
            />
          </td>
          <td style={{ width: "25%", padding: "5px 20px" }}>
            <input
              name="lastname"
              type="text"
              value={item["lastname"]}
              onChange={context.handleItemChanged.bind(context, ind)}
            />
          </td>
          <td style={{ padding: "5px 20px" }}>
            <input
              name="affiliation"
              type="text"
              value={item["affiliation"]}
              onChange={context.handleItemChanged.bind(context, ind)}
            />
          </td>
          <td style={{ padding: "5px 20px" }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={context.handleItemDeleted.bind(context, ind)}
            >
              Delete
            </Button>
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
              <th style={{ padding: "5px 20px" }}>First Name</th>
              <th style={{ padding: "5px 20px" }}>Last Name</th>
              <th style={{ padding: "5px 20px" }}>Affiliation</th>
              <th style={{ padding: "5px 20px" }}>{/* delete button */}</th>
            </tr>
          </thead>
          <tbody>{this.renderRows()}</tbody>
        </table>

        <Button
          variant="contained"
          color="primary"
          onClick={this.handleAdd.bind(this)}
        >
          Add Author
        </Button>
        <hr />
      </div>
    );
  }
}
