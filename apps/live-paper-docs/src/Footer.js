import React from "react";
import "./App.css";

export default class Footer extends React.Component {
  render() {
    return (
      <div className="block">
        <div className="block-little-header">Contact</div>
        <div className="block-main-header">Any questions?</div>
        <div className="block-text">
          If you have questions that are not answered here, contact us by e-mail:
          {" "}<a href="mailto:support@ebrains.eu">support@ebrains.eu</a>
        </div>
      </div>
    );
  }
}
