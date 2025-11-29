import pickle
import os

path = os.path.join('backend', 'app', 'models', 'MPDD.pkl')
with open(path, 'rb') as f:
    data = pickle.load(f)

print('Type:', type(data))
if hasattr(data, 'shape'):
    print('Shape:', data.shape)
if hasattr(data, 'columns'):
    print('Columns:', data.columns.tolist())
if hasattr(data, 'steps'):
    print('Pipeline steps:', data.steps)
print('Sample data:')
print(data.head() if hasattr(data, 'head') else str(data)[:200])
