import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_home_page(client):
    """Test that home page renders successfully."""
    response = client.get('/')
    assert response.status_code == 200
    assert b"Crop Yield" in response.data or b"Agricultural" in response.data

def test_about_page(client):
    """Test that about page renders successfully."""
    response = client.get('/about')
    assert response.status_code == 200

def test_yield_prediction_page(client):
    """Test yield prediction page rendering."""
    response = client.get('/yield-prediction')
    assert response.status_code == 200

def test_disease_prediction_page(client):
    """Test disease prediction page rendering."""
    response = client.get('/disease-prediction')
    assert response.status_code == 200

def test_fertilizer_recommendation_page(client):
    """Test fertilizer recommendation page rendering."""
    response = client.get('/fertilizer-recommendation')
    assert response.status_code == 200

def test_weather_prediction_page(client):
    """Test weather prediction page rendering."""
    response = client.get('/weather-prediction')
    assert response.status_code == 200

def test_api_predict_yield(client):
    """Test yield prediction API endpoint."""
    payload = {
        'rainfall': 800,
        'pesticide': 100,
        'temperature': 25,
        'crop': 'Maize'
    }
    response = client.post('/api/predict-yield', json=payload)
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
    assert 'prediction' in data

def test_api_predict_disease(client):
    """Test disease prediction API endpoint."""
    payload = {
        'rainfall': 150,
        'temperature': 25,
        'humidity': 80,
        'pesticide': '0-7 days'
    }
    response = client.post('/api/predict-disease', json=payload)
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
    assert 'risk_level' in data

def test_api_recommend_fertilizer(client):
    """Test fertilizer recommendation API endpoint."""
    payload = {
        'crop': 'Maize',
        'rainfall': 600,
        'soil_type': 'loamy',
        'field_size': 2.0,
        'growth_stage': 'vegetative'
    }
    response = client.post('/api/recommend-fertilizer', json=payload)
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
    assert 'fertilizer' in data

def test_api_predict_weather(client):
    """Test weather prediction API endpoint."""
    payload = {
        'year': 2026,
        'location': 'General'
    }
    response = client.post('/api/predict-weather', json=payload)
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
    assert 'predicted_rainfall' in data

def test_api_recommend_crop(client):
    """Test crop recommendation API endpoint."""
    payload = {
        'rainfall': 800,
        'temperature': 25,
        'humidity': 70,
        'soil_type': 'loamy',
        'ph_level': 6.5,
        'season': 'kharif'
    }
    response = client.post('/api/recommend-crop', json=payload)
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
    assert 'recommendations' in data
