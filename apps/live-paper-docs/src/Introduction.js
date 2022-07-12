import React from "react";
import "./App.css";

export default class Introduction extends React.Component {
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
          <div className="title-solid-style" style={{ fontSize: 44 }}>EBRAINS Live Papers</div>
          <div className="title-solid-style" style={{ fontSize: 32, color: "#00A595" }}>Interactive resource sheets for computational studies in neuroscience</div>
        </div>

        <div className="block">
          <div className="block-little-header">Introduction</div>
          <div className="block-main-header">What are EBRAINS Live Papers?</div>
          <div className="block-text">
            The {" "}
            <a href="/"
            >EBRAINS Live Papers</a
            >{" "}
            are intended to be structured and interactive supplementary
            documents to complement journal publications, that allow users to
            readily access, explore and utilize the various kinds of data
            underlying scientific studies. Interactivity is a prominent feature
            with several integrated tools and services that will allow users to
            download, visualise or simulate data, models and results presented
            in the corresponding publications.
            <br /><br />
            Live Papers bring together various neuroscience related resources
            thereby providing a more complete picture of the original modelers'
            workspace. By virtue of being developed within the EBRAINS
            infrastructure setup, Live Papers are able to effectively leverage
            the Knowledge Graph (KG) for storing all information. The KG, being
            a graph based database, interlinks all data units thereby readily
            offering a high degree of data provenance.
          </div>
        </div>

        <div className="block">
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ flex: 0.5 }}>
              <div className="block-little-header">Find</div>
              <div className="block-main-header">Find and explore live papers</div>
              <div className="block-text">
                All published live papers are categorized by year and listed on
                the live paper platform. The Live Paper platform lets you
                search/filter the list of live papers by:
                <ul>
                  <li>title of associated published article</li>
                  <li>the year of publication</li>
                  <li>the publishing journal</li>
                  <li>names of associated author(s)</li>
                  <li>keyword search of abstract</li>
                </ul>
                Each live paper contains the metadata associated with the
                journal publication, followed by a list of related resources
                that the authors have shared with the scientific community.
                These resources are easily downloadable, and certain types of
                resources can also be explored/executed interactively from
                within the live paper using tools integrated into the live paper
                platform.
                <p><a onClick={() => this.props.updateHash("find")}>Learn more...</a></p>
              </div>
            </div>
            <div style={{ flex: 0.5 }}>
              <img
                src="/figures/index/find.png"
                width="100%"
                style={{ paddingLeft: "20px" }}
              />
            </div>
          </div>
        </div>
        
        <div className="block">
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ flex: 0.5 }}>
              <img
                src="/figures/index/create.png"
                width="100%"
                style={{ paddingRight: "40px" }}
              />
            </div>
            <div style={{ flex: 0.5 }}>
              <div className="block-little-header">Create</div>
              <div className="block-main-header">Create live papers, share resources</div>
              <div className="block-text">
                Authors of scientific publications are encouraged to create live
                papers to share the resources underlying their study. Live
                papers allow authors to easily share a variety of resources,
                such as:
                <ul>
                  <li><a href="#morphology">Morphologies</a></li>
                  <li><a href="#traces">Electrophysiological Recordings</a></li>
                  <li><a href="#models">Models</a></li>
                  <li><a href="#other">Other Content</a></li>
                </ul>
                Live papers can be set to be password-protected, thereby
                enabling them to be shared solely with reviewers prior to
                publication, or be made public and thereby freely accessible to
                the scientific community.
                <br /><br />
                The EBRAINS platform issues DOIs to published live papers.
                This assists in the citation of published data and models.
                <p><a onClick={() => this.props.updateHash("create")}>Learn more...</a></p>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}
