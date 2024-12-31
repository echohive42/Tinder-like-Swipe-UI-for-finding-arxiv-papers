from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import arxiv
from termcolor import colored
import uvicorn

app = FastAPI()

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", response_class=HTMLResponse)
async def read_root():
    try:
        print(colored("Serving index page", "green"))
        with open("static/index.html", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        print(colored(f"Error serving index page: {str(e)}", "red"))
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/papers/{query}")
async def get_papers(query: str, start: int = 0):
    try:
        print(colored(f"Fetching papers for query: {query} from index {start}", "cyan"))
        client = arxiv.Client()
        search = arxiv.Search(
            query=query,
            max_results=100,
            sort_by=arxiv.SortCriterion.SubmittedDate
        )
        
        papers = []
        for idx, result in enumerate(client.results(search)):
            if idx >= start and len(papers) < 10:
                papers.append({
                    "id": result.entry_id,
                    "title": result.title,
                    "authors": [author.name for author in result.authors],
                    "summary": result.summary,
                    "pdf_url": result.pdf_url,
                    "published": result.published.strftime("%Y-%m-%d"),
                    "primary_category": result.primary_category
                })
            elif len(papers) >= 10:
                break
        
        print(colored(f"Found {len(papers)} papers", "green"))
        return {"papers": papers, "has_more": len(papers) == 10}
    except Exception as e:
        print(colored(f"Error fetching papers: {str(e)}", "red"))
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    print(colored("Starting server...", "yellow"))
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True) 