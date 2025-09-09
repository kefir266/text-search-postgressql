ALTER TABLE organizations
    ADD COLUMN name_vectors_unaccent tsvector;


CREATE FUNCTION organizations_name_vectors_update() RETURNS trigger AS $$
BEGIN
  NEW.name_vectors_unaccent :=
    to_tsvector('english', unaccent(coalesce(NEW.name, '')));
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER organizations_name_vectors_trigger
    BEFORE INSERT OR UPDATE OF name
                     ON organizations
                         FOR EACH ROW EXECUTE FUNCTION organizations_name_vectors_update();


create index name_vectors_unaccent_idx on organizations using gist(name_vectors_unaccent);