import os
import re
from typing import Any

import arxiv
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from supabase import Client, create_client

app = FastAPI()
load_dotenv()

ARXIV_TOPICS = [
    "large language models RLHF",
    "instruction tuning language models",
    "AI alignment human feedback",
]


def _get_supabase_client() -> Client:
    supabase_url = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    supabase_key = (
        os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        or os.getenv("SUPABASE_ANON_KEY")
        or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    )

    if not supabase_url or not supabase_key:
        raise HTTPException(
            status_code=500,
            detail="Missing Supabase environment variables (SUPABASE_URL and key).",
        )

    return create_client(supabase_url, supabase_key)


def _first_sentence(text: str) -> str:
    cleaned = " ".join(text.split())
    match = re.search(r"^(.+?[.!?])(?:\s|$)", cleaned)
    return match.group(1) if match else cleaned


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/scrape/arxiv")
def scrape_arxiv() -> dict[str, Any]:
    client = arxiv.Client()
    supabase = _get_supabase_client()

    rows_to_insert: list[dict[str, Any]] = []
    seen_titles: set[str] = set()

    for topic in ARXIV_TOPICS:
        search = arxiv.Search(
            query=topic,
            max_results=10,
            sort_by=arxiv.SortCriterion.Relevance,
        )

        for paper in client.results(search):
            title = " ".join(paper.title.split())
            abstract = " ".join(paper.summary.split())

            if not title or not abstract:
                continue

            title_key = title.lower()
            if title_key in seen_titles:
                continue
            seen_titles.add(title_key)

            rows_to_insert.append(
                {
                    "prompt": f"Explain this research: {title}",
                    "response_a": abstract,
                    "response_b": _first_sentence(abstract),
                    "source": "arxiv",
                    "domain": "technical",
                    "quality_score": 85,
                }
            )

    if not rows_to_insert:
        return {"inserted": 0}

    try:
        response = supabase.table("data_samples").insert(rows_to_insert).execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to insert rows: {exc}") from exc

    inserted_count = len(response.data or [])
    return {"inserted": inserted_count}
