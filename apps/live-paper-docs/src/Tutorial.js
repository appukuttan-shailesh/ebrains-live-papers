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
      width: '1120',
      height: '630',
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
              <YouTube videoId='tnAcMYpKiVk' opts={opts} onReady={this.onReady} />
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
                    <li><a href onClick={() => this.changeTime(156)}>Walkthrough a sample Live Paper</a></li>
                  </ul>
                </li>
                <li>
                  <a href onClick={() => this.changeTime(490)}>Live Paper Builder</a>
                  <li>
                    <a href onClick={() => this.changeTime(505)}>EBRAINS account and the Collaboratory</a>
                    <ul>
                      <li><a href onClick={() => this.changeTime(512)}>Request EBRAINS account</a></li>
                      <li><a href onClick={() => this.changeTime(561)}>Intro to Collaboratory & Collabs</a></li>
                      <li><a href onClick={() => this.changeTime(617)}>Create a new Collab</a></li>
                      <li><a href onClick={() => this.changeTime(712)}>Overview of Teams & Live Paper permissions</a></li>
                    </ul>
                  </li>
                  <ul>
                    <li>
                      <a href onClick={() => this.changeTime(821)}>Start creating a new live paper</a>
                      <ul>
                        <li><a href onClick={() => this.changeTime(868)}>Loading metadata via DOI</a></li>
                        <li><a href onClick={() => this.changeTime(890)}>Loading metadata via PDF</a></li>
                        <li><a href onClick={() => this.changeTime(975)}>Entering/updating metadata manually</a></li>
                      </ul>
                    </li>
                    <li><a href onClick={() => this.changeTime(1177)}>Preview live papers</a></li>
                    <li>
                      <a href onClick={() => this.changeTime(1200 )}>Adding resource sections</a>
                      <ul>
                        <li><a href onClick={() => this.changeTime(1235)}>Generic section</a></li>
                        <li>
                          <a href onClick={() => this.changeTime(1250)}>Common features</a>
                          <ul>
                            <li><a href onClick={() => this.changeTime(1285)}>Adding entries to section</a></li>
                            <li><a href onClick={() => this.changeTime(1316)}>Expanding input area</a></li>
                            <li><a href onClick={() => this.changeTime(1351)}>Re-ordering entries in section</a></li>
                            <li><a href onClick={() => this.changeTime(1362)}>Grouping items into tabs</a></li>
                            <li><a href onClick={() => this.changeTime(1430)}>Editing source code</a></li>
                            <li><a href onClick={() => this.changeTime(1517)}>Deleting items</a></li>
                            <li><a href onClick={() => this.changeTime(1524)}>Simple multi-input tool</a></li>
                            <li><a href onClick={() => this.changeTime(1638)}>Collapsing a live paper section</a></li>
                            <li><a href onClick={() => this.changeTime(1657)}>Re-ordering live paper sections</a></li>
                            <li><a href onClick={() => this.changeTime(1672)}>Deleting a live paper section</a></li>
                          </ul>
                        </li>
                        <li>
                          <a href onClick={() => this.changeTime(1701)}>Morphology section</a>
                          <ul>
                            <li><a href onClick={() => this.changeTime(1775)}>Add from external database</a></li>
                          </ul>
                        </li>
                        <li>
                          <a href onClick={() => this.changeTime(1949)}>Electrophysiology section</a>
                          <ul>
                            <li><a href onClick={() => this.changeTime(2047)}>Add from external database</a></li>
                          </ul>
                        </li>
                        <li>
                          <a href onClick={() => this.changeTime(2081)}>Models section</a>
                          <ul>
                            <li><a href onClick={() => this.changeTime(2114)}>Add from external database</a></li>
                          </ul>
                        </li>
                        <li>
                          <a href onClick={() => this.changeTime(2182)}>Custom HTML/Markdown section</a>
                          <ul>
                            <li><a href onClick={() => this.changeTime(2252)}>Example</a></li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                    <li><a href onClick={() => this.changeTime(2358)}>Download live papers</a></li>
                    <li><a href onClick={() => this.changeTime(2433)}>Save live papers</a></li>
                    <li>
                      <a href onClick={() => this.changeTime(2503)}>Submit live papers</a>
                      <ul>
                        <li><a href onClick={() => this.changeTime(2517)}>Publish live paper</a></li>
                        <li>
                          <a href onClick={() => this.changeTime(2559)}>Password-protect live paper</a>
                          <ul>
                            <li><a href onClick={() => this.changeTime(2579)}>Example</a></li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                    <li><a href onClick={() => this.changeTime(2640)}>Resume working on an existing live paper</a>
                      <ul>
                        <li><a href onClick={() => this.changeTime(2658)}>Load existing live paper project from file</a></li>
                        <li><a href onClick={() => this.changeTime(2702)}>Load existing live paper project from KG</a></li>
                      </ul>
                    </li>
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

      </div>

    );
  }
}
