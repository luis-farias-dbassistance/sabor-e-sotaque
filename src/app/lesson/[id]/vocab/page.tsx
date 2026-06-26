import { INITIAL_DATA } from '@/lib/lessons';
import VocabClient from './VocabClient';

export function generateStaticParams() {
  return Object.values(INITIAL_DATA)
    .filter(m => (m.vocabulary?.length ?? 0) > 0)
    .map(m => ({ id: m.id }));
}

export default function VocabPage({ params }: { params: { id: string } }) {
  return <VocabClient moduleId={params.id} />;
}
