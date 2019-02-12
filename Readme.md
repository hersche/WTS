## This is a very short-developed webtorrent-seeder for permanent servers

Try it with 
  
  node server.js
  
## Quick install

  npm install

(i needed sudo as well, also when this is bad practice)

Then, create a config.js-file with config.example.js

## Auth-idea 

Via base-auth on nginx for a first.

A config like this does the trick:

  location / {
    proxy_pass  http://127.0.0.1:8001;
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
  location /upload {
    auth_basic "The password, you must enter.";
    auth_basic_user_file /etc/nginx/htpasswd;
    proxy_pass  http://127.0.0.1:8001;
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
  location /delete {
    auth_basic "The password, you must enter.";
    auth_basic_user_file /etc/nginx/htpasswd;
    proxy_pass  http://127.0.0.1:8001;
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

Then, generate a usual htpasswd-file on /etc/nginx/htpasswd.

This way, the list is public avaible while all changing actions are restricted.

If you protect / as well, i guess it breaks the downloads from other sources.
