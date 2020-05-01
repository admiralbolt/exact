from collections import Counter
from fuzzywuzzy import fuzz

from api import models

SCORE_THRESHOLD = 50

FIELD_WEIGHTS = {
  "number": {
    "token": 1.0,
    "partial": 0.5,
    "jaccard": 0.3
  },
  "name": {
    "token": 0.5,
    "partial": 0.8,
    "jaccard": 1.0
  },
  "author": {
    "token": 1.0,
    "partial": 0.5,
    "jaccard": 0.3
  }
}

def jaccard(a, b):
  """Get the jaccard similarity of two strings."""
  a_count = Counter(a)
  b_count = Counter(b)
  return float(sum((a_count & b_count).values())) / sum((a_count | b_count).values()) * 100

def score_field(field, keyword, token_weight=1.0, partial_weight=0.5, jaccard_weight=0.3):
  """Scores a single field based on its resemblance to the keyword from 0-100.

    If the keyword is an exact match a score of 100 is returned.
    If the keyword is a substring of the field a score of 85 is returned.
    Otherwise scoring is computed as the weighted sum of:
      1. Token Ratio - Allows for minor differences as long as they are exact matches.
      2. Partial Ratio - Allows for minor differences provided substring matches.
      3. Jaccard similarity.
  """
  if field == keyword:
    return 100

  if keyword in field:
    return 85

  return (
    fuzz.token_set_ratio(field, keyword) * token_weight +
    fuzz.partial_ratio(field, keyword) * partial_weight +
    jaccard(field, keyword) * jaccard_weight
  ) / sum([token_weight, partial_weight, jaccard_weight])


def score(equation, keyword):
  """Score an equation based on how it matches a keyword.

  Score is returned in a range from 0 -> 100.
  Score is calculated based on exact matches of the keyword to the following
  fields:
  1. equation.geometry.number
  2. equation.title
  3. equation.author

  If a calculated score doesn't beat the threshold, it moves on to the the next
  field in order.

  """
  max_score = 0
  for field_name, field in zip(FIELD_WEIGHTS.keys(), [equation.geometry.number.lower(), equation.name, equation.author]):
    score = score_field(field.lower(), keyword.lower(),
                        token_weight=FIELD_WEIGHTS[field_name]["token"],
                        partial_weight=FIELD_WEIGHTS[field_name]["partial"],
                        jaccard_weight=FIELD_WEIGHTS[field_name]["jaccard"])
    if score > max_score:
      max_score = score

  return max_score

def eq_to_json(equation, score):
  return {
    "id": equation.id,
    "name": equation.name,
    "author": equation.author,
    "number": equation.geometry.number,
    "score": score
  }

def run_search(keyword):
  keyword_lower = keyword.lower()
  data = [{"equation": equation, "score": score(equation, keyword_lower)}
    for equation in models.Equation.objects.all()]

  # data = filter(lambda item: item["score"] > SCORE_THRESHOLD, data)
  data = sorted(data, key=lambda item: item["score"], reverse=True)
  return [eq_to_json(item["equation"], item["score"]) for item in data]
