# --- PHẦN 1: CHUẨN BỊ MÔI TRƯỜNG & DỮ LIỆU ---
import os
import zipfile
import torch
import torchvision
from torchvision import datasets, transforms, models
from torch import nn, optim
from torch.utils.data import Dataset, DataLoader
import matplotlib.pyplot as plt
import numpy as np
from sklearn.metrics import confusion_matrix
import seaborn as sns
from PIL import Image

# Giải nén dữ liệu (Nếu bạn đã upload tDHimg.zip)
if os.path.exists("tDHimg.zip"):
    with zipfile.ZipFile("tDHimg.zip", 'r') as zip_ref:
        zip_ref.extractall(".")
    print("Đã giải nén dữ liệu thành công!")
else:
    print("⚠️ Chú ý: Hãy upload file tDHimg.zip lên Colab trước!")

# Thiết lập thiết bị (Dùng GPU nếu có)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Đang sử dụng thiết bị: {device}")

# --- PHẦN 2: XỬ LÝ DỮ LIỆU (ĐÃ SỬA LỖI LOGIC) ---

# Chuẩn hóa theo ImageNet (Bắt buộc cho ResNet)
normalize = transforms.Normalize(mean=[0.485, 0.456, 0.406],
                                 std=[0.229, 0.224, 0.225])

# Transform cho tập Train (Có Augmentation để chống học vẹt)
train_transform = transforms.Compose([
    transforms.RandomRotation(30),
    transforms.RandomResizedCrop(224, scale=(0.8, 1.0)),
    transforms.RandomHorizontalFlip(),
    transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.2),
    transforms.ToTensor(),
    normalize
])

# Transform cho tập Val (Chỉ resize và chuẩn hóa)
val_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    normalize
])

# Đường dẫn dữ liệu (Giả sử giải nén ra thư mục tDHimg)
data_dir = "./tDHimg"

try:
    # Load toàn bộ dữ liệu thô trước
    full_dataset = datasets.ImageFolder(root=data_dir)
    classes = full_dataset.classes
    print(f"Tìm thấy {len(classes)} loại tranh: {classes}")

    # Chia tập Train (70%) và Val (30%)
    train_size = int(0.7 * len(full_dataset))
    val_size = len(full_dataset) - train_size
    train_dataset_raw, val_dataset_raw = torch.utils.data.random_split(full_dataset, [train_size, val_size])

    # Class wrapper để áp dụng transform riêng biệt (SỬA LỖI LOGIC CŨ)
    class AppliedTransformDataset(Dataset):
        def __init__(self, subset, transform=None):
            self.subset = subset
            self.transform = transform
        def __getitem__(self, index):
            x, y = self.subset[index]
            if self.transform:
                x = self.transform(x)
            return x, y
        def __len__(self):
            return len(self.subset)

    train_dataset = AppliedTransformDataset(train_dataset_raw, transform=train_transform)
    eval_dataset = AppliedTransformDataset(val_dataset_raw, transform=val_transform)

    # Dataloaders
    train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
    eval_loader = DataLoader(eval_dataset, batch_size=32, shuffle=False)

except Exception as e:
    print(f"Lỗi load dữ liệu: {e}")
    print("Hãy đảm bảo cấu trúc thư mục là: tDHimg/Ten_Loai_Tranh/anh.jpg")

# --- PHẦN 3: XÂY DỰNG & TRAIN MODEL ---

# Load ResNet18
model = models.resnet18(pretrained=True)
# Thay đổi lớp cuối cùng cho phù hợp số lượng tranh của bạn
model.fc = nn.Linear(model.fc.in_features, len(classes))
model = model.to(device)

criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

num_epochs = 20 # Train thử 20 epoch (Tăng lên nếu cần)
best_acc = 0.0

print("\nBắt đầu Training...")
for epoch in range(num_epochs):
    model.train()
    running_loss = 0.0
    
    for inputs, labels in train_loader:
        inputs, labels = inputs.to(device), labels.to(device)
        
        optimizer.zero_grad()
        outputs = model(inputs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        running_loss += loss.item()
    
    # Đánh giá sau mỗi epoch
    model.eval()
    correct = 0
    total = 0
    with torch.no_grad():
        for inputs, labels in eval_loader:
            inputs, labels = inputs.to(device), labels.to(device)
            outputs = model(inputs)
            _, predicted = torch.max(outputs.data, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
    
    acc = 100 * correct / total
    print(f"Epoch {epoch+1}/{num_epochs} | Loss: {running_loss/len(train_loader):.4f} | Val Acc: {acc:.2f}%")
    
    # Lưu model tốt nhất
    if acc > best_acc:
        best_acc = acc
        torch.save(model.state_dict(), "dongho_resnet18_best.pth")

print(f"\nĐã train xong! Độ chính xác cao nhất: {best_acc:.2f}%")
print("Model đã lưu tại: dongho_resnet18_best.pth")

# --- PHẦN 4: ĐÁNH GIÁ CHI TIẾT (CONFUSION MATRIX) ---
# Đây là phần bạn cần bổ sung để báo cáo trở nên chuyên nghiệp

all_preds = []
all_labels = []

model.load_state_dict(torch.load("dongho_resnet18_best.pth")) # Load lại model tốt nhất
model.eval()

with torch.no_grad():
    for inputs, labels in eval_loader:
        inputs = inputs.to(device)
        outputs = model(inputs)
        _, predicted = torch.max(outputs, 1)
        all_preds.extend(predicted.cpu().numpy())
        all_labels.extend(labels.numpy())

# Vẽ Confusion Matrix
cm = confusion_matrix(all_labels, all_preds)
plt.figure(figsize=(10, 8))
sns.heatmap(cm, annot=True, fmt='d', xticklabels=classes, yticklabels=classes, cmap='Blues')
plt.xlabel('Predicted')
plt.ylabel('True')
plt.title('Confusion Matrix - Dong Ho Painting Classification')
plt.show()

# --- PHẦN 5: VISUALIZE KẾT QUẢ ---
# Hiển thị thử một vài ảnh và dự đoán
def imshow(inp, title=None):
    inp = inp.cpu().numpy().transpose((1, 2, 0))
    mean = np.array([0.485, 0.456, 0.406])
    std = np.array([0.229, 0.224, 0.225])
    inp = std * inp + mean
    inp = np.clip(inp, 0, 1)
    plt.imshow(inp)
    if title:
        plt.title(title)
    plt.pause(0.001)

# Lấy 1 batch ảnh
inputs, classes_idx = next(iter(eval_loader))
inputs = inputs.to(device)
outputs = model(inputs)
_, preds = torch.max(outputs, 1)

plt.figure(figsize=(15, 5))
# Hiện 4 ảnh đầu tiên
for i in range(4):
    ax = plt.subplot(1, 4, i+1)
    ax.axis('off')
    title = f"Thực: {classes[classes_idx[i]]}\nĐoán: {classes[preds[i]]}"
    imshow(inputs[i], title)
plt.show()