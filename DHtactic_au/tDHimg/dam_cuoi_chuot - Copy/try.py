import cv2
import numpy as np
import os
from pathlib import Path

img = cv2.imread("damcuoichuot_original.jpg")
Path("augmented").mkdir(exist_ok=True)

for i in range(50):
    aug = img.copy()
    # random rotate, brightness, blur, flip...
    angle = np.random.uniform(-18, 18)
    h, w = aug.shape[:2]
    M = cv2.getRotationMatrix2D((w//2, h//2), angle, 1)
    aug = cv2.warpAffine(aug, M, (w, h))

    brightness = np.random.uniform(0.7, 1.4)
    aug = cv2.convertScaleAbs(aug, alpha=brightness, beta=0)

    if np.random.rand() > 0.5:
        aug = cv2.flip(aug, 1)

    cv2.imwrite(f"augmented/dongho_{i+1:03d}.jpg", aug)

print("Xong! 50 ảnh trong folder 'augmented'")