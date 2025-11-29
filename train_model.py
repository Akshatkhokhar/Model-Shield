import joblib
import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report

# Load the data
data_path = os.path.join('backend', 'app', 'models', 'MPDD.joblib')
df = joblib.load(data_path)

print(f"Loaded data shape: {df.shape}")
print(f"Columns: {df.columns.tolist()}")

# Prepare the data
X = df['Prompt']
y = df['isMalicious']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create the pipeline
pipeline = Pipeline([
    ('tfidfvectorizer', TfidfVectorizer(max_features=5000, ngram_range=(1, 2))),
    ('logisticregression', LogisticRegression(random_state=42))
])

# Train the model
print("Training the model...")
pipeline.fit(X_train, y_train)

# Evaluate the model
y_pred = pipeline.predict(X_test)
print("Classification Report:")
print(classification_report(y_test, y_pred))

# Save the trained model
model_path = os.path.join('backend', 'app', 'models', 'MPDD.joblib')
joblib.dump(pipeline, model_path)

print(f"Model saved to {model_path}")
print("Model training completed!")
