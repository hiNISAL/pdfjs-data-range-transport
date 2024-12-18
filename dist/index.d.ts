import { type PDFDataRangeTransport } from 'pdfjs-dist';
interface PDFReaderOptions {
    url: string;
    PDFDataRangeTransport: any;
}
declare class PDFJSFileReader {
    static options: {
        readChunkSize: number;
    };
    totalChunkSize: number;
    pdf: PDFDataRangeTransport | null;
    url: string;
    PDFDataRangeTransport: any;
    constructor(options: PDFReaderOptions);
    read(): Promise<{
        length: any;
        range: PDFDataRangeTransport | null;
    }>;
    getPdf(): PDFDataRangeTransport;
}
export default PDFJSFileReader;
