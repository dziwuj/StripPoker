import { Game } from "./Game";
import { GenDisplay } from "./GenDisplay";

export class Scoring {
    static enemyScore: number = 100;
    static playerScore: number = 100;
    static raise: number = 0;
    static pot: number = 0;

    constructor() {}

    static ante() {
        if (Scoring.enemyScore <= 0) {
            Game.strike++;
            Scoring.enemyScore += 100;
        }
        if (Scoring.enemyScore >= 200 && Game.strike > 0) {
            Game.strike--;
            Scoring.enemyScore -= 100;
        }

        if (Game.strike > 5) {
            alert("You won");
        }

        Scoring.playerScore -= 5;
        Scoring.enemyScore -= 5;
        Scoring.pot += 10;
        Scoring.updateCurrency();
    }

    static bet(money: number) {
        Scoring.playerScore -= money;
        Scoring.pot += money;
        Scoring.raise = money;
        Scoring.updateCurrency();
    }

    static updateCurrency() {
        GenDisplay.playerCurrency.textContent = String(Scoring.playerScore);
        GenDisplay.enemyCurrency.textContent = String(Scoring.enemyScore);
    }
}
