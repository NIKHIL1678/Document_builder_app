from fastapi import APIRouter, UploadFile, File

from fastapi import APIRouter, UploadFile, File
from services.textExtraction import extract_pdf_text
from services.textToembeddings import text_to_embeddings

router = APIRouter(
    prefix="/files",
    tags=["Files"]
)


@router.post("/extract/pdf")
async def extract_pdf(file: UploadFile = File(...)):

    result = await extract_pdf_text(file)

    return result


@router.post("/embeddings/pdf")
async def create_embeddings(file: UploadFile = File(...)):

    extracted = await extract_pdf_text(file)

    if not extracted["success"]:
        return extracted

    embeddings = await text_to_embeddings(
        extracted["text"]
    )

    return embeddings