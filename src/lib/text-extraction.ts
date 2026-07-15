import { extractText as extractPdfText, getDocumentProxy } from 'unpdf';
import mammoth from 'mammoth';
import MsgReader from '@kenjiuno/msgreader';
import { simpleParser } from 'mailparser';

// Turns an uploaded file's raw bytes into plain text for extractEvents()
// (lib/claude.ts) to consume, plus the handful of document-metadata fields
// the Documents Dev Dataverse table wants (sender, dated, document type).
// Accepted formats: PDF, DOCX, MSG (build-decisions.md), plus EML —
// added 2026-07-15 for the Full Review-tier volume test, since the
// realistic subcontractor sample document set uses .eml (a plain
// RFC 5322 text format, not Outlook's binary .msg) throughout. EML and
// MSG both classify as DocumentKind 'email' (documentTypeForKind in
// dataverse-schema.ts doesn't need to know the difference) but need
// different parsers, so dispatch is on file extension, not kind.

export type DocumentKind = 'pdf' | 'docx' | 'email' | 'other';

export interface ExtractedDocument {
  kind: DocumentKind;
  text: string;
  sender?: string;
  documentDated?: string; // ISO YYYY-MM-DD if known
}

type FileExtension = 'pdf' | 'docx' | 'doc' | 'msg' | 'eml' | 'other';

function extFromFilename(filename: string): FileExtension {
  const ext = filename.toLowerCase().split('.').pop();
  if (ext === 'pdf' || ext === 'docx' || ext === 'doc' || ext === 'msg' || ext === 'eml') return ext;
  return 'other';
}

async function extractPdf(buffer: Uint8Array): Promise<ExtractedDocument> {
  const pdf = await getDocumentProxy(buffer);
  const { text } = await extractPdfText(pdf, { mergePages: true });
  return { kind: 'pdf', text };
}

async function extractDocx(buffer: Buffer): Promise<ExtractedDocument> {
  const result = await mammoth.extractRawText({ buffer });
  return { kind: 'docx', text: result.value };
}

function extractMsg(buffer: ArrayBuffer): ExtractedDocument {
  const reader = new MsgReader(buffer);
  const data = reader.getFileData();
  const bodyText = data.body ?? '';
  const subject = data.subject ? `Subject: ${data.subject}\n\n` : '';
  const sender = data.senderEmail ?? data.senderName ?? undefined;
  const documentDated = data.messageDeliveryTime
    ? new Date(data.messageDeliveryTime).toISOString().slice(0, 10)
    : undefined;
  return { kind: 'email', text: `${subject}${bodyText}`, sender, documentDated };
}

async function extractEml(nodeBuffer: Buffer): Promise<ExtractedDocument> {
  const parsed = await simpleParser(nodeBuffer);
  const bodyText = parsed.text ?? (typeof parsed.html === 'string' ? parsed.html : '') ?? '';
  const subject = parsed.subject ? `Subject: ${parsed.subject}\n\n` : '';
  const fromValue = Array.isArray(parsed.from?.value) ? parsed.from?.value[0] : undefined;
  const sender = fromValue?.address ?? parsed.from?.text ?? undefined;
  const documentDated = parsed.date ? parsed.date.toISOString().slice(0, 10) : undefined;
  return { kind: 'email', text: `${subject}${bodyText}`, sender, documentDated };
}

/**
 * Extracts plain text (+ known metadata) from an uploaded document's raw
 * bytes, dispatching on file extension. Throws on unsupported/corrupt files
 * — callers should catch per-document so one bad file doesn't fail an
 * entire submission (see process/route.ts).
 */
export async function extractDocumentText(
  filename: string,
  buffer: ArrayBuffer,
): Promise<ExtractedDocument> {
  const ext = extFromFilename(filename);
  const nodeBuffer = Buffer.from(buffer);

  switch (ext) {
    case 'pdf':
      return extractPdf(new Uint8Array(buffer));
    case 'docx':
    case 'doc':
      return extractDocx(nodeBuffer);
    case 'msg':
      return extractMsg(buffer);
    case 'eml':
      return extractEml(nodeBuffer);
    default:
      throw new Error(`Unsupported file type for "${filename}" — only PDF, DOCX, MSG, EML are accepted`);
  }
}
