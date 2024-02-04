let observer : MutationObserver | undefined;

function initCaptionsListener() {
    const captionsContainer = document.getElementById("ytp-caption-window-container");

    if (!captionsContainer) return;

    // Create a new MutationObserver
    observer = new MutationObserver((mutationsList) => {

        if (!chrome.runtime?.id) return;

        
        mutationsList.forEach((mutation) => {
            if (mutation.type === 'childList') {
                // Check if the added nodes match your regex pattern
                mutation.addedNodes.forEach((addedNode) => {
                    if (addedNode instanceof HTMLDivElement) {
                        // should I add this? && addedNode.id.match(/^caption-window-.*/)
                        // Get caption id to avoid repeated captions
                        const captionId = addedNode.id.split("caption-window-_").pop();
                        // get the caption text
                        const captionText = addedNode.getElementsByTagName("span")[0]
                                                        ?.getElementsByTagName("span")[0]
                                                        ?.getElementsByTagName("span")[0]
                                                        ?.innerText;
                                            
                        console.log('Caption ', captionId, captionText);
                        // send message to be received by sidePanel process
                        if (captionId && captionText)
                        chrome.runtime.sendMessage({ 
                            action: 'newCaption',
                            captionId: captionId,
                            captionText: captionText,
                        });
                    }
                });
            }
        });
    });

    // Configure the observer (observe childList mutations)
    const config = { childList: true };

    // Attach the observer to the target element
    observer.observe(captionsContainer, config);
}

// const orphanCheck = () => {
//     const eventName = chrome.runtime.id + '-install-hook-jp-learn';
//     const orphanCheckRequest = () => {
//       // If we can't get the UI language, it means we are orphaned, and should
//       // remove our event handlers
//       if (chrome.i18n && chrome.i18n.getUILanguage()) return true;

//       observer?.disconnect();
//       window.removeEventListener(eventName, orphanCheckRequest, true);
//     };

//     // Send the event before we listen for it, for other possible
//     // running instances of the content script.
//     dispatchEvent(new Event(eventName));
//     addEventListener(eventName, orphanCheckRequest, true);
// };

// orphanCheck();
initCaptionsListener();