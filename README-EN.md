# pdfjs-data-range-transport

[🇨🇳 中文](README.md) | ENGLISH

Implementation of pdf.js's `PDFDataRangeTransport` interface for reading PDF files in chunks.

Only works with `pdf.js@4.x`.

## Installation

```shell
npm install pdfjs-data-range-transport
```

## Usage

```ts
import PDFJSFileReader from 'pdfjs-data-range-transport';
import * as pdfjs from 'pdfjs-dist';

const reader = new PDFJSFileReader({
  url: 'https://example.com/example.pdf',
  PDFDataRangeTransport: pdfjs.PDFDataRangeTransport,
});

const options = await reader.read();

const doc = pdfjs.getDocument({
  ...options,
});
```

## APIs

### constructor options

```ts
interface PDFReaderOptions {
  // file url
  url: string;
  // pdfjs's PDFDataRangeTransport class
  PDFDataRangeTransport: any,
  // request headers
  headers?: Record<string, string>,
  // called before fetching chunk
  beforeFetchChunk?: (begin: number, end: number) => void,
  // called after fetching chunk
  afterFetchChunk?: (begin: number, end: number, chunk: ArrayBuffer) => void,
}
```
