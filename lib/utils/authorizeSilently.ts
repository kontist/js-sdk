import { SilentAuthorizationError } from "../errors";
import { TimeoutID } from "../types";

const DEFAULT_SERVER_MESSAGE_TIMEOUT = 10000;

export const authorizeSilently = (uri: string, origin: string, timeout?: number) => {
  return new Promise((resolve, reject) => {
    let timeoutId: TimeoutID;
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const cleanup = () => {
      window.removeEventListener("message", onMessageHandler);
      if (iframe && iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };

    const onMessageHandler = (event: MessageEvent) => {
      if (event.origin !== origin) {
        return;
      }

      cleanup();

      if (!event.data.error) {
        const { code } = event.data.response;
        return resolve(code);
      } else {
        return reject(event.data.error);
      }
    };

    window.addEventListener("message", onMessageHandler);
    iframe.src = uri;

    timeoutId = setTimeout(() => {
      cleanup();
      return reject(
        new SilentAuthorizationError({
          message: "Server did not respond with authorization code, aborting."
        })
      );
    }, timeout || DEFAULT_SERVER_MESSAGE_TIMEOUT);
  });
};
