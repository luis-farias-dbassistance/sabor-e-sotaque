const fs = require('fs');
const path = require('path');

const lessonsPath = path.join(__dirname, '../src/lib/lessons.ts');
let content = fs.readFileSync(lessonsPath, 'utf8');

const replacements = {
    "8-3": "/images/lessons/8-3-tour-guide.png",
    "8-6": "/images/lessons/8-6-condor.png",
    "11-4": "/images/lessons/11-4-horses.png",
    "12-8": "/images/lessons/12-8-skiing.png"
};

let matchCount = 0;

for (const [id, newUrl] of Object.entries(replacements)) {
    const regex = new RegExp(`({ id: "${id}",[\\s\\S]*?imageUrl: ")(https?[^"]+)(" })`, 'g');
    if (regex.test(content)) {
        content = content.replace(regex, `$1${newUrl}$3`);
        matchCount++;
        console.log(`✅ Updated ${id} with ${newUrl}`);
    } else {
        console.log(`❌ Could not find/match ${id}`);
    }
}

fs.writeFileSync(lessonsPath, content, 'utf8');
console.log(`\nDone! Updated ${matchCount} adventure image URLs.`);
