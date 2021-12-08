import React from 'react';
import 'bulma/css/bulma.css'
import './AppView.sass';
import BustabitScript from './components/BustabitScript'
import { DisclaimerButton } from './components/Disclaimer'
import { DonateButton } from './components/Donate'
import Notifications from './components/Notifications'
import * as PropTypes from "prop-types";
import ScriptActions from "../data/ScriptActions";

function ExportAllScriptsButton(props) {
  const { className = '', ...rest } = props
  return (
    <div>
      <button {...rest} className={`button ${className}`}
              onClick={ScriptActions.exportScripts}>
          <span className="icon is-medium">
            <i className="fas fa-file-export"></i>
          </span>
        <span className="is-uppercase">Export All Scripts</span>
      </button>
    </div>
  )
}

ExportAllScriptsButton.propTypes = {className: PropTypes.string};

function AppView(props) {
  return (
    <div className="AppView">
      <nav className="navbar has-shadow">
        <div className="container">
          <div className="navbar-brand">
            <div className="navbar-item">
              <BustabitScript.Title />
            </div>
          </div>
          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                <DisclaimerButton className="is-small" />
                <DonateButton className="is-small" />
                <ExportAllScriptsButton className="is-small" />
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main>
        <Notifications
          notifications={props.notifications}/>
        <BustabitScript.App
          scripts={props.scripts}/>
      </main>
    </div>
  );
}

export default AppView
