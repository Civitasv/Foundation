export function presentationUrl(courseId: string, trace: string, basePath = ""): string {
  return `${basePath.replace(/\/$/, "")}/courses/${encodeURIComponent(courseId)}/presentation/?trace=${encodeURIComponent(trace)}`;
}
