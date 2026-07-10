'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Box = 'terms' | 'correspondence';

const SUGGESTED_PROMPTS = [
  'Have I been delayed?',
  'Am I entitled to extra time?',
  'Am I entitled to a variation?',
];

async function uploadFile(submissionId: string, box: Box, file: File) {
  const form = new FormData();
  form.append('file', file);
  form.append('submissionId', submissionId);
  form.append('box', box);
  const res = await fetch('/claim-score/api/upload', { method: 'POST', body: form });
  if (!res.ok) throw new Error(`Upload failed for ${file.name}`);
}

function UploadBox({
  label,
  submissionId,
  box,
  files,
  setFiles,
}: {
  label: string;
  submissionId: string;
  box: Box;
  files: string[];
  setFiles: (names: string[]) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      for (const file of selected) {
        await uploadFile(submissionId, box, file);
      }
      setFiles([...files, ...selected.map((f) => f.name)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  }

  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-6">
      <label className="block cursor-pointer text-center text-sm text-slate-500">
        {busy ? 'Uploading…' : `${label} — click to upload (PDF, DOCX, MSG)`}
        <input
          type="file"
          accept=".pdf,.docx,.doc,.msg"
          multiple
          className="hidden"
          onChange={handleChange}
          disabled={busy}
        />
      </label>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      {files.length > 0 && (
        <ul className="mt-3 space-y-1 text-left text-xs text-slate-600">
          {files.map((name, i) => (
            <li key={`${name}-${i}`}>✓ {name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function UploadForm({ submissionId }: { submissionId: string }) {
  const router = useRouter();
  const [termsFiles, setTermsFiles] = useState<string[]>([]);
  const [correspondenceFiles, setCorrespondenceFiles] = useState<string[]>([]);
  const [question, setQuestion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalFiles = termsFiles.length + correspondenceFiles.length;
  const canSubmit = totalFiles > 0 && question.trim().length > 0 && !submitting;

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/claim-score/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId, userQuestion: question }),
      });
      if (!res.ok) throw new Error('Processing failed — please try again');
      router.push(`/claim-score/results/${submissionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-8 space-y-6">
      <UploadBox
        label="Subcontract T&Cs"
        submissionId={submissionId}
        box="terms"
        files={termsFiles}
        setFiles={setTermsFiles}
      />
      <UploadBox
        label="Correspondence / other documents"
        submissionId={submissionId}
        box="correspondence"
        files={correspondenceFiles}
        setFiles={setCorrespondenceFiles}
      />

      <div>
        <label className="block text-sm font-medium text-slate-700">
          What do you want to know?
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setQuestion(p)}
              className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-600 hover:bg-slate-50"
            >
              {p}
            </button>
          ))}
        </div>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. Have I been delayed?"
          rows={3}
          className="mt-2 w-full rounded-md border border-slate-300 p-3 text-sm"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full rounded-md bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-40"
      >
        {submitting ? 'Scoring your claim… this can take a few minutes' : 'Submit for scoring'}
      </button>
    </div>
  );
}
