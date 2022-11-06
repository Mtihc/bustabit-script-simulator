import AppDispatcher from './AppDispatcher';
import ScriptActionTypes from './ScriptActionTypes';
import ScriptUtils from './ScriptUtils'
import NotificationActions from './NotificationActions'

const Actions = {

  load () {
    let scripts = ScriptUtils.load();
    AppDispatcher.dispatch({ type: ScriptActionTypes.LOADED, scripts });
  },

  restoreSamples () {
    let scripts = ScriptUtils.restoreSamples()
    AppDispatcher.dispatch({ type: ScriptActionTypes.LOADED, scripts });
    NotificationActions.success('Sample scripts restored.', { autoCloseTimeout: 2000, container: 'bottom-left' })
  },

  restoreSample (id) {
    let scripts = ScriptUtils.restoreSample(id)
    AppDispatcher.dispatch({ type: ScriptActionTypes.LOADED, scripts });
  },

  delete (id) {
    AppDispatcher.dispatch({ type: ScriptActionTypes.DELETE, id })
  },

  deleted (id) {
    ScriptUtils.delete(id)
    AppDispatcher.dispatch({ type: ScriptActionTypes.DELETED, id })
  },

  save (script) {
    if (!script.id) {
      try {
        ScriptUtils.save(script)
        AppDispatcher.dispatch({ type: ScriptActionTypes.CREATED, script })
        NotificationActions.success('Script saved.', { autoCloseTimeout: 2000, container: 'bottom-left' })
      } catch (e) {
        AppDispatcher.dispatch({ type: ScriptActionTypes.CREATE_ERROR, script, error: e })
      }
    } else {
      try {
        ScriptUtils.save(script)
        AppDispatcher.dispatch({ type: ScriptActionTypes.UPDATED, script })
        NotificationActions.success('Script saved.', { autoCloseTimeout: 2000, container: 'bottom-left' })
      } catch (e) {
        AppDispatcher.dispatch({ type: ScriptActionTypes.UPDATE_ERROR, script, error: e })
      }
    }
  },

  new () {
    AppDispatcher.dispatch({ type: ScriptActionTypes.NEW })
  },

  edit (id) {
    AppDispatcher.dispatch({ type: ScriptActionTypes.EDIT, id })
  },

  cancel () {
    AppDispatcher.dispatch({ type: ScriptActionTypes.CANCEL })
  },

  select (id) {
    AppDispatcher.dispatch({ type: ScriptActionTypes.SELECT, id })
  },

  deselect () {
    AppDispatcher.dispatch({ type: ScriptActionTypes.DESELECT })
  },

  run (settings) {
    Actions.save(settings.script)
    AppDispatcher.dispatch({ type: ScriptActionTypes.SIMULATE, settings });
    ScriptUtils
      .run(settings)
      .then((results) => {
        AppDispatcher.dispatch({ type: ScriptActionTypes.SIMULATED, results })
      })
  },

  exportScripts () {
    ScriptUtils.exportScripts()
      .then(() => {
        NotificationActions.success('Scripts exported.', { autoCloseTimeout: 2000, container: 'bottom-left' })
      })
      .catch(error => {
        NotificationActions.error(error.message, { autoCloseTimeout: 3000 })
      })
  },

  exportScript (id) {
    ScriptUtils.exportScript(id)
  },

  copyScript (id) {
    let scripts = ScriptUtils.load();
    let script = scripts[id];
    ScriptUtils.setClipboardContent(script.text).then(() => {
      NotificationActions.success('Script copied to clipboard', { autoCloseTimeout: 3000, container: 'bottom-left' })
    })
  }
};

export default Actions;
