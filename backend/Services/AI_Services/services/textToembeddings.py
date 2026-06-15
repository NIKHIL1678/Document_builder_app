from google import genai

client = genai.Client(
    api_key="AIzaSyBIwPO3CUrbvCwpewbbd2wZ2_ve9bhOtAU"
)


async def text_to_embeddings ( fileData ) :
    
    try:
        response = client.models.embed_content(
            model="models/gemini-embedding-001",
            contents=fileData
        )

        print(response)

        return {
            "success": True,
            "text_embeddings": response
        }



    except Exception as error :
        return {
            "success" : False,
            "error": error
        }
        
