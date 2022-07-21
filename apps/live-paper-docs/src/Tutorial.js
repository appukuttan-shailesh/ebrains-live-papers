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
    event.target.playVideo();
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
            (PyNN video as placeholder)
            <div class="video-container">
              <YouTube videoId='azBQRXMsLPY' opts={opts} onReady={this.onReady} />
            </div>
            <br />
            Click on the below links to jump to a specific topic in the video:
            <br />
            <div style={{ lineHeight: 1.75 }}>
              <ul>
                <li><a onClick={() => this.changeTime(100)}>Introduction to Live Papers</a></li>
                <li>
                  <a onClick={() => this.changeTime(500)}>Live Paper Platform</a>
                  <ul>
                    <li><a onClick={() => this.changeTime(600)}>Listing of all Live Papers</a></li>
                    <li><a onClick={() => this.changeTime(600)}>Walkthrough a sample Live Paper</a></li>
                  </ul>
                </li>
                <li>
                  <a onClick={() => this.changeTime(500)}>Live Paper Builder</a>
                  <ul>
                    <li>
                      <a onClick={() => this.changeTime(600)}>Start creating a new live paper</a>
                      <ul>
                        <li><a onClick={() => this.changeTime(600)}>Loading metadata via DOI</a></li>
                        <li><a onClick={() => this.changeTime(600)}>Loading metadata via PDF</a></li>
                        <li><a onClick={() => this.changeTime(600)}>Entering/updating metadata manually</a></li>
                        <li><a onClick={() => this.changeTime(600)}>Specifying live paper author(s)</a></li>
                      </ul>
                    </li>
                    <li>
                      <a onClick={() => this.changeTime(600)}>Adding resource sections</a>
                      <ul>
                        <li>
                          <a onClick={() => this.changeTime(600)}>Common features</a>
                          <ul>
                            <li><a onClick={() => this.changeTime(600)}>Adding entries to section</a></li>
                            <li><a onClick={() => this.changeTime(600)}>Expanding input area</a></li>
                            <li><a onClick={() => this.changeTime(600)}>Re-ordering entries in section</a></li>
                            <li><a onClick={() => this.changeTime(600)}>Grouping items into tabs</a></li>
                            <li>
                              <a onClick={() => this.changeTime(600)}>Editing source code</a>
                              <ul>
                                <li><a onClick={() => this.changeTime(600)}>Simple multi-input tool</a></li>
                              </ul>
                            </li>
                            <li><a onClick={() => this.changeTime(600)}>Re-ordering live paper sections</a></li>
                            <li><a onClick={() => this.changeTime(600)}>Collapsing a live paper section</a></li>
                            <li><a onClick={() => this.changeTime(600)}>Deleting a live paper section</a></li>
                          </ul>
                        </li>
                        <li><a onClick={() => this.changeTime(600)}>Generic section</a></li>
                        <li>
                          <a onClick={() => this.changeTime(600)}>Morphology section</a>
                          <ul>
                            <li><a onClick={() => this.changeTime(600)}>Add from external database</a></li>
                          </ul>
                        </li>
                        <li>
                          <a onClick={() => this.changeTime(600)}>Electrophysiology section</a>
                          <ul>
                            <li><a onClick={() => this.changeTime(600)}>Add from external database</a></li>
                          </ul>
                        </li>
                        <li>
                          <a onClick={() => this.changeTime(600)}>Models section</a>
                          <ul>
                            <li><a onClick={() => this.changeTime(600)}>Add from external database</a></li>
                          </ul>
                        </li>
                        <li>
                          <a onClick={() => this.changeTime(600)}>Custom HTML/Markdown section</a>
                          <ul>
                            <li><a onClick={() => this.changeTime(600)}>Example</a></li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                    <li><a onClick={() => this.changeTime(600)}>Preview live papers</a></li>
                    <li><a onClick={() => this.changeTime(600)}>Download live papers</a></li>
                    <li>
                      <a onClick={() => this.changeTime(600)}>Save live papers</a>
                      <ul>
                        <li><a onClick={() => this.changeTime(600)}>Request EBRAINS account</a></li>
                        <li><a onClick={() => this.changeTime(600)}>Intro to Collaboratory & Collabs</a></li>
                        <li><a onClick={() => this.changeTime(600)}>Create a new Collab</a></li>
                        <li><a onClick={() => this.changeTime(600)}>Overview of Teams & Live Paper permissions</a></li>
                      </ul>
                    </li>
                    <li>
                      <a onClick={() => this.changeTime(600)}>Submit live papers</a>
                      <ul>
                        <li><a onClick={() => this.changeTime(600)}>Publish live paper</a></li>
                        <li>
                          <a onClick={() => this.changeTime(600)}>Password-protect live paper</a>
                          <ul>
                            <li><a onClick={() => this.changeTime(600)}>Example</a></li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                    <li><a onClick={() => this.changeTime(600)}>Resume working on an existing live paper</a>
                      <ul>
                        <li><a onClick={() => this.changeTime(600)}>Load existing live paper project from file</a></li>
                        <li><a onClick={() => this.changeTime(600)}>Load existing live paper project from KG</a></li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>


      </div>
    );
  }
}
