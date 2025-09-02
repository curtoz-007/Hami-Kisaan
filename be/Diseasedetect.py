import torch
from transformers import AutoFeatureExtractor, AutoModelForImageClassification
from PIL import Image
from pathlib import Path

# ---- LABEL MAPPING ----
LABEL_MAP = {
    'LABEL_0': 'Apple___Apple_scab',
    'LABEL_1': 'Apple___Black_rot',
    'LABEL_2': 'Apple___Cedar_apple_rust',
    'LABEL_3': 'Apple___healthy',
    'LABEL_4': 'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
    'LABEL_5': 'Corn_(maize)___Common_rust_',
    'LABEL_6': 'Corn_(maize)___Northern_Leaf_Blight',
    'LABEL_7': 'Corn_(maize)___healthy',
    'LABEL_8': 'Grape___Black_rot',
    'LABEL_9': 'Grape___Esca_(Black_Measles)',
    'LABEL_10': 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    'LABEL_11': 'Grape___healthy',
    'LABEL_12': 'Potato___Early_blight',
    'LABEL_13': 'Potato___Late_blight',
    'LABEL_14': 'Tomato___Bacterial_spot',
    'LABEL_15': 'Tomato___Late_blight',
    'LABEL_16': 'Tomato___Septoria_leaf_spot',
    'LABEL_17': 'Tomato___Target_Spot',
    'LABEL_18': 'Tomato___Tomato_mosaic_virus'
}

def predict_plant_disease_from_image(image: Image.Image) -> str:
    """
    Predicts the disease of a plant leaf from a PIL Image object using a pretrained model.
    """
    # Correct checkpoint path
    checkpoint_path = Path(r"D:\Team-QUBITS\be\AI\results\checkpoint-5373")

    if not checkpoint_path.exists():
        raise FileNotFoundError(f"Checkpoint folder not found: {checkpoint_path}")

    # Load model & extractor
    extractor = AutoFeatureExtractor.from_pretrained(str(checkpoint_path), local_files_only=True)
    model = AutoModelForImageClassification.from_pretrained(str(checkpoint_path), local_files_only=True)

    # Device
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    model.eval()

    # Ensure image is RGB
    image = image.convert("RGB")

    # Preprocess image
    inputs = extractor(images=image, return_tensors="pt")
    inputs = {k: v.to(device) for k, v in inputs.items()}

    # Predict
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_class_idx = logits.argmax(-1).item()

    # Get proper label
    predicted_label = model.config.id2label.get(predicted_class_idx)
    predicted_disease = LABEL_MAP.get(predicted_label, "Unknown")

    return predicted_disease

# # # Example usage:
# img = Image.open(r"D:\Team-QUBITS\be\12.jpg")
# disease = predict_plant_disease_from_image(img)
# print(f"Predicted disease: {disease}")
