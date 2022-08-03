import React from "react";
import "./App.css";

export default class Credits extends React.Component {
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
          <div className="title-solid-style" style={{ fontSize: 44 }}>Credits</div>
          <div className="title-solid-style" style={{ fontSize: 32, color: "#00A595" }}>Developers & funding agencies</div>
        </div>

        <div className="block">
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ flex: 0.5 }}>
              <div className="block-little-header">Acknowledgements</div>
              <div className="block-main-header">People & Funding</div>
              <div className="block-text">
                EBRAINS Live Papers have been developed through the efforts of many
                different people, with financial support from several organisations.
                <br /><br />
                <div style={{ lineHeight: 1.75 }}>
                  <strong>Design & development of Live Papers:</strong>
                  <ul>
                    <li>Shailesh Appukuttan<br /><i>Université Paris-Saclay, CNRS - France</i></li>
                    <li>Andrew Davison<br /><i>Université Paris-Saclay, CNRS - France</i></li>
                    <li>Luca L. Bologna<br /><i>Institute of Biophysics, CNR - Italy</i></li>
                    <li>Michele Migliore<br /><i>Institute of Biophysics, CNR - Italy </i></li>
                    <li>Felix Schürmann<br /><i>Blue Brain Project, EPFL - Switzerland</i></li>
                  </ul>
                </div>
                <br />
                We would also like to thank the developers of the various integrated
                tools and services:
                <br />
                <div style={{ lineHeight: 1.75 }}>
                  {/* <strong>Developers of integrated tools & services:</strong> */}
                  <ul>
                    <li>Rembrandt Bakker
                      <br />
                      <i><a href="https://neuroinformatics.nl/HBP/morphology-viewer/"
                        target="_blank"
                        rel="noopener noreferrer">
                        3D Morphology Visualizer
                      </a></i>
                    </li>
                    <li>Genrich Ivaska, Stefano Antonel<br />
                      <i><a href="https://blue-naas-bsp-epfl.apps.hbp.eu/"
                        target="_blank"
                        rel="noopener noreferrer">
                        Neuron as a Service (BlueNaaS)
                      </a></i>
                    </li>
                    <li>Onur Ates, Andrew Davison, Shailesh Appukuttan<br />
                      <i><a href="https://neo-viewer.brainsimulation.eu/"
                        target="_blank"
                        rel="noopener noreferrer">
                        Neural activity visualizer (NeoViewer)
                      </a></i>
                    </li>
                    <li>Shailesh Appukuttan, Andrew Davison<br />
                      <i><a href="https://collab-file-cloner.netlify.app/"
                        target="_blank"
                        rel="noopener noreferrer">
                        Collab File Cloner
                      </a></i>
                    </li>
                    <li>Shailesh Appukuttan, Andrew Davison<br />
                      <i><a href="https://model-catalog.brainsimulation.eu/"
                        target="_blank"
                        rel="noopener noreferrer">
                        EBRAINS Model Catalog
                      </a></i>
                    </li>
                    <li>Fatma El Haddad, Shailesh Appukuttan<br />
                      <i>
                        CORS Proxy
                      </i>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div style={{ flex: 0.5, textAlign: "center" }}>
              <img
                alt=""
                src={process.env.PUBLIC_URL + "/figures/credits/funding.png"}
                width="75%"
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
