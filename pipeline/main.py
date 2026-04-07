from fastapi import FastAPI

app = FastAPI()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/scrape")
def scrape():
    return {"message": "Scrape endpoint ready"}
