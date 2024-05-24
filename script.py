from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import mysql.connector
import sys

db_conn = mysql.connector.connect(
  host="localhost",
  user="root",
  password="omnath8055",
  database="alldata"
)
cursor = db_conn.cursor()

query = "SELECT name FROM stockinfo WHERE uploaddate = 20240411"
cursor.execute(query)

results = cursor.fetchall()

company_names = [result[0] for result in results]

cursor.close()
db_conn.close()
# print(company_names[0:10])

def create_company_vectors(company_names):
    vectorizer = TfidfVectorizer()
    company_vectors = vectorizer.fit_transform(company_names)
    return vectorizer, company_vectors

def find_top_correlated(input_text, company_names, vectorizer, company_vectors, top_n=5):
    input_vector = vectorizer.transform([input_text])
    similarities = cosine_similarity(input_vector, company_vectors)
    similarities = similarities[0]  # Remove the single-element dimension
    top_indices = np.argsort(similarities)[::-1][:top_n]
    top_correlated_companies = [(company_names[i], similarities[i]) for i in top_indices]
    return top_correlated_companies

vectorizer, company_vectors = create_company_vectors(company_names)


input_text = sys.argv[1]
# print(f"Enter a company name: {input_text}")

top_correlated_companies = find_top_correlated(input_text, company_names, vectorizer, company_vectors)

# for company, correlation in top_correlated_companies:
#     print(f"{company}: {correlation}")

# Extract the company name from the tuple
best_match_name = top_correlated_companies[0][0]
print(best_match_name)

# db_connection = mysql.connector.connect(
#   host="localhost",
#   user="root",
#   password="Rutuja_2001",
#   database="student_schema"
# )
# db_cursor = db_connection.cursor()

# update_query = f"UPDATE individualnews SET recocompany = '{best_match_name}' WHERE companyname = '{input_text}'"
# db_cursor.execute(update_query)
# db_connection.commit()
# db_cursor.close()
# db_connection.close()
