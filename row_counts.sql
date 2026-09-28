DO $$
DECLARE
    r RECORD;
BEGIN
    DROP TABLE IF EXISTS row_counts;
    CREATE TEMP TABLE row_counts (table_name text, row_count bigint);
    FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename LOOP
        EXECUTE format('INSERT INTO row_counts SELECT %L, count(*) FROM %I', r.tablename, r.tablename);
    END LOOP;
END $$;
SELECT * FROM row_counts ORDER BY table_name;
