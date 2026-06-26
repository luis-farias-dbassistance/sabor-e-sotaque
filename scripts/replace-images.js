/**
 * Script para buscar y reemplazar imágenes incongruentes en lessons.ts
 * usando la API de Unsplash.
 * 
 * Uso: node scripts/replace-images.js
 */

const UNSPLASH_ACCESS_KEY = 'BX_P6Cy1lUQ7dhVgMW5qgP0oB0v3OTjeeMTCPaS1ic4';
const UNSPLASH_API = 'https://api.unsplash.com';

// Mapa de lección ID -> términos de búsqueda en Unsplash
const SEARCH_TERMS = {
    "1-1": "restaurant host greeting guests warmly",
    "1-4": "restaurant digital menu QR code tablet",
    "2-1": "raw beef sirloin steak cut",
    "2-2": "picanha brazilian beef fat cap",
    "2-6": "well done cooked steak brown",
    "2-8": "side dishes vegetables separate bowls",
    "2-9": "dry aged beef meat hanging",
    "3-2": "pastel de choclo chilean corn pie baked",
    "4-1": "chacarero chilean sandwich steak green beans",
    "4-3": "raw seafood ceviche mariscos lime",
    "4-4": "gratinated clams cheese seafood",
    "4-7": "fish soup caldillo de congrio chowder",
    "5-2": "hotel wifi password sign",
    "5-5": "hotel extra towels bathroom",
    "5-6": "hotel check out reception desk",
    "5-8": "credit card payment terminal hand",
    "5-9": "extra warm blanket hotel bed",
    "5-10": "shower repair plumber bathroom",
    "6-3": "car seatbelt safety buckle",
    "6-5": "highway rest stop road trip",
    "6-9": "speed limit sign road",
    "7-1": "travel booking confirmation ticket",
    "7-4": "cancellation policy document travel",
    "7-5": "refund money credit card transaction",
    "7-6": "travel voucher ticket printed",
    "7-8": "travel insurance document passport",
    "7-10": "whatsapp chat mobile phone",
    "8-3": "tour guide group together walking",
    "8-6": "andean condor flying bird",
    "9-2": "tour bus voucher ticket boarding",
    "10-3": "hiking water bottle drink trail",
    "10-5": "leave no trace hiking pack trash",
    "10-8": "do not feed wildlife sign trail",
    "11-1": "horse riding helmet safety",
    "11-3": "horse reins hands holding",
    "11-4": "horses trail riding distance",
    "11-7": "calm horse riding balance rider",
    "11-9": "feeding horse hand treat",
    "11-10": "dismount horse getting off",
    "12-2": "id card deposit rental document",
    "12-3": "rental price sign shop equipment",
    "12-6": "rental equipment return shop store",
    "12-7": "rental agreement contract signing",
    "12-8": "cleaning ski equipment snow",
    "12-10": "receipt deposit refund paper",
    "13-2": "food allergy warning sign restaurant",
    "13-5": "restaurant tip service charge bill",
    "13-7": "asking for bill check restaurant waiter",
};

async function searchUnsplash(query) {
    const url = `${UNSPLASH_API}/search/photos?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
    });

    if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.results || [];
}

function buildImageUrl(photo) {
    // Usar raw URL y agregar nuestros parámetros
    const raw = photo.urls.raw;
    // Construir URL con nuestros parámetros
    return `${raw}&auto=format&fit=crop&w=800&q=80`;
}

async function main() {
    const lessons = Object.entries(SEARCH_TERMS);
    console.log(`🔍 Buscando imágenes para ${lessons.length} lecciones...\n`);

    const results = {};

    for (const [lessonId, query] of lessons) {
        process.stdout.write(`  [${lessonId}] Buscando: "${query}"... `);

        try {
            const photos = await searchUnsplash(query);

            if (photos.length === 0) {
                console.log('❌ Sin resultados');
                results[lessonId] = null;
            } else {
                const bestPhoto = photos[0];
                const imageUrl = buildImageUrl(bestPhoto);
                const description = bestPhoto.description || bestPhoto.alt_description || 'sin descripción';
                console.log(`✅ ${bestPhoto.id} - "${description.substring(0, 60)}"`);
                results[lessonId] = {
                    id: bestPhoto.id,
                    url: imageUrl,
                    description: description
                };
            }

            // Pequeña pausa para no rate-limit
            await new Promise(r => setTimeout(r, 300));
        } catch (error) {
            console.log(`❌ Error: ${error.message}`);
            results[lessonId] = null;
        }
    }

    console.log('\n📋 RESULTADOS FINALES - URLs para reemplazar:\n');

    for (const [lessonId, result] of Object.entries(results)) {
        if (result) {
            console.log(`  ${lessonId}: ${result.url}`);
        } else {
            console.log(`  ${lessonId}: [NO ENCONTRADO]`);
        }
    }

    // Guardar resultados en un archivo JSON
    const fs = require('fs');
    const path = require('path');
    const outputPath = path.join(__dirname, '..', 'replacements.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`\n📝 Resultados guardados en: ${outputPath}`);
}

main().catch(console.error);
