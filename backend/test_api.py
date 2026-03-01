import requests
import time

def test_api():
    url = "http://127.0.0.1:8000/api/contact"
    data = {"firstName": "A", "lastName": "B", "email": "a@b.com", "subject": "test", "message": "hello msig"}
    try:
        t1 = time.time()
        res = requests.post(url, json=data) # no timeout
        print("Status", res.status_code)
        print("Data", res.json())
        print("Time:", time.time() - t1)
    except Exception as e:
        print("Error:", e)
        print("Time:", time.time() - t1)

if __name__ == "__main__":
    test_api()
