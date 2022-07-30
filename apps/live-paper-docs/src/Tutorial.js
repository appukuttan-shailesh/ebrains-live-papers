import React from "react";
import YouTube from 'react-youtube';
import "./App.css";

export default class Tutorial extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      player: null
    }
  }
  onReady = (event) => {
    // access to player in all event handlers via event.target
    this.setState({
      player: event.target
    })
    // event.target.playVideo();
  }

  changeTime = (seconds) => {
    console.log('seeking to: ' + seconds)
    this.state.player.seekTo(seconds)
    this.state.player.playVideo();
  }
  render() {
    const opts = {
      width: '560',
      height: '315',
    };

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
          <div className="title-solid-style" style={{ fontSize: 44 }}>Tutorial</div>
          <div className="title-solid-style" style={{ fontSize: 32, color: "#00A595" }}>A step-by-step walkthrough</div>
        </div>

        <div className="block">
          <div className="block-little-header">Video Tutorial</div>
          <div className="block-main-header">Demonstration of Live Papers</div>
          <div className="block-text">
            <div class="video-container">
              <YouTube videoId='2eaANKHclkk' opts={opts} onReady={this.onReady} />
            </div>
            <br />
            <div style={{
              backgroundColor: "#DCEDC8", textAlign: "justify", padding: "10px",
              marginLeft: "2.5%", marginRight: "2.5%", marginTop: "20px", marginBottom: "20px"
            }}>
              <strong>Note:</strong> The Live Paper platform and related tools are continuously
              being improved, with newer features being introduced to improve the user experience.
              This can produce changes in the visual appearance of these pages, and might vary
              slightly from that seen in the above tutorial video. Rest assured that the functionality
              would continue to largely remain the same.
            </div>
            <br />
            Click on the below links to jump to a specific topic in the video:
            <br />
            <div style={{ lineHeight: 1.75 }}>
              <ul>
                <li><a href onClick={() => this.changeTime(0)}>Introduction to Live Papers</a></li>
                <li>
                  <a href onClick={() => this.changeTime(112)}>Live Paper Platform</a>
                  <ul>
                    <li><a href onClick={() => this.changeTime(158)}>Walkthrough a sample Live Paper</a></li>
                  </ul>
                </li>
                <li>
                  <a href onClick={() => this.changeTime(492)}>Live Paper Builder</a>
                  <li>
                    <a href onClick={() => this.changeTime(507)}>EBRAINS account and the Collaboratory</a>
                    <ul>
                      <li><a href onClick={() => this.changeTime(516)}>Request EBRAINS account</a></li>
                      <li><a href onClick={() => this.changeTime(563)}>Intro to Collaboratory & Collabs</a></li>
                      <li><a href onClick={() => this.changeTime(619)}>Create a new Collab</a></li>
                      <li><a href onClick={() => this.changeTime(715)}>Overview of Teams & Live Paper permissions</a></li>
                    </ul>
                  </li>
                  <ul>
                    <li>
                      <a href onClick={() => this.changeTime(825)}>Start creating a new live paper</a>
                      <ul>
                        <li><a href onClick={() => this.changeTime(869)}>Loading metadata via DOI</a></li>
                        <li><a href onClick={() => this.changeTime(894)}>Loading metadata via PDF</a></li>
                        <li><a href onClick={() => this.changeTime(980)}>Entering/updating metadata manually</a></li>
                        <li><a href onClick={() => this.changeTime(1050)}>Specifying live paper author(s)</a></li>
                      </ul>
                    </li>
                    <li><a href onClick={() => this.changeTime(1180)}>Preview live papers</a></li>
                    <li>
                      <a href onClick={() => this.changeTime(1202)}>Adding resource sections</a>
                      <ul>
                        <li><a href onClick={() => this.changeTime(1237)}>Generic section</a></li>
                        <li>
                          <a href onClick={() => this.changeTime(1262)}>Common features</a>
                          <ul>
                            <li><a href onClick={() => this.changeTime(1287)}>Adding entries to section</a></li>
                            <li><a href onClick={() => this.changeTime(1327)}>Expanding input area</a></li>
                            <li><a href onClick={() => this.changeTime(1352)}>Re-ordering entries in section</a></li>
                            <li><a href onClick={() => this.changeTime(1370)}>Grouping items into tabs</a></li>
                            <li><a href onClick={() => this.changeTime(1440)}>Editing source code</a></li>
                            <li><a href onClick={() => this.changeTime(1520)}>Deleting items</a></li>
                            <li><a href onClick={() => this.changeTime(1536)}>Simple multi-input tool</a></li>
                            <li><a href onClick={() => this.changeTime(1650)}>Collapsing a live paper section</a></li>
                            <li><a href onClick={() => this.changeTime(1667)}>Re-ordering live paper sections</a></li>
                            <li><a href onClick={() => this.changeTime(1675)}>Deleting a live paper section</a></li>
                          </ul>
                        </li>
                        <li>
                          <a href onClick={() => this.changeTime(1705)}>Morphology section</a>
                          <ul>
                            <li><a href onClick={() => this.changeTime(1780)}>Add from external database</a></li>
                          </ul>
                        </li>
                        <li>
                          <a href onClick={() => this.changeTime(1954)}>Electrophysiology section</a>
                          <ul>
                            <li><a href onClick={() => this.changeTime(2050)}>Add from external database</a></li>
                          </ul>
                        </li>
                        <li>
                          <a href onClick={() => this.changeTime(2084)}>Models section</a>
                          <ul>
                            <li><a href onClick={() => this.changeTime(2120)}>Add from external database</a></li>
                          </ul>
                        </li>
                        <li>
                          <a href onClick={() => this.changeTime(2188)}>Custom HTML/Markdown section</a>
                          <ul>
                            <li><a href onClick={() => this.changeTime(2258)}>Example</a></li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                    {/* <li><a href onClick={() => this.changeTime(600)}>Download live papers</a></li>
                    <li><a href onClick={() => this.changeTime(600)}>Save live papers</a></li>
                    <li>
                      <a href onClick={() => this.changeTime(600)}>Submit live papers</a>
                      <ul>
                        <li><a href onClick={() => this.changeTime(600)}>Publish live paper</a></li>
                        <li>
                          <a href onClick={() => this.changeTime(600)}>Password-protect live paper</a>
                          <ul>
                            <li><a href onClick={() => this.changeTime(600)}>Example</a></li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                    <li><a href onClick={() => this.changeTime(600)}>Resume working on an existing live paper</a>
                      <ul>
                        <li><a href onClick={() => this.changeTime(600)}>Load existing live paper project from file</a></li>
                        <li><a href onClick={() => this.changeTime(600)}>Load existing live paper project from KG</a></li>
                      </ul>
                    </li> */}
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="block">
          <div className="block-little-header">Examples</div>
          <div className="block-main-header">Sample resource URLs</div>
          <div className="block-text">
            The sample resources used in the above tutorial can be accessed{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.google.com/document/d/10jwl_hCPSYc5bbsn6VKtYxxUlCG7sqVH_6_goiqZnwE/edit?usp=sharing">
              here.
            </a>
          </div>
        </div>

        <div className="block">
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ flex: 0.5 }}>
              <div className="block-little-header">Credits</div>
              <div className="block-main-header">Developers & funding agencies</div>
              <div className="block-text">
                EBRAINS Live Papers have been developed through the efforts of many
                different people, with financial support from several organisations.
                <br /><br />
                <div style={{ lineHeight: 1.75 }}>
                  <strong>Design & development of Live Papers:</strong>
                  <ul>
                    <li>Shailesh Appukuttan (Université Paris-Saclay, CNRS - France)</li>
                    <li>Andrew Davison (Université Paris-Saclay, CNRS - France)</li>
                    <li>Luca L. Bologna (Institute of Biophysics, CNR - Italy)</li>
                    <li>Michele Migliore (Institute of Biophysics, CNR - Italy) </li>
                    <li>Felix Schürmann (Blue Brain Project, EPFL - Switzerland)</li>
                  </ul>
                </div>
                <br />
                We would also like to thank the developers of the various integrated
                tools and services.
                <br /><br />
                <div style={{ lineHeight: 1.75 }}>
                  <strong>Developers of integrated tools:</strong>
                  <ul>
                    <li>Rembrandt Bakker - 3D morphology visualizer</li>
                    <li>Genrich Ivaska - Neuron as a Service (BlueNaaS)</li>
                    <li>Stefano Antonel - Neuron as a Service (BlueNaaS)</li>
                    <li>Onur Ates - Neural activity visualizer (NeoViewer)</li>
                    <li>Shailesh Appukuttan - EBRAINS Model Catalog</li>
                    <li>Andrew Davison - EBRAINS Model Catalog</li>
                  </ul>
                </div>
              </div>
            </div>
            <div style={{ flex: 0.5, textAlign: "center" }}>
              <img
                alt=""
                src={process.env.PUBLIC_URL + "/figures/tutorial/funding.png"}
                width="60%"
                style={{ paddingTop: "60px" }}
              />
            </div>
          </div>
          <br />
        </div>

      </div>

    );
  }
}
