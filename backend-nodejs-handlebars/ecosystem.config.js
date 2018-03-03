module.exports = {
  apps : [{
    "name"        : "book_editor",
    "script"      : "./index.js",
    "log_file"        : "/opt/app/pm2.log",
	"log_date_format" : "YYYY-MM-DD HH:mm:ss",
	"merge_logs"      : true,
	"autorestart" : false,
    "watch"       : ["app", "index.js"],
	"watch_options": {
		"usePolling": true
	}
  }]
}