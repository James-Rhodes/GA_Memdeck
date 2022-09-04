import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import "../../styles/style.css";
import { AGSettings } from "./ag-settings";
import { DisplayResults } from "./ag-displayResults";

const RUN_URL = "/Generated_Mem_Deck/RunGA";
const GET_RESULTS_URL = "/Generated_Mem_Deck/GetResults";

export class AGShuffleTab extends React.Component {
  constructor(props) {
    super(props);

    this.handleSettingsChange = this.handleSettingsChange.bind(this);
    this.getGeneratedDeck = this.getGeneratedDeck.bind(this);
    this.state = {};
  }

  handleSettingsChange(data) {
    this.getGeneratedDeck(data);
  }

  // componentDidMount() {
  //   setInterval(() => {
  //     console.log(this.state);
  //   }, 1000);
  // }

  getGeneratedDeck(params) {
    if (!this.state.checkResultTimer) {
      this.setState({
        loading: "Loading Page",
        Order: undefined,
        Shuffles: undefined,
        error: undefined,
      });
      fetch(RUN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(params),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          this.setState({
            ...this.state,
            ...data,
            checkResultTimer: setInterval(this.GetResults.bind(this), 1000),
          });
        });
    }
  }

  GetResults() {
    if (this.state.uuid) {
      fetch(GET_RESULTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ uuid: this.state.uuid }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (!data.response) {
            clearInterval(this.state.checkResultTimer);
            this.setState({
              ...data,
              loading: undefined,
              checkResultTimer: undefined,
            });
          }
          console.log(data);
        });
    }
  }

  render() {
    return (
      <div>
        <h1>Auto-Generated Shuffle</h1>
        <Container>
          <Row className="justify-content-md-center">
            <Col md="7">
              <DisplayResults
                order={this.state.Order}
                shuffles={this.state.Shuffles}
                error={this.state.error}
                loading={this.state.loading}
              />
            </Col>

            <Col>
              <AGSettings
                changeSettings={this.handleSettingsChange}
                buttonDisabled={this.state.checkResultTimer}
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
