import { Card } from "./types/Card";
import { Colors } from "./types/Colors";
import { Score } from "./types/Score";
import { Signs } from "./types/Signs";
import { Winner } from "./types/Winner";

export class HandEvaluation {
    signOrder = Object.values(Signs);
    colorOrder = Object.values(Colors);

    static playerScore: Score;
    static enemyScore: Score;

    static winner: Winner;

    constructor(myHand: Card[], enemyHand: Card[]) {
        HandEvaluation.playerScore = this.getHandDetails(myHand);
        HandEvaluation.enemyScore = this.getHandDetails(enemyHand);
        HandEvaluation.winner = this.compareHands();
    }

    getHandDetails(hand: Card[]) {
        const faces = hand
            .map((e) => e.Sign)
            .sort(
                (a, b) => this.signOrder.indexOf(a) - this.signOrder.indexOf(b)
            );
        const suits = hand
            .map((e) => e.Color)
            .sort(
                (a, b) =>
                    this.colorOrder.indexOf(a) - this.colorOrder.indexOf(b)
            );
        const counts = faces.reduce(count, {});
        const duplicates: any = Object.values(counts).reduce(count, {});

        const flush = suits[0] === suits[4];
        const first = faces[0].charCodeAt(0);
        const straight = faces.every(
            (f, index) => f.charCodeAt(0) - first === index
        );

        let rank =
            (flush && straight && 1) ||
            (!!duplicates[4] && 2) ||
            (!!duplicates[3] && !!duplicates[2] && 3) ||
            (flush && 4) ||
            (straight && 5) ||
            (!!duplicates[3] && 6) ||
            (duplicates[2] > 1 && 7) ||
            (!!duplicates[2] && 8) ||
            9;

        console.log(rank);

        // function byCountFirst(a: any, b: any) {
        //     //Counts are in reverse order - bigger is better
        //     const countDiff = counts[b] - counts[a];
        //     if (countDiff) return countDiff; // If counts don't match return
        //     return b > a ? -1 : b === a ? 0 : 1;
        // }

        function count(c: any, a: any) {
            c[a] = (c[a] || 0) + 1;
            return c;
        }

        const output: Score = {
            Rank: rank,
            HighCard: faces[4],
        };

        return output;
    }

    compareHands(): Winner {
        let enemyHigh = Object.values(Signs).indexOf(
            HandEvaluation.enemyScore.HighCard
        );

        let playerHigh = Object.values(Signs).indexOf(
            HandEvaluation.playerScore.HighCard
        );
        if (
            HandEvaluation.enemyScore.Rank === HandEvaluation.playerScore.Rank
        ) {
            if (enemyHigh > playerHigh) {
                return "player";
            } else if (enemyHigh < playerHigh) {
                return "enemy";
            } else {
                return "draw";
            }
        }
        return HandEvaluation.enemyScore.Rank > HandEvaluation.playerScore.Rank
            ? "player"
            : "enemy";
    }

    static getScoresDifference() {
        return {
            Winner: HandEvaluation.winner,
            Value: Math.abs(
                HandEvaluation.playerScore.Rank - HandEvaluation.enemyScore.Rank
            ),
        };
    }
}
