"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deck = void 0;
const types_1 = require("../lib/types");
const Card_1 = require("./Card");
class Deck {
    constructor() {
        this.deck = [];
        this.resetDeck = () => {
            const allSuits = [types_1.Suit.C, types_1.Suit.D, types_1.Suit.H, types_1.Suit.S];
            const newDeck = [];
            for (let i = 2; i <= 14; i++) {
                for (let j = 0; j < allSuits.length; j++) {
                    newDeck.push(new Card_1.Card(i, allSuits[j]));
                }
            }
            this.setDeck(newDeck);
        };
        this.getDeck = () => this.deck;
        this.setDeck = (deck) => {
            this.deck = deck;
        };
        this.dealCardsToThisManyPlayers = async (numPlayers) => {
            const tempDeck = Array.from(this.deck);
            const dealtCards = [];
            const dealCardToPlayer = (playerIndex, playerCardIndex) => {
                const deckCardIndex = Math.floor(Math.random() * tempDeck.length);
                dealtCards[playerIndex].push(tempDeck[deckCardIndex]);
                tempDeck.splice(deckCardIndex, 1);
            };
            for (let i = 0; i < numPlayers; i++) {
                dealtCards.push([]);
                await dealCardToPlayer(i, 0);
                await dealCardToPlayer(i, 1);
            }
            this.setDeck(tempDeck);
            return dealtCards;
        };
        this.dealThisManyCardsToTable = (numCardsToDeal = 1) => {
            const tempDeck = Array.from(this.deck);
            const dealtCards = [];
            for (let i = 0; i < numCardsToDeal; i++) {
                const deckCardIndex = Math.floor(Math.random() * tempDeck.length);
                dealtCards.push(tempDeck[deckCardIndex]);
                tempDeck.splice(deckCardIndex, 1);
            }
            this.setDeck(tempDeck);
            return dealtCards;
        };
        this.resetDeck();
    }
}
exports.Deck = Deck;
//# sourceMappingURL=Deck.js.map