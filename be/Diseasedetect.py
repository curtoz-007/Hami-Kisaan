from pathlib import Path
import torch
from transformers import AutoFeatureExtractor, AutoModelForImageClassification
from PIL import Image

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
    # Resolve checkpoint path relative to this script
    checkpoint_path = Path(__file__).parent / "AI" / "results" / "checkpoint-5373"
    # Alternative for testing: Hardcode absolute path
    # checkpoint_path = Path("/home/user/Hami-Kisaan/be/AI/results/checkpoint-5373")

    print(f"Checking checkpoint path: {checkpoint_path}")
    if not checkpoint_path.exists():
        raise FileNotFoundError(f"Checkpoint folder not found: {checkpoint_path}")
    if not checkpoint_path.is_dir():
        raise NotADirectoryError(f"Checkpoint path is not a directory: {checkpoint_path}")

    # Verify required files
    required_files = ["training_args.bin", "config.json", "preprocessor_config.json"]
    for file in required_files:
        if not (checkpoint_path / file).exists():
            raise FileNotFoundError(f"Missing required file in checkpoint: {file}")

    print("Checkpoint folder and files verified")

    try:
        # Load model & extractor
        extractor = AutoFeatureExtractor.from_pretrained(str(checkpoint_path), local_files_only=True)
        model = AutoModelForImageClassification.from_pretrained(str(checkpoint_path), local_files_only=True)
    except Exception as e:
        print(f"Error loading model or extractor: {str(e)}")
        raise

    # Device
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    model.eval()
    print(f"Using device: {device}")

    # Ensure image is RGB
    image = image.convert("RGB")

    # Preprocess image
    try:
        inputs = extractor(images=image, return_tensors="pt")
        inputs = {k: v.to(device) for k, v in inputs.items()}
    except Exception as e:
        print(f"Error preprocessing image: {str(e)}")
        raise

    # Predict
    try:
        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits
            predicted_class_idx = logits.argmax(-1).item()
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        raise

    # Get proper label
    predicted_label = model.config.id2label.get(predicted_class_idx, "Unknown")
    predicted_disease = LABEL_MAP.get(predicted_label, "Unknown")
    print(f"Predicted disease: {predicted_disease}")

    return predicted_disease