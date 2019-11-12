import { RenewTokenError } from "../errors";
import { TimeoutID } from "../types";

export const authorizeSilently = (
  uri: string,
  origin: string,
  timeout: number
) => {
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

      if (event.data && event.data.response) {
        const { code } = event.data.response;
        return resolve(code);
      } else {
        const error =
          (event.data && event.data.error) ||
          new RenewTokenError({
            message: "Invalid message received from server"
          });
        return reject(error);
      }
    };

    window.addEventListener("message", onMessageHandler);
    iframe.src = uri;

    timeoutId = setTimeout(() => {
      cleanup();
      return reject(
        new RenewTokenError({
          message: "Server did not respond with authorization code, aborting."
        })
      );
    }, timeout);
  });
};
