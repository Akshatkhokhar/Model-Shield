import pickle
from pathlib import Path

# Resolve to backend/app/models
BASE_DIR = Path(__file__).resolve().parents[1] / 'app' / 'models'
PKL_PATH = BASE_DIR / 'MPDD.pkl'

with open(PKL_PATH, 'rb') as f:
    data = pickle.load(f)

print('Path:', PKL_PATH)
print('Type:', type(data))
if hasattr(data, 'shape'):
    print('Shape:', data.shape)
if hasattr(data, 'columns'):
    print('Columns:', data.columns.tolist())
if hasattr(data, 'steps'):
    print('Pipeline steps:', data.steps)
print('Sample data:')
print(data.head() if hasattr(data, 'head') else str(data)[:200])
