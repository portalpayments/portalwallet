import type { RawDecafReceipt } from "../types";
import { JSDOM } from "jsdom";

// Mock this (as node doesn't have a DOM)
export const receiptHTMLToObject = (html: string): RawDecafReceipt => {
  const dom = new JSDOM(html);
  const nextData = dom.window.document.getElementById("__NEXT_DATA__");
  if (!nextData) {
    throw new Error(`Couldn't find nextdata in DOM`);
  }
  const jsonInsideHTML = nextData.textContent;
  return JSON.parse(jsonInsideHTML);
};
