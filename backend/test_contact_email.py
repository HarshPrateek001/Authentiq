import requests
import time

def test_api():
    url = "http://127.0.0.1:8000/api/contact"
    data = {
        "firstName": "Harsh", 
        "lastName": "Prateek", 
        "email": "itsharshprateek@gmail.com", 
        "subject": "Test Contact - Email Confirmation", 
        "message": "Hi, just testing the contact form email functionality to see if the confirmation email is delivered."
    }
    try:
        t1 = time.time()
        print(f"Sending POST request to {url} with user email: {data['email']}...")
        res = requests.post(url, json=data)
        print("Status code:", res.status_code)
        print("Response Data:", res.json())
        print("Time taken:", round(time.time() - t1, 2), "seconds")
    except Exception as e:
        print("Error details:", e)

if __name__ == "__main__":
    test_api()
