#!/usr/bin/env python3
"""
Extract text and images from NEET PG 2023 question paper
"""

import pdfplumber
from PIL import Image
import os
import io

def extract_text_from_pdf(pdf_path):
    """Extract all text from PDF"""
    print(f"Extracting text from {pdf_path}...")
    
    with pdfplumber.open(pdf_path) as pdf:
        full_text = ""
        print(f"Total pages: {len(pdf.pages)}")
        
        for page_num, page in enumerate(pdf.pages, 1):
            text = page.extract_text()
            if text:
                full_text += f"\n\n=== PAGE {page_num} ===\n\n"
                full_text += text
        
        return full_text

def extract_images_from_pdf(pdf_path, output_dir):
    """Extract images from PDF and save them"""
    print(f"Extracting images from {pdf_path}...")
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    image_count = 0
    
    with pdfplumber.open(pdf_path) as pdf:
        for page_num, page in enumerate(pdf.pages, 1):
            # Get images from page
            if hasattr(page, 'images'):
                images = page.images
                
                for img_num, img in enumerate(images, 1):
                    try:
                        # Skip very small images (likely decorative)
                        if img.get('width', 0) < 50 or img.get('height', 0) < 50:
                            continue
                        
                        image_count += 1
                        print(f"Page {page_num}, Image {img_num}: {img.get('width')}x{img.get('height')}")
                        
                    except Exception as e:
                        print(f"Error processing image on page {page_num}: {e}")
    
    print(f"\nTotal images found: {image_count}")
    return image_count

def main():
    pdf_path = "/Users/sanjeevmurmu/workspace/neet-pg-prep/NEET-PG-2023-Question-Paper-With-Solutions.pdf"
    output_text_file = "/Users/sanjeevmurmu/workspace/neet-pg-prep/NEET_PG_2023_extracted_text.txt"
    output_images_dir = "/Users/sanjeevmurmu/workspace/neet-pg-prep/public/images/questions/2023"
    
    # Extract text
    text = extract_text_from_pdf(pdf_path)
    
    # Save text to file
    with open(output_text_file, 'w', encoding='utf-8') as f:
        f.write(text)
    
    print(f"\n✅ Text extracted and saved to: {output_text_file}")
    print(f"   Total characters: {len(text)}")
    
    # Extract images
    image_count = extract_images_from_pdf(pdf_path, output_images_dir)
    
    print(f"\n✅ Found {image_count} images in PDF")
    print(f"   Image directory: {output_images_dir}")

if __name__ == "__main__":
    main()

