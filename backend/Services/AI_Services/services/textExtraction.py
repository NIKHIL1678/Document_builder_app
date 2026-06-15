import fitz


async def extract_pdf_text(file):

    try:
        pdf_bytes = await file.read()

        doc = fitz.open(
            stream=pdf_bytes,
            filetype="pdf"
        )

        extracted_text = ""

        for page in doc:
          extracted_text += str(page.get_text())
          
        return {
            "success": True,
            "text": extracted_text
        }

    except Exception as error:

        return {
            "success": False,
            "error": str(error)
        }