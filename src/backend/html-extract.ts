import type { RawDecafReceipt } from "./types";

export const receiptHTMLToObject = (html: string): RawDecafReceipt => {
  var newDocument = new DOMParser().parseFromString(html, "text/html");
  const jsonInsideHTML =
    newDocument.getElementById("__NEXT_DATA__").textContent;
  return JSON.parse(jsonInsideHTML);
};
