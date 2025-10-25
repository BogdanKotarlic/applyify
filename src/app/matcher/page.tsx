"use client";

import { useState, useRef } from "react";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import Spinner from "@/components/ui/spinner";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type InputBlockProps = {
  label: string;
  text: string;
  fileName: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onTextChange: (val: string) => void;
  onFileNameChange: (val: string) => void;
  onReset: () => void;
  showError: boolean;
};

function TextOrFileInput({
  label,
  text,
  fileName,
  inputRef,
  onTextChange,
  onFileNameChange,
  onReset,
  showError,
}: InputBlockProps) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onFileNameChange(file.name);
    onTextChange("");

    const reader = new FileReader();
    reader.onload = () => {
      onTextChange(reader.result as string);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>
          {label} <span className="text-red-500">*</span>
        </Label>
        <Button
          className="cursor-pointer"
          type="button"
          variant="outline"
          size="sm"
          onClick={onReset}
        >
          Reset
        </Button>
      </div>
      <Textarea
        value={fileName ? "" : text}
        onChange={(e) => {
          onTextChange(e.target.value);
          onFileNameChange("");
        }}
        placeholder={`Paste your ${label.toLowerCase()} here`}
        className="min-h-[350px]"
        disabled={!!fileName}
      />
      {fileName && (
        <p className="text-sm text-muted-foreground italic">
          Uploaded: {fileName}
        </p>
      )}
      {showError && !text && !fileName && (
        <p className="text-sm text-red-500">{label} is required</p>
      )}
      <Input
        ref={inputRef}
        type="file"
        accept=".txt, .docx, .pdf"
        onChange={handleFileUpload}
      />
    </div>
  );
}

export default function MatcherPage() {
  const { loading } = useAuthRedirect();
  const [resumeText, setResumeText] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [jobText, setJobText] = useState("");
  const [jobFileName, setJobFileName] = useState("");
  const [result, setResult] = useState<null | {
    score: number;
    improvements: string[];
    missing: string[];
  }>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [loadingCompare, setLoadingCompare] = useState(false);
  const [apiError, setApiError] = useState("");

  const resumeInputRef = useRef<HTMLInputElement>(null);
  const jobInputRef = useRef<HTMLInputElement>(null);

  const handleCompare = async () => {
    const isValid =
      (resumeText.trim() || resumeFileName) && (jobText.trim() || jobFileName);
    setShowErrors(true);
    setApiError("");
    if (!isValid) return;

    setResult(null);
    setLoadingCompare(true);

    try {
      const res = await fetch("/api/matcher", {
        method: "POST",
        body: JSON.stringify({ resume: resumeText, job: jobText }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error("Something went wrong.");
      setResult(data);
    } catch {
      setApiError("Something went wrong, please try again.");
    } finally {
      setLoadingCompare(false);
    }
  };

  return (
    <ProtectedLayout>
      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Matcher</h1>
            <p className="text-muted-foreground text-sm max-w-5xl mx-auto">
              Paste or upload your CV and a job description to receive a match
              score. This is currently optimized for IT jobs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <TextOrFileInput
              label="Resume"
              text={resumeText}
              fileName={resumeFileName}
              inputRef={resumeInputRef}
              onTextChange={setResumeText}
              onFileNameChange={setResumeFileName}
              onReset={() => {
                setResumeText("");
                setResumeFileName("");
                if (resumeInputRef.current) resumeInputRef.current.value = "";
              }}
              showError={showErrors}
            />

            <TextOrFileInput
              label="Job Description"
              text={jobText}
              fileName={jobFileName}
              inputRef={jobInputRef}
              onTextChange={setJobText}
              onFileNameChange={setJobFileName}
              onReset={() => {
                setJobText("");
                setJobFileName("");
                if (jobInputRef.current) jobInputRef.current.value = "";
              }}
              showError={showErrors}
            />
          </div>

          <div className="flex justify-center gap-4 items-center">
            <Button
              className="cursor-pointer"
              onClick={handleCompare}
              disabled={loadingCompare}
            >
              {loadingCompare ? <Spinner /> : "Compare Now"}
            </Button>
          </div>

          {apiError && (
            <p className="text-center text-sm text-red-500">{apiError}</p>
          )}

          <div className="mt-6 space-y-4 border-t pt-6 min-h-[200px]">
            {loadingCompare ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 w-1/3 bg-muted rounded" />
                <div className="h-3 w-2/3 bg-muted rounded" />
                <div className="h-3 w-1/2 bg-muted rounded" />
                <div className="h-4 w-1/4 bg-muted rounded mt-4" />
                <div className="h-3 w-3/4 bg-muted rounded" />
                <div className="h-3 w-2/5 bg-muted rounded" />
              </div>
            ) : result ? (
              <>
                <p className="text-sm">
                  Score: <strong>{result.score}%</strong>
                </p>
                <div>
                  <p className="font-medium">What is Missing:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {result.missing.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Suggestions to Improve:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {result.improvements.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Fill in the details and click Compare to see results here.
              </p>
            )}
          </div>
        </div>
      )}
    </ProtectedLayout>
  );
}
