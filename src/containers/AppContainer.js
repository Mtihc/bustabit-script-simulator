import AppView from '../views/AppView';
import {Container} from 'flux/utils';
import ScriptStore from '../data/ScriptStore';
import ScriptListStore from '../data/ScriptListStore';
import ScriptActions from '../data/ScriptActions';
import NotificationStore from '../data/NotificationStore';
import NotificationActions from '../data/NotificationActions'

function getStores() {
  return [
    ScriptStore,
    ScriptListStore,
    NotificationStore
  ];
}

function getState() {
  let items = ScriptStore.getState()
  let list = ScriptListStore.getState()
  let notifications = NotificationStore.getState()
  return {
    scripts: {
      ...{
        items: items,
        creating: list.get('creating'),
        editing: items.get(list.get('editingId')),
        deleting: items.get(list.get('deletingId')),
        selected: items.get(list.get('selectedId')),
        isLoading: list.get('isSimulating'),
        results: list.get('results'),
        createError: list.get('createError'),
        updateError: list.get('updateError'),
        deleteError: list.get('deleteError')
      },
      ...{
        load: ScriptActions.load,
        onNew: ScriptActions.new,
        onEdit: ScriptActions.edit,
        onCancel: ScriptActions.cancel,
        onSave: ScriptActions.save,
        onDelete: ScriptActions.delete,
        onDeleted: ScriptActions.deleted,
        onSelect: ScriptActions.select,
        onDeselect: ScriptActions.deselect,
        onRun: ScriptActions.run,
      }
    },
    notifications: {
      items: notifications,
      ...{
        open: NotificationActions.open,
        close: NotificationActions.close
      }
    }
  };
}

export default Container.createFunctional(AppView, getStores, getState);
