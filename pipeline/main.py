import os
import re
from typing import Any

import arxiv
import requests
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


def _normalize_text(text: str) -> str:
    return " ".join(text.split())


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


@app.get("/scrape/courtlistener")
def scrape_courtlistener() -> dict[str, Any]:
    supabase = _get_supabase_client()
    headers = {"Authorization": f"Token {os.getenv('COURTLISTENER_API_TOKEN', '')}"}

    try:
        response = requests.get(
            "https://www.courtlistener.com/api/rest/v3/opinions/",
            params={"order_by": "-date_filed", "page_size": 20},
            headers=headers,
            timeout=30,
        )
        response.raise_for_status()
    except requests.RequestException as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Failed to fetch CourtListener opinions: {exc}",
        ) from exc

    payload = response.json()
    opinions = payload.get("results", []) if isinstance(payload, dict) else []

    rows_to_insert: list[dict[str, Any]] = []

    for opinion in opinions:
        if not isinstance(opinion, dict):
            continue

        case_name = _normalize_text(
            opinion.get("case_name")
            or opinion.get("case_name_full")
            or opinion.get("case_name_short")
            or "Unknown case"
        )

        opinion_text = _normalize_text(
            opinion.get("plain_text")
            or opinion.get("html")
            or opinion.get("html_with_citations")
            or opinion.get("snippet")
            or ""
        )

        if not opinion_text:
            continue

        rows_to_insert.append(
            {
                "prompt": f"Analyze this legal question: {case_name}",
                "response_a": opinion_text[:500],
                "response_b": opinion_text[:100],
                "source": "courtlistener",
                "domain": "legal",
                "quality_score": 90,
            }
        )

    if not rows_to_insert:
        return {"inserted": 0}

    try:
        insert_response = supabase.table("data_samples").insert(rows_to_insert).execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to insert rows: {exc}") from exc

    inserted_count = len(insert_response.data or [])
    return {"inserted": inserted_count}


@app.get("/scrape/federal-register")
def scrape_federal_register() -> dict[str, Any]:
    supabase = _get_supabase_client()

    try:
        response = requests.get(
            "https://www.federalregister.gov/api/v1/documents.json",
            params={"order": "newest", "per_page": 20},
            timeout=30,
        )
        response.raise_for_status()
    except requests.RequestException as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Failed to fetch Federal Register documents: {exc}",
        ) from exc

    payload = response.json()
    documents = payload.get("results", []) if isinstance(payload, dict) else []

    rows_to_insert: list[dict[str, Any]] = []

    for document in documents:
        if not isinstance(document, dict):
            continue

        title = _normalize_text(document.get("title") or "Untitled document")
        abstract = _normalize_text(document.get("abstract") or "")

        if not abstract:
            continue

        rows_to_insert.append(
            {
                "prompt": f"Analyze this legal question: {title}",
                "response_a": abstract[:500],
                "response_b": abstract[:100],
                "source": "federal-register",
                "domain": "legal",
                "quality_score": 88,
            }
        )

    if not rows_to_insert:
        return {"inserted": 0}

    try:
        insert_response = supabase.table("data_samples").insert(rows_to_insert).execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to insert rows: {exc}") from exc

    inserted_count = len(insert_response.data or [])
    return {"inserted": inserted_count}
