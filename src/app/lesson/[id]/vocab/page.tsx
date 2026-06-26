import { INITIAL_DATA } from '@/lib/lessons';
import VocabClient from './VocabClient';

export function generateStaticParams() {
  return Object.values(INITIAL_DATA)
    .filter(m => (m.vocabulary?.length ?? 0) > 0)
    .map(m => ({ id: m.id }));
}

export default async function VocabPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <VocabClient moduleId={id} />;
}
