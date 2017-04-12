var print_results = false;
var insert_data = false;

var db = openDatabase('musictracker', '1.0', 'Music Tracker', 5*1024*1024);
db.transaction(function(tx) {
	console.log('creating tables');
	executeSql(tx, 'CREATE TABLE IF NOT EXISTS songs (id unique, title, url)');
	executeSql(tx, 'CREATE TABLE IF NOT EXISTS listens (date, id)');
});

if (insert_data) initSampleData(selectAllData);
else countListensByDate();//selectAllData();

function initSampleData(callback) {
	db.transaction(function(tx) {
		executeSql(tx, 'INSERT INTO songs (id, title, url) VALUES (?, ?, ?)', song);
		listens.forEach(function(listen, idx) {
			executeSql(tx, 'INSERT INTO listens (date, id) VALUES (?, ?)', [(new Date(listen[0])).toJSON(), listen[1]], (function(idx) {
				if (idx === listens.length-1) callback();
		  }).bind(null, idx));
		});
	});
}

function selectAllData() {
	db.transaction(function(tx) {
		executeSql(tx, 'SELECT * FROM songs', []);
		executeSql(tx, 'SELECT * FROM listens', []);
	});
}

function countListensByDate() {
	db.transaction(function(tx) {
		executeSql(tx, 'SELECT date, COUNT(id) FROM listens GROUP BY date', [], parseDates);
	});
}

function parseDates(results) {
	for (var i=0; i<results.rows.length; i++) {
		var date = results.rows.item(i).date;
		console.log('date', date, 'becomes', d3.isoParse(date));
	}
}

function executeSql(tx, sql, vals, success_callback, failure_callback) {
	tx.executeSql(sql, vals, success.bind(null, success_callback), failure.bind(null, failure_callback));
}

function success(callback, tx, results) {
	if (print_results) {
		console.log('success:');
		printRows(results);
  } else {
		console.log('success:', results);
  }
	if (callback) callback(results);
}

function failure(callback, tx, error) {
	console.log('error:', error);
	if (callback) callback(error);
}

function printRows(results) {
	for (var i=0; i<results.rows.length; i++) {
		console.log(i, results.rows.item(i));
	}
}
