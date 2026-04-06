ALTER TABLE datasets
ADD COLUMN IF NOT EXISTS download_count integer DEFAULT 0;
