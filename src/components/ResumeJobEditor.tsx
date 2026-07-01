import { saveDocuments } from "@/app/actions/documentActions";

type ResumeJobEditorProps = {
  initialResumeText: string;
  initialJobDescriptionText: string;
};

export function ResumeJobEditor({
  initialResumeText,
  initialJobDescriptionText,
}: ResumeJobEditorProps) {
  return (
    <form action={saveDocuments}>
      <div>
        <label htmlFor="resumeText">Resume</label>
        <textarea
          id="resumeText"
          name="resumeText"
          defaultValue={initialResumeText}
          rows={16}
        />
      </div>

      <div>
        <label htmlFor="jobDescriptionText">Job Description</label>
        <textarea
          id="jobDescriptionText"
          name="jobDescriptionText"
          defaultValue={initialJobDescriptionText}
          rows={16}
        />
      </div>

      <button type="submit">Save</button>
    </form>
  );
}