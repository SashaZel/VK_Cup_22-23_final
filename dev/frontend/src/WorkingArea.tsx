import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";
import { IFilter, ILetterPreview, TFolders } from "./utils/types";
import { LetterRow } from "./LetterRow";
import { NoLetters } from "./NoLetters";
import { ShowWholeLetter } from "./ShowWholeLetter";
import { TooltipPreviewFirst } from "./TooltipPreviewFirst";
import { fetchLetters } from "./api/API";
import { filterLettersByFilterState } from "./utils/utilFunctions";

interface IWorkingArea {
  filterState: IFilter;
  currentFolder: TFolders;
  showLetter: boolean;
  handleShowLetter: () => void;
  handleDnDletter: (letter: ILetterPreview | null) => void;
  handleDnDdrop: (folder: TFolders) => void;
}

interface IFirstTooltipState {
  show: boolean;
  x: number;
  y: number;
  letterForTooltip: ILetterPreview | null;
}

export function WorkingArea({
  filterState,
  currentFolder,
  showLetter,
  handleShowLetter,
  handleDnDletter,
  handleDnDdrop
}: IWorkingArea) {
  const [allLettersPreview, setAllLettersPreview] = useState<ILetterPreview[]>(
    []
  );
  const [showFirstPreview, setShowFirstPreview] = useState<IFirstTooltipState>({
    show: false,
    x: 0,
    y: 0,
    letterForTooltip: null,
  });
  const [letterForDetailsShow, setLetterForDetailsShow] =
    useState<null | ILetterPreview>(null);
  const [offsetForScroll, setOffsetForScroll] = useState(0);
  const [hasNextForScroll, setHasNextForScroll] = useState(true);

  const observer = useRef<null | IntersectionObserver>(null);
  const lastElementCallback = useCallback(
    (element: HTMLLIElement | null) => {
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting) {
          async function getLetters() {
            const newOffsetForScroll = offsetForScroll + 15;
            const fetchedData = await fetchLetters(
              currentFolder,
              newOffsetForScroll,
              15
            );
            const fetchedLettersPreview: ILetterPreview[] = fetchedData.letters;
            setAllLettersPreview((letters) => [
              ...letters,
              ...fetchedLettersPreview,
            ]);
            setOffsetForScroll(newOffsetForScroll);
            setHasNextForScroll(fetchedData.nextAvailable);
          }
          if (hasNextForScroll) {
            getLetters();
          }
        }
      });
      if (element) {
        observer.current.observe(element);
      }
    },
    [currentFolder, offsetForScroll, hasNextForScroll]
  );

  useEffect(() => {
    async function getLetters() {
      setAllLettersPreview([]);
      const fetchedLetters = await fetchLetters(currentFolder, 0, 15);
      const letterPreview: ILetterPreview[] = fetchedLetters.letters;
      setAllLettersPreview(letterPreview);
      setOffsetForScroll(0);
      setHasNextForScroll(fetchedLetters.nextAvailable);
    }
    getLetters();
  }, [currentFolder]);

  const handleClickOnLetter = (
    e: JSXInternal.TargetedMouseEvent<HTMLDivElement>,
    letter: ILetterPreview
  ) => {
    handleShowLetter();
    e.stopPropagation();
    setLetterForDetailsShow(letter);
  };

  const handleUnread = (
    e: JSXInternal.TargetedMouseEvent<HTMLButtonElement>,
    letter: ILetterPreview
  ) => {
    e.stopPropagation();
  };

  const handleBookmark = (
    e: JSXInternal.TargetedMouseEvent<HTMLImageElement>,
    letter: ILetterPreview
  ) => {
    e.stopPropagation();
  };

  const handleTooltipOn = (
    e: JSXInternal.TargetedMouseEvent<HTMLDivElement>,
    letter: ILetterPreview
  ) => {
    setShowFirstPreview({
      show: true,
      x: e.currentTarget.getBoundingClientRect().left,
      y: e.currentTarget.getBoundingClientRect().top,
      letterForTooltip: letter,
    });
  };

  const handleTooltipOff = () => {
    setShowFirstPreview({ show: false, x: 0, y: 0, letterForTooltip: null });
  };

  const lettersForDisplay = allLettersPreview.filter((letter) =>
    filterLettersByFilterState(letter, filterState)
  );
  const displaiedLetters = lettersForDisplay.map((letter, index) => {
    const LetterRowElement = (
      <LetterRow
        key={String(index) + String(letter?.date)}
        letter={letter}
        handleClickOnLetter={handleClickOnLetter}
        handleTooltipOn={handleTooltipOn}
        handleUnread={handleUnread}
        handleBookmark={handleBookmark}
        handleDnDletter={handleDnDletter}
        handleDnDdrop={handleDnDdrop}
      />
    );
    if (index === lettersForDisplay.length - 1) {
      return <li ref={(e) => lastElementCallback(e)}>{LetterRowElement}</li>;
    }

    return <li>{LetterRowElement}</li>;
  });

  if (lettersForDisplay.length === 0) {
    return <NoLetters />;
  }

  return (
    <div class="working-area">
      {letterForDetailsShow && showLetter ? (
        <ShowWholeLetter
          letter={letterForDetailsShow}
          handleUnread={handleUnread}
          handleBookmark={handleBookmark}
        />
      ) : (
        <ul>{displaiedLetters}</ul>
      )}
      {showFirstPreview.show && (
        <TooltipPreviewFirst
          x={showFirstPreview.x}
          y={showFirstPreview.y}
          handleTooltipOff={handleTooltipOff}
          letterForTooltipPreview={showFirstPreview.letterForTooltip}
        />
      )}
    </div>
  );
}
