import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from collections import Counter

# 1. Đọc dữ liệu
df = pd.read_csv('dong_ho_dataset.csv') # Nhớ đổi tên file của bạn

# Thiết lập style cho biểu đồ
sns.set(style="whitegrid")

# 2. Biểu đồ Phân bố Đề tài (Cultural Category)
plt.figure(figsize=(10, 6))
sns.countplot(y='Cultural_Category', data=df,
              order = df['Cultural_Category'].value_counts().index,
              palette='viridis')
plt.title('Phân bố Đề tài Văn hóa trong Tranh Đông Hồ', fontsize=15)
plt.xlabel('Số lượng tranh')
plt.ylabel('Đề tài')
plt.tight_layout()
plt.show()

# 3. Biểu đồ Phân tích Cảm xúc (Sentiment Distribution)
plt.figure(figsize=(10, 6))
sns.histplot(df['Sentiment_Score'], bins=10, kde=True, color='purple')
plt.title('Phân tích Chỉ số Cảm xúc của các Họa tiết', fontsize=15)
plt.xlabel('Điểm Cảm xúc (-1: Tiêu cực đến +1: Tích cực)')
plt.ylabel('Tần suất')
plt.axvline(x=0, color='red', linestyle='--') # Đường trung bình
plt.show()

# 4. Phân tích Từ khóa Ý nghĩa (Ontological Concepts)
# Tách các từ khóa từ chuỗi (ví dụ: "Prosperity, Joy" -> "Prosperity", "Joy")
concepts = df['Ontological_Concept'].str.split(', ').sum()
concept_counts = Counter(concepts)
common_concepts = pd.DataFrame(concept_counts.most_common(10), columns=['Concept', 'Count'])

plt.figure(figsize=(12, 6))
sns.barplot(x='Count', y='Concept', data=common_concepts, palette='rocket')
plt.title('Top 10 Khái niệm Văn hóa cốt lõi', fontsize=15)
plt.xlabel('Số lần xuất hiện')
plt.show()