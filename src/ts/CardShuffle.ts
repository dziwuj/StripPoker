import { Card } from "./types/Card";
import { Colors } from "./types/Colors";
import { Signs } from "./types/Signs";
const card_data = require("../assets/cards.json");

export class CardShuffle {
    usedCards: number[] = [];
    playerHand: Card[] = [];
    enemyHand: Card[] = [];

    constructor() {
        this.shuffle();
    }

    shuffle() {
        for (let i = 0; i < 5; i++) {
            let card = this.getCard();
            let cardId = this.getCardId(card);
            if (!this.usedCards.includes(cardId)) {
                this.playerHand.push(card);
                this.usedCards.push(cardId);
            } else i--;
        }

        for (let i = 0; i < 5; i++) {
            let card = this.getCard();
            let cardId = this.getCardId(card);
            if (!this.usedCards.includes(cardId)) {
                this.enemyHand.push(card);
                this.usedCards.push(cardId);
            } else i--;
        }
    }

    getCard() {
        const card: Card = {
            Sign: randomEnumValue(Signs),
            Color: randomEnumValue(Colors),
        };

        return card;
    }

    getCardId(card: Card) {
        const index = card_data.findIndex(
            (e: any) => e.sign == card.Sign && e.color == card.Color
        );

        return index;
    }
}

const randomEnumValue = (enumeration: any) => {
    const values = Object.keys(enumeration);
    const enumKey = values[Math.floor(Math.random() * values.length)];
    return enumeration[enumKey];
};
