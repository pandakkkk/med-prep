#!/usr/bin/env python3
"""
Extract images from NEET PG 2023 PDF and save them
"""

import fitz  # PyMuPDF
from PIL import Image
import os
import io

def extract_images_with_pymupdf(pdf_path, output_dir):
    """Extract images using PyMuPDF (fitz)"""
    print(f"Extracting images from {pdf_path}...")
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Open PDF
    pdf_document = fitz.open(pdf_path)
    
    image_count = 0
    saved_count = 0
    
    for page_num in range(len(pdf_document)):
        page = pdf_document[page_num]
        image_list = page.get_images(full=True)
        
        print(f"\nPage {page_num + 1}: Found {len(image_list)} images")
        
        for img_index, img in enumerate(image_list):
            xref = img[0]
            base_image = pdf_document.extract_image(xref)
            
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            width = base_image["width"]
            height = base_image["height"]
            
            # Skip small images (likely headers/logos)
            if width < 100 or height < 100:
                print(f"  Skipping small image {img_index + 1}: {width}x{height}")
                continue
            
            image_count += 1
            
            # Save image
            filename = f"page{page_num + 1}_img{image_count}.{image_ext}"
            filepath = os.path.join(output_dir, filename)
            
            with open(filepath, "wb") as image_file:
                image_file.write(image_bytes)
            
            saved_count += 1
            print(f"  ✅ Saved: {filename} ({width}x{height})")
    
    pdf_document.close()
    
    print(f"\n{'='*60}")
    print(f"✅ Extraction complete!")
    print(f"   Total images saved: {saved_count}")
    print(f"   Output directory: {output_dir}")
    print(f"{'='*60}")
    
    return saved_count

def main():
    pdf_path = "/Users/sanjeevmurmu/workspace/neet-pg-prep/NEET-PG-2023-Question-Paper-With-Solutions.pdf"
    output_dir = "/Users/sanjeevmurmu/workspace/neet-pg-prep/public/images/questions/2023"
    
    try:
        count = extract_images_with_pymupdf(pdf_path, output_dir)
        print(f"\n🎉 Successfully extracted {count} images!")
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\nTrying alternative method...")

if __name__ == "__main__":
    main()

