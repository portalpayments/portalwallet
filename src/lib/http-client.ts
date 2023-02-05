// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
import { log } from "../backend/functions";

export const CONTENT_TYPES = {
  JSON: "application/json",
  TEXT: "text/plain",
  HTML: "text/html",
};

export const get = async (
  uri: string,
  forceContentType: string | null = null
) => {
  return fetchUnfucked(uri, forceContentType);
};

export const post = async (
  uri: string,
  body: Record<string, unknown>,
  forceContentType: string | null = null
) => {
  return fetchUnfucked(uri, forceContentType, "POST", body);
};

export const fetchUnfucked = async (
  uri: string,
  forceContentType: string | null = null,
  method = "GET",
  body: Record<string, unknown> = null
) => {
  const response = await fetch(uri, {
    method,
    body: body ? JSON.stringify(body) : null,
  });

  let contentType = CONTENT_TYPES.JSON;
  if (forceContentType) {
    contentType = forceContentType;
  } else {
    let contentTypeHeader = response.headers.get("Content-Type");
    if (contentTypeHeader) {
      contentType = contentTypeHeader.split(";").at(0);
    } else {
      log(`No Content Type header. Weird. Using default.`);
    }
  }

  if (
    contentType === CONTENT_TYPES.TEXT ||
    contentType === CONTENT_TYPES.HTML
  ) {
    const htmlOrText = await response.text();
    return htmlOrText;
  }
  if (contentType === CONTENT_TYPES.JSON) {
    return response.json();
  }
  throw new Error(`Don't know how to decode this contentType: ${contentType}`);
};
