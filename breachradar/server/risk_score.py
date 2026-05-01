import sys
import json
from datetime import datetime, timedelta

def calculate_risk(breaches_json):
    try:
        breaches = json.loads(breaches_json)
    except json.JSONDecodeError:
        return 0

    score = 0
    now = datetime.now()
    two_years_ago = now - timedelta(days=365*2)

    data_class_scores = {
        "Passwords": 30,
        "Email addresses": 10,
        "Phone numbers": 15,
        "Credit cards": 25,
        "Physical addresses": 10,
        "Government data": 35,
        "Social media profiles": 5,
        "Usernames": 5,
        "Dates of birth": 10,
        "Security questions": 20
    }

    for breach in breaches:
        breach_date_str = breach.get("BreachDate")
        recent = False
        if breach_date_str:
            try:
                breach_date = datetime.strptime(breach_date_str, "%Y-%m-%d")
                if breach_date >= two_years_ago:
                    recent = True
            except ValueError:
                pass

        data_classes = breach.get("DataClasses", [])
        for dc in data_classes:
            score += data_class_scores.get(dc, 0)
        
        if recent:
            score += 20

    if score > 100:
        score = 100

    return score

if __name__ == "__main__":
    if len(sys.argv) > 1:
        print(calculate_risk(sys.argv[1]))
    else:
        print(0)
