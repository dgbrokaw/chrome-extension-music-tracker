var db = openDatabase('musictracker', '1.0', 'Music Tracker', 5*1024*1024);
db.transaction(function(tx) {
	console.log('creating tables');
  tx.executeSql('CREATE TABLE IF NOT EXISTS songs (id unique, title, url)', null, function(tx, results) {
		console.log('success:', results);
	}, function(tx, error) {
		console.log('error:', error);
	});
  tx.executeSql('CREATE TABLE IF NOT EXISTS listens (date, id)', null, function(tx, results) {
		console.log('success:', results);
	}, function(tx, error) {
		console.log('error:', error);
	});
});

// initSampleData(db);

setTimeout(function() {
	console.log('going to try something now...');
	db.transaction(function(tx) {
		tx.executeSql('SELECT * FROM songs', [], function(tx, results) {
			console.log(results);
		});
		tx.executeSql('SELECT * FROM listens', [], function(tx, results) {
			console.log(results);
		});
	});
}, 3000);

function initSampleData(db) {
	var song = ['gfAHzU1vgGI', '_BLADEE_SUBARU_', 'https://www.youtube.com/watch?v=gfAHzU1vgGI']
	var listens = [ ['Wed Mar 01 2017', 'gfAHzU1vgGI']
	              , ['Thu Mar 02 2017', 'gfAHzU1vgGI']
	              , ['Fri Mar 03 2017', 'gfAHzU1vgGI']
	              , ['Fri Mar 03 2017', 'gfAHzU1vgGI']
	              , ['Fri Mar 03 2017', 'gfAHzU1vgGI']
	              , ['Sat Mar 04 2017', 'gfAHzU1vgGI']
	              , ['Sat Mar 04 2017', 'gfAHzU1vgGI']
	              , ['Sat Mar 04 2017', 'gfAHzU1vgGI']
	              , ['Sat Mar 04 2017', 'gfAHzU1vgGI']
	              , ['Sat Mar 04 2017', 'gfAHzU1vgGI']
	              , ['Fri Mar 10 2017', 'gfAHzU1vgGI']
	              , ['Sat Mar 11 2017', 'gfAHzU1vgGI']
	              , ['Sat Mar 11 2017', 'gfAHzU1vgGI']
	              , ['Sat Mar 11 2017', 'gfAHzU1vgGI']
	              , ['Sun Mar 12 2017', 'gfAHzU1vgGI']
	              , ['Mon Mar 13 2017', 'gfAHzU1vgGI']
	              , ['Tue Mar 14 2017', 'gfAHzU1vgGI']
	              , ['Tue Mar 14 2017', 'gfAHzU1vgGI']
	              , ['Wed Mar 15 2017', 'gfAHzU1vgGI']
	              , ['Thu Mar 16 2017', 'gfAHzU1vgGI']
	              , ['Fri Mar 17 2017', 'gfAHzU1vgGI']
	              , ['Fri Mar 17 2017', 'gfAHzU1vgGI']
	              , ['Fri Mar 17 2017', 'gfAHzU1vgGI']
	              , ['Mon Mar 20 2017', 'gfAHzU1vgGI']
	              , ['Mon Mar 20 2017', 'gfAHzU1vgGI']
	              , ['Wed Mar 22 2017', 'gfAHzU1vgGI']
	              , ['Thu Mar 23 2017', 'gfAHzU1vgGI']
	              , ['Fri Mar 24 2017', 'gfAHzU1vgGI']
	              , ['Sat Mar 25 2017', 'gfAHzU1vgGI']
	              , ['Sat Mar 25 2017', 'gfAHzU1vgGI']
	              , ['Sat Mar 25 2017', 'gfAHzU1vgGI'] ];

	db.transaction(function(tx) {
		console.log('inserting song');
		tx.executeSql('INSERT INTO songs (id, title, url) VALUES (?, ?, ?)', song, function(tx, results) {
			console.log('success:', results);
		}, function(tx, error) {
			console.log('error:', error);
		});

		console.log('inserting listens');
		listens.forEach(function(listen) {
			console.log('inserting:', [(new Date(listen[0])).toJSON(), listen[1]]);
			tx.executeSql('INSERT INTO listens (date, id) VALUES (?, ?)', [(new Date(listen[0])).toJSON(), listen[1]], function(tx, results) {
				console.log('success:', results);
			}, function(tx, error) {
				console.log('error:', error);
			});
		});
	});
}
