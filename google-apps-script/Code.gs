// ============================================================
//  RARIVELLE — Google Apps Script Auth Backend
//  Deploy as: Web App > Execute as: Me > Access: Anyone
// ============================================================

var SHEET_NAME = 'Users';

// ------ Sheet Bootstrap ------

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Write headers
    sheet.getRange(1, 1, 1, 5).setValues([[
      'userId', 'name', 'email', 'password', 'createdAt'
    ]]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// ------ Helpers ------

function generateId() {
  return 'rv-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getAllUsers(sheet) {
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return []; // Only headers or empty
  var headers = data[0];
  return data.slice(1).map(function(row) {
    var obj = {};
    headers.forEach(function(h, i) { obj[h] = row[i]; });
    return obj;
  });
}

// ------ doGet — handle GET requests ------
// Usage: ?action=getUser&userId=rv-xxx

function doGet(e) {
  try {
    var params = e.parameter || {};
    var action = params.action || '';

    if (action === 'getUser') {
      return handleGetUser(params);
    } else if (action === 'getProducts') {
      return handleGetProducts(params);
    } else if (action === 'getProduct') {
      return handleGetProduct(params);
    }

    return jsonResponse({ success: false, error: 'Unknown action: ' + action });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

function handleGetUser(params) {
  var userId = params.userId || '';
  if (!userId) {
    return jsonResponse({ success: false, error: 'userId is required' });
  }

  var sheet = getOrCreateSheet();
  var users = getAllUsers(sheet);
  var user = users.find(function(u) { return u.userId === userId; });

  if (!user) {
    return jsonResponse({ success: false, error: 'User not found' });
  }

  return jsonResponse({
    success: true,
    data: {
      userId: user.userId,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    }
  });
}

// ------ doPost — handle POST requests ------
// Body: { action: 'signup' | 'login', ... }

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var action = body.action || '';

    if (action === 'signup') {
      return handleSignup(body);
    } else if (action === 'login') {
      return handleLogin(body);
    } else if (action === 'createProduct') {
      return handleCreateProduct(body);
    } else if (action === 'updateProduct') {
      return handleUpdateProduct(body);
    } else if (action === 'deleteProduct') {
      return handleDeleteProduct(body);
    }

    return jsonResponse({ success: false, error: 'Unknown action: ' + action });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

function handleSignup(body) {
  var name = (body.name || '').trim();
  var email = (body.email || '').trim().toLowerCase();
  var password = (body.password || '').trim();

  if (!name || !email || !password) {
    return jsonResponse({ success: false, error: 'Name, email, and password are required.' });
  }
  if (password.length < 6) {
    return jsonResponse({ success: false, error: 'Password must be at least 6 characters.' });
  }

  var sheet = getOrCreateSheet();
  var users = getAllUsers(sheet);

  var existing = users.find(function(u) {
    return u.email === email;
  });
  if (existing) {
    return jsonResponse({ success: false, error: 'An account with this email already exists.' });
  }

  var userId = generateId();
  var createdAt = new Date().toISOString();

  sheet.appendRow([userId, name, email, password, createdAt]);

  return jsonResponse({
    success: true,
    data: {
      userId: userId,
      name: name,
      email: email,
      createdAt: createdAt
    }
  });
}

function handleLogin(body) {
  var email = (body.email || '').trim().toLowerCase();
  var password = (body.password || '').trim();

  if (!email || !password) {
    return jsonResponse({ success: false, error: 'Email and password are required.' });
  }

  var sheet = getOrCreateSheet();
  var users = getAllUsers(sheet);

  var user = users.find(function(u) {
    return u.email === email && u.password === password;
  });

  if (!user) {
    return jsonResponse({ success: false, error: 'Invalid email or password.' });
  }

  return jsonResponse({
    success: true,
    data: {
      userId: user.userId,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    }
  });
}

// ============================================================
//  PHASE 2B — Products / Listings Backend
//  Products sheet columns:
//  productId | sellerId | title | category | description | price |
//  condition | brand | year | location | images | status | createdAt
//  - images is stored as a JSON-encoded array of image URLs.
//  - status is one of: active | sold | delisted (no hard deletes).
// ============================================================

var PRODUCTS_SHEET_NAME = 'Products';
var PRODUCT_HEADERS = [
  'productId', 'sellerId', 'title', 'category', 'description', 'price',
  'condition', 'brand', 'year', 'location', 'images', 'status', 'createdAt'
];
var PRODUCT_STATUSES = ['active', 'sold', 'delisted'];
var HOUSE_SELLER_ID = 'rarivelle-house';

function getOrCreateProductsSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(PRODUCTS_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(PRODUCTS_SHEET_NAME);
    sheet.getRange(1, 1, 1, PRODUCT_HEADERS.length).setValues([PRODUCT_HEADERS]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function generateProductId() {
  return 'rv-p-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
}

function parseImagesCell(cell) {
  if (!cell || typeof cell !== 'string') return [];
  var trimmed = cell.trim();
  if (!trimmed) return [];
  try {
    var parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.filter(function(u) { return typeof u === 'string' && u; });
    }
  } catch (e) {}
  // Fallback: newline- or comma-separated URLs.
  return trimmed.split(/[\n,]+/).map(function(s) { return s.trim(); }).filter(function(s) { return !!s; });
}

function sanitizeImageUrls(images) {
  if (!Array.isArray(images)) return [];
  return images
    .map(function(u) { return String(u || '').trim(); })
    // URLs only — never persist data-URL / base64 payloads in Sheets.
    .filter(function(u) { return /^https?:\/\/.+/i.test(u); })
    .slice(0, 8);
}

// Map of userId -> display name for seller attribution.
function buildSellerNameMap() {
  var map = {};
  try {
    var usersSheet = getOrCreateSheet();
    var users = getAllUsers(usersSheet);
    users.forEach(function(u) { map[u.userId] = u.name; });
  } catch (e) {}
  map[HOUSE_SELLER_ID] = 'Rarivelle Salon';
  return map;
}

function serializeProduct(row, sellerNameById) {
  return {
    productId: row.productId,
    sellerId: row.sellerId,
    sellerName: sellerNameById[row.sellerId] || 'Private Collector',
    title: row.title,
    category: row.category,
    description: row.description,
    price: Number(row.price) || 0,
    condition: row.condition,
    brand: row.brand,
    year: row.year,
    location: row.location,
    images: parseImagesCell(row.images),
    status: row.status,
    createdAt: row.createdAt
  };
}

function getProductRows() {
  var sheet = getOrCreateProductsSheet();
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return { sheet: sheet, headers: PRODUCT_HEADERS, rows: [] };
  var headers = data[0];
  var rows = [];
  for (var r = 1; r < data.length; r++) {
    var obj = { __rowNum: r + 1 };
    headers.forEach(function(h, i) { obj[h] = data[r][i]; });
    if (obj.productId) rows.push(obj);
  }
  return { sheet: sheet, headers: headers, rows: rows };
}

function handleGetProducts(params) {
  var sellerId = (params.sellerId || '').trim();
  var status = (params.status || 'active').trim().toLowerCase();

  var result = getProductRows();
  var sellerNameById = buildSellerNameMap();

  var filtered = result.rows.filter(function(p) {
    if (sellerId && p.sellerId !== sellerId) return false;
    if (status === 'all') return true;
    if (PRODUCT_STATUSES.indexOf(status) === -1) return false;
    return String(p.status).toLowerCase() === status;
  });

  return jsonResponse({
    success: true,
    data: filtered.map(function(p) { return serializeProduct(p, sellerNameById); })
  });
}

function handleGetProduct(params) {
  var productId = (params.productId || '').trim();
  if (!productId) {
    return jsonResponse({ success: false, error: 'productId is required' });
  }

  var result = getProductRows();
  var found = null;
  result.rows.forEach(function(p) {
    if (p.productId === productId) found = p;
  });

  if (!found) {
    return jsonResponse({ success: false, error: 'Product not found' });
  }

  return jsonResponse({ success: true, data: serializeProduct(found, buildSellerNameMap()) });
}

function sellerExists(sellerId) {
  if (sellerId === HOUSE_SELLER_ID) return true;
  var usersSheet = getOrCreateSheet();
  var users = getAllUsers(usersSheet);
  return users.some(function(u) { return u.userId === sellerId; });
}

function handleCreateProduct(body) {
  var sellerId = (body.sellerId || '').trim();
  var title = (body.title || '').trim();
  var price = Number(body.price) || 0;

  if (!sellerId || !title || !price) {
    return jsonResponse({ success: false, error: 'sellerId, title, and price are required.' });
  }
  if (price <= 0) {
    return jsonResponse({ success: false, error: 'Price must be greater than zero.' });
  }
  if (!sellerExists(sellerId)) {
    return jsonResponse({ success: false, error: 'Unknown seller. Please sign in again.' });
  }

  var images = sanitizeImageUrls(body.images);
  if (images.length === 0) {
    images = ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop'];
  }

  var productId = generateProductId();
  var createdAt = new Date().toISOString();

  var row = [
    productId,
    sellerId,
    title,
    (body.category || '').trim(),
    (body.description || '').trim(),
    price,
    (body.condition || '').trim(),
    (body.brand || '').trim(),
    (body.year || '').toString().trim(),
    (body.location || '').trim(),
    JSON.stringify(images),
    'active',
    createdAt
  ];

  getOrCreateProductsSheet().appendRow(row);

  return jsonResponse({
    success: true,
    data: serializeProduct({
      productId: row[0], sellerId: row[1], title: row[2], category: row[3],
      description: row[4], price: row[5], condition: row[6], brand: row[7],
      year: row[8], location: row[9], images: row[10], status: row[11], createdAt: row[12]
    }, buildSellerNameMap())
  });
}

var PRODUCT_EDITABLE_FIELDS = [
  'title', 'category', 'description', 'price',
  'condition', 'brand', 'year', 'location', 'images', 'status'
];

function handleUpdateProduct(body) {
  var productId = (body.productId || '').trim();
  var sellerId = (body.sellerId || '').trim();

  if (!productId || !sellerId) {
    return jsonResponse({ success: false, error: 'productId and sellerId are required.' });
  }

  var result = getProductRows();
  var sheet = result.sheet;
  var headers = result.headers;
  var found = null;
  result.rows.forEach(function(p) {
    if (p.productId === productId) found = p;
  });

  if (!found) {
    return jsonResponse({ success: false, error: 'Product not found' });
  }
  if (found.sellerId !== sellerId) {
    return jsonResponse({ success: false, error: 'You do not own this listing.' });
  }

  var colIndex = {};
  headers.forEach(function(h, i) { colIndex[h] = i + 1; });

  PRODUCT_EDITABLE_FIELDS.forEach(function(field) {
    if (body[field] === undefined || body[field] === null) return;
    var value = body[field];
    if (field === 'price') {
      value = Number(value) || 0;
      if (value <= 0) return;
    } else if (field === 'images') {
      var urls = sanitizeImageUrls(value);
      if (urls.length === 0) return;
      value = JSON.stringify(urls);
    } else if (field === 'status') {
      value = String(value).trim().toLowerCase();
      if (PRODUCT_STATUSES.indexOf(value) === -1) return;
    } else {
      value = String(value).trim();
    }
    sheet.getRange(found.__rowNum, colIndex[field]).setValue(value);
    found[field] = value;
  });

  return jsonResponse({ success: true, data: serializeProduct(found, buildSellerNameMap()) });
}

// ============================================================
//  SEED — run once manually (Run > seedProducts) after deploying.
//  Inserts the 12 house catalog pieces (rv-101…rv-112) as
//  seller "rarivelle-house". Idempotent: skips existing IDs.
// ============================================================

function seedProducts() {
  var sheet = getOrCreateProductsSheet();
  var existing = {};
  getProductRows().rows.forEach(function(p) { existing[p.productId] = true; });

  var createdAt = new Date().toISOString();
  var seeds = [
    { id: 'rv-101', title: "Audemars Piguet Royal Oak 'Jumbo' Ref. 5402ST (A-Series)", category: 'Haute Horology', price: 118000, condition: 'Near Mint', brand: 'Audemars Piguet', year: '1972', location: 'Geneva, Switzerland', desc: 'A monument of twentieth-century industrial design penned by Gerald Genta. A-Series example with AP monogram at 6 o’clock, unpolished chamfers, original Gay Freres tapered bracelet and Audemars Piguet Archives Extract.', images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop'] },
    { id: 'rv-102', title: '1794 Flowing Hair Silver Dollar (Historic Early Federal Strike)', category: 'Rare Numismatics', price: 465000, condition: 'Museum Grade', brand: 'United States Mint', year: '1794', location: 'Philadelphia, PA, USA', desc: 'Among the most celebrated icons in American numismatics. Hand-struck at the inaugural Philadelphia mint in October 1794. PCGS authenticated with exquisite pewter-grey toning.', images: ['https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=1200&auto=format&fit=crop'] },
    { id: 'rv-103', title: 'The Great Gatsby - First Edition in Original 1925 Dust Jacket', category: 'First Editions & Manuscripts', price: 195000, condition: 'Excellent', brand: "Charles Scribner's Sons", year: '1925', location: 'Mayfair, London, UK', desc: 'The crowning masterpiece of the Jazz Age. First impression, first state with all six primary textual points. Retains the legendary pictorial dust jacket designed by Francis Cugat, unrestored.', images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200&auto=format&fit=crop'] },
    { id: 'rv-104', title: 'Cartier Art Deco Tutti Frutti Platinum & Carved Gem Bracelet', category: 'Haute Joaillerie', price: 320000, condition: 'Museum Grade', brand: 'Cartier', year: '1928', location: 'Place Vendome, Paris, France', desc: 'A sublime high-period jewel. Articulated platinum ribbon set with hand-carved Mughal-style emerald and ruby foliage, cabochon sapphires and old European-cut diamonds totalling approx. 16.50 carats. Signed Cartier Paris.', images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop'] },
    { id: 'rv-105', title: "Andy Warhol - Campbell's Soup I: Tomato (Hand-Signed 1968)", category: 'Fine Art & Lithographs', price: 98000, condition: 'Museum Grade', brand: 'Andy Warhol / Factory Additions', year: '1968', location: 'Upper East Side, New York, USA', desc: 'Color screenprint on smooth wove paper. Numbered 112/250 and hand-signed by Andy Warhol. Printed by Salvatore Silkscreen Co., New York. Pristine paper brightness, deckled margins intact.', images: ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?q=80&w=1200&auto=format&fit=crop'] },
    { id: 'rv-106', title: 'Patek Philippe Perpetual Calendar Chronograph Ref. 3970EJ', category: 'Haute Horology', price: 142000, condition: 'Near Mint', brand: 'Patek Philippe', year: '1991', location: 'Zurich, Switzerland', desc: 'Second-series execution in 18k yellow gold with solid screw-down caseback, silvered opaline dial and feuille hands. Lemania-derived CH 27-70 Q movement. Unpolished with deep Swiss hallmarks.', images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop'] },
    { id: 'rv-107', title: '1963 Ferrari 250 GTO Factory Blueprint & Scaglietti Dossier', category: 'Vintage Automobilia', price: 88000, condition: 'Excellent', brand: 'Ferrari / Carrozzeria Scaglietti', year: '1963', location: 'Modena, Italy', desc: 'Original cyanotype technical drawing of the lightweight aluminum aerodynamic chassis for chassis 4153GT, annotated by Giotto Bizzarrini and stamp-certified by Carrozzeria Scaglietti. With dyno sheets and logbook.', images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop'] },
    { id: 'rv-108', title: 'Roman Imperial Aureus of Caesar Augustus (Lugdunum Mint)', category: 'Antiquities & Relics', price: 74000, condition: 'Museum Grade', brand: 'Roman Empire', year: '2 BC', location: 'Rome, Italy', desc: 'Struck circa 2 BC - AD 4 at Lugdunum. Laureate head of Augustus; reverse honors Gaius and Lucius Caesar. Exceptional high-relief strike. NGC Ancients Choice VF.', images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=1200&auto=format&fit=crop'] },
    { id: 'rv-109', title: 'Leica M3 Double Stroke (First Production Batch #700244)', category: 'Rare Instruments & Optics', price: 36500, condition: 'Excellent', brand: 'Ernst Leitz Wetzlar', year: '1954', location: 'Wetzlar, Germany', desc: 'From the legendary initial run of 1,000 cameras (1954). Corner-screw top plate, glass pressure plate, Buddha-ear strap lugs, double-stroke advance. With matching 50mm f/2 Summicron collapsible lens.', images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1200&auto=format&fit=crop'] },
    { id: 'rv-110', title: '1959 Gibson Les Paul Standard "Burst" in Factory Sunburst', category: 'Rare Instruments & Optics', price: 335000, condition: 'Near Mint', brand: 'Gibson Guitars', year: '1959', location: 'Nashville, TN, USA', desc: 'Bookmatched figured flame maple top in original cherry sunburst nitrocellulose. Two original PAF humbuckers with untouched solder joints, bumblebee capacitors, Brazilian rosewood board. Original Lifton case.', images: ['https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?q=80&w=1200&auto=format&fit=crop'] },
    { id: 'rv-111', title: 'Edo Period Samurai Armor (Tosei Gusoku) with Dragon Crest', category: 'Antiquities & Relics', price: 62000, condition: 'Restored Historic', brand: 'Myochin School Armorer', year: '1740', location: 'Kyoto, Japan', desc: 'Ceremonial suit by a Myochin master. 32-plate russet iron kabuto with gilded copper dragon maedate, ressei menpo mask, black-lacquered scales in silk navy cord. Original storage chest.', images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?q=80&w=1200&auto=format&fit=crop'] },
    { id: 'rv-112', title: "Rene Lalique Amber Glass 'Tourbillons' Vase (Marcilhac #973)", category: 'Fine Art & Lithographs', price: 38500, condition: 'Near Mint', brand: 'Rene Lalique', year: '1926', location: 'Brussels, Belgium', desc: "Deeply molded undulating swirls with black enamel accents across cognac-amber crystal. Signed 'R. Lalique France'. No chips or restorations.", images: ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop'] }
  ];

  var inserted = 0;
  seeds.forEach(function(s) {
    if (existing[s.id]) return;
    sheet.appendRow([
      s.id, HOUSE_SELLER_ID, s.title, s.category, s.desc, s.price,
      s.condition, s.brand, s.year, s.location,
      JSON.stringify(s.images), 'active', createdAt
    ]);
    inserted++;
  });

  return inserted;
}

// Soft-delete: flips status to "delisted" instead of removing the row,
// preserving listing history.
function handleDeleteProduct(body) {
  var productId = (body.productId || '').trim();
  var sellerId = (body.sellerId || '').trim();

  if (!productId || !sellerId) {
    return jsonResponse({ success: false, error: 'productId and sellerId are required.' });
  }

  var result = getProductRows();
  var found = null;
  result.rows.forEach(function(p) {
    if (p.productId === productId) found = p;
  });

  if (!found) {
    return jsonResponse({ success: false, error: 'Product not found' });
  }
  if (found.sellerId !== sellerId) {
    return jsonResponse({ success: false, error: 'You do not own this listing.' });
  }

  var headers = result.headers;
  var colIndex = {};
  headers.forEach(function(h, i) { colIndex[h] = i + 1; });
  result.sheet.getRange(found.__rowNum, colIndex['status']).setValue('delisted');
  found.status = 'delisted';

  return jsonResponse({ success: true, data: serializeProduct(found, buildSellerNameMap()) });
}
