import { Suit } from '../lib/types';
import { Card } from './Card';

export class Deck {
	deck: Card[] = [];

	constructor() {
		this.resetDeck();
	}

	resetDeck = () => {
		const allSuits = [Suit.C, Suit.D, Suit.H, Suit.S];
		const newDeck = [];

		for (let i = 2; i <= 14; i++) {
			for (let j = 0; j < allSuits.length; j++) {
				newDeck.push(new Card(i, allSuits[j]));
			}
		}

		this.setDeck(newDeck);
	}

	getDeck = () => this.deck;

	setDeck = (deck: Card[]) => {
		this.deck = deck;
	}

	dealCardsToThisManyPlayers = async (numPlayers: number) => {
		const tempDeck = Array.from(this.deck);
		const dealtCards: Array<Array<Card>> = [];

		const dealCardToPlayer = (playerIndex: number, playerCardIndex: number) => {
			const deckCardIndex = Math.floor(Math.random() * tempDeck.length);

			dealtCards[playerIndex].push(tempDeck[deckCardIndex]);
			tempDeck.splice(deckCardIndex, 1);
		}

		for (let i = 0; i < numPlayers; i++) {
			dealtCards.push([]);
			await dealCardToPlayer(i, 0);
			await dealCardToPlayer(i, 1);
		}

		this.setDeck(tempDeck);

		return dealtCards;
	}

	dealThisManyCardsToTable = (numCardsToDeal: number = 1) => {
		const tempDeck = Array.from(this.deck);
		const dealtCards: Array<Card> = [];


		for (let i = 0; i < numCardsToDeal; i++) {
			const deckCardIndex = Math.floor(Math.random() * tempDeck.length);
			dealtCards.push(tempDeck[deckCardIndex]);
			tempDeck.splice(deckCardIndex, 1);
		}

		this.setDeck(tempDeck);

		return dealtCards;
	}
}
