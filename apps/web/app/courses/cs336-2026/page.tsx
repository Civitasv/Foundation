import type { Metadata } from "next";
import { CourseJournal } from "../../../components/course-journal";
import course from "../../../../../content/courses/cs336-2026/course.json";

export const metadata: Metadata = {
  title: `${course.title["zh-CN"]} — Foundation`,
  description: course.description["zh-CN"]
};

export default function Page() {
  return <CourseJournal locale="zh-CN" />;
}
