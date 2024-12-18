var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const READ_CHUNK_SIZE = 262140; // 65535 * 4 = 262140
const fetchPdfHead = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(url, {
        method: 'HEAD',
        headers: {
            Accept: 'application/pdf',
        },
    });
    const contentLength = response.headers.get('content-length');
    return {
        contentLength: contentLength,
    };
});
const fetchPdfChunk = (url, startRange, endRange) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(url, {
        headers: {
            Accept: 'application/pdf',
            Range: `bytes=${startRange}-${endRange}`,
        },
    });
    const contentLength = response.headers.get('content-length');
    const chunk = yield response.arrayBuffer();
    return {
        contentLength: contentLength,
        chunk: chunk,
    };
});
// -------------------------------------------------------------------------
// read pdf file as chunks for pdfjs
class PDFJSFileReader {
    // -------------------------------------------------------------------------
    constructor(options) {
        // -------------------------------------------------------------------------
        this.totalChunkSize = 0;
        this.pdf = null;
        this.url = options.url;
        this.PDFDataRangeTransport = options.PDFDataRangeTransport;
    }
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            const { contentLength } = yield fetchPdfHead(this.url);
            this.totalChunkSize = contentLength;
            this.pdf = new (this.PDFDataRangeTransport)(contentLength, new Uint8Array([]));
            let hasFetchLength = 0;
            this.pdf.requestDataRange = (begin, end) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const { chunk, contentLength: chunkContentLength } = yield fetchPdfChunk(this.url, begin, end - 1);
                hasFetchLength += Number(chunkContentLength);
                (_a = this.pdf) === null || _a === void 0 ? void 0 : _a.onDataProgress(hasFetchLength, contentLength);
                (_b = this.pdf) === null || _b === void 0 ? void 0 : _b.onDataRange(begin, chunk);
            });
            return {
                length: contentLength,
                range: this.pdf,
            };
        });
    }
    getPdf() {
        return this.pdf;
    }
}
PDFJSFileReader.options = {
    readChunkSize: READ_CHUNK_SIZE,
};
export default PDFJSFileReader;
