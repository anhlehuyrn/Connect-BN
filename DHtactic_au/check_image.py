from PIL import Image

try:
    Image.open("tDHimg/dam_cuoi_chuot.jpg")
    print("Image opened successfully!")
except FileNotFoundError:
    print("Error: Image file not found.")
except Exception as e:
    print(f"Error opening image: {e}")