from google import genai
import os

client = genai.Client(
    api_key="AIzaSyBIwPO3CUrbvCwpewbbd2wZ2_ve9bhOtAU"
)

for model in client.models.list():
    print(model.name)