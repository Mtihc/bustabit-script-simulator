import React, { Component } from 'react';

class DisclaimerButton extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpen: false
    }
  }

  render () {
    const { className = '', ...rest } = this.props
    return (
      <div>
        <button {...rest} className={`button ${className}`}
                onClick={() => this.setState({ isOpen: true })}>
          <span className="icon is-medium">
            <i className="fas fa-exclamation"></i>
          </span>
          <span className="is-uppercase">Disclaimer</span>
        </button>
        <DisclaimerModal
          isOpen={this.state.isOpen}
          onClose={() => this.setState({ isOpen: false })}/>
      </div>
    )
  }
}

class DisclaimerModal extends Component {
  render () {
    return (
      <div className={'modal' + (this.props.isOpen ? ' is-active' : '')}>
        <div className="modal-background"
             onClick={this.props.onClose}>
        </div>
        <div className="modal-content">
          <div className="box">
            <h4 className="title is-4">
              <span
                className="icon is-medium">
                <i className="fas fa-exclamation"></i>
              </span>
              Disclaimer
            </h4>
            <p>No one is responsible if you lose money using this tool and/or trusting its results.</p>
            <p>All it does is simulate you running a script on previous bustabit games. </p>
            <p>Results achieved in the past don't provide any guarantee for the future.</p>
            <p>And, there's no guarantee that the simulated engine on this site, behaves in exactly the same way as the engine on bustabit.</p>
          </div>
        </div>
        <button
          className="modal-close is-large"
          onClick={this.props.onClose}>
        </button>
      </div>
    )
  }
}

export { DisclaimerButton, DisclaimerModal }
