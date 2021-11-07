import { Card } from '../builders/Card';

export type DisplayValue = number | 'J' | 'Q' | 'K' | 'A';

export enum Suit {
    C = 'club',
    S = 'spade',
    D = 'diamond',
    H = 'heart'
};

export enum HandTitles {
    ROYALFLUSH = 'Royal Flush',
    STRAIGHTFLUSH = 'Straight Flush',
    FOURKIND = '4 of a Kind',
    FULLHOUSE = 'Full House',
    FLUSH = 'Flush',
    STRAIGHT = 'Straight',
    THREEKIND = '3 of a Kind',
    TWOPAIR = '2 Pair',
    PAIR = 'Pair',
    HIGHCARD = 'High Card'
}

export interface PlayerHandResults {
    cards: Card[];
    rank: number;
    title: HandTitles;
}

export interface HandCheckResults<T> {
    result: boolean;
    data?: T;
}