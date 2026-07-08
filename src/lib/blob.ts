import { put } from '@vercel/blob';

// Vercel Blob storage for Claim Score document uploads. Path convention
// mirrors the SharePoint Incoming/Processed pattern from the scoping doc:
// claim-score/{submissionId}/{box}/{filename}
export async function uploadSubmissionFile(
  submissionId: string,
  box: string,
  file: File,
) {
  return put(`claim-score/${submissionId}/${box}/${file.name}`, file, {
    access: 'public',
    addRandomSuffix: true,
  });
}
