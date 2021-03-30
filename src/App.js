import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import $ from 'jquery';
import logo from './logo.png';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, InputGroup, FormControl, Table, Card, Container, Row, Col } from 'react-bootstrap';

require('dotenv').config()
const apiKey = process.env.INFURA_API_KEY

class App extends Component {

  componentDidMount() {
    this.loadBlockchainData()
  }

  async loadBlockchainData() {

    const web3 = new Web3(`https://mainnet.infura.io/v3/${apiKey}`)

    var latestBlock = web3.eth.getBlockNumber().then((latest) => {
      for (var i = 0; i < 10; i++) {
        web3.eth.getBlock(latest - i).then((block) => {
          var number = block.number
          var hash = block.hash
          var size = block.size
          var time = new Date(block.timestamp)
          $('tbody').append("<tr><td>" + number + "</td><td>" + hash + "</td><td>" + size + "</td><td>" + time + "</td></tr>")
        })
      }
    })

    const getblock = await web3.eth.getBlock('latest')
    this.setState({
      getblock: getblock.number,
      difficulty: getblock.difficulty,
    })

    const gaspricenow = await web3.eth.getGasPrice()
    this.setState({ gaspricenow: gaspricenow })

    const hashratenow = await web3.eth.getHashrate()
    this.setState({ hashratenow: hashratenow })

  }
  searchBlock() {
    const web3 = new Web3(`https://mainnet.infura.io/v3/${apiKey}`)
    web3.eth.getBlock(this.state.value).then((block) => {
      this.setState({
        searchresult: block,
      })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      getBlock: '',
      gaspricenow: '',
      difficulty: '',
      hashratenow: '',
      value: '',
      searchresult: null,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({ value: event.target.value })

  }

  handleSubmit(event) {
    event.preventDefault()
    this.searchBlock()
  }


  render() {


    return (
      <div className="container">
        <img src={logo} alt="Logo" class="logo" />
        <h1 class="display-1">Ether Explorer</h1>
        <h2>Latest Block: </h2>
        <h3># {this.state.getblock}</h3>

        <InputGroup className="mb-3">
          <FormControl
            onSubmit={this.handleSubmit}
            placeholder="Search Block Number"
            aria-describedby="basic-addon2"
            value={this.state.value}
            onChange={this.handleChange}
          />
          <InputGroup.Append>
            <Button variant="primary"
              value="Submit"
              onClick={this.handleSubmit}>Submit</Button>
          </InputGroup.Append>
        </InputGroup>

        <div>
          <ol class="list-inline-item">Hash: {this.state.searchresult && this.state.searchresult.hash}</ol>
          <ol class="list-inline-item">Size: {this.state.searchresult && this.state.searchresult.size}</ol>
          <ol class="list-inline-item">Timestamp: {this.state.searchresult && this.state.searchresult.timestamp}</ol>
        </div>


        <div>
          <Container>
            <Row>


              <Col md={4}>
                <Card style={{ width: '18rem' }}>
                  <Card.Body>
                    <Card.Title>Med Gas Price</Card.Title>
                    <Card.Text>
                      {this.state.gaspricenow} Wei
                      </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card style={{ width: '18rem' }}>
                  <Card.Body>
                    <Card.Title>Difficulty</Card.Title>
                    <Card.Text>
                      {this.state.difficulty} TH
                      </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card style={{ width: '18rem' }}>
                  <Card.Body>
                    <Card.Title>Hash Rate</Card.Title>
                    <Card.Text>
                      {this.state.hashratenow} HG/s
                      </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

            </Row>
          </Container>
        </div>

        <h2>Latest 10 Blocks</h2>
        <Table responsive class="table">
          <thead>
            <tr class="table-secondary">
              <th scope="col">#</th>
              <th scope="col">Hash</th>
              <th scope="col">Size</th>
              <th scope="col">Timestamp</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </Table>

      </div>

    );
  }
}

export default App;
