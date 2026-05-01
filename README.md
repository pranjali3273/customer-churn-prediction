# NovaStar Bank Churn Prediction Dashboard

## 📌 Project Description
The **NovaStar Bank Churn Prediction Dashboard** is an end-to-end machine learning solution designed to predict customer churn and provide actionable retention strategies. It consists of an Artificial Neural Network (ANN) trained on customer data to output churn probabilities, and a full-stack web application (FastAPI + Vanilla JS/HTML/CSS) to visualize these predictions.

## 🎯 Problem It Solves
Customer retention is a critical challenge for banks. Acquiring a new customer is significantly more expensive than retaining an existing one. This project solves this problem by:
1. **Identifying At-Risk Customers**: Using deep learning to predict the likelihood of a customer leaving the bank.
2. **Providing Actionable Insights**: Generating personalized retention recommendations (e.g., fee waivers, personalized advisory, digital engagement campaigns) based on customer segments, behaviors, and their predicted churn risk.

## ⚙️ Installation & Running the Project

### Prerequisites
Make sure you have Python 3.x installed. You will need the following libraries:
```bash
pip install fastapi uvicorn pandas numpy scikit-learn tensorflow joblib
```

### 1. Running the Backend API
The backend is built with FastAPI and serves the model predictions and customer data.
Navigate to the project directory and run:
```bash
python app.py
```
The API will start at `http://localhost:8000`. You can access the interactive API docs at `http://localhost:8000/docs`.

### 2. Running the Frontend Dashboard
The frontend is a lightweight, responsive web app built with HTML, CSS, and JavaScript. 
Simply open the `index.html` file in your favorite web browser.
It will automatically connect to the local FastAPI backend to fetch customer insights.

### 3. Training the Model (Optional)
If you wish to retrain the underlying Artificial Neural Network (ANN) or generate new scored datasets:
```bash
python train_and_save.py
```
This will preprocess the data, train the ANN, and save the resulting model (`churn_model.h5`) and scaler (`scaler.pkl`).

## 📊 Dataset
The project uses the standard **Churn Modelling** dataset, which contains details of 10,000 bank customers. 
- **Target Variable**: `Exited` (1 = Churned, 0 = Retained)
- **Features included**: Credit Score, Geography, Gender, Age, Tenure, Balance, Number of Products, Credit Card Status, Active Member Status, and Estimated Salary.
- **Source**: [Bank Customer Churn Dataset on Kaggle](https://www.kaggle.com/datasets/barelydedicated/bank-customer-churn-modeling)

## 📈 Results
The core machine learning model is an Artificial Neural Network (ANN) with two hidden layers. 
- **Accuracy**: ~86% on the test set.
- **Optimization**: Binary Crossentropy loss using the Adam optimizer.

### Model Evaluation Proof
Here is the verifiable terminal output from evaluating the trained `churn_model.h5` model on the testing set (20% of the dataset):

```text
========================================
MODEL EVALUATION PROOF
========================================
Accuracy Score: 0.8620 (86.20%)

Confusion Matrix:
[[1526   69]
 [ 207  198]]

Classification Report:
              precision    recall  f1-score   support

           0       0.88      0.96      0.92      1595
           1       0.74      0.49      0.59       405

    accuracy                           0.86      2000
   macro avg       0.81      0.72      0.75      2000
weighted avg       0.85      0.86      0.85      2000
========================================
```

By translating these model probabilities into business logic, the dashboard accurately segments users and outputs dynamic retention strategies, allowing relationship managers to prioritize high-risk and high-value customers effectively.



