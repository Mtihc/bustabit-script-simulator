const SCRIPT_SAMPLES = [
  {
    name: 'Flat Bet',
    text: `var config = {
  wager: {
    value: 100,
    type: "balance",
    label: "wager",
  },
  payout: {
    value: 2,
    type: "multiplier",
    label: "payout",
  },
};

// Try to bet immediately when script starts
if (engine.gameState === "GAME_STARTING" || engine.gameState === "GAME_ENDED") {
  makeBet();
}

engine.on("GAME_STARTING", onGameStarted);
engine.on("GAME_ENDED", onGameEnded);

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
    var profit =
      (config.wager.value * lastGame.cashedAt - config.wager.value) / 100;
    log("we won", profit.toFixed(2), "bits");
  } else {
    log("we lost", Math.round(config.wager.value / 100), "bits");
  }
}

function makeBet() {
  engine.bet(config.wager.value, config.payout.value);
  log(
    "betting",
    Math.round(config.wager.value / 100),
    "on",
    config.payout.value,
    "x"
  );
}`
  },
  {
    name: 'Sniper',
    text: `var config = {
  target: { value: "", type: "text", label: "User to follow" },
  maxBet: { value: 1e8, type: "balance", label: "Max Bet" },
};

engine.on("BET_PLACED", (bet) => {
  if (bet.uname.toLowerCase() === config.target.value.toLowerCase()) {
    if (userInfo.balance < 100) {
      stop("Your balance is too low to bet.");
    }

    log(
      "Spotted",
      bet.uname,
      "betting",
      bet.wager / 100,
      "bit(s) with a",
      bet.payout + "x payout."
    );

    const bettableBalance = Math.floor(userInfo.balance / 100) * 100;
    const wager = Math.min(bettableBalance, bet.wager, config.maxBet.value);

    if (engine.gameState != "GAME_STARTING") {
      // do not queue the bet if the current game is no longer accepting bets
      return;
    }

    engine.bet(wager, bet.payout); // aim at target's payout
  }
});

engine.on("CASHED_OUT", (cashOut) => {
  if (cashOut.uname.toLowerCase() === config.target.value.toLowerCase()) {
    log("Spotted", cashOut.uname, "cashing out at", cashOut.cashedAt + "x.");

    if (engine.currentlyPlaying()) {
      engine.cashOut();
    }
  }
});`
  },
  {
    name: 'Martingale',
    text: `var config = {
  baseBet: { value: 100, type: "balance", label: "base bet" },
  payout: { value: 2, type: "multiplier" },
  stop: { value: 1e8, type: "balance", label: "stop if bet >" },
  loss: {
    value: "increase",
    type: "radio",
    label: "On Loss",
    options: {
      base: { type: "noop", label: "Return to base bet" },
      increase: { value: 2, type: "multiplier", label: "Increase bet by" },
    },
  },
  win: {
    value: "base",
    type: "radio",
    label: "On Win",
    options: {
      base: { type: "noop", label: "Return to base bet" },
      increase: { value: 2, type: "multiplier", label: "Increase bet by" },
    },
  },
};

log("Script is running..");

var currentBet = config.baseBet.value;

engine.on("GAME_STARTING", onGameStarted);
if (engine.gameState === "GAME_STARTING" || engine.gameState === "GAME_ENDED") {
  engine.bet(roundBit(currentBet), config.payout.value);
  engine.on("GAME_ENDED", onGameEnded);
} else {
  engine.once("GAME_STARTING", () => engine.on("GAME_ENDED", onGameEnded));
}

function onGameStarted() {
  engine.bet(roundBit(currentBet), config.payout.value);
}

function onGameEnded() {
  var lastGame = engine.history.first();

  // If we wagered, it means we played
  if (!lastGame.wager) {
    return;
  }

  // we won..
  if (lastGame.cashedAt) {
    if (config.win.value === "base") {
      currentBet = config.baseBet.value;
    } else {
      console.assert(config.win.value === "increase");
      currentBet *= config.win.options.increase.value;
    }
    log("We won, so next bet will be", currentBet / 100, "bits");
  } else {
    // damn, looks like we lost :(
    if (config.loss.value === "base") {
      currentBet = config.baseBet.value;
    } else {
      console.assert(config.loss.value === "increase");
      currentBet *= config.loss.options.increase.value;
    }
    log("We lost, so next bet will be", currentBet / 100, "bits");
  }

  if (currentBet > config.stop.value) {
    log("Was about to bet", currentBet / 100, "which triggers the stop");
    engine.removeListener("GAME_STARTING", onGameStarted);
    engine.removeListener("GAME_ENDED", onGameEnded);
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
    type: "balance",
  },
  basePayout: {
    value: 2,
    type: "multiplier",
    label: "base payout",
  },
  stop: {
    value: 20,
    type: "multiplier",
    label: "stop if payout >",
  },
  loss: {
    value: "increase",
    type: "radio",
    label: "On Loss",
    options: {
      base: {
        type: "noop",
        label: "Return to base payout",
      },
      increase: {
        value: 1,
        type: "multiplier",
        label: "Increase payout by +",
      },
    },
  },
  win: {
    value: "base",
    type: "radio",
    label: "On Win",
    options: {
      base: {
        type: "noop",
        label: "Return to base payout",
      },
      increase: {
        value: 1,
        type: "multiplier",
        label: "Increase payout by +",
      },
    },
  },
};

log("Script is running..");

var currentPayout = config.basePayout.value;

engine.on("GAME_STARTING", onGameStarted);
if (engine.gameState === "GAME_STARTING" || engine.gameState === "GAME_ENDED") {
  engine.bet(roundBit(config.bet.value), currentPayout);
  engine.on("GAME_ENDED", onGameEnded);
} else {
  engine.once("GAME_STARTING", () => engine.on("GAME_ENDED", onGameEnded));
}

function onGameStarted() {
  log(
    "betting",
    Math.round(config.bet.value / 100),
    "at payout of",
    currentPayout,
    "x"
  );
  engine.bet(config.bet.value, currentPayout);
}

function onGameEnded(info) {
  var lastGame = engine.history.first();

  // If we wagered, it means we played
  if (!lastGame.wager) {
    return;
  }

  // we won..
  if (lastGame.cashedAt) {
    if (config.win.value === "base") {
      currentPayout = config.basePayout.value;
      log("won, so resetting payout to", currentPayout);
    } else {
      console.assert(config.win.value === "increase");
      currentPayout += config.win.options.increase.value;
      log("won, so increasing payout to", currentPayout);
    }
  } else {
    // damn, looks like we lost :(
    if (config.loss.value === "base") {
      currentPayout = config.basePayout.value;
      log("lost, so resetting payout to", currentPayout);
    } else {
      console.assert(config.loss.value === "increase");
      currentPayout += config.loss.options.increase.value;
      log("lost, so increasing payout", currentPayout);
    }
  }

  if (currentPayout > config.stop.value) {
    log(
      "Was about to bet with payout",
      currentPayout,
      "which triggers the stop"
    );
    engine.removeListener("GAME_STARTING", onGameStarted);
    engine.removeListener("GAME_ENDED", onGameEnded);
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
