import streamlit as st
import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from PIL import Image, ImageDraw, ImageFont

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

# --- TAB 3: MÔ PHỎNG (Khoe tính năng AI Vision) ---
with tab3:
    st.header("Digital Twin Simulation with AI Vision")
    
    col_sim_1, col_sim_2 = st.columns([1, 2])
    
    with col_sim_1:
        st.subheader("🎮 Control Panel")
        
        # Nút gạt bật tắt chế độ AI
        ai_mode = st.checkbox("👁️ Activate AI Vision (Object Detection)", value=True)
        st.caption("*Mô phỏng lớp phân tích Computer Vision (YOLO/ResNet)*")
        
        st.markdown("---")
        
        # Chọn vùng chạm (Dùng Radio button nhìn sẽ trực quan hơn Selectbox)
        option = st.radio(
            "📍 Select Touch Point (Chọn điểm chạm):",
            ("None", "Con Mèo (The Cat)", "Con Chuột đi đầu (Leading Rat)", "Kèn Trống (Instruments)")
        )
        
        st.markdown("---")
        
        # Hiển thị kết quả phân tích
        if option != "None":
            st.success(f"Detected Interaction: **{option}**")
            
            # Logic giả lập AI phản hồi
            if option == "Con Mèo (The Cat)":
                st.audio("https://www.soundjay.com/nature/sounds/cat-meow-01.mp3") 
                st.markdown("> **AI Description:** *Đây là con Mèo già, đại diện cho giai cấp thống trị tham lam. Tay nó đang nhận hối lộ.*")
                # Hiển thị dạng JSON để khoe cấu trúc dữ liệu
                st.json({"Concept": "Corruption", "Confidence": 0.98, "Region_ID": "box_01", "OntoLex": "Cat_Official"})
            
            elif option == "Con Chuột đi đầu (Leading Rat)":
                st.markdown("> **AI Description:** *Chú chuột dâng cá, thể hiện sự khúm núm đút lót để được yên thân.*")
                st.json({"Concept": "Bribery/Survival", "Confidence": 0.95, "Region_ID": "box_02", "OntoLex": "Rat_Tribute"})
                
            elif option == "Kèn Trống (Instruments)":
                st.markdown("> **AI Description:** *Tiếng kèn đám ma nhưng lại thổi trong đám cưới, thể hiện sự bi hài và châm biếm.*")
                st.json({"Concept": "Satire", "Confidence": 0.92, "Region_ID": "box_03", "OntoLex": "Irony_Music"})

    with col_sim_2:
        st.subheader("🖼️ Real-time Interface")
        
        if os.path.exists(img_file_path):
            if ai_mode:
                # Nếu bật AI Mode thì gọi hàm vẽ khung
                # Truyền active_box (option) vào để tô đậm vùng đang chọn
                processed_img = visualize_ai_analysis(img_file_path, active_box=option)
                if processed_img:
                    st.image(processed_img, caption="Computer Vision Layer (Simulation)", use_column_width=True)
            else:
                # Nếu tắt thì hiện ảnh gốc
                st.image(img_file_path, caption="Original Woodblock Print", use_column_width=True)
        else:
            st.error("⚠️ Không tìm thấy ảnh để hiển thị.")