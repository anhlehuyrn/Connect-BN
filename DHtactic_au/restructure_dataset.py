import os
import glob
import shutil

base_dir = "c:\\Users\\leeka\\Documents\\0. ER pl\\smart blink\\DHtactic_au\\tDHimg"
default_dir = os.path.join(base_dir, "default")

# List all jpg files in the default directory
jpg_files = glob.glob(os.path.join(default_dir, "*.jpg"))

for jpg_file in jpg_files:
    # Get the filename without extension (e.g., "choi_ca")
    file_name_with_ext = os.path.basename(jpg_file)
    file_name_without_ext = os.path.splitext(file_name_with_ext)[0]

    # Create a new directory for this class (e.g., "tDHimg/choi_ca")
    class_dir = os.path.join(base_dir, file_name_without_ext)
    os.makedirs(class_dir, exist_ok=True)

    # Move the image into its class directory
    shutil.move(jpg_file, os.path.join(class_dir, file_name_with_ext))
    print(f"Moved {file_name_with_ext} to {class_dir}")

# Optionally, remove the now empty 'default' directory
# os.rmdir(default_dir)

print("Dataset restructured successfully.")