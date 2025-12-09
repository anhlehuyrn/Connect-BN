import streamlit as st
import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Cấu hình trang web
st.set_page_config(page_title="Dong Ho Tactile Audio", page_icon="🎨", layout="wide")

# Tiêu đề chính
st.title("🎨 Dong Ho Folk Painting: A Multimodal Tactile Interface")
st.markdown("**Project by:** Le Huyen Anh | **Target:** Inclusive Heritage Accessibility")

# Tạo các tab (Menu)
tab1, tab2, tab3 = st.tabs(["📖 Story & Vision", "📊 Data Explorer", "👆 Tactile Simulation"])

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
        # Bạn thay bằng ảnh bìa dự án của bạn
        image_path = os.path.join(os.path.dirname(__file__), "tDHimg/dam_cuoi_chuot.jpg")
        st.image(image_path, caption="Đám cưới chuột - Rat's Wedding")

# --- TAB 2: DỮ LIỆU (Khoe kỹ năng Data) ---
with tab2:
    st.header("The 'OntoLex-Lemon' Dataset")
    st.write("Dữ liệu được cấu trúc hóa để liên kết Hình ảnh với Ý nghĩa (Semantics).")
    
    # Load dữ liệu của bạn (Nhớ để file csv cùng thư mục)
    try:
        df = pd.read_csv('data_1.xlsx - Sheet1.csv') # Đổi tên file cho đúng
        st.dataframe(df) # Hiển thị bảng dữ liệu tương tác
        
        # Vẽ biểu đồ ngay trên web
        st.subheader("📊 Quantitative Analysis")
        fig, ax = plt.subplots()
        sns.countplot(y='Cultural_Category', data=df, palette='viridis', ax=ax)
        st.pyplot(fig)
    except:
        st.warning("⚠️ Hãy upload file 'dong_ho_dataset.csv' lên GitHub để xem dữ liệu.")

# --- TAB 3: MÔ PHỎNG (Khoe tính năng) ---
with tab3:
    st.header("Digital Twin Simulation")
    st.write("Hãy chọn một vùng trên tranh để trải nghiệm 'Cảm giác' của người khiếm thị.")
    
    col_sim_1, col_sim_2 = st.columns([1, 2])
    
    with col_sim_1:
        # Giả lập hành động chạm bằng Dropdown list
        option = st.selectbox(
            "Bạn đang chạm vào đâu?",
            ("Con Mèo (The Cat)", "Con Chuột đi đầu (Leading Rat)", "Kèn Trống (Instruments)")
        )
        
        if st.button("👆 Chạm (Touch)"):
            st.success(f"Đã kích hoạt cảm biến tại: **{option}**")
            
            # Logic giả lập AI phản hồi
            if option == "Con Mèo (The Cat)":
                st.audio("https://www.soundjay.com/nature/sounds/cat-meow-01.mp3") # Link âm thanh ví dụ
                st.markdown("> **AI Description:** *Đây là con Mèo già, đại diện cho giai cấp thống trị tham lam. Tay nó đang nhận hối lộ.*")
                st.code("Concept: Corruption | Sentiment: Negative (-0.8)", language="json")
            
            elif option == "Kèn Trống (Instruments)":
                st.markdown("> **AI Description:** *Tiếng kèn đám ma nhưng lại thổi trong đám cưới, thể hiện sự bi hài của xã hội thực dân.*")
                st.code("Concept: Satire | Sentiment: Mixed", language="json")

    with col_sim_2:
        image_path_sim = os.path.join(os.path.dirname(__file__), "tDHimg/dam_cuoi_chuot.jpg")
        st.image(image_path_sim, width=500)