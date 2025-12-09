import torch
import os
from torchvision import transforms, models
from PIL import Image
import matplotlib.pyplot as plt

# --- CẤU HÌNH ---
MODEL_PATH = "tDHcomvi/dongho_resnet18.pth" # File model bạn vừa tạo
DATA_DIR = "tDHimg"                # Thư mục ảnh để lấy tên Class

# Hàm lấy tên class tự động từ tên thư mục (đảm bảo đúng thứ tự lúc train)
def get_class_names(data_dir):
    if not os.path.exists(data_dir):
        print(f"❌ Lỗi: Không tìm thấy thư mục '{data_dir}' để lấy tên Class.")
        return []
    # Lấy tên các thư mục con và sắp xếp theo bảng chữ cái (mặc định của ImageFolder)
    classes = sorted([d.name for d in os.scandir(data_dir) if d.is_dir()])
    print(f"✅ Đã tìm thấy {len(classes)} classes: {classes}")
    return classes

def load_model(num_classes):
    # Load kiến trúc ResNet18
    model = models.resnet18(pretrained=False)
    # Sửa lớp cuối cùng cho khớp số lượng class
    model.fc = torch.nn.Linear(model.fc.in_features, num_classes)
    
    # Load trọng số đã train
    try:
        model.load_state_dict(torch.load(MODEL_PATH, map_location=torch.device('cpu')))
        print("✅ Đã load 'dongho_resnet18.pth' thành công!")
    except FileNotFoundError:
        print(f"❌ Lỗi: Không tìm thấy file '{MODEL_PATH}'")
        return None
        
    model.eval()
    return model

def predict_image(image_path, model, class_names):
    # Chuẩn hóa ảnh y hệt lúc train
    preprocess = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    
    try:
        image = Image.open(image_path).convert("RGB")
        img_tensor = preprocess(image).unsqueeze(0) # Thêm batch dimension
        
        with torch.no_grad():
            outputs = model(img_tensor)
            # Lấy xác suất (Softmax)
            probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
            confidence, predicted_idx = torch.max(probabilities, 0)
            
        return class_names[predicted_idx], confidence.item(), image
    except Exception as e:
        print(f"Lỗi đọc ảnh: {e}")
        return None, 0, None

# --- CHẠY THỬ ---
if __name__ == "__main__":
    # 1. Lấy danh sách class
    class_names = get_class_names(DATA_DIR)
    
    if class_names:
        # 2. Load model
        model = load_model(len(class_names))
        
        if model:
            # 3. Chọn 1 ảnh để test (Sửa đường dẫn này thành ảnh bạn muốn thử)
            # Ví dụ: Thử lấy ảnh đầu tiên trong thư mục con đầu tiên
            test_dir = os.path.join(DATA_DIR, class_names[0]) 
            test_img_name = os.listdir(test_dir)[0]
            test_image_path = os.path.join(test_dir, test_img_name)
            
            print(f"\n🔍 Đang đoán ảnh: {test_image_path}")
            pred_label, conf, img = predict_image(test_image_path, model, class_names)
            
            # 4. Hiển thị kết quả
            print(f"🎯 Kết quả: {pred_label} (Độ tin cậy: {conf*100:.2f}%)")
            
            # Vẽ ảnh lên để xem
            plt.imshow(img)
            plt.title(f"AI đoán: {pred_label} ({conf*100:.1f}%)")
            plt.axis('off')
            plt.show()