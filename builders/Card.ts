import { DisplayValue, Suit } from '../lib/types';

export class Card {
    readonly value: number;
    readonly suit: Suit;
    readonly display: DisplayValue;
    isLowAce?: boolean;

    constructor(value: number, suit: Suit, isLowAce?: boolean) {
        if (!value || !suit) {
            throw new Error('Card must have a value and a suit.');
        } else if (value < 2 || value > 14) {
            throw new RangeError(`${value} is not a valid value. Card value must be between 2 and 14.`);
        } else if (suit !== Suit.C && suit !== Suit.D && suit !== Suit.H && suit !== Suit.S) {
            throw new RangeError(`${suit} is not a valid suit. Card suit must be ${Suit.C}, ${Suit.D}, ${Suit.H}, or ${Suit.S}.`)
        } else {
            this.value = isLowAce && value === 14 ? 1 : value;
            this.suit = suit;
            this.display = value === 11 ? 'J' : value === 12 ? 'Q' : value === 13 ? 'K' : value === 14 ? 'A' : value
        }
    }
}
