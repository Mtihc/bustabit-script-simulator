import { getUniqueID } from './AppUtils'
import NotificationActionTypes from './NotificationActionTypes';
import NotificationTypes from './NotificationTypes';
import NotificationDispatcher from './AppDispatcher';

const Actions = {
  open (type, content, options) {
    let { id = getUniqueID(), container = 'top-right', closeable = true, autoCloseTimeout = 0, ...props } = options || {};
    let notification = {
      type,
      id,
      children: content,
      container,
      onClose: closeable ? this.close.bind(this, id) : undefined,
      ...props,
    };
    NotificationDispatcher.dispatch({ type: NotificationActionTypes.OPEN, notification });
    if (autoCloseTimeout) {
      setTimeout(() => {
        this.close(notification.id)
      }, autoCloseTimeout)
    }
  },

  info (content, options) {
    this.open(NotificationTypes.INFO, content, options)
  },

  success (content, options) {
    this.open(NotificationTypes.SUCCESS, content, options)
  },

  warning (content, options) {
    this.open(NotificationTypes.WARNING, content, options)
  },

  error (content, options) {
    this.open(NotificationTypes.ERROR, content, options)
  },

  close (id) {
    NotificationDispatcher.dispatch({ type: NotificationActionTypes.CLOSE, id })
  }
};

export default Actions;