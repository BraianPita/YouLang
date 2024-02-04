import { useEffect, useState } from "react";

interface Caption {
  captionId: string,
  captionText: string,
}

const App = () => {
    const [newCaption, setNewCaption] = useState<Caption | null>(null);
    const [captions, setCaptions] = useState<Caption[]>([]);

    useEffect(() => {

      const onNewCaption = (message: any) => {
        // console.log(message);
        if (message.action == "newCaption") {
          const caption = {captionId: message.captionId, captionText: message.captionText};
          try {
            setNewCaption(caption)
            return true;

          } catch (error: any) {
            console.error('Error in captions:', error);
            return false;
          }
        }
      }

      chrome.runtime.onMessage.addListener(onNewCaption);

    return () => {
      chrome.runtime.onMessage.removeListener(onNewCaption);
    }

    }, []);

    useEffect(() => {
      if (newCaption && !captions.some(c => c.captionId == newCaption.captionId))
      setCaptions([
        newCaption,
        ...captions
      ]);
    }, [newCaption]);

    return (
      <main className="sidepanel">
        <h1>Subtitles</h1>

        <div className="caption-container">
          <span className="caption caption-current">{newCaption?.captionText}</span>
          {captions.slice(1).map(cap => (
            <span className="caption" key={cap.captionId}>
              {cap.captionText}
            </span>
          ))}
        </div>

      </main>
    );
};

  export default App;
  