import { getUniqueID, capitalize } from './AppUtils'
import NotificationActionTypes from './NotificationActionTypes';
import NotificationTypes from './NotificationTypes';
import NotificationDispatcher from './AppDispatcher';

const Actions = {
  open ({ type, header, content, model, autoCloseTimeout }) {
    let notification = {
      ...arguments[0],
      id: getUniqueID(),
      header: arguments[0].header || capitalize(type)
    };
    NotificationDispatcher.dispatch({ type: NotificationActionTypes.OPEN, notification })

    if (autoCloseTimeout) {
      setTimeout(() => {
        this.close(notification.id)
      }, autoCloseTimeout)
    }
  },

  info () {
    this.open({ type: NotificationTypes.INFO, ...arguments[0] })
  },

  success () {
    this.open({ type: NotificationTypes.SUCCESS, ...arguments[0] })
  },

  warning () {
    this.open({ type: NotificationTypes.WARNING, ...arguments[0] })
  },

  error () {
    this.open({ type: NotificationTypes.ERROR, ...arguments[0] })
  },

  close (id) {
    NotificationDispatcher.dispatch({ type: NotificationActionTypes.CLOSE, id })
  }
};

export default Actions;