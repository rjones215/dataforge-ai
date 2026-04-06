DELETE FROM datasets
WHERE title IN (
  'Technical NLP Preference Pairs',
  'Government Document Pairs',
  'Code Review Preferences',
  'ArXiv AI Research Pairs',
  'Stack Overflow Q&A Pairs',
  'Legal Document Preferences'
);

INSERT INTO datasets (title, description, category, domain, size, price, quality_score, file_url) VALUES
('Technical NLP Preference Pairs', 'High-quality RLHF preference pairs from ML communities', 'nlp', 'technical', 5000, 49.00, 87.0, '#'),
('Government Document Pairs', 'Preference pairs from federal policy and regulatory documents', 'government', 'government', 3200, 79.00, 91.0, '#'),
('Code Review Preferences', 'Accepted vs rejected code review responses from Stack Overflow', 'coding', 'coding', 4100, 59.00, 83.0, '#'),
('ArXiv AI Research Pairs', 'Instruction-response pairs from AI research paper abstracts', 'nlp', 'technical', 2800, 39.00, 78.0, '#'),
('Stack Overflow Q&A Pairs', 'Top vs bottom answer preference pairs across dev topics', 'coding', 'coding', 6200, 49.00, 85.0, '#'),
('Legal Document Preferences', 'Expert-curated legal language preference pairs', 'legal', 'government', 1900, 99.00, 94.0, '#');
