import sys
import json
import requests
from bs4 import BeautifulSoup

def scrape(url):
    try:
        response = requests.get(url)
        if response.status_code != 200:
            return json.dumps({"error": f"Failed to fetch the page. Status code: {response.status_code}"})

        soup = BeautifulSoup(response.text, 'html.parser')

        # Extracting text from paragraphs
        paragraphs = [p.get_text() for p in soup.find_all('p')]

        return json.dumps({
            "url": url,
            "content": paragraphs
        })
    except Exception as e:
        return json.dumps({"error": f"Error: {str(e)}"})

if __name__ == "__main__":
    url = sys.argv[1]  # Get URL from command-line argument
    print(scrape(url))  # Print the result as JSON
