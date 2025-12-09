import os
import torch
import torchvision
from torchvision import datasets, transforms, models
from torch import nn, optim
from torch.utils.data import Dataset, DataLoader
import matplotlib.pyplot as plt
import numpy as np
from sklearn.metrics import confusion_matrix
import seaborn as sns

# --- CẤU HÌNH ---
# Tên thư mục chứa ảnh (nằm cùng cấp với file code này)
DATA_DIR = 'tDHimg' 
BATCH_SIZE = 16 # Nếu máy yếu thì giảm xuống 8, máy mạnh tăng lên 32
NUM_EPOCHS = 20
LEARNING_RATE = 0.001

def main():
    # 1. Kiểm tra thiết bị
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"🖥️ Đang chạy trên: {device}")
    if device.type == 'cpu':
        print("⚠️ Cảnh báo: Chạy trên CPU sẽ chậm. Nếu máy có card rời NVIDIA, hãy cài PyTorch CUDA.")

    # 2. Kiểm tra dữ liệu
    if not os.path.exists(DATA_DIR):
        print(f"❌ Lỗi: Không tìm thấy thư mục '{DATA_DIR}'. Hãy kiểm tra lại cấu trúc thư mục!")
        return

    # 3. Chuẩn bị Transform (Chuẩn hóa ảnh)
    normalize = transforms.Normalize(mean=[0.485, 0.456, 0.406],
                                     std=[0.229, 0.224, 0.225])

    train_transform = transforms.Compose([
        transforms.RandomRotation(30),
        transforms.RandomResizedCrop(224, scale=(0.8, 1.0)),
        transforms.RandomHorizontalFlip(),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.2),
        transforms.ToTensor(),
        normalize
    ])

    val_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        normalize
    ])

    # 4. Load Dữ liệu & Chia tập Train/Val
    try:
        full_dataset = datasets.ImageFolder(root=DATA_DIR)
        classes = full_dataset.classes
        print(f"✅ Tìm thấy {len(classes)} loại tranh: {classes}")
        
        # Chia 70% train - 30% val
        train_size = int(0.7 * len(full_dataset))
        val_size = len(full_dataset) - train_size
        train_dataset_raw, val_dataset_raw = torch.utils.data.random_split(full_dataset, [train_size, val_size])

        # Wrapper để áp dụng transform riêng
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

        # DataLoader (num_workers=0 để tránh lỗi trên Windows)
        train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=0)
        eval_loader = DataLoader(eval_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=0)

    except Exception as e:
        print(f"❌ Lỗi load dữ liệu: {e}")
        return

    # 5. Xây dựng Model ResNet18
    print("⏳ Đang tải model ResNet18...")
    model = models.resnet18(pretrained=True)
    model.fc = nn.Linear(model.fc.in_features, len(classes))
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)

    # 6. Training Loop
    print(f"\n🚀 Bắt đầu Train trong {NUM_EPOCHS} epochs...")
    best_acc = 0.0
    history_loss = []
    history_acc = []

    for epoch in range(NUM_EPOCHS):
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
        
        # Đánh giá (Validation)
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
        
        epoch_loss = running_loss/len(train_loader)
        epoch_acc = 100 * correct / total
        history_loss.append(epoch_loss)
        history_acc.append(epoch_acc)

        print(f"Epoch {epoch+1}/{NUM_EPOCHS} | Loss: {epoch_loss:.4f} | Acc: {epoch_acc:.2f}%")

        # Lưu model tốt nhất
        if epoch_acc > best_acc:
            best_acc = epoch_acc
            torch.save(model.state_dict(), "best_dongho_model.pth")

    print(f"\n🏆 Hoàn tất! Độ chính xác cao nhất: {best_acc:.2f}%")
    print("💾 Đã lưu model tại: best_dongho_model.pth")

    # 7. Vẽ Confusion Matrix (Phiên bản đã sửa lỗi File Not Found)
    print("\n📊 Đang chuẩn bị vẽ Confusion Matrix...")
    
    # Kiểm tra xem file model có tồn tại không
    if os.path.exists("best_dongho_model.pth"):
        print("✅ Đã tìm thấy model tốt nhất, đang load lại...")
        model.load_state_dict(torch.load("best_dongho_model.pth"))
    else:
        print("⚠️ CẢNH BÁO: Không tìm thấy file 'best_dongho_model.pth'!")
        print("👉 Lý do có thể: Quá trình train chưa hoàn tất hoặc không có dữ liệu ảnh.")
        print("👉 Hệ thống sẽ sử dụng model hiện tại (Last Epoch) để vẽ biểu đồ thay thế.")
        
        # Nếu accuracy vẫn bằng 0 thì dừng luôn
        if best_acc == 0.0:
            print("❌ LỖI: Độ chính xác bằng 0%. Vui lòng kiểm tra lại thư mục 'tDHimg' xem có ảnh không!")
            return

    model.eval()
    
    all_preds = []
    all_labels = []

    print("🔄 Đang chạy dự đoán trên tập kiểm thử...")
    with torch.no_grad():
        for inputs, labels in eval_loader:
            inputs = inputs.to(device)
            outputs = model(inputs)
            _, predicted = torch.max(outputs, 1)
            all_preds.extend(predicted.cpu().numpy())
            all_labels.extend(labels.numpy())
    
    # Chỉ vẽ nếu có dữ liệu dự đoán
    if len(all_labels) > 0:
        cm = confusion_matrix(all_labels, all_preds)
        plt.figure(figsize=(10, 8))
        sns.heatmap(cm, annot=True, fmt='d', xticklabels=classes, yticklabels=classes, cmap='Blues')
        plt.xlabel('Máy đoán (Predicted)')
        plt.ylabel('Thực tế (True)')
        plt.title('Confusion Matrix - Phân loại Tranh Đông Hồ')
        plt.show()
        print("✅ Đã hiện biểu đồ!")
    else:
        print("❌ Không có dữ liệu để vẽ biểu đồ (Tập Validation trống).")