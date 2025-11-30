import joblib
import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from pathlib import Path

# Resolve paths relative to this script location
BASE_DIR = Path(__file__).resolve().parents[1] / 'app' / 'models'
MODEL_PATH = BASE_DIR / 'MPDD.joblib'

# Load the data (note: this assumes a dataset saved as joblib at MODEL_PATH)
# If you intended to load a CSV of labeled prompts, replace this with e.g.:
# df = pd.read_csv(BASE_DIR / 'dataset.csv')
df = joblib.load(MODEL_PATH)

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
BASE_DIR.mkdir(parents=True, exist_ok=True)
joblib.dump(pipeline, MODEL_PATH)

print(f"Model saved to {MODEL_PATH}")
print("Model training completed!")
