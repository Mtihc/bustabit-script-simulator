import React, { Component } from 'react';

class OptionsButton extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false
        }
    }

    render() {
        const { className = '', ...rest } = this.props
        return (
            <div>
                <button {...rest} className={`button ${className}`}
                    onClick={() => this.setState({ isOpen: true })}>
                    <span className="icon is-medium">
                        <i className="fas fa-exclamation"></i>
                    </span>
                    <span className="is-uppercase">Options</span>
                </button>
                <OptionsModal
                    isOpen={this.state.isOpen}
                    onClose={() => this.setState({ isOpen: false })} />
            </div>
        )
    }
}

class OptionsModal extends Component {
    render() {
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
                    Options
                    </h4>
                        <p>In the near future you will find several </p>
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

export { OptionsButton, OptionsModal }
