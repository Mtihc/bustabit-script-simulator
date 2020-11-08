import React from 'react';
import 'bulma/css/bulma.css'
import './AppView.css';
import BustabitScript from './components/BustabitScript'
import { DisclaimerButton } from './components/Disclaimer'
import { DonateButton } from './components/Donate'

function AppView(props) {
  return (
    <div className="App">
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
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="section has-text-centered">
        <BustabitScript.App scripts={props.scripts} />
      </main>
    </div>
  );
}

export default AppView
