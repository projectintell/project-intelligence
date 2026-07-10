import { extractText as extractPdfText, getDocumentProxy } from 'unpdf';
import mammoth from 'mammoth';
import MsgReader from '@kenjiuno/msgreader';

// Turns an uploaded file's raw bytes into plain text for extractEvents()
// (lib/claude.ts) to consume, plus the handful of document-metadata fields
// the Documents Dev Dataverse table wants (sender, dated, document type).
// Accepted formats confirmed in build-decisions.md: PDF, DOCX, MSG only.

export type DocumentKind = 'pdf' | 'docx' | 'email' | 'other';

export interface ExtractedDocument {
  kind: DocumentKind;
  text: string;
  sender?: string;
  documentDated?: string; // ISO YYYY-MM-DD if known
}

function kindFromFilename(filename: string): DocumentKind {
  const ext = filename.toLowerCase().split('.').pop();
  if (ext === 'pdf') return 'pdf';
  if (ext === 'docx' || ext === 'doc') return 'docx';
  if (ext === 'msg') return 'email';
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
  const kind = kindFromFilename(filename);
  const nodeBuffer = Buffer.from(buffer);

  switch (kind) {
    case 'pdf':
      return extractPdf(new Uint8Array(buffer));
    case 'docx':
      return extractDocx(nodeBuffer);
    case 'email':
      return extractMsg(buffer);
    default:
      throw new Error(`Unsupported file type for "${filename}" — only PDF, DOCX, MSG are accepted`);
  }
}
