import { INITIAL_DATA } from '@/lib/lessons';
import LessonClient from '@/components/LessonClient';

// Required for static export with dynamic routes
export function generateStaticParams() {
  return Object.keys(INITIAL_DATA).map((id) => ({ id }));
}

export default function LessonPage() {
  return <LessonClient />;
}
