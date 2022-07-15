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
            <div class="video-container">
              <YouTube videoId='azBQRXMsLPY' opts={opts} onReady={this.onReady} />
            </div>
            <br /><br />
            <a onClick={() => this.changeTime(100)}>Topic 1</a><br />
            <a onClick={() => this.changeTime(500)}>Topic 2</a><br />
          </div>
        </div>


      </div>
    );
  }
}
