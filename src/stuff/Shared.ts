import { Candy } from '../modules/bulk/NetwordsTile';
import { dictContains } from './dictionary';

/**
 * Possible game statuses; changes what actions are available to players.
 */
export enum GameModes {
  /** Player is currently choosing tiles in the letter cloud. */
  BuildingWord = 'BuildingWord',
  /**
   * Player has submitted a word and is choosing a tile in the word-in-progress
   * bar to connect to a tile on the word grid.
   *
   * Player may cancel back to {@link GameModes.BuildingWord BuildingWord}.
   */
  ChoosingLocalLetter = 'ChoosingLocalLetter',
  /**
   * Player has submitted a word and has chosen a tile in the word-in-progress
   * bar. They may now pick a different tile in the word-in-progress bar, or
   * choose a tile in the word grid to connect it to.
   *
   * Player may cancel back to {@link GameModes.BuildingWord BuildingWord}.
   */
  ChoosingBoardSpace = 'ChoosingBoardSpace',
  /**
   * Player has submitted a word, chosen a tile in the word-in-progress bar,
   * and chosen a tile in the word grid. They are now choosing a direction
   * to point the new word in.
   *
   * Player may cancel back to {@link GameModes.ChoosingBoardSpace ChoosingBoardSpace}.
   */
  ChoosingDirection = 'ChoosingDirection',
  ConfirmingChoices = 'ConfirmingChoices'
}

export enum Directions {
  Northeast = 'NE',
  East = 'E',
  Southeast = 'SE',
  Southwest = 'SW',
  West = 'W',
  Northwest = 'NW'
}

export const GetOppositeDirection = (dir: Directions) => {
  switch (dir) {
    case Directions.Northeast:
      return Directions.Southwest;
    case Directions.East:
      return Directions.West;
    case Directions.Southeast:
      return Directions.Northwest;
    case Directions.Southwest:
      return Directions.Northeast;
    case Directions.West:
      return Directions.East;
    case Directions.Northwest:
      return Directions.Southeast;
  }
};

export const GetRotation = (direction: Directions) => {
  switch (direction) {
    case Directions.East:
      return 0;
    case Directions.West:
      return 180;
    case Directions.Northeast:
      return 300;
    case Directions.Southeast:
      return 60;
    case Directions.Northwest:
      return 240;
    case Directions.Southwest:
      return 120;
  }
};

export interface NWTData {
  row: number;
  col: number;
  letter?: string;
  candy?: Candy;
}

export const AreTilesSame = (tileA: NWTData, tileB: NWTData) => {
  return tileA.col === tileB.col && tileA.row === tileB.row;
};

export const AreTilesAdjacent = (tileA: NWTData, tileB: NWTData) => {
  return (
    (tileA.row === tileB.row && Math.abs(tileA.col - tileB.col) === 1) ||
    (tileA.col === tileB.col && Math.abs(tileA.row - tileB.row) === 1) ||
    (Math.abs(tileA.row - tileB.row) === 1 &&
      ((tileA.row % 2 === 1 && tileB.col - tileA.col === 1) ||
        (tileB.row % 2 === 1 && tileA.col - tileB.col === 1) ||
        (tileA.row % 2 === 0 && tileA.col - tileB.col === 1) ||
        (tileB.row % 2 === 0 && tileB.col - tileA.col === 1)))
  );
};

/**
 * Checks if the 'word' a player made is valid.
 *
 * Makes sure it hasn't already been found, and that it's in the dictionary.
 *
 * @param word Stringified version of tiles the player has selected.
 * @param wordsFound List of already-found words.
 * @returns true if it's a valid word; false otherwise
 */
export const IsValidWord = (word: string, wordsFound: string[]) => {
  console.log(`checking if '${word}' is a valid word`);

  if (wordsFound.includes(word)) {
    console.log(`no, '${word}' is not valid; already submitted`);
    return false;
  }

  if (!dictContains(word)) {
    console.log(`no, '${word}' is not valid; not in dictionary`);
    return false;
  }

  console.log(`confirmed, '${word}' is a valid word`);
  return true;
};

export const TilesToString = (tiles: NWTData[]) => {
  return tiles
    .map((tileData) => tileData.letter!)
    .join('')
    .toLowerCase();
};

export const CompareWords = (wordA: NWTData[], wordB: NWTData[]) => {
  const [wordAString, wordBString] = [wordA, wordB].map(TilesToString);
  if (wordAString < wordBString) return -1;
  if (wordAString > wordBString) return 1;
  return 0;
};
