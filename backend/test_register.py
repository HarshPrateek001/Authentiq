import requests
import json

def test_register():
    url = "http://127.0.0.1:8000/api/auth/register"
    data = {
        "fullName": "Test New User 3",
        "email": "testnewuser_003@fakemail.com",
        "password": "Testpassword123!",
        "userType": "student",
        "newsletter": False
    }
    
    try:
        response = requests.post(url, json=data)
        with open("test_register_output.json", "w") as f:
            json.dump({"status": response.status_code, "body": response.json()}, f)
    except Exception as e:
        with open("test_register_output.json", "w") as f:
            json.dump({"error": str(e)}, f)

if __name__ == "__main__":
    test_register()
