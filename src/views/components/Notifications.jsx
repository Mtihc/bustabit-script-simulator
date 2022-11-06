import React, { Component } from 'react';
import PropTypes from 'prop-types'
import NotificationTypes from "../../data/NotificationTypes";
import FlipMove from 'react-flip-move';
import './Notifications.sass';

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


function classNames(...classNames) {
  return classNames.filter(className => !!className)
    .map(className => className.toString())
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

class Notification extends Component {
  static propTypes = {
    children: PropTypes.any,
    header: PropTypes.any,
    id: (props, propName, componentName) => {
      if (props[propName] && typeof(props[propName]) !== 'string') {
        return new Error(`${componentName} ${propName} must be a string`);
      }
      if (!props[propName] && props.onClose) {
        return new Error(`${componentName} ${propName} is required when onClose is set`);
      }
    },
    modal: PropTypes.bool,
    onClose: PropTypes.func,
    type: PropTypes.oneOf(Object.values(NotificationTypes)).isRequired,
  };

  render () {
    let { children, className = '', header, id, modal, onClose, type, ...rest } = this.props;
    let notification = (
      <article
        {...rest}
        className={classNames('Notification', 'message', className, getClassByType(type))}>
        {(header || onClose) && (
          <div className="message-header">
            <p>{header}</p>
            {onClose && (
              <button className="delete" onClick={() => onClose(id)}/>
            )}
          </div>
        )}
        <div className="message-body">
          {children}
        </div>
      </article>
    );
    if (modal) {
      return (
        <div className={"modal is-active"}>
          <div className={"modal-background"} onClick={() => onClose(id)}/>
          <div className={"modal-content"}>
            {notification}
          </div>
        </div>
      )
    } else {
      return notification;
    }
  }
}

function NotificationsContainer (props) {
  let { className, items, container, notificationProps, ...rest } = props;
  return (
    <div
      className={classNames('NotificationsContainer', `NotificationsContainer-${container}`)}>
      <FlipMove
        {...rest}
        className={classNames('FlipMove', className)}
        enterAnimation="none"
        leaveAnimation="none">
        {items.filter(item => item.container === container).entrySeq().map(([id, item]) => {
          let { container, ...rest } = item;
          return (
            <Notification key={`Notification-${id}`} {...notificationProps} {...rest}>
              {item.children}
            </Notification>
          )
        })}
      </FlipMove>
    </div>
  );
}

class Notifications extends Component {
  static propTypes = {
    notifications: PropTypes.shape({
      items: PropTypes.object.isRequired,
    }).isRequired,
  };

  render () {
    let { notifications, className = '', ...rest } = this.props;
    return (
      <div
        {...rest}
        className={`Notifications ${className}`.trim()}>
        <NotificationsContainer
          items={notifications.items}
          container={'top-left'} />
        <NotificationsContainer
          items={notifications.items}
          container={'top-right'} />
        <NotificationsContainer
          items={notifications.items}
          container={'bottom-left'} />
        <NotificationsContainer
          items={notifications.items}
          container={'bottom-right'} />
      </div>
    )
  }
}

export default Notifications;