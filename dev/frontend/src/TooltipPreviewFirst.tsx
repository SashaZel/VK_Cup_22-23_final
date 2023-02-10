import { useEffect, useState } from "preact/hooks";
import { getImageSize } from "./api/API";
import { ILetterPreview } from "./utils/types";

interface ITooltipPreviewFirst {
  x: number;
  y: number;
  handleTooltipOff: () => void;
  letterForTooltipPreview: ILetterPreview | null;
}

export function TooltipPreviewFirst({
  x,
  y,
  handleTooltipOff,
  letterForTooltipPreview,
}: ITooltipPreviewFirst) {
  const [attachmentSize, setAttachmentSize] = useState("");
  const [showSecondTooltip, setShowSecondTooltip] = useState(false);
  let attachedImage = null;
  let secondTooltip = null;
  let imagePath: null | string = null;
  if (letterForTooltipPreview && letterForTooltipPreview.hasAttachment) {
    imagePath = `/images/attachments/att-pic--${
      letterForTooltipPreview.author.email
    }-${letterForTooltipPreview.date.replaceAll(":", "--esc-colon--")}.jpg`;

    attachedImage = (
      <div>
        <a href={imagePath} target="_blank">
          <img
            src={imagePath}
            alt="attached image"
            class="tooltip-first__preview"
          />
        </a>
      </div>
    );
    secondTooltip = (
      <div>
        <a href={imagePath} target="_blank">
          <img src={imagePath} alt="attached image" class="tooltip-second" />
        </a>
      </div>
    );
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (
      e.clientX < x - 300 ||
      e.clientX > x + 30 ||
      e.clientY < y - 16 ||
      e.clientY > y + 40
    ) {
      handleTooltipOff();
    }
  };

  const handleSecondTooltipOn = () => {
    setShowSecondTooltip(true);
  };

  const handleSecondTooltipOff = () => {
    setShowSecondTooltip(false);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const requestImageSize = async () => {
      if (!imagePath) {
        return;
      }
      const attachedImageData = await getImageSize(imagePath.split("/")[3]);
      if (!attachedImageData?.ok) {
        return;
      }
      const formattedSize =
        attachedImageData.imageSize < 1024 ** 2
          ? `${Math.round(attachedImageData.imageSize / 1024)} KB`
          : `${
              Math.round(attachedImageData.imageSize / (1024 ** 2 / 100)) / 100
            } MB`;
      const imageDataMarkup = `...${imagePath.slice(-10)} ${formattedSize}`;
      setAttachmentSize(imageDataMarkup);
    };
    requestImageSize();
  }, []);

  return (
    <div class="tooltip-first" style={{ left: x - 306, top: y - 12 }}>
      <div
        className="tooltip-first__attach-row"
        onMouseEnter={handleSecondTooltipOn}
        onMouseLeave={handleSecondTooltipOff}
      >
        {attachedImage}
        <div>{attachmentSize}</div>
      </div>
      {showSecondTooltip && secondTooltip}
    </div>
  );
}
