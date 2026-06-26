<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Procedures
Whenever new phrases are added or existing phrases are modified in `src/lib/lessons.ts`, you MUST ALWAYS:
1. Sync the updated data with DynamoDB by running: `npx tsx scripts/seed-db.ts`
2. Generate or update the Polly audio for the new/modified phrases by running: `npm run generate-audio`
