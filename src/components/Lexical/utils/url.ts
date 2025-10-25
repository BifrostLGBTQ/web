/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export function sanitizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    // Allow http, https, and mailto protocols
    if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'mailto:') {
      return url;
    }
    return 'https://';
  } catch {
    return 'https://';
  }
}
