import Immutable from 'immutable';
import { ReduceStore } from 'flux/utils';
import NotificationActionTypes from './NotificationActionTypes';
import NotificationDispatcher from './AppDispatcher';

class NotificationStore extends ReduceStore {
  constructor() {
    super(NotificationDispatcher);
  }

  getInitialState() {
    return Immutable.OrderedMap()
  }

  reduce(state, action) {

    switch (action.type) {
      case NotificationActionTypes.OPEN:
        return state.set(action.notification.id, action.notification)

      case NotificationActionTypes.CLOSE:
        return state.delete(action.id)

      default:
        return state;
    }
  }
}

let notificationsStore = new NotificationStore();
export default notificationsStore
