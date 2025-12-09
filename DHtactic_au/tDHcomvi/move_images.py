import os
import glob
import shutil

source_dir = "c:\\Users\\leeka\\Documents\\0. ER pl\\smart blink\\DHtactic_au\\tDHimg"
dest_dir = os.path.join(source_dir, "default")

# Create the destination directory if it doesn't exist
os.makedirs(dest_dir, exist_ok=True)

# Move .jpg files
for jpg_file in glob.glob(os.path.join(source_dir, "*.jpg")):
    shutil.move(jpg_file, dest_dir)
    print(f"Moved {jpg_file} to {dest_dir}")

print("All .jpg files moved.")