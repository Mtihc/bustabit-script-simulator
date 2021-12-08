import React, { Component } from "react";
import './OptionsMenu.sass'

class OptionsMenu extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isOpen: false
    };

    this.handleWindowClick = this.handleWindowClick.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  componentDidMount () {
    window.addEventListener('click', this.handleWindowClick)
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleWindowClick)
  }

  handleWindowClick () {
    // close the menu
    this.setState({ isOpen: false })
  }

  handleButtonClick (event) {
    // don't let the window receive the click event
    event.stopPropagation();
    // open/close the menu
    this.setState(prevState => {
      return { isOpen: !prevState.isOpen }
    });
  }

  render () {
    let { children, className = '', style, ...rest } = this.props;
    return (
      <div
        {...rest}
        className={this.classNames('OptionsMenu is-relative', className, !children && 'is-hidden')}>
        <CircularIconButton
          className={'is-white'}
          iconClassName={'fas fa-ellipsis-v'}
          onClick={this.handleButtonClick}/>
        {/* Submenu */}
        <div
          style={{ position: 'absolute', zIndex: 10 }}
          className={this.classNames('box p-1', !this.state.isOpen && 'is-hidden')}>
          {children}
        </div>
      </div>
    )
  }

  classNames(...classNames) {
    return classNames.filter(className => !!className)
      .map(className => className.toString())
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

function CircularIconButton (props) {
  let { children, className = '', iconClassName = 'fas fa-ellipsis-v', ...rest } = props;
  return (
    <button {...rest}
            className={`button is-circular ${className}`}>
      <span className={"icon"}>
        <i className={iconClassName}/>
      </span>
      {children}
    </button>
  )
}

function OptionsMenuItem (props) {
  let { children, iconClassName = '', className = '', onClick, ...rest } = props
  return (
    <div {...rest}
         className={`p-0 ${className}`.trim()}>
      <button className="button is-white is-fullwidth is-justify-content-left"
              onClick={onClick}>
        <span className={"icon"}><i className={iconClassName}/></span>
        <span>{children}</span>
      </button>
    </div>
  )
}

export { OptionsMenu, OptionsMenuItem }
