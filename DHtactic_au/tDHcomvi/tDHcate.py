import torch
import os
import torchvision
from torchvision import datasets, transforms, models
from torch import nn, optim
import random
from torch.utils.data import Dataset

class AugmentedDataset(Dataset):
    def __init__(self, base_dataset, transform=None, num_augmentations=5):
        self.base_dataset = base_dataset
        self.transform = transform
        self.num_augmentations = num_augmentations

    def __len__(self):
        return len(self.base_dataset) * self.num_augmentations

    def __getitem__(self, idx):
        original_idx = idx // self.num_augmentations
        image, label = self.base_dataset[original_idx]
        if self.transform:
            image = self.transform(image)
        return image, label

# Define data augmentations for training
train_transform = transforms.Compose([
    transforms.RandomRotation(30),
    transforms.RandomResizedCrop(224, scale=(0.8, 1.0)),
    transforms.RandomHorizontalFlip(),
    transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.2),
    transforms.RandomAffine(degrees=0, translate=(0.1, 0.1), scale=(0.9, 1.1)),
    transforms.RandomPerspective(distortion_scale=0.2, p=0.5),
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

# Define transformations for validation and testing (no augmentation)
val_test_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

# Dataset
base_train_transform = transforms.Compose([
    transforms.Resize((224, 224)),
])

# Dataset
base_full_dataset = datasets.ImageFolder(root=os.path.join(os.path.dirname(__file__), "..", "tDHimg"), transform=base_train_transform)

# Split dataset into training and evaluation sets
total_size = len(base_full_dataset)
train_size = int(0.7 * total_size)
eval_size = total_size - train_size

# Create a dataset for training with train_transform
train_base_dataset = datasets.ImageFolder(root=os.path.join(os.path.dirname(__file__), "..", "tDHimg"), transform=base_train_transform)

# Create the augmented training dataset
train_full_dataset = AugmentedDataset(train_base_dataset, transform=train_transform, num_augmentations=500)

# Create a dataset for evaluation with val_test_transform
eval_full_dataset = datasets.ImageFolder(root=os.path.join(os.path.dirname(__file__), "..", "tDHimg"), transform=val_test_transform)

# Split indices
indices = list(range(total_size))
random.shuffle(indices)

train_indices = indices[:train_size]
eval_indices = indices[train_size:]

train_dataset = torch.utils.data.Subset(train_full_dataset, train_indices)
eval_dataset = torch.utils.data.Subset(eval_full_dataset, eval_indices)

print(f"Total dataset size: {total_size}")
print(f"Train set size: {len(train_dataset)}")
print(f"Evaluation set size: {len(eval_dataset)}")
print(f"Number of classes: {len(base_full_dataset.classes)}")
print(f"Class to index mapping: {base_full_dataset.class_to_idx}")

# DataLoaders
train_loader = torch.utils.data.DataLoader(train_dataset, batch_size=8, shuffle=True)
eval_loader = torch.utils.data.DataLoader(eval_dataset, batch_size=8, shuffle=False)

# Model (ResNet18)
model = models.resnet18(pretrained=True)
model.fc = nn.Linear(model.fc.in_features, len(base_full_dataset.classes))

# Loss & Optimizer
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# Training loop with evaluation
num_epochs = 100

for epoch in range(num_epochs):
    model.train()
    running_loss = 0.0
    for inputs, labels in train_loader:
        optimizer.zero_grad()
        outputs = model(inputs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        running_loss += loss.item()
    
    print(f"Epoch {epoch+1}/{num_epochs}, Training Loss: {running_loss/len(train_loader):.4f}")

    # Evaluation phase
    model.eval()
    correct = 0
    total = 0
    with torch.no_grad():
        for inputs, labels in eval_loader:
            outputs = model(inputs)
            _, predicted = torch.max(outputs.data, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
    
    eval_accuracy = 100 * correct / total
    print(f"Evaluation Accuracy: {eval_accuracy:.2f}%")

print("Training complete.")

torch.save(model.state_dict(), os.path.join(os.path.dirname(__file__), "dongho_resnet18.pth"))
print("Model saved to dongho_resnet18.pth")

# Collect all predicted and true labels for detailed analysis
all_predicted = []
all_labels = []
model.eval()
with torch.no_grad():
    for inputs, labels in eval_loader:
        outputs = model(inputs)
        _, predicted = torch.max(outputs.data, 1)
        all_predicted.extend(predicted.cpu().numpy())
        all_labels.extend(labels.cpu().numpy())

print("\n--- Detailed Evaluation Results ---")
print(f"Predicted Labels: {all_predicted}")
print(f"True Labels: {all_labels}")
