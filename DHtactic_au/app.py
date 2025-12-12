import streamlit as st
import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from PIL import Image, ImageDraw
from streamlit_image_coordinates import streamlit_image_coordinates

# --- CẤU HÌNH TRANG WEB ---
st.set_page_config(page_title="Dong Ho Tactile Audio", page_icon="🎨", layout="wide")

# --- KHỞI TẠO SESSION STATE (QUAN TRỌNG) ---
if 'ai_boxes' not in st.session_state:
    # Đây là tọa độ mặc định. Bạn sẽ dùng công cụ bên dưới để sửa lại cho chuẩn.
    st.session_state.ai_boxes = {
        "Con Mèo (The Cat)": [400, 50, 550, 250],   
        "Chuột đi đầu (Leading Rat)": [280, 150, 380, 250],
        "Con Cá (The Fish)": [300, 180, 350, 220], # Thêm box riêng cho con cá
        "Kèn Trống (Instruments)": [50, 180, 200, 300]
    }

# --- HÀM HỖ TRỢ: VẼ KHUNG ---
def visualize_ai_analysis(image_path, ai_boxes_data, active_box=None):
    try:
        img = Image.open(image_path)
        draw = ImageDraw.Draw(img)
        
        # Vẽ tất cả các khung
        for name, coords in ai_boxes_data.items():
            # Nếu phát hiện trúng vùng click thì vẽ màu ĐỎ đậm, còn lại màu XANH nhạt
            if name == active_box:
                color = "red"
                width = 5
            else:
                color = "blue"
                width = 2
            
            # Vẽ hình chữ nhật
            draw.rectangle(coords, outline=color, width=width)
            
            # Vẽ nền nhãn
            draw.rectangle((coords[0], coords[1]-15, coords[0]+100, coords[1]), fill=color)
            draw.text((coords[0]+5, coords[1]-12), name, fill="white")

        return img
    except Exception as e:
        st.error(f"Lỗi xử lý ảnh: {e}")
        return None

# --- HÀM CALLBACK CẬP NHẬT TỌA ĐỘ (ĐÃ FIX LỖI KEY ERROR) ---
def update_coords(obj_name, axis_index, widget_key):
    # Lấy giá trị mới từ widget thông qua key
    new_value = st.session_state[widget_key]
    # Cập nhật vào dữ liệu gốc
    st.session_state.ai_boxes[obj_name][axis_index] = new_value

# --- 1. LOAD MODEL (Tự động tải model xịn về) ---
# 'yolov8n.pt' là bản nhẹ nhất, chạy mượt trên web


# --- GIAO DIỆN CHÍNH ---
st.title("🎨 Dong Ho Folk Painting: A Multimodal Tactile Interface")

# Đường dẫn ảnh (Sửa lại đường dẫn này nếu cần cho đúng máy bạn)
# Mẹo: Dùng os.path.join để tránh lỗi đường dẫn Windows/Mac
base_dir = os.path.dirname(os.path.abspath(__file__))
img_file_path = os.path.join(base_dir, "tDHimg", "dam_cuoi_chuot", "dam_cuoi_chuot.jpg") 
# Lưu ý: Nếu ảnh bạn để trong thư mục con dam_cuoi_chuot thì thêm vào path nhé



st.header("👆 Interactive Tactile Interface")
st.write("Click vào tranh để kiểm tra vùng nhận diện. Dùng bảng bên phải để tinh chỉnh tọa độ.")

value = None # Initialize value to None globally
found_object = None # Initialize found_object to None globally
col_sim_1, col_sim_2 = st.columns([2, 1])

with col_sim_1:
    # 1. Hiển thị ảnh & Bắt sự kiện Click
    if os.path.exists(img_file_path):
        img_pil = Image.open(img_file_path)
        
        # Lấy tọa độ click (Streamlit sẽ rerun mỗi khi click)
        value = streamlit_image_coordinates(img_pil, key="pil")
        
        # Xử lý Logic Hit-Test (Kiểm tra va chạm)
        # found_object initialization removed from here as it is now global
        if value:
            click_x = value['x']
            click_y = value['y']
            
            # Duyệt qua các box để xem click trúng cái nào
            for name, coords in st.session_state.ai_boxes.items():
                if coords[0] <= click_x <= coords[2] and coords[1] <= click_y <= coords[3]:
                    found_object = name
                    break # Ưu tiên box nào tìm thấy trước (hoặc box nhỏ hơn nếu lồng nhau)

        # Hiển thị ảnh kết quả (Vẽ khung đè lên ảnh gốc) ở bên dưới để đối chiếu
        st.caption("👁️ AI Vision Layer (Kết quả nhận diện):")
        processed_img = visualize_ai_analysis(img_file_path, st.session_state.ai_boxes, found_object)
        if processed_img:
            st.image(processed_img, use_column_width=True)
            
    else:
        st.error(f"Không tìm thấy ảnh tại: {img_file_path}")

with col_sim_2:
    st.subheader("🛠️ Calibration Tool (Công cụ chỉnh sửa)")
    
    # Hiển thị tọa độ vừa click để dễ copy
    if value:
        st.info(f"📍 Tọa độ vừa click: **X={value['x']}, Y={value['y']}**")
    else:
        st.write("👈 Click vào ảnh để xem tọa độ.")

    # Hiển thị kết quả nhận diện
    if found_object:
        st.success(f"🎯 Đã phát hiện: **{found_object}**")
        if found_object == "Con Cá (The Fish)":
             st.json({"Meaning": "Bribery (Hối lộ)", "Holder": "Leading Rat"})
    elif value:
        st.warning("❌ Click vào vùng trống (Chưa có Box). Hãy dùng tọa độ trên để tạo Box mới.")

    st.markdown("---")
    st.write("### 📐 Chỉnh sửa Bounding Box")
    
    # Dropdown chọn đối tượng cần sửa
    object_names = list(st.session_state.ai_boxes.keys())
    selected_object = st.selectbox("Chọn đối tượng:", object_names)

    if selected_object:
        current = st.session_state.ai_boxes[selected_object]
        
        col1, col2 = st.columns(2)
        with col1:
            # Sửa lỗi args: Truyền TÊN KEY (string) chứ không truyền giá trị
            k1 = f"{selected_object}_x_min"
            st.number_input("X Min (Trái)", 0, 1000, current[0], key=k1, on_change=update_coords, args=(selected_object, 0, k1))
            
            k2 = f"{selected_object}_y_min"
            st.number_input("Y Min (Trên)", 0, 1000, current[1], key=k2, on_change=update_coords, args=(selected_object, 1, k2))
            
        with col2:
            k3 = f"{selected_object}_x_max"
            st.number_input("X Max (Phải)", 0, 1000, current[2], key=k3, on_change=update_coords, args=(selected_object, 2, k3))
            
            k4 = f"{selected_object}_y_max"
            st.number_input("Y Max (Dưới)", 0, 1000, current[3], key=k4, on_change=update_coords, args=(selected_object, 3, k4))

        st.info("Mẹo: Click vào góc trên-trái của con vật -> Copy X, Y vào ô Min. Click vào góc dưới-phải -> Copy X, Y vào ô Max.")

