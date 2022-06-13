import { Colors } from "./Colors";
import { Signs } from "./Signs";
const card_data = require("../assets/cards.json");

export type Card = {
    Sign: Signs;
    Color: Colors;
};
