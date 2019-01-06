import React, { Component } from 'react';

import './global.css';
import ResultsList from './components/ResultsList';

const { ipcRenderer } = window.require('electron');

class App extends Component {
  constructor() {
    super();
    this.state = {
      results: [],
      inSearch: false,
      searchComplete: false
    };
    // * IPC Listeners
    ipcRenderer.on('maps-data-res', (event, data) => {
      this.setState({
        results: data
      });
      this.searchSuccess();
    });
  }

  handleInput = event => {
    this.setState({
      [event.currentTarget.id]: event.currentTarget.value
    });
  };

  // * UI Inputs

  submitSearch = event => {
    event.preventDefault();
    event.currentTarget.classList.add('is-loading');
    this.setState({
      inSearch: true
    });
    // TODO Use IPC listener to make call to GoogleAPI
    ipcRenderer.send('map-data-req', this.state);
  };

  clearFields = event => {
    event.preventDefault();
    const submitButton = document.querySelector('#submit');
    submitButton.classList.remove('is-loading');
    const inputs = [...document.querySelectorAll('input')];
    inputs.forEach(input => {
      input.value = '';
    });
    this.setState({ results: [], searchComplete: false });
  };

  searchSuccess = () => {
    this.setState({
      inSearch: false,
      searchComplete: true
    });
    const submitButton = document.querySelector('#submit');
    submitButton.classList.remove('is-loading');
  };

  render() {
    return (
      <div>
        <section
          className="section"
          style={{ backgroundColor: 'hsl(0, 0%, 96%)' }}
        >
          <div className="container">
            <div className="field is-grouped columns">
              <div className="control column is-two-thirds">
                <label className="label">Search Area</label>
                <input
                  id="searchArea"
                  type="text"
                  className="input"
                  placeholder="Area to search"
                  onChange={this.handleInput}
                />
              </div>
              <div className="control column is-one-third">
                <label className="label">Place Category</label>
                <input
                  id="placeCategory"
                  type="text"
                  className="input"
                  placeholder="Type of thing to find"
                  onChange={this.handleInput}
                />
              </div>
            </div>

            <div className="level">
              <div className="level-left">
                <div className="field is-grouped">
                  <div className="control">
                    <button
                      onClick={this.submitSearch}
                      className="button is-primary"
                      id="submit"
                    >
                      Submit
                    </button>
                  </div>
                  <div className="control">
                    <button
                      onClick={this.clearFields}
                      className="button is-light"
                      id="cancel"
                      disabled={!this.state.searchComplete}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
              <div className="level-right" />
              <div className="field">
                <div className="control">
                  <button
                    className="button is-text"
                    id="export"
                    disabled={!this.state.searchComplete}
                  >
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section class="section">
          <div className="container">
            <ResultsList
              results={this.state.results}
              loading={this.state.inSearch}
            />
          </div>
        </section>
      </div>
    );
  }
}

export default App;
