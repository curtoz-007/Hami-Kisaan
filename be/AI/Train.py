import numpy as np
import torch
from transformers import (
    AutoImageProcessor,
    AutoModelForImageClassification,
    Trainer,
    TrainingArguments,
    default_data_collator,
)
from datasets import load_dataset
from evaluate import load
from PIL import Image

# 1️⃣ Load dataset and split
dataset = load_dataset("imagefolder", data_dir="./PlantVillage Dataset/Color images")
dataset = dataset["train"].train_test_split(test_size=0.1)

# 2️⃣ Detect columns
columns = dataset["train"].column_names
print(f"Columns in train dataset: {columns}")
image_column = next(col for col in columns if "image" in col.lower())
label_column = next(col for col in columns if col != image_column)
print(f"Detected image column: {image_column}, label column: {label_column}")

# 3️⃣ Processor (image feature extractor)
processor = AutoImageProcessor.from_pretrained("google/mobilenet_v2_1.0_224", use_fast=True)

# 4️⃣ Transform function (batched). Return PyTorch tensors (pt) — required by fast processors.
def transform(examples):
    imgs = []
    for im in examples[image_column]:
        if isinstance(im, Image.Image):
            imgs.append(im.convert("RGB"))
        else:
            imgs.append(Image.open(im).convert("RGB"))
    inputs = processor(images=imgs, return_tensors="pt")  # <-- use "pt" here
    # store pixel_values as a list of torch tensors (one per example)
    examples["pixel_values"] = [pv for pv in inputs["pixel_values"]]
    examples["labels"] = examples[label_column]
    # remove the raw image and original label columns so the collator doesn't try to handle PIL
    if image_column in examples:
        del examples[image_column]
    if label_column in examples:
        del examples[label_column]
    return examples

dataset = dataset.with_transform(transform)

# 5️⃣ Num classes
num_labels = len(dataset["train"].features[label_column].names)
print(f"Number of classes: {num_labels}")

# 6️⃣ Model (will re-init head because num_labels differs)
model = AutoModelForImageClassification.from_pretrained(
    "google/mobilenet_v2_1.0_224",
    num_labels=num_labels,
    ignore_mismatched_sizes=True,
)

# 7️⃣ Training args
training_args = TrainingArguments(
    output_dir="./results",
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=3,
    logging_dir="./logs",
    logging_steps=50,
    save_strategy="epoch",
    save_total_limit=2,
    eval_strategy="epoch",
    load_best_model_at_end=True,
    metric_for_best_model="accuracy",
    report_to=None,
    remove_unused_columns=False,
    dataloader_pin_memory=False,  # helpful on CPU-only machines
)

# 8️⃣ Metrics (robust to torch tensors / numpy arrays)
metric = load("accuracy")

def compute_metrics(eval_pred):
    preds = eval_pred.predictions
    # handle tuple outputs or torch tensors
    if isinstance(preds, tuple):
        preds = preds[0]
    if isinstance(preds, torch.Tensor):
        preds = preds.detach().cpu().numpy()
    preds = np.argmax(preds, axis=-1)
    refs = eval_pred.label_ids
    if isinstance(refs, torch.Tensor):
        refs = refs.detach().cpu().numpy()
    return metric.compute(predictions=preds, references=refs)

# 9️⃣ Trainer: use processing_class (not tokenizer) and default_data_collator
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset["train"],
    eval_dataset=dataset["test"],
    processing_class=processor,             # replace deprecated tokenizer=
    data_collator=default_data_collator,    # handles torch tensors / numpy arrays
    compute_metrics=compute_metrics,
)

# 🔟 Train
if __name__ == "__main__":
    trainer.train()
