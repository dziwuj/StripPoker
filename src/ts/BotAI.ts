import { Scoring } from "./Scoring";
import { Winner } from "./types/Winner";

export class BotAI {
    evaluation: { Winner: Winner; Value: number };
    response: "raise" | "call" | "drop";
    value: number;

    constructor(evaluation: { Winner: Winner; Value: number }) {
        this.evaluation = evaluation;
        this.decision();
    }

    decision() {
        let opt = Math.floor(Math.random() * 3);

        if (opt == 0) {
            if (Scoring.raise == 25) {
                this.call();
            } else {
                //random number 1-5
                let stakes = Math.floor(Math.random() * 5) + 1;
                while (stakes * 5 < Scoring.raise)
                    stakes = Math.floor(Math.random() * 5) + 1;
                this.raise(stakes * 5);
            }
        } else if (opt == 1) this.call();
        else this.drop();
    }

    raise(bet: number) {
        console.log("Betting: ", bet);
        Scoring.pot += bet;
        Scoring.enemyScore -= bet;
        Scoring.raise = bet;
        Scoring.updateCurrency();
        this.value = bet;
        this.response = "raise";
    }

    call() {
        console.log("Calling");
        Scoring.enemyScore -= Scoring.raise;
        Scoring.pot += Scoring.raise;
        Scoring.raise = 0;
        Scoring.updateCurrency();
        this.response = "call";
    }

    drop() {
        console.log("Dropping");
        Scoring.playerScore += Scoring.pot;
        this.value = Scoring.pot;
        Scoring.pot = 0;
        Scoring.raise = 0;
        Scoring.updateCurrency();
        this.response = "drop";
    }
}
