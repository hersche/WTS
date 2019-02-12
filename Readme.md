## This is a very short-developed webtorrent-seeder for permanent servers

THIS PROJECT IS VERY UNPROPER!

It's

- my first expirience with Node / serverside-JS / express-JS
- a thing i was waiting for, but i did not found it
- a short work and learn of ~15h (will increase for quality, maybe)
- a additional to LaraTube

Ideas

- Place encoding for video-files there
- After upload, be able to place it directly into the wanted service (eg create the video in PeerTube/LaraTube) (Oauth2-stage)

Try it with 

>   node server.js
  
## Quick install

>  npm install
  
(i needed sudo as well, also when this is bad practice)

Then, create a config.js-file with config.example.js

## Auth-idea 

Final: Oauth2

Via base-auth on nginx for a first.

A config like this does the trick:

>  location / {
>
>    proxy_pass  http://127.0.0.1:8001;
>
>    proxy_set_header Host $host;
>
>    proxy_cache_bypass $http_upgrade;
>
>  }
>
>  location /upload {
>
>    auth_basic "The password, you must enter.";
>
>    auth_basic_user_file /etc/nginx/htpasswd;
>
>    proxy_pass  http://127.0.0.1:8001;
>
>    proxy_set_header Host $host;
>
>    proxy_cache_bypass $http_upgrade;
>
>  }
>
>  location /delete {
>
>    auth_basic "The password, you must enter.";
>
>    auth_basic_user_file /etc/nginx/htpasswd;
>
>    proxy_pass  http://127.0.0.1:8001;
>
>    proxy_set_header Host $host;
>
>    proxy_cache_bypass $http_upgrade;
>
>  }


Then, generate a usual htpasswd-file on /etc/nginx/htpasswd.

This way, the list is public avaible while all changing actions are restricted.

If you protect / as well, i guess it breaks the downloads from other sources.