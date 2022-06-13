import { Stages } from "./types/Stages";
import { Card } from "./types/Card";
import { Scoring } from "./Scoring";
import { CardShuffle } from "./CardShuffle";
import { HandEvaluation } from "./HandEvaluation";
import { BotAI } from "./BotAI";
import { Game } from "./Game";
const card_data = require("../assets/cards.json");

export class GenDisplay {
    root: HTMLElement = document.getElementById("root")!;
    actions: HTMLDivElement;
    static playerCurrency: HTMLParagraphElement;
    static enemyCurrency: HTMLParagraphElement;
    cards: HTMLElement[] = [];

    constructor(hand: Card[]) {
        this.generateSurroundings();
        this.generateEmptyHand(hand);
    }

    generateSurroundings() {
        const display: HTMLDivElement = document.createElement("div");
        display.id = "display";
        this.root.appendChild(display);
        {
            const lady: HTMLDivElement = document.createElement("div");
            lady.id = "lady";
            lady.style.backgroundImage = `url(${Stages.Stage4})`;
            display.appendChild(lady);

            let stage: string[] = [];

            for (const value of Object.values(Stages)) {
                stage.push(value);
            }

            lady.style.backgroundImage = `url(${stage[Game.strike]})`;
        }

        {
            const table: HTMLDivElement = document.createElement("div");
            table.id = "table";
            display.appendChild(table);
            {
                const actions: HTMLDivElement = document.createElement("div");
                actions.id = "actions";
                table.appendChild(actions);

                this.actions = actions;

                const lowerTable: HTMLDivElement =
                    document.createElement("div");
                lowerTable.id = "lowerTable";
                table.appendChild(lowerTable);
                {
                    const score1: HTMLDivElement =
                        document.createElement("div");
                    score1.classList.add("score");
                    lowerTable.appendChild(score1);
                    {
                        const text: HTMLParagraphElement =
                            document.createElement("p");
                        text.classList.add("text");
                        text.textContent = String(Scoring.playerScore);
                        score1.appendChild(text);
                        GenDisplay.playerCurrency = text;
                    }

                    const cards: HTMLDivElement = document.createElement("div");
                    cards.id = "cards";
                    lowerTable.appendChild(cards);

                    const score2: HTMLDivElement =
                        document.createElement("div");
                    score2.classList.add("score");
                    lowerTable.appendChild(score2);
                    {
                        const text: HTMLParagraphElement =
                            document.createElement("p");
                        text.classList.add("text");
                        text.textContent = String(Scoring.enemyScore);
                        score2.appendChild(text);
                        GenDisplay.enemyCurrency = text;
                    }
                }
            }
        }
    }

    generateHand(hand: Card[]) {
        const cards = document.getElementById("cards")!;

        this.cards = Array.from(
            document.getElementsByClassName(
                "card"
            ) as HTMLCollectionOf<HTMLElement>
        );

        let counter = 0;

        let inter = setInterval(() => {
            if (counter < 5) {
                this.cards[counter].classList.remove("back");

                this.cards[counter].style.backgroundPositionX = `${
                    card_data.find(
                        (e: any) =>
                            e.sign == hand[counter].Sign &&
                            e.color == hand[counter].Color
                    ).xPos
                }px`;

                this.cards[counter].style.backgroundPositionY = `${
                    card_data.find(
                        (e: any) =>
                            e.sign == hand[counter].Sign &&
                            e.color == hand[counter].Color
                    ).yPos
                }px`;
            } else {
                clearInterval(inter);
                this.actions.innerHTML = "";

                {
                    const bet: HTMLParagraphElement =
                        document.createElement("p");
                    bet.classList.add("option");
                    bet.textContent = "Bet";
                    this.actions.appendChild(bet);
                    bet.addEventListener(
                        "click",
                        () => {
                            this.bet();
                        },
                        { once: true }
                    );
                }
                {
                    const stay: HTMLParagraphElement =
                        document.createElement("p");
                    stay.classList.add("option");
                    stay.textContent = "Stay";
                    this.actions.appendChild(stay);
                    stay.addEventListener(
                        "click",
                        () => {
                            this.stay();
                        },
                        { once: true }
                    );
                }
                {
                    const drop: HTMLParagraphElement =
                        document.createElement("p");
                    drop.classList.add("option");
                    drop.textContent = "Drop";
                    this.actions.appendChild(drop);
                    drop.addEventListener(
                        "click",
                        () => {
                            this.drop();
                        },
                        { once: true }
                    );
                }
            }

            counter++;
        }, 500);
    }

    generateEmptyHand(hand: Card[]) {
        const cards = document.getElementById("cards")!;

        let counter = 0;

        let inter = setInterval(() => {
            if (counter < 5) {
                const card: HTMLDivElement = document.createElement("div");
                card.classList.add("card");
                card.classList.add("back");

                cards.appendChild(card);
            } else {
                clearInterval(inter);
                const text: HTMLParagraphElement = document.createElement("p");
                text.classList.add("option");
                text.textContent = "Click to continue...";
                this.actions.appendChild(text);
                this.root.addEventListener(
                    "click",
                    () => {
                        text.textContent = "Ante  $5";
                        Scoring.ante();
                        this.generateHand(hand);
                    },
                    { once: true }
                );
            }
            counter++;
        }, 500);
    }

    bet() {
        this.actions.innerHTML = "";
        {
            const bet: HTMLParagraphElement = document.createElement("p");
            bet.classList.add("option");
            bet.textContent = "Amount?";
            this.actions.appendChild(bet);
        }

        for (let i = 5 + Scoring.raise; i <= 25; i += 5) {
            const bet: HTMLParagraphElement = document.createElement("p");
            bet.classList.add("option");
            bet.textContent = `${i}`;
            this.actions.appendChild(bet);
            bet.addEventListener(
                "click",
                () => {
                    Scoring.bet(i);

                    let bot = new BotAI(HandEvaluation.getScoresDifference());

                    this.actions.innerHTML = "";
                    const bet: HTMLParagraphElement =
                        document.createElement("p");
                    bet.classList.add("option");
                    if (bot.response == "raise")
                        bet.textContent = `I raise ${bot.value}`;
                    else if (bot.response == "call") bet.textContent = `I call`;
                    else {
                        bet.textContent = `I'm out. Pot ${bot.value} is yours.`;
                    }
                    console.log(Scoring.pot);
                    this.actions.appendChild(bet);

                    {
                        setTimeout(() => {
                            this.actions.innerHTML = "";
                            if (bot.response == "drop") {
                                this.root.innerHTML = "";
                                let shuffle = new CardShuffle();
                                let evaluation = new HandEvaluation(
                                    shuffle.playerHand,
                                    shuffle.enemyHand
                                );
                                let gen = new GenDisplay(shuffle.playerHand);
                            } else if (bot.response == "call") {
                                {
                                    const bet: HTMLParagraphElement =
                                        document.createElement("p");
                                    bet.classList.add("option");
                                    bet.textContent = "Bet";
                                    bet.addEventListener("click", () => {
                                        this.bet();
                                    });
                                    this.actions.appendChild(bet);
                                }
                                {
                                    const stay: HTMLParagraphElement =
                                        document.createElement("p");
                                    stay.classList.add("option");
                                    stay.textContent = "Stay";
                                    stay.addEventListener("click", () => {
                                        this.stay();
                                    });
                                    this.actions.appendChild(stay);
                                }
                                {
                                    const drop: HTMLParagraphElement =
                                        document.createElement("p");
                                    drop.classList.add("option");
                                    drop.textContent = "Drop";
                                    drop.addEventListener("click", () => {
                                        this.drop();
                                    });
                                    this.actions.appendChild(drop);
                                }
                            } else {
                                if (Scoring.raise == 25) {
                                    {
                                        const call: HTMLParagraphElement =
                                            document.createElement("p");
                                        call.classList.add("option");
                                        call.textContent = "Call";
                                        call.addEventListener("click", () => {
                                            this.call();
                                        });
                                        this.actions.appendChild(call);
                                    }
                                    {
                                        const drop: HTMLParagraphElement =
                                            document.createElement("p");
                                        drop.classList.add("option");
                                        drop.textContent = "Drop";
                                        drop.addEventListener("click", () => {
                                            this.drop();
                                        });
                                        this.actions.appendChild(drop);
                                    }
                                } else {
                                    {
                                        const bet: HTMLParagraphElement =
                                            document.createElement("p");
                                        bet.classList.add("option");
                                        bet.textContent = "Bet";
                                        bet.addEventListener("click", () => {
                                            this.bet();
                                        });
                                        this.actions.appendChild(bet);
                                    }
                                    {
                                        const call: HTMLParagraphElement =
                                            document.createElement("p");
                                        call.classList.add("option");
                                        call.textContent = "Call";
                                        call.addEventListener("click", () => {
                                            this.call();
                                        });
                                        this.actions.appendChild(call);
                                    }
                                    {
                                        const drop: HTMLParagraphElement =
                                            document.createElement("p");
                                        drop.classList.add("option");
                                        drop.textContent = "Drop";
                                        drop.addEventListener("click", () => {
                                            this.drop();
                                        });
                                        this.actions.appendChild(drop);
                                    }
                                }
                            }
                        }, 1500);
                    }
                },
                { once: true }
            );
        }
    }

    drop() {
        this.actions.innerHTML = "";
        const bet: HTMLParagraphElement = document.createElement("p");
        bet.classList.add("option");
        bet.textContent = `My pot, ${Scoring.pot}`;
        this.actions.appendChild(bet);
        Scoring.enemyScore += Scoring.pot;
        Scoring.pot = 0;
        Scoring.updateCurrency();
        setTimeout(() => {
            this.actions.innerHTML = "";
            const text: HTMLParagraphElement = document.createElement("p");
            text.classList.add("option");
            this.root.innerHTML = "";
            let shuffle = new CardShuffle();
            let evaluation = new HandEvaluation(
                shuffle.playerHand,
                shuffle.enemyHand
            );
            let gen = new GenDisplay(shuffle.playerHand);
        }, 1500);
    }

    stay() {
        this.actions.innerHTML = "";
        const text: HTMLParagraphElement = document.createElement("p");
        text.classList.add("option");
        if (HandEvaluation.winner == "player") {
            text.textContent = `You won ${Scoring.pot}`;
            Scoring.playerScore += Scoring.pot;
            Scoring.pot = 0;
        } else if (HandEvaluation.winner == "enemy") {
            text.textContent = `I won ${Scoring.pot}`;
            Scoring.enemyScore += Scoring.pot;
            Scoring.pot = 0;
        } else {
            text.textContent = `It's a draw`;
            Scoring.enemyScore += Scoring.pot / 2;
            Scoring.playerScore += Scoring.pot / 2;
            Scoring.pot = 0;
        }
        this.actions.appendChild(text);
        setTimeout(() => {
            this.root.innerHTML = "";
            let shuffle = new CardShuffle();
            let evaluation = new HandEvaluation(
                shuffle.playerHand,
                shuffle.enemyHand
            );
            let gen = new GenDisplay(shuffle.playerHand);
        }, 1500);
    }

    call() {
        this.actions.innerHTML = "";
        const text: HTMLParagraphElement = document.createElement("p");
        text.classList.add("option");
        Scoring.playerScore -= Scoring.raise;
        Scoring.pot += Scoring.raise;
        Scoring.raise = 0;
        if (HandEvaluation.winner == "player") {
            text.textContent = `You won ${Scoring.pot}`;
            Scoring.playerScore += Scoring.pot;
            Scoring.pot = 0;
        } else if (HandEvaluation.winner == "enemy") {
            text.textContent = `I won ${Scoring.pot}`;
            Scoring.enemyScore += Scoring.pot;
            Scoring.pot = 0;
        } else {
            text.textContent = `It's a draw`;
            Scoring.enemyScore += Scoring.pot / 2;
            Scoring.playerScore += Scoring.pot / 2;
            Scoring.pot = 0;
        }
        this.actions.appendChild(text);
        setTimeout(() => {
            this.root.innerHTML = "";
            let shuffle = new CardShuffle();
            let evaluation = new HandEvaluation(
                shuffle.playerHand,
                shuffle.enemyHand
            );
            let gen = new GenDisplay(shuffle.playerHand);
        }, 1500);
    }
}
