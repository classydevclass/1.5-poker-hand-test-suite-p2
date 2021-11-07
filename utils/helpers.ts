import { Card } from '../builders/Card';

export const sortCardsHighToLow = (a: Card, b: Card) => b.value - a.value;
