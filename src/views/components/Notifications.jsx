import React, { Component } from 'react';
import NotificationTypes from "../../data/NotificationTypes";
import { TransitionGroup, CSSTransition } from 'react-transition-group';

function getClassByType(type) {
  switch(type) {
    case NotificationTypes.INFO:
      return 'is-info';
    case NotificationTypes.WARNING:
      return 'is-warning';
    case NotificationTypes.SUCCESS:
      return 'is-success';
    case NotificationTypes.ERROR:
      return 'is-danger';
    default:
      return 'is-info';
  }
}

class NotificationList extends Component {
  render () {
    return (
      <div>
        <TransitionGroup>
          {this.props.notifications.items.entrySeq().map(([, item]) => {
            let props = { ...item, onClose: this.props.notifications.close }
            if (item.modal) {
              return (
                <CSSTransition key={item.id} classNames="item" timeout={500}>
                  <ModalNotification {...props}/>
                </CSSTransition>
              )
            } else {
              return (
                <CSSTransition key={item.id} classNames="item" timeout={500}>
                  <Notification {...props}/>
                </CSSTransition>
              )
            }
          })}
        </TransitionGroup>
      </div>
    )
  }
}

class Notification extends Component {
  render () {
    return (
      <article className={`message ${getClassByType(this.props.type)}`} style={{ position: 'absolute', right: '1%', top: '10%'}}>
        <div className="message-header">
          <p>{this.props.header}</p>
          <button className="delete" onClick={() => this.props.onClose(this.props.id)}/>
        </div>
        <div className="message-body">
          {this.props.content}
        </div>
      </article>
    )
  }
}

class ModalNotification extends Component {
  render () {
    return (
      <div className={"modal is-active"}>
        <div className={"modal-background"}/>
        <div className={"modal-content"}>
          <article className={`message ${getClassByType(this.props.type)}`}>
            <div className="message-header">
              <p>{this.props.header}</p>
              <button className="delete" onClick={() => this.props.onClose(this.props.id)}/>
            </div>
            <div className="message-body">
              {this.props.content}
            </div>
          </article>
        </div>
      </div>
    )
  }
}

export { NotificationList }