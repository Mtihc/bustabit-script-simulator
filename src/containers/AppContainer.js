import AppView from '../views/AppView';
import {Container} from 'flux/utils';
import ScriptStore from '../data/ScriptStore';
import ScriptListStore from '../data/ScriptListStore';
import ScriptActions from '../data/ScriptActions';

function getStores() {
  return [
    ScriptStore,
    ScriptListStore
  ];
}

function getState() {
  let items = ScriptStore.getState()
  let list = ScriptListStore.getState()
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
        onDeleteConfirmed: ScriptActions.deleteConfirmed,
        onSelect: ScriptActions.select,
        onDeselect: ScriptActions.deselect,
        onRunScript: ScriptActions.runScript,
      }
    },
  };
}

export default Container.createFunctional(AppView, getStores, getState);
