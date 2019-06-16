import Document, { Head, Main, NextScript } from 'next/document';
import { THEME_VARIABLES } from '../config/env';
import React from 'react';

export default class MyDocument extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <script
            src="https://apis.google.com/js/api.js"
            type="text/javascript"
          />
          <link href="https://fonts.googleapis.com/css?family=Montserrat&display=swap" rel="stylesheet">
          <meta name="description" content="App for Postbank" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta
            name="theme-color"
            content={THEME_VARIABLES['@primary-color']}
          />
          <link rel="apple-touch-icon" href="/static/icon.png" />
          <meta name="apple-mobile-web-app-title" content="Postbank Health" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="mobile-web-app-capable" content="yes" />
          <link rel="icon" type="image/x-icon" href="/static/favicon.ico" />
          <link rel="manifest" href="/static/manifest.json" />
          <link rel="shortcut icon" href="/static/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/static/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/static/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/static/favicon-16x16.png"
          />
          <link
            rel="mask-icon"
            href="/static/safari-pinned-tab.svg"
            color={THEME_VARIABLES['@primary-color']}
          />
          <meta name="apple-mobile-web-app-title" content="Postbank Health" />
          <meta name="application-name" content="Postbank Health" />
          <meta
            name="msapplication-TileColor"
            content={THEME_VARIABLES['@primary-color']}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
