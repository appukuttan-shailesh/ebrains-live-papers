import React from "react";
import "./App.css";

export default class Models extends React.Component {
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
            marginBottom: "40px",
          }}
        >
          <div className="title-solid-style" style={{ fontSize: 44 }}>
            Resource Type: Models
          </div>
          <div
            className="title-solid-style"
            style={{ fontSize: 32, color: "#00A595" }}
          >
            How to share... How to use...
          </div>
        </div>

        <div className="block">
          <div className="block-little-header">Share Resource</div>
          <div className="block-main-header">Sharing model source code</div>
          <div className="block-text">
            Authors can share model source code related resources via their live
            papers. Each individual model is listed as a separate entry, as
            shown below:
            <br />
            <br />
            <div style={{ textAlign: "center" }}>
              <img
                alt=""
                src={
                  process.env.PUBLIC_URL +
                  "/figures/models/example_models_section.png"
                }
                width="85%"
              />
            </div>
            <br />
            For general instructions on how to add info to resource sections,{" "}
            <a
              href
              onClick={() => this.props.updateHash("buildCommon")}
              target="_blank"
            >
              click here
            </a>
            .
            <br />
            <br />
            Authors can import / link existing model related entries from other
            repositories such as:
            <ul>
              <li>
                <a
                  href="https://search.kg.ebrains.eu/?facet_type[0]=Dataset"
                  target="_blank"
                  rel="noreferrer"
                >
                  EBRAINS Knowledge Graph
                </a>
              </li>
              <li>
                <a
                  href="https://senselab.med.yale.edu/modeldb/"
                  target="_blank"
                  rel="noreferrer"
                >
                  ModelDB
                </a>
              </li>
              <li>
                <a
                  href="https://www.opensourcebrain.org/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Source Brain
                </a>
              </li>
              <li>
                <a
                  href="https://www.ebi.ac.uk/biomodels/"
                  target="_blank"
                  rel="noreferrer"
                >
                  BioModels
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="block">
          <div className="block-little-header">Access Resource</div>
          <div className="block-main-header">Accessing model source code</div>
          <div className="block-text">
            An example of a model related resource section in a live paper is
            shown below:
            <br />
            <br />
            <div style={{ textAlign: "center" }}>
              <img
                alt=""
                src={
                  process.env.PUBLIC_URL +
                  "/figures/models/example_models_output.png"
                }
                width="85%"
              />
            </div>
            <br />
            Users are able to downloaded each listed model file by clicking on
            the 'Download' button for that entry. By clicking on the 'View'
            button, they can open the model's detailed page, if it was imported
            from a neuroscience repository. An example of such a model from the
            EBRAINS model catalog (Knowledge Graph) is illustrated below:
            <br />
            <br />
            <div style={{ textAlign: "center" }}>
              <img
                alt=""
                src={
                  process.env.PUBLIC_URL + "/figures/models/model_catalog.png"
                }
                width="85%"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
