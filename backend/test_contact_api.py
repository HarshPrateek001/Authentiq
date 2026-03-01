import asyncio
import httpx

async def test_contact_form():
    url = "http://localhost:8000/api/contact"
    data = {
        "firstName": "Test",
        "lastName": "User",
        "email": "test@example.com",
        "subject": "general",
        "message": "This is a test message to verify the contact form integration."
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=data)
        print("Status Code:", response.status_code)
        print("Response:", response.json())

if __name__ == "__main__":
    asyncio.run(test_contact_form())
