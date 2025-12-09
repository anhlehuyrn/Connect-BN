import streamlit as st
import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from PIL import Image, ImageDraw, ImageFont
from streamlit_image_coordinates import streamlit_image_coordinates

# --- CẤU HÌNH TRANG WEB ---
st.set_page_config(page_title="Dong Ho Tactile Audio", page_icon="🎨", layout="wide")

# --- HÀM HỖ TRỢ: VẼ BOUNDING BOX (MÔ PHỎNG AI VISION) ---
def visualize_ai_analysis(image_path, active_box=None):
    """
    Hàm này mở ảnh từ đường dẫn local, vẽ các bounding box giả lập lên đó
    để mô phỏng cách Computer Vision nhận diện vật thể.
    """
    try:
        # Mở ảnh gốc
        img = Image.open(image_path)
        draw = ImageDraw.Draw(img)
        
        # Định nghĩa tọa độ giả lập (X_min, Y_min, X_max, Y_max) cho các con vật
        # Lưu ý: Tọa độ này ước lượng dựa trên ảnh ngang. Bạn có thể chỉnh lại số cho khớp ảnh thật.
        boxes = {
            "Con Mèo (The Cat)": [(450, 50, 580, 200), "Cat (98%)", "red"],
            "Con Chuột đi đầu (Leading Rat)": [(320, 150, 400, 250), "Rat_Leader (95%)", "blue"],
            "Kèn Trống (Instruments)": [(50, 200, 200, 350), "Instruments (92%)", "green"]
        }

        # Vẽ tất cả các khung
        for key, (coords, label, color) in boxes.items():
            # Nếu là vùng đang chọn thì vẽ đậm (width=5), còn lại vẽ nhạt (width=2)
            width = 5 if key == active_box else 2
            
            # Vẽ hình chữ nhật
            draw.rectangle(coords, outline=color, width=width)
            
            # Vẽ nền cho nhãn (Label background) để chữ dễ đọc
            draw.rectangle((coords[0], coords[1]-20, coords[0]+120, coords[1]), fill=color)
            
            # Vẽ chữ (Nếu không có font thì dùng mặc định)
            draw.text((coords[0]+5, coords[1]-15), label, fill="white")

        return img
    except Exception as e:
        st.error(f"Lỗi xử lý ảnh: {e}")
        return None

# --- TIÊU ĐỀ CHÍNH ---
st.title("🎨 Dong Ho Folk Painting: A Multimodal Tactile Interface")
st.markdown("**Project by:** Le Huyen Anh | **Target:** Inclusive Heritage Accessibility")

# Tạo các tab (Menu)
tab1, tab2, tab3 = st.tabs(["📖 Story & Vision", "📊 Data Explorer", "👆 Tactile Simulation"])

# Đường dẫn ảnh chung (Sửa lại cho chuẩn với cấu trúc thư mục của bạn)
# Giả sử ảnh nằm trong thư mục tDHimg cùng cấp với file app.py
img_file_path = os.path.join(os.path.dirname(__file__), "tDHimg/dam_cuoi_chuot.jpg")

# --- TAB 1: CÂU CHUYỆN ---
with tab1:
    st.header("Bridging the Sensory Gap")
    col1, col2 = st.columns(2)
    with col1:
        st.write("""
        Tranh dân gian Đông Hồ là di sản quý giá, nhưng người khiếm thị không thể 'xem' được.
        Dự án này sử dụng **Big Data** và **AI** để chuyển đổi dữ liệu thị giác thành:
        - 🔊 **Âm thanh** (Mô tả & Âm nhạc)
        - 🧠 **Tri thức** (Ngữ nghĩa văn hóa theo chuẩn OntoLex-Lemon)
        """)
        st.info("💡 Inspired by the 'Red Hen Lab' multimodal research vision.")
    with col2:
        if os.path.exists(img_file_path):
            st.image(img_file_path, caption="Đám cưới chuột - Rat's Wedding")
        else:
            st.error("⚠️ Không tìm thấy file ảnh. Hãy kiểm tra lại thư mục 'tDHimg'.")

# --- TAB 2: DỮ LIỆU (Khoe kỹ năng Data) ---
with tab2:
    st.header("The 'OntoLex-Lemon' Dataset")
    st.write("Dữ liệu được cấu trúc hóa để liên kết Hình ảnh với Ý nghĩa (Semantics).")
    
    # Load dữ liệu của bạn
    try:
        df = pd.read_csv('data_1.xlsx - Sheet1.csv') # Đảm bảo tên file đúng
        st.dataframe(df) # Hiển thị bảng dữ liệu tương tác
        
        # Vẽ biểu đồ ngay trên web
        st.subheader("📊 Quantitative Analysis")
        fig, ax = plt.subplots()
        sns.countplot(y='Cultural_Category', data=df, palette='viridis', ax=ax)
        st.pyplot(fig)
    except Exception as e:
        st.warning(f"⚠️ Chưa load được dữ liệu: {e}")
        st.info("Hãy upload file 'data_1.xlsx - Sheet1.csv' lên cùng thư mục với app.py")

# --- CẬP NHẬT TAB 3: TƯƠNG TÁC CHẠM THẬT ---
with tab3:
    st.header("👆 Interactive Tactile Interface")
    st.write("Hãy click trực tiếp vào các nhân vật trong tranh để xem AI phân tích.")

    col_sim_1, col_sim_2 = st.columns([2, 1])

    # Đường dẫn ảnh
    img_path = "tDHimg/dam_cuoi_chuot.jpg"  # Đảm bảo đường dẫn đúng

    with col_sim_1:
        # 1. Định nghĩa "Bản đồ tọa độ" (Bounding Boxes)
        # Đây là phần "Trí tuệ" của AI: AI (YOLO) đã quét và cho ta biết vị trí các con vật.
        # Cấu trúc: [x_min, y_min, x_max, y_max]
        # Lưu ý: Bạn cần căn chỉnh số này cho khớp với ảnh thật của bạn.
        # Mẹo: Click thử lên ảnh, web sẽ hiện tọa độ X, Y để bạn điền vào đây.
        ai_boxes = {
            "Con Mèo (The Cat)": [400, 50, 550, 250],   
            "Chuột đi đầu (Leading Rat)": [280, 150, 380, 250],
            "Kèn Trống (Instruments)": [50, 180, 200, 300],
            "Con Cá (The Fish)": [300, 180, 350, 220] # Ví dụ thêm con cá
        }

        # 2. Hiển thị ảnh và Bắt sự kiện Click
        # Biến 'value' sẽ trả về tọa độ {'x': 123, 'y': 456} khi người dùng click
        value = streamlit_image_coordinates(img_path, key="pil")

    with col_sim_2:
        st.subheader("🧠 AI Analysis Result")

        # 3. Xử lý Logic: Kiểm tra xem Click vào đâu?
        if value:
            click_x = value['x']
            click_y = value['y']
            
            # Biến kiểm tra xem có click trúng con nào không
            found_object = None 

            # Duyệt qua danh sách các hộp (boxes) để xem click có nằm trong đó không
            for name, coords in ai_boxes.items():
                x_min, y_min, x_max, y_max = coords
                
                # Thuật toán Hit-Test (Kiểm tra va chạm)
                if x_min <= click_x <= x_max and y_min <= click_y <= y_max:
                    found_object = name
                    break # Tìm thấy rồi thì dừng lại
            
            # 4. Hiển thị kết quả
            if found_object:
                st.success(f"🎯 Detected: **{found_object}**")
                st.write(f"📍 Coordinates: `({click_x}, {click_y})`")
                
                # Logic hiển thị nội dung (lấy từ Dataset OntoLex)
                if found_object == "Con Mèo (The Cat)":
                    st.markdown("> *Con mèo già tham lam, tay nhận hối lộ nhưng mặt vẫn ra vẻ đạo mạo.*")
                    st.json({"Concept": "Corruption", "Confidence": "98%"})
                    # st.audio("cat_sound.mp3") 
                
                elif found_object == "Con Cá (The Fish)":
                    st.markdown("> *Lễ vật hối lộ. Cá chép tượng trưng cho sự dư dả, nhưng ở đây lại dùng để mua chuộc.*")
                    st.json({"Concept": "Bribery", "Confidence": "95%"})

            else:
                st.info(f"Bạn click vào vùng trống `({click_x}, {click_y})`. Hãy thử click vào con vật!")
        else:
            st.write("👈 Hãy click vào bức tranh bên trái.")