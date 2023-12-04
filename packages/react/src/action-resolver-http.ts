import {
  HttpActionResolverEvents,
  HttpActionResolverInit,
} from "@mod-protocol/core";

export default function actionResolverHttp(
  init: HttpActionResolverInit,
  events: HttpActionResolverEvents
) {
  const xhr = new XMLHttpRequest();
  xhr.open(init.method, init.url);

  function parseBody() {
    if (
      ["application/json", "application/ld+json"].includes(
        xhr.getResponseHeader("content-type") || ""
      )
    ) {
      return JSON.parse(xhr.response);
    }
    return xhr.response;
  }

  if (init.headers) {
    for (const name in init.headers) {
      xhr.setRequestHeader(name, init.headers[name]);
    }
  }

  if (init.body) {
    xhr.upload.onprogress = (e) => {
      events.onUploadProgress(Math.ceil((e.loaded / e.total) * 100));
    };

    xhr.send(init.body);
  } else {
    xhr.send();
  }

  xhr.onabort = () => {
    events.onAbort();
  };

  xhr.onerror = (err) => {
    events.onError({
      status: xhr.status,
      statusText: xhr.statusText,
      error: parseBody(),
    });
  };

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        events.onSuccess({
          status: xhr.status,
          statusText: xhr.statusText,
          data: parseBody(),
        });
      } else if (xhr.status >= 400) {
        events.onError({
          status: xhr.status,
          statusText: xhr.statusText,
          error: parseBody(),
        });
      }
    }
  };
}
