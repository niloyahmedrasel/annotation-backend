import sys
import json
import requests
from bs4 import BeautifulSoup
import os
import csv

# Define color styles for span classes
color_styles = {
    "c1": "color: red;",
    "c2": "color: green;",
    "c3": "color: blue;",
    "c4": "color: purple;",
    "c5": "color: orange;"
}

def scrape_page_content(url):
    """Scrapes data and HTML content from a given URL."""
    try:
        response = requests.get(url)
        if response.status_code != 200:
            return {"error": f"Failed to fetch the page. Status code: {response.status_code}"}

        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract fields such as Hadith No., Volume, Book Page, Chapter, and Question
        hadith_no = soup.find("input", id="fld_specialNum_top").get("value", "Not found") if soup.find("input", id="fld_specialNum_top") else "Hadith No. not found."
        volume_no = soup.find("button", {"data-toggle": "dropdown"}).get_text(strip=True) if soup.find("button", {"data-toggle": "dropdown"}) else "Volume not found."
        book_page = soup.find("input", id="fld_goto_top").get("value", "Not found") if soup.find("input", id="fld_goto_top") else "Book Page not found."
        
        # Extract Chapter and Question
        main_div_info = soup.find("div", class_="size-12")
        chapter, question = "Chapter text not found.", "Question text not found."
        if main_div_info:
            text_black_spans = main_div_info.find_all("span", class_="text-black")
            if len(text_black_spans) > 1:
                chapter = text_black_spans[1].get_text(strip=True)
            if len(text_black_spans) > 2:
                question = text_black_spans[2].get_text(strip=True)

        # Extract Issue, Fatwa, and Hamesh
        main_div = soup.find("div", class_="nass margin-top-10")
        issue_html, fatwa_html, hamesh = "", "", ""
        if main_div:
            paragraphs = main_div.find_all('p')
            
            # Format Issue with color styling for each span class
            if len(paragraphs) >= 2:
                issue_paragraphs = []
                for para in paragraphs[:2]:
                    p_soup = BeautifulSoup(str(para), 'html.parser')
                    for span in p_soup.find_all("span"):
                        span_class = span.get("class", [None])[0]
                        if span_class in color_styles:
                            span['style'] = color_styles[span_class]
                    issue_paragraphs.append(str(p_soup))
                issue_html = "".join(issue_paragraphs)  # Use <br> for line breaks in HTML

            # Format Fatwa with color styling for each span class
            fatwa_texts = []
            for i in range(2, len(paragraphs)):
                if 'hamesh' in paragraphs[i].get('class', []):
                    hamesh = paragraphs[i].get_text(separator="\n", strip=True).replace("\n", "<br>")
                    break
                p_content = str(paragraphs[i])
                p_soup = BeautifulSoup(p_content, 'html.parser')
                for span in p_soup.find_all("span"):
                    span_class = span.get("class", [None])[0]
                    if span_class in color_styles:
                        span['style'] = color_styles[span_class]
                fatwa_texts.append(str(p_soup))
            fatwa_html = "".join(fatwa_texts)
        
        # Prepare HTML content with table formatting
        html_content = f"""
        <html lang="ar" dir="rtl">
        <head>
        <meta charset="UTF-8">
        <style>
            body {{ font-family: Arial, sans-serif; direction: rtl; }}
            p {{ line-height: 1.6; }}
            table {{ width: 100%; border-collapse: collapse; }}
            th, td {{ border: 1px solid #ddd; padding: 8px; text-align: right; }}
            th {{ background-color: #f2f2f2; }}
        </style>
        </head>
        <body>
        <table>
            <tr>
                <th>Hadith No.</th>
                <td>{hadith_no}</td>
            </tr>
            <tr>
                <th>Volume</th>
                <td>{volume_no}</td>
            </tr>
            <tr>
                <th>Book Page</th>
                <td>{book_page}</td>
            </tr>
            <tr>
                <th>Chapter</th>
                <td>{chapter}</td>
            </tr>
            <tr>
                <th>Question</th>
                <td>{question}</td>
            </tr>
            <tr>
                <th>Issue</th>
                <td>{issue_html}</td>
            </tr>
            <tr>
                <th>Fatwa</th>
                <td>{fatwa_html}</td>
            </tr>
            <tr>
                <th>Hamesh</th>
                <td>{hamesh}</td>
            </tr>
        </table>
        </body>
        </html>
        """
        
        # Return extracted data and HTML content
        return {
            "url": url,
            "hadith_no": hadith_no,
            "volume_no": volume_no,
            "book_page": book_page,
            "chapter": chapter,
            "question": question,
            "issue": issue_html,
            "fatwa": fatwa_html,
            "hamesh": hamesh,
            "html_content": html_content
        }

    except Exception as e:
        return {"error": f"Error: {str(e)}"}

def save_html_file(content, folder_name, file_name):
    """Saves HTML content to a file."""
    os.makedirs(folder_name, exist_ok=True)
    file_path = os.path.join(folder_name, file_name)
    with open(file_path, "w", encoding="utf-8") as file:
        file.write(content)
    print(f"HTML file saved at '{file_path}'", file=sys.stderr)  # Log to stderr

def save_to_csv_file(data, folder_name, file_name):
    """Saves all scraped data to a CSV file."""
    os.makedirs(folder_name, exist_ok=True)
    csv_file_path = os.path.join(folder_name, file_name)
    
    # Define CSV headers
    headers = ["url", "hadith_no", "volume_no", "book_page", "chapter", "question", "issue", "fatwa", "hamesh"]
    
    # Remove 'html_content' from the data to avoid CSV errors
    data_for_csv = {key: data[key] for key in headers}
    
    with open(csv_file_path, mode="w", encoding="utf-8-sig", newline="") as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=headers)
        writer.writeheader()
        writer.writerow(data_for_csv)
    print(f"CSV file saved at '{csv_file_path}'", file=sys.stderr)  # Log to stderr

def main(url):
    """Main function to scrape data, save HTML, and save CSV."""
    # Scrape the page content
    scraped_data = scrape_page_content(url)
    
    if "error" in scraped_data:
        print(json.dumps(scraped_data))
        return

    # Save HTML file
    folder_name = "scraped_data"
    html_file_name = f"page_{url.split('/')[-1].replace('#', '_')}.html"
    save_html_file(scraped_data["html_content"], folder_name, html_file_name)

    # Save CSV file
    csv_file_name = "scraped_data.csv"
    save_to_csv_file(scraped_data, folder_name, csv_file_name)

    # Return the scraped data as JSON (print to stdout)
    print(json.dumps(scraped_data))

if __name__ == "__main__":
    url = sys.argv[1]  # Get URL from command-line argument
    main(url)