const SCRIPT_SAMPLES = [
  {
    name: 'Flat Bet',
    text: `var config = {
  wager: {
    value: 1000, type: 'balance', label: 'wager'
  },
  payout: {
    value: 2, type: 'multiplier', label: 'payout' }
};

// Try to bet immediately when script starts
makeBet();

engine.on('GAME_STARTING', onGameStarted);
engine.on('GAME_ENDED', onGameEnded);

function onGameStarted() {
  makeBet();
}

function onGameEnded() {
  var lastGame = engine.history.first();

  // If we wagered, it means we played
  if (!lastGame.wager) {
    return;
  }

  if (lastGame.cashedAt) {
    var profit = Math.round((config.wager.value * config.payout.value - config.wager.value) / 100)
    log('we won', profit, 'bits');
  } else {
    log('we lost', Math.round(config.wager.value / 100), 'bits');
  }
}

function makeBet() {
  engine.bet(config.wager.value, config.payout.value);
  log('betting', Math.round(config.wager.value / 100), 'on', config.payout.value, 'x');
}`
  },
  {
    name: 'Martingale',
    text: `var config = {
  baseBet: { value: 100, type: 'balance', label: 'base bet' },
  payout: { value: 2, type: 'multiplier' },
  stop: { value: 1e8, type: 'balance', label: 'stop if bet >' },
  loss: {
    value: 'increase', type: 'radio', label: 'On Loss',
    options: {
      base: { type: 'noop', label: 'Return to base bet' },
      increase: { value: 2, type: 'multiplier', label: 'Increase bet by' },
    }
  },
  win: {
    value: 'base', type: 'radio', label: 'On Win',
    options: {
      base: { type: 'noop', label: 'Return to base bet' },
      increase: { value: 2, type: 'multiplier', label: 'Increase bet by' },
    }
  }
};


log('Script is running..');

var currentBet = config.baseBet.value;

// Always try to bet when script is started
engine.bet(roundBit(currentBet), config.payout.value);

engine.on('GAME_STARTING', onGameStarted);
engine.on('GAME_ENDED', onGameEnded);

function onGameStarted() {
  engine.bet(roundBit(currentBet), config.payout.value);
}

function onGameEnded() {
  var lastGame = engine.history.first()

  // If we wagered, it means we played
  if (!lastGame.wager) {
    return;
  }

  // we won..
  if (lastGame.cashedAt) {
    if (config.win.value === 'base') {
      currentBet = config.baseBet.value;
    } else {
      console.assert(config.win.value === 'increase');
      currentBet *= config.win.options.increase.value;
    }
    log('We won, so next bet will be', currentBet/100, 'bits')
  } else {
    // damn, looks like we lost :(
    if (config.loss.value === 'base') {
      currentBet = config.baseBet.value;
    } else {
      console.assert(config.loss.value === 'increase');
      currentBet *= config.loss.options.increase.value;
    }
    log('We lost, so next bet will be', currentBet/100, 'bits')
  }

  if (currentBet > config.stop.value) {
    log('Was about to bet', currentBet, 'which triggers the stop');
    engine.removeListener('GAME_STARTING', onGameStarted);
    engine.removeListener('GAME_ENDED', onGameEnded);
  }
}

function roundBit(bet) {
  return Math.round(bet / 100) * 100;
}`
  },
  {
    name: 'Payout Martingale',
    text: `var config = {
  bet: {
    value: 100,
    type: 'balance'
  },
  basePayout: {
    value: 1.2,
    type: 'multiplier',
    label: 'base payout'
  },
  stop: {
    value: 20,
    type: 'multiplier',
    label: 'stop if payout >'
  },
  loss: {
    value: 'increase',
    type: 'radio',
    label: 'On Loss',
    options: {
      base: {
        type: 'noop',
        label: 'Return to base payout'
      },
      increase: {
        value: 0.1,
        type: 'multiplier',
        label: 'Increase payout by +'
      },
    }
  },
  win: {
    value: 'base',
    type: 'radio',
    label: 'On Win',
    options: {
      base: {
        type: 'noop',
        label: 'Return to base payout'
      },
      increase: {
        value: 1,
        type: 'multiplier',
        label: 'Increase payout by +'
      },
    }
  }
};


log('Script is running..');

var currentPayout = config.basePayout.value;

// Always try to bet when script is started
engine.bet(config.bet.value, currentPayout);

engine.on('GAME_STARTING', onGameStarted);
engine.on('GAME_ENDED', onGameEnded);

function onGameStarted() {
  log('betting', Math.round(config.bet.value / 100), 'at payout of', currentPayout, 'x')
  engine.bet(config.bet.value, currentPayout);
}

function onGameEnded(info) {
  var lastGame = engine.history.first()

  // If we wagered, it means we played
  if (!lastGame.wager) {
    return;
  }

  // we won..
  if (lastGame.cashedAt) {
    if (config.win.value === 'base') {
      currentPayout = config.basePayout.value;
      log('won, so resetting payout to', currentPayout)
    } else {
      console.assert(config.win.value === 'increase');
      currentPayout += config.win.options.increase.value;
      log('won, so increasing payout to', currentPayout)
    }
  } else {
    // damn, looks like we lost :(
    if (config.loss.value === 'base') {
      currentPayout = config.basePayout.value;
      log('lost, so resetting payout to', currentPayout)
    } else {
      console.assert(config.loss.value === 'increase');
      currentPayout += config.loss.options.increase.value;
      log('lost, so increasing payout', currentPayout)
    }
  }

  if (currentPayout > config.stop.value) {
    log('Was about to bet with payout', currentPayout, 'which triggers the stop');
    engine.removeListener('GAME_STARTING', onGameStarted);
    engine.removeListener('GAME_ENDED', onGameEnded);
  }
}`
  },

];

const NEW_SCRIPT = {
  id: '',
  name: 'Untitled Script',
  text: `var config = {

};

log('Simulation begins here...')`,
  config: undefined
}

const ScriptConstants = {
  SCRIPT_SAMPLES,
  NEW_SCRIPT,
}
export default ScriptConstants
