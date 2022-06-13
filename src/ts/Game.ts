import { CardShuffle } from "./CardShuffle";
import { GenDisplay } from "./GenDisplay";
import { HandEvaluation } from "./HandEvaluation";
import { Scoring } from "./Scoring";

export class Game {
    scoring: Scoring = new Scoring();
    shuffle: CardShuffle = new CardShuffle();
    evaluate: HandEvaluation = new HandEvaluation(
        this.shuffle.playerHand,
        this.shuffle.enemyHand
    );
    display: GenDisplay = new GenDisplay(this.shuffle.playerHand);

    static strike: number = 0;

    constructor() {
        console.log(HandEvaluation.winner);
        console.log("player hand: ", this.shuffle.playerHand);
        console.log("enemy hand: ", this.shuffle.enemyHand);
    }

    static restart() {
        new Game();
    }
}
