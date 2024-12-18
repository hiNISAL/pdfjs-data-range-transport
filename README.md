# pdfjs-data-range-transport

🇨🇳 中文 | [ENGLISH](README-EN.md)

pdf.js 的 `PDFDataRangeTransport` 接口的实现，用于分片读取 pdf 文件。

仅在`pdf.js@4.x`下使用。

## 安装

```shell
npm install pdfjs-data-range-transport
```

## 使用

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
  // 文件 URL
  url: string;
  // pdfjs 的 PDFDataRangeTransport 类
  PDFDataRangeTransport: any,
  // 请求头
  headers?: Record<string, string>,
  // 在读取分片之前调用
  beforeFetchChunk?: (begin: number, end: number) => void,
  // 在读取分片之后调用
  afterFetchChunk?: (begin: number, end: number, chunk: ArrayBuffer) => void,
}
```
