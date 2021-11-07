"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.determinePlayerHand = exports.addHighestRemainingCardsToHand = exports.hasStraight = exports.hasFlush = exports.hasDuplicates = void 0;
const Card_1 = require("../builders/Card");
const types_1 = require("../lib/types");
const helpers_1 = require("./helpers");
const hasDuplicates = (cards) => {
    const duplicateCounts = cards.reduce((acc, currentCard) => {
        acc[currentCard.value] = acc[currentCard.value] ? acc[currentCard.value] + 1 : 1;
        return acc;
    }, {});
    return {
        result: !!Object.values(duplicateCounts).find(counts => counts > 1),
        data: duplicateCounts
    };
};
exports.hasDuplicates = hasDuplicates;
const hasFlush = (cards) => {
    const suitCounts = cards.reduce((acc, currentCard) => {
        acc[currentCard.suit] = acc[currentCard.suit] ? acc[currentCard.suit] + 1 : 1;
        return acc;
    }, {});
    const flushSuit = Object.keys(suitCounts).find(suit => suitCounts[suit] >= 5);
    return {
        result: !!flushSuit,
        data: flushSuit
    };
};
exports.hasFlush = hasFlush;
const hasStraight = (cards) => {
    const tempCards = Array.from(cards);
    const filteredCards = tempCards.reduce((cardArray, card) => {
        if (!cardArray.map(cardArrayCard => cardArrayCard.value).includes(card.value)) {
            cardArray.push(card);
        }
        return cardArray;
    }, []);
    filteredCards.sort(helpers_1.sortCardsHighToLow);
    // Handle Ace as a low or high card
    const ace = filteredCards.find(card => card.value === 14);
    if (ace && filteredCards.find(card => card.value === 5)) {
        filteredCards.push(new Card_1.Card(ace.value, ace.suit, true));
    }
    let numInARow = 1;
    let highCard = null;
    if (filteredCards.length >= 5) {
        for (let i = 0; i < filteredCards.length - 1; i++) {
            if (filteredCards[i].value - filteredCards[i + 1].value === 1) {
                numInARow++;
                highCard = highCard || filteredCards[i];
            }
            else if (numInARow < 5) {
                numInARow = 1;
                highCard = null;
            }
        }
    }
    return {
        result: numInARow >= 5,
        data: {
            highCard
        }
    };
};
exports.hasStraight = hasStraight;
const addHighestRemainingCardsToHand = (cardsUsedForHand, allCards) => {
    const unusedCards = allCards.reduce((cardsLeft, currentCard) => {
        const wasThisCardUsed = cardsUsedForHand.find(cardToMatch => cardToMatch.suit === currentCard.suit && cardToMatch.value === currentCard.value);
        if (!wasThisCardUsed) {
            cardsLeft.push(currentCard);
        }
        return cardsLeft;
    }, []).sort(helpers_1.sortCardsHighToLow);
    const remainingCards = [];
    for (let i = 0; i < 5 - cardsUsedForHand.length; i++) {
        remainingCards.push(unusedCards[i]);
    }
    return [...cardsUsedForHand, ...remainingCards];
};
exports.addHighestRemainingCardsToHand = addHighestRemainingCardsToHand;
const determinePlayerHand = (cards) => {
    cards.sort(helpers_1.sortCardsHighToLow);
    const playerDuplicates = (0, exports.hasDuplicates)(cards);
    const playerStraight = (0, exports.hasStraight)(cards);
    const playerFlush = (0, exports.hasFlush)(cards);
    let playerStraightFlush = {
        result: playerStraight.result && playerFlush.result,
        data: {
            highCard: null
        }
    };
    const allHandRanks = {
        ROYALFLUSH: 10,
        STRAIGHTFLUSH: 9,
        FOURKIND: 8,
        FULLHOUSE: 7,
        FLUSH: 6,
        STRAIGHT: 5,
        THREEKIND: 4,
        TWOPAIR: 3,
        PAIR: 2,
        HIGHCARD: 1,
    };
    let playerHandCards = [];
    let playerHandRank = allHandRanks.HIGHCARD;
    let playerHandTitle = types_1.HandTitles.HIGHCARD;
    const multiplePairValues = Object.values(playerDuplicates.data).filter(value => value > 1);
    // Calculate If Straight Flush Exists
    if (playerStraightFlush.result) {
        const cardsWithMatchingSuit = cards.filter(card => card.suit === playerFlush.data);
        playerStraightFlush = (0, exports.hasStraight)(cardsWithMatchingSuit);
    }
    if (playerStraightFlush.result) {
        // Royal Flush & Straight Flush - FAIL (straight and a flush, but not a straight flush)
        const isRoyalFlush = playerStraightFlush.data.highCard.value === 14;
        playerHandCards = [
            cards.find(card => card.value === playerStraightFlush.data.highCard.value),
            cards.find(card => card.value === playerStraightFlush.data.highCard.value - 1),
            cards.find(card => card.value === playerStraightFlush.data.highCard.value - 2),
            cards.find(card => card.value === playerStraightFlush.data.highCard.value - 3),
            cards.find(card => card.value === playerStraightFlush.data.highCard.value - 4),
        ];
        playerHandRank = isRoyalFlush ? allHandRanks.ROYALFLUSH : allHandRanks.STRAIGHTFLUSH;
        playerHandTitle = isRoyalFlush ? types_1.HandTitles.ROYALFLUSH : types_1.HandTitles.STRAIGHTFLUSH;
    }
    else if (playerDuplicates.result && Object.values(playerDuplicates.data).includes(4)) {
        // 4 of a Kind - 11 SUCCESS
        const cardValue = parseInt(Object.keys(playerDuplicates.data).find(key => playerDuplicates.data[key] === 4));
        playerHandCards = (0, exports.addHighestRemainingCardsToHand)(cards.filter(card => card.value === cardValue), cards);
        playerHandRank = allHandRanks.FOURKIND;
        playerHandTitle = types_1.HandTitles.FOURKIND;
    }
    else if (playerDuplicates.result && multiplePairValues.length > 1 && multiplePairValues.includes(3)) {
        // Full House - 6 SUCCESS
        const allTripleValues = Object.keys(playerDuplicates.data).filter(key => playerDuplicates.data[key] === 3).map(value => parseInt(value));
        const bestTripleValue = Math.max(...allTripleValues);
        const bestPairValue = Object.keys(playerDuplicates.data).reduce((bestPair, currentValue) => {
            currentValue = parseInt(currentValue);
            if (currentValue !== bestTripleValue && playerDuplicates.data[currentValue] > 1 && currentValue > bestPair) {
                return currentValue;
            }
            return bestPair;
        }, 0);
        playerHandCards = [...cards.filter(card => card.value === bestTripleValue), ...cards.reduce((pair, currentCard) => {
                if (currentCard.value === bestPairValue && pair.length < 2) {
                    pair.push(currentCard);
                }
                return pair;
            }, [])];
        playerHandRank = allHandRanks.FULLHOUSE;
        playerHandTitle = types_1.HandTitles.FULLHOUSE;
    }
    else if (playerFlush.result) {
        // Flush - 4 SUCCESS
        playerHandCards = cards.reduce((allCards, currentCard) => {
            if (allCards.length < 5 && currentCard.suit === playerFlush.data) {
                allCards.push(currentCard);
            }
            return allCards;
        }, []);
        playerHandRank = allHandRanks.FLUSH;
        playerHandTitle = types_1.HandTitles.FLUSH;
    }
    else if (playerStraight.result) {
        // Straight - 4 SUCCESS (including 6-card straight)
        playerHandCards = [
            cards.find(card => card.value === playerStraight.data.highCard.value),
            cards.find(card => card.value === playerStraight.data.highCard.value - 1),
            cards.find(card => card.value === playerStraight.data.highCard.value - 2),
            cards.find(card => card.value === playerStraight.data.highCard.value - 3),
            cards.find(card => card.value === playerStraight.data.highCard.value - 4),
        ];
        playerHandRank = allHandRanks.STRAIGHT;
        playerHandTitle = types_1.HandTitles.STRAIGHT;
    }
    else if (playerDuplicates.result && Object.values(playerDuplicates.data).includes(3)) {
        // 3 of a Kind - 8 SUCCESS
        const pairValue = parseInt(Object.keys(playerDuplicates.data).find(key => playerDuplicates.data[key] === 3));
        playerHandCards = (0, exports.addHighestRemainingCardsToHand)(cards.filter(card => card.value === pairValue), cards);
        playerHandRank = allHandRanks.THREEKIND;
        playerHandTitle = types_1.HandTitles.THREEKIND;
    }
    else if (playerDuplicates.result && multiplePairValues.length > 1) {
        // 2 Pair - 9 SUCCESS
        const pairValues = Object.keys(playerDuplicates.data).reduce((allValues, currentValue) => {
            if (playerDuplicates.data[currentValue] === 2) {
                allValues.push(parseInt(currentValue));
                allValues.sort((a, b) => b - a);
                if (allValues.length > 2) {
                    allValues.pop();
                }
            }
            return allValues;
        }, []);
        playerHandCards = (0, exports.addHighestRemainingCardsToHand)(cards.filter(card => pairValues.includes(card.value)), cards);
        playerHandRank = allHandRanks.TWOPAIR;
        playerHandTitle = types_1.HandTitles.TWOPAIR;
    }
    else if (playerDuplicates.result) {
        // Pair - 15 SUCCESS
        const pairValue = Object.keys(playerDuplicates.data).find(key => playerDuplicates.data[key] === 2);
        playerHandCards = (0, exports.addHighestRemainingCardsToHand)(cards.filter(card => card.value === parseInt(pairValue)), cards);
        playerHandRank = allHandRanks.PAIR;
        playerHandTitle = types_1.HandTitles.PAIR;
    }
    else {
        // High Card - 6 SUCCESS
        playerHandCards = (0, exports.addHighestRemainingCardsToHand)([], cards);
        playerHandRank = allHandRanks.HIGHCARD;
        playerHandTitle = types_1.HandTitles.HIGHCARD;
    }
    return {
        cards: playerHandCards,
        rank: playerHandRank,
        title: playerHandTitle
    };
};
exports.determinePlayerHand = determinePlayerHand;
//# sourceMappingURL=handCheck.js.map