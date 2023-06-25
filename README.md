# ako to spustit ???
Treba mat nainstalovane npm a docker.

## npm install
Treba spustit `npm install` vo folderoch shared, be, fe (kazdy je samostany npm projekt).

## konfiguracia (.env subory)
Foldery db, be, fe obsahuju konfiguracne subory. Ku kazdemu konfiguracnemu suboru existuje ukazkovy sample subor. Staci kazdy z tycho suborov skopirovat, defaultne hodnoty stacia na spustenie aplikacie.

Zoznam konfiguracnych suborov

- `db/db_password.txt`
- `be/.env`
- `fe/.env`

## prisma
Vo folderi be je potrebne spustit prikaz `npx prisma migrate dev`

## spustenie
db: `docker compose up`

be: `npm run start`

fe: `npm dev`