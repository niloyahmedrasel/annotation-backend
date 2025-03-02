import sys
import json
import requests
import os
import csv
from bs4 import BeautifulSoup
from docx import Document
from docx.shared import Pt
from docx.enum.text import WD_PARAGRAPH_ALIGNMENT

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
            
            # Format Issue with color styling
            if len(paragraphs) >= 2:
                issue_paragraphs = []
                for para in paragraphs[:2]:
                    p_soup = BeautifulSoup(str(para), 'html.parser')
                    for span in p_soup.find_all("span"):
                        span_class = span.get("class", [None])[0]
                        if span_class in color_styles:
                            span['style'] = color_styles[span_class]
                    issue_paragraphs.append(str(p_soup))
                issue_html = "".join(issue_paragraphs)

            # Format Fatwa with color styling
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
    print(f"HTML file saved at '{file_path}'", file=sys.stderr)

def save_to_csv_file(data, folder_name, file_name):
    """Appends all scraped data to a CSV file."""
    os.makedirs(folder_name, exist_ok=True)
    csv_file_path = os.path.join(folder_name, file_name)
    
    headers = ["url", "hadith_no", "volume_no", "book_page", "chapter", "question", "issue", "fatwa", "hamesh"]
    data_for_csv = {key: data.get(key, "") for key in headers}
    
    file_exists = os.path.isfile(csv_file_path)
    
    with open(csv_file_path, mode="a", encoding="utf-8-sig", newline="") as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=headers)
        if not file_exists:
            writer.writeheader()
        writer.writerow(data_for_csv)
    print(f"CSV file saved at '{csv_file_path}'", file=sys.stderr)

def numeric_sort_key(filename):
    """Helper function for numeric sorting of filenames."""
    numeric_part = ''.join(filter(str.isdigit, filename))
    return int(numeric_part) if numeric_part.isdigit() else float('inf')

def combine_html(input_dir, output_dir):
    """Combines all HTML files into a single organized document."""
    os.makedirs(output_dir, exist_ok=True)
    combined_path = os.path.join(output_dir, "combined.html")
    
    with open(combined_path, "w", encoding="utf-8") as outfile:
        outfile.write('<html lang="ar" dir="rtl">\n<head><meta charset="UTF-8"></head>\n<body>\n')
        
        unique_chapters = set()
        for filename in sorted(os.listdir(input_dir), key=numeric_sort_key):
            if filename.endswith('.html'):
                filepath = os.path.join(input_dir, filename)
                with open(filepath, "r", encoding="utf-8") as infile:
                    soup = BeautifulSoup(infile, "html.parser")
                    
                    # Handle chapter duplicates
                    chapter_tag = soup.find("h3")
                    if chapter_tag:
                        chapter_text = chapter_tag.get_text(strip=True)
                        if chapter_text in unique_chapters:
                            chapter_tag.decompose()
                        else:
                            unique_chapters.add(chapter_text)
                    
                    # Extract and write body content
                    body = soup.find("body")
                    if body:
                        outfile.write(str(body))
        
        outfile.write('</body>\n</html>')
    return combined_path

def html_to_docx(html_path, docx_path):
    """Converts combined HTML file to a formatted DOCX document."""
    doc = Document()
    
    with open(html_path, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f, "html.parser")
        
        for div in soup.find_all("div", dir="rtl"):
            elements = div.find_all(["h3", "p", "small"])
            
            for element in elements:
                if element.name == "h3":
                    heading = doc.add_heading(element.text, level=3)
                    heading.paragraph_format.alignment = WD_PARAGRAPH_ALIGNMENT.RIGHT
                elif element.name == "p":
                    style = element.get("style", "")
                    text = element.get_text(strip=True)
                    para = doc.add_paragraph()
                    run = para.add_run(text)
                    
                    if "font-weight: bold" in style:
                        run.bold = True
                    
                    if "V:" in text and "P:" in text:
                        para.runs[0].font.size = Pt(10)
                    
                    para.paragraph_format.alignment = WD_PARAGRAPH_ALIGNMENT.RIGHT
                elif element.name == "small":
                    para = doc.add_paragraph(element.text)
                    para.paragraph_format.alignment = WD_PARAGRAPH_ALIGNMENT.RIGHT
                    para.runs[0].font.size = Pt(10)
    
    doc.save(docx_path)



def main(urls):
    """Main function to process URLs and generate outputs."""
    # Create output directories
    scraped_dir = "scraped_data"
    combined_dir = "combined_output"
    
    # Scrape each URL
    results = []
    for url in urls:
        data = scrape_page_content(url)
        if "error" in data:
            results.append(data)
            continue
        
        # Generate unique filename from URL
        filename = f"page_{url.split('/')[-1].replace('#', '_')}.html"
        save_html_file(data["html_content"], scraped_dir, filename)
        save_to_csv_file(data, scraped_dir, "scraped_data.csv")
        results.append(data)
    
    # Combine HTML files
    combined_html = combine_html(scraped_dir, combined_dir)
    
    # Convert to DOCX
    output_docx = os.path.join(combined_dir, "output.docx")
    html_to_docx(combined_html, output_docx)
    
    # Output JSON result
    result = {
        "status": "success",
        "output_docx": output_docx,
        "scraped_data": results
    }
    print(json.dumps(result))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python script.py <URL1> <URL2> ..."}))
        sys.exit(1)
    
    main(sys.argv[1:])