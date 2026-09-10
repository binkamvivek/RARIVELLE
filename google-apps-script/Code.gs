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
