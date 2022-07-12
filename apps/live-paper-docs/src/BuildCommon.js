import React from "react";
import "./App.css";

export default class BuildCommon extends React.Component {
  render() {
    return (
      <div>
        <div
          style={{
            paddingLeft: "5%",
            paddingRight: "5%",
            textAlign: "justify",
            fontSize: 16,
            lineHeight: 1.75,
            marginTop: "40px",
            marginBottom: "40px"
          }}
        >
          <div className="title-solid-style" style={{ fontSize: 44 }}>Resource Sections</div>
          <div className="title-solid-style" style={{ fontSize: 32, color: "#00A595" }}>Handling resource sections in live paper builder tool</div>
        </div>

        <div className="block">
          <div className="block-little-header">Add Section</div>
          <div className="block-main-header">Add a new resource section</div>
          <div className="block-text">
          </div>
        </div>

        <div className="block">
          <div className="block-little-header">Basic Info</div>
          <div className="block-main-header">Adding basic info to resource section</div>
          <div className="block-text">
          </div>
        </div>

        <div className="block">
          <div className="block-little-header">Re-order / Delete / Expand Sections</div>
          <div className="block-main-header">Change order of sections or remove a section</div>
          <div className="block-text">
          </div>
        </div>

        <div className="block">
          <div className="block-little-header">Add Row</div>
          <div className="block-main-header">Adding an entry manually</div>
          <div className="block-text">
          </div>
        </div>

        <div className="block">
          <div className="block-little-header">Add From DB</div>
          <div className="block-main-header">Adding an entry from a repository</div>
          <div className="block-text">
          </div>
        </div>

        <div className="block">
          <div className="block-little-header">Expand Table</div>
          <div className="block-main-header">Expand each entry in table</div>
          <div className="block-text">
          </div>
        </div>

        <div className="block">
          <div className="block-little-header">Re-order / Delete</div>
          <div className="block-main-header">Re-ordering or deleting rows</div>
          <div className="block-text">
          </div>
        </div>

        <div className="block">
          <div className="block-little-header">Edit Source</div>
          <div className="block-main-header">Edit table contents manually</div>
          <div className="block-text">
          </div>
        </div>

        <div className="block">
          <div className="block-little-header">Using Tabs</div>
          <div className="block-main-header">Grouping entries into categories</div>
          <div className="block-text">
          </div>
        </div>

      </div>
    );
  }
}
