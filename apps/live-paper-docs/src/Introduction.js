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
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ flex: 0.5 }}>
              <div className="block-little-header">The Problem</div>
              <div className="block-main-header">Where to find underlying data?</div>
              <div className="block-text">
                Consider that you came across a scientfic publication that piqued your interest.
                It might be because:
                <ul>
                  <li>the experimental data produced by the authors could aid your own scientific work, or</li>
                  <li>the model developed by them could be used by you to test certain other hypotheses, or</li>
                  <li>you simply wish to reproduce the findings reported in the article</li>
                </ul>
                To do any of these, you need access to the underlying data. And this is where things can get difficult.
                Very often authors simply resort to adding a statement in their publication, something similar to:

                <div style={{
                  backgroundColor: "#DCEDC8", textAlign: "center", padding: "10px",
                  marginLeft: "10%", marginRight: "10%", marginTop: "20px", marginBottom: "20px"
                }}>
                  <span style={{ fontFamily: "cursive", fontWeight: "bold", fontStyle: "italic" }}>
                    "Data are available from the authors upon request."
                  </span>
                </div>

                This typically results in a situation where potential users face a dead-end because authors are
                either unresponsive, have left academia, or because code or data have been lost,
                or are otherwise no longer available.
                <br /><br />
                What is lacking is a structured and systematic way of offering these resources, that
                makes this process simpler for both the authors and the potential users.
              </div>
            </div>
            <div style={{ flex: 0.5, textAlign: "center" }}>
              <img
                src="/figures/index/problem.png"
                width="60%"
                style={{ paddingTop: "120px" }}
              />
            </div>
          </div>
          <br />
        </div>

        <div className="block">
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ flex: 0.5, textAlign: "center" }}>
              <img
                src="/figures/index/banner2.png"
                width="100%"
                style={{ paddingRight: "40px", paddingTop: "75px" }}
              />
            </div>
            <div style={{ flex: 0.5 }}>
              <div className="block-little-header">The Solution</div>
              <div className="block-main-header">EBRAINS Live Papers</div>
              <div className="block-text">
                The {" "}
                <a href="/"
                >EBRAINS Live Papers</a
                >{" "}
                are structured and interactive supplementary
                documents to complement journal publications, that allow users to
                readily access, explore and utilize the various kinds of data
                underlying scientific studies. Interactivity is a prominent feature
                with several integrated tools and services that will allow users to
                download, visualise or simulate data, models and results presented
                in the corresponding publications.
                <br /><br />
                Live papers provide a platform by means
                of which authors can easily aggregate the various data components underlying
                their scientific study into a systematic, structured and distributable format.
                The live paper builder tool has been developed with the primary focus on making
                this data sharing process as simple as possible.
                <div style={{
                  backgroundColor: "#DCEDC8", textAlign: "center", padding: "10px",
                  marginLeft: "10%", marginRight: "10%", marginTop: "20px", marginBottom: "20px"
                }}>
                  <span style={{ fontFamily: "cursive", fontWeight: "bold", fontStyle: "italic" }}>
                    Authors can easily create a new live paper within 2-3 hours using the live paper builder tool!
                  </span>
                </div>
                The uploaded resources are stored on the EBRAINS archival data repository, 
                thereby ensuring their long term retrievability.
                With data being managed via the EBRAINS KG, the issue of data provenance can also be better tackled,
                along with tighter integration with other tools and services offered under the EBRAINS ecosystem.
              </div>
            </div>
          </div>
          <br />
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
