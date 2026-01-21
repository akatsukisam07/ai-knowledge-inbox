import httpx
from bs4 import BeautifulSoup


def fetch_url_text(url: str, timeout: int = 10) -> str:
    """
    Fetch a URL and extract readable text.
    Keeps it simple and deterministic.
    """
    resp = httpx.get(url, timeout=timeout)
    resp.raise_for_status()

    soup = BeautifulSoup(resp.text, "html.parser")

    # Noise Removal for context
    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()

    text = soup.get_text(separator=" ")
    lines = [line.strip() for line in text.splitlines() if line.strip()]

    return " ".join(lines)
