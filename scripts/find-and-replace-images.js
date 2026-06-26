/**
 * Script FINAL para buscar imágenes en Unsplash y actualizar lessons.ts
 * 
 * La API de Unsplash tiene rate limit de 50 requests/hora para keys gratuitas.
 * Este script:
 * 1. Busca imágenes para cada concepto incongruente
 * 2. Guarda resultados parciales en replacements.json
 * 3. Cuando todas las búsquedas están completas, genera los comandos sed
 *    para actualizar lessons.ts
 * 
 * Uso: node scripts/find-and-replace-images.js
 * 
 * Si se interrumpe por rate limit, espera una hora y ejecuta de nuevo.
 */

const UNSPLASH_ACCESS_KEY = 'BX_P6Cy1lUQ7dhVgMW5qgP0oB0v3OTjeeMTCPaS1ic4';
const UNSPLASH_API = 'https://api.unsplash.com';
const fs = require('fs');
const path = require('path');

// Mapa de lección ID -> términos de búsqueda
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

// Mapa de lección ID -> vieja URL (para hacer el reemplazo)
const OLD_URLS = {
    "1-1": "https://images.unsplash.com/photo-1552566626-52f8b828add9",
    "1-4": "https://images.unsplash.com/photo-1552566626-52f8b828add9",
    "2-1": "https://images.unsplash.com/photo-1544025162-d76694265947",
    "2-2": "https://images.unsplash.com/photo-1546964124-0cce460f38ef",
    "2-6": "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
    "2-8": "https://images.unsplash.com/photo-1606787366850-de6330128bfc",
    "2-9": "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db",
    "3-2": "https://images.unsplash.com/photo-1587314168485-3236d6710814",
    "4-1": "https://images.unsplash.com/photo-1509722747041-616f39b57569",
    "4-3": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb",
    "4-4": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5",
    "4-7": "https://images.unsplash.com/photo-1547592180-85f173990554",
    "5-2": "https://images.unsplash.com/photo-1543269865-cbf427effbad",
    "5-5": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af",
    "5-6": "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
    "5-8": "https://images.unsplash.com/photo-1556740738-b6a63e27c4df",
    "5-9": "https://images.unsplash.com/photo-1540518614846-7eded433c457",
    "5-10": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a",
    "6-3": "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98",
    "6-5": "https://images.unsplash.com/photo-1527018601619-a508a2be00cd",
    "6-9": "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d",
    "7-1": "https://images.unsplash.com/photo-1506784983877-45594efa4cbe",
    "7-4": "https://images.unsplash.com/photo-1508962914676-134849a727f0",
    "7-5": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44",
    "7-6": "https://images.unsplash.com/photo-1555421689-491a97ff2040",
    "7-8": "https://images.unsplash.com/photo-1450133064473-71024230f91b",
    "7-10": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",
    "8-3": "https://images.unsplash.com/photo-1539635278303-d4002c07eae3",
    "8-6": "https://images.unsplash.com/photo-1465101162946-4377e57745c3",
    "9-2": "https://images.unsplash.com/photo-1528605248644-14dd04022da1",
    "10-3": "https://images.unsplash.com/photo-1510563800743-aed236490d08",
    "10-5": "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9",
    "10-8": "https://images.unsplash.com/photo-1504470695779-75300268aa0e",
    "11-1": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
    "11-3": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
    "11-4": "https://images.unsplash.com/photo-1598974357801-cbca100e65d3",
    "11-7": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1",
    "11-9": "https://images.unsplash.com/photo-1534447677768-be436bb09401",
    "11-10": "https://images.unsplash.com/photo-1598974357801-cbca100e65d3",
    "12-2": "https://images.unsplash.com/photo-1556740758-90de374c12ad",
    "12-3": "https://images.unsplash.com/photo-1556742111-a301076d9d18",
    "12-6": "https://images.unsplash.com/photo-1508962914676-134849a727f0",
    "12-7": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f",
    "12-8": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
    "12-10": "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23",
    "13-2": "https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf",
    "13-5": "https://images.unsplash.com/photo-1580828343064-fde4fc206bc6",
    "13-7": "https://images.unsplash.com/photo-1556740738-b6a63e27c4df",
};

async function searchUnsplash(query) {
    const url = `${UNSPLASH_API}/search/photos?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`${response.status}: ${text}`);
    }

    const data = await response.json();
    return data.results || [];
}

function buildImageUrl(photo) {
    const raw = photo.urls.raw;
    return `${raw}&auto=format&fit=crop&w=800&q=80`;
}

async function main() {
    const resultsPath = path.join(__dirname, '..', 'replacements.json');
    let results = {};

    // Cargar resultados previos
    if (fs.existsSync(resultsPath)) {
        try {
            results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
            console.log(`📂 Cargados ${Object.keys(results).length} resultados previos`);
        } catch (e) { }
    }

    const lessons = Object.entries(SEARCH_TERMS);
    let pending = lessons.filter(([id]) => !results[id] || results[id] === null);

    console.log(`🔍 Buscando imágenes para ${pending.length} lecciones pendientes...\n`);

    for (const [lessonId, query] of lessons) {
        if (results[lessonId] && results[lessonId] !== null) {
            continue;
        }

        process.stdout.write(`  [${lessonId}] "${query}"... `);

        try {
            const photos = await searchUnsplash(query);

            if (photos.length === 0) {
                console.log('❌ Sin resultados');
                results[lessonId] = null;
            } else {
                const bestPhoto = photos[0];
                const imageUrl = buildImageUrl(bestPhoto);
                const desc = bestPhoto.description || bestPhoto.alt_description || 'sin descripción';
                console.log(`✅ ${imageUrl.substring(0, 70)}...`);
                results[lessonId] = {
                    id: bestPhoto.id,
                    url: imageUrl,
                    description: desc.substring(0, 100)
                };
            }

            fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
            await new Promise(r => setTimeout(r, 600));
        } catch (error) {
            console.log(`❌ ${error.message.substring(0, 60)}`);
            if (error.message.includes('403') || error.message.includes('Rate Limit')) {
                console.log('\n⚠️ Rate limit alcanzado. Guardando progreso...');
                fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
                console.log('   Ejecuta este script de nuevo en una hora para continuar.');
                process.exit(0);
            }
            results[lessonId] = null;
            fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
        }
    }

    // Si llegamos aquí, todas las búsquedas están completas
    console.log('\n✅ TODAS LAS BÚSQUEDAS COMPLETADAS\n');
    console.log('📋 Comandos sed para actualizar lessons.ts:\n');

    const lessonsPath = path.join(__dirname, '..', 'src', 'lib', 'lessons.ts');
    let content = fs.readFileSync(lessonsPath, 'utf-8');
    let modifiedContent = content;

    for (const [lessonId, result] of Object.entries(results)) {
        if (result && result.url) {
            const oldUrl = OLD_URLS[lessonId];
            if (oldUrl && modifiedContent.includes(oldUrl)) {
                // Escapar caracteres especiales para sed
                const escapedOld = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const escapedNew = result.url.replace(/[&/\\]/g, '\\$&');
                modifiedContent = modifiedContent.replace(oldUrl, result.url);
                console.log(`✅ ${lessonId}: reemplazado`);
            } else {
                console.log(`⚠️ ${lessonId}: URL antigua no encontrada en el archivo`);
            }
        } else {
            console.log(`❌ ${lessonId}: [PENDIENTE - sin reemplazo]`);
        }
    }

    // Guardar el archivo modificado
    fs.writeFileSync(lessonsPath, modifiedContent);
    console.log(`\n📝 Archivo lessons.ts actualizado en: ${lessonsPath}`);
}

main().catch(console.error);
