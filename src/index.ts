import { type PDFDataRangeTransport } from 'pdfjs-dist';

const READ_CHUNK_SIZE = 262140; // 65535 * 4 = 262140

const fetchPdfHead = async (url: string, headers: Record<string, string> = {}) => {
  const response = await fetch(url, {
    method: 'HEAD',
    headers: {
      Accept: 'application/pdf',
      ...headers,
    },
  });

  const contentLength = response.headers.get('content-length');

  return {
    contentLength: contentLength as any,
  }
}

const fetchPdfChunk = async (url: string, startRange: number, endRange: number, headers: Record<string, string> = {}) => {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/pdf',
      Range: `bytes=${startRange}-${endRange}`,
      ...headers,
    },
  });

  const contentLength = response.headers.get('content-length');
  const chunk = await response.arrayBuffer();

  return {
    contentLength: contentLength,
    chunk: chunk,
  };
}

interface PDFReaderOptions {
  url: string;
  PDFDataRangeTransport: any,
  headers?: Record<string, string>,
  beforeFetchChunk?: (begin: number, end: number) => void,
  afterFetchChunk?: (begin: number, end: number, chunk: ArrayBuffer) => void,
}

// -------------------------------------------------------------------------
// read pdf file as chunks for pdfjs
class PDFJSFileReader {
  static options: {
    readChunkSize: number;
  } = {
    readChunkSize: READ_CHUNK_SIZE,
  };

  // -------------------------------------------------------------------------

  public totalChunkSize: number = 0;

  public pdf: PDFDataRangeTransport|null = null;

  public url: string;

  public PDFDataRangeTransport: any;

  public headers: Record<string, string> = {};

  public beforeFetchChunk?: (begin: number, end: number) => void;

  public afterFetchChunk?: (begin: number, end: number, chunk: ArrayBuffer) => void;

  // -------------------------------------------------------------------------

  constructor(options: PDFReaderOptions) {
    this.url = options.url;
    this.headers = options.headers || {};
    this.PDFDataRangeTransport = options.PDFDataRangeTransport;
    this.beforeFetchChunk = options.beforeFetchChunk;
    this.afterFetchChunk = options.afterFetchChunk;
  }

  public async read() {
    const { contentLength } = await fetchPdfHead(this.url, this.headers);

    this.totalChunkSize = contentLength;

    this.pdf = new (this.PDFDataRangeTransport)(contentLength, new Uint8Array([]));

    let hasFetchLength = 0;
    this.pdf!.requestDataRange = async (begin: number, end: number) => {
      this?.beforeFetchChunk?.(begin, end);
      const { chunk, contentLength: chunkContentLength } = await fetchPdfChunk(this.url, begin, end - 1, this.headers);
      this?.afterFetchChunk?.(begin, end, chunk);

      hasFetchLength += Number(chunkContentLength);

      this.pdf?.onDataProgress(hasFetchLength, contentLength);
      this.pdf?.onDataRange(begin, chunk as any);
    }

    return {
      length: contentLength,
      range: this.pdf,
    };
  }

  public getPdf(): PDFDataRangeTransport {
    return this.pdf as PDFDataRangeTransport;
  }
}

export default PDFJSFileReader;
