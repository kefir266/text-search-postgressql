# This is example of Postgres text search

To search the matches of company names used `tsvectors`
To build text search vectors was created the trigger thet put the unaccented name into `name_vectors_unaccent` column
The structure of table is as follows:

```sql
create table organizations
(
    id                    integer not null
        constraint organizations_pk
            primary key,
    name                  text,
    name_vectors_unaccent tsvector
);
```

### Migrations

migrations are provided in `./migrations.sql`

### Installation

```bash
npm install
```

### Run

```bash
npm start
```
