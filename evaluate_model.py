import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.models import load_model
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib

print("Loading dataset and preprocessing...")
dataset = pd.read_csv('Churn_Modelling.csv')
X = dataset.iloc[:, 3:13]
y = dataset.iloc[:, 13]

geography = pd.get_dummies(X["Geography"], drop_first=True)
gender = pd.get_dummies(X['Gender'], drop_first=True)
X = pd.concat([X, geography, gender], axis=1)
X = X.drop(['Geography', 'Gender'], axis=1)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)

print("Loading scaler and model...")
sc = joblib.load('scaler.pkl')
X_test = sc.transform(X_test)

classifier = load_model('churn_model.h5')

print("Evaluating model...")
y_pred = classifier.predict(X_test)
y_pred = (y_pred > 0.5)

accuracy = accuracy_score(y_test, y_pred)
print("\n" + "="*40)
print("MODEL EVALUATION PROOF")
print("="*40)
print(f"Accuracy Score: {accuracy:.4f} ({(accuracy*100):.2f}%)")
print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))
print("\nClassification Report:")
print(classification_report(y_test, y_pred))
print("="*40)
