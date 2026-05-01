import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
import joblib

print("Loading dataset...")
dataset = pd.read_csv('Churn_Modelling.csv')

X = dataset.iloc[:, 3:13]
y = dataset.iloc[:, 13]

print("Preprocessing data...")
geography = pd.get_dummies(X["Geography"], drop_first=True)
gender = pd.get_dummies(X['Gender'], drop_first=True)

X = pd.concat([X, geography, gender], axis=1)
X = X.drop(['Geography', 'Gender'], axis=1)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)

sc = StandardScaler()
X_train = sc.fit_transform(X_train)
X_test = sc.transform(X_test)

print("Building ANN...")
classifier = Sequential()
classifier.add(Dense(units=11, activation='relu'))
classifier.add(Dense(units=6, activation='relu'))
classifier.add(Dense(units=1, activation='sigmoid')) # Changed to sigmoid for probabilities

classifier.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

print("Training ANN...")
# Reduced epochs for quick saving (we just need the model structure and some weights for the dashboard demo)
# Or we can keep it at 50 to match the notebook. Let's do 50.
classifier.fit(X_train, y_train, validation_split=0.33, batch_size=10, epochs=50, verbose=1)

print("Saving model and scaler...")
classifier.save('churn_model.h5')
joblib.dump(sc, 'scaler.pkl')

print("Done! Model saved to churn_model.h5 and scaler saved to scaler.pkl")
