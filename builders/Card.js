"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
const types_1 = require("../lib/types");
class Card {
    constructor(value, suit, isLowAce) {
        if (!value || !suit) {
            throw new Error('Card must have a value and a suit.');
        }
        else if (value < 2 || value > 14) {
            throw new RangeError(`${value} is not a valid value. Card value must be between 2 and 14.`);
        }
        else if (suit !== types_1.Suit.C && suit !== types_1.Suit.D && suit !== types_1.Suit.H && suit !== types_1.Suit.S) {
            throw new RangeError(`${suit} is not a valid suit. Card suit must be ${types_1.Suit.C}, ${types_1.Suit.D}, ${types_1.Suit.H}, or ${types_1.Suit.S}.`);
        }
        else {
            this.value = isLowAce && value === 14 ? 1 : value;
            this.suit = suit;
            this.display = value === 11 ? 'J' : value === 12 ? 'Q' : value === 13 ? 'K' : value === 14 ? 'A' : value;
        }
    }
}
exports.Card = Card;
//# sourceMappingURL=Card.js.map