#!/usr/bin/env bash
# AUTHOR:   manawasp
# MAIL:     clovis.kyndt@gmail.com
# FILE:     test.sh
# ROLE:     TODO (some explanation)
# CREATED:  2014-11-14 08:00:36
# MODIFIED: 2014-11-14 23:57:41

curl -X POST -H "Content-Type: application/json" -d '{"password":"SuperMana59","email":"clovss.mna2@gmail.com"}' http://localhost:8080/sessions
echo ''