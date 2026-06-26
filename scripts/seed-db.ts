import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { INITIAL_DATA } from '../src/lib/lessons';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'us-east-1' }));
const TABLE_NAME = 'SaborSotaque-Lessons';

async function seed() {
  console.log('Starting to seed lessons into DynamoDB...');
  for (const module of Object.values(INITIAL_DATA)) {
    for (const lesson of module.lessons) {
      console.log(`Seeding lesson ${lesson.id} of module ${module.id}...`);
      await ddb.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          moduleId: module.id,
          lessonId: lesson.id,
          moduleTitle: module.title,
          moduleSubtitle: module.subtitle,
          phrase_pt: lesson.phrase_pt,
          phrase_es: lesson.phrase_es,
          context: lesson.context,
          imageUrl: lesson.imageUrl,
          createdAt: new Date().toISOString(),
        }
      }));
    }
  }
  console.log('Seeding completed successfully!');
}

seed().catch(err => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
