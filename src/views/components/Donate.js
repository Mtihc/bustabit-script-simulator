import React, { Component } from 'react';

class DonateButton extends Component {
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
        <button {...rest}
                className={`button ${className}`}
                onClick={() => this.setState({ isOpen: true })}>
          <span className="icon">
            <i className="fas fa-hand-holding-usd"></i>
          </span>
          <span className="is-uppercase">Send a tip...</span>
        </button>
        <DonateModal
          isOpen={this.state.isOpen}
          onClose={() => this.setState({ isOpen: false })}/>
      </div>
    )
  }

}

class DonateModal extends Component {
  render () {
    return (
      <div className={'modal' + (this.props.isOpen ? ' is-active' : '')}>
        <div className="modal-background"
             onClick={this.props.onClose}>
        </div>
        <div className="modal-content">
          <div className="box">
            <p><strong>Hello fellow gambler!</strong></p>
            <p>I hope you like my Bustabit Simulator. I worked hard on it.
              <span className="icon is-medium">
                <i className="fas fa-grin-beam-sweat"></i>
              </span>
            </p>
            <p>If you use this tool regularly, please consider donating a dollar or two.</p>
            <p>
              <a href="https://bustabit.com/tip"
                 target="_blank" rel="noopener noreferrer">
                <span>https://bustabit.com/tip</span>
              </a>
              <span>My username is </span><span className="is-bold">Mtihc</span>
            </p>
            <p>
              <a href="https://paypal.me/MitchStoffels"
                 target="_blank" rel="noopener noreferrer">
                <span>https://paypal.me/MitchStoffels</span>
              </a>
            </p>
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

export { DonateModal , DonateButton }
