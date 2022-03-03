import { useAppDispatch, useAppSelector } from '../stuff/hooks';
import {
  AreTilesAdjacent,
  AreTilesSame,
  GameModes,
  NWTData
} from '../stuff/Shared';
import { selectGameMode, startDragging } from '../stuff/slices/GameSlice';
import {
  selectLeftOffset,
  selectTopOffset
} from '../stuff/slices/StylingSlice';
import {
  addTileToWordInProgress,
  removeLastTile,
  selectLastWipTile,
  selectSecondToLastWipTile,
  selectDoesWipContain
} from '../stuff/slices/WordInProgressSlice';

interface LCDTProps {
  myData: NWTData;
}
export const LCDragTile = ({ myData }: LCDTProps) => {
  const leftOffset = useAppSelector((state) => selectLeftOffset(state, myData));
  const topOffset = useAppSelector((state) => selectTopOffset(state, myData));

  const gameMode = useAppSelector(selectGameMode);
  const isInteractable = gameMode === GameModes.BuildingWord;

  const isChosen = useAppSelector((state) =>
    selectDoesWipContain(state, myData)
  );

  const lastTile = useAppSelector(selectLastWipTile);
  const isAdjacentToLastTile = !!lastTile && AreTilesAdjacent(lastTile, myData);

  const secondToLastTile = useAppSelector(selectSecondToLastWipTile);
  const isSecondToLast =
    !!secondToLastTile && AreTilesSame(myData, secondToLastTile);

  const isDragging = useAppSelector((state) => state.game.isDraggingLCTiles);

  const shouldChooseOnMouseDown =
    isInteractable && !isDragging && !isChosen && !lastTile;
  const shouldChooseOnOver =
    isInteractable && isDragging && !isChosen && isAdjacentToLastTile;
  const shouldUnchooseLastOnOver =
    isInteractable && isDragging && isSecondToLast;

  const dispatch = useAppDispatch();

  let onMouseOver: (() => void) | undefined;
  if (shouldChooseOnOver) {
    console.log('adding mouse over for tile');
    onMouseOver = () => {
      dispatch(addTileToWordInProgress(myData));
    };
  } else if (shouldUnchooseLastOnOver) {
    onMouseOver = () => {
      dispatch(removeLastTile(undefined));
    };
  }

  let onMouseDown: (() => void) | undefined;
  if (shouldChooseOnMouseDown) {
    onMouseDown = () => {
      dispatch(startDragging(undefined));
      dispatch(addTileToWordInProgress(myData));
    };
  }

  return (
    <div
      className={`NetwordsTile LCTile ${isChosen ? 'Chosen' : ''} ${gameMode}`}
      onMouseOver={onMouseOver}
      onMouseDown={onMouseDown}
      style={{ left: leftOffset, top: topOffset }}
    >
      {myData.letter}
    </div>
  );
};
