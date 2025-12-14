import speech_recognition as sr
from gtts import gTTS  # hoặc elevenlabs
import os
import openai  # hoặc grok api nếu có

r = sr.Recognizer()

def ai_conversation(label, user_question=""):
    prompt = f"""
    Bạn là hướng dẫn viên tranh Đông Hồ dành cho người mù.
    Người dùng vừa chạm vùng: {label}.
    Câu hỏi của họ: {user_question if user_question else "Mô tả chi tiết vùng này"}
    Trả lời chi tiết, thân thiện, dùng ngôn ngữ đơn giản, và hỏi lại 1 câu để tiếp tục trò chuyện.
    """
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    text = response.choices[0].message.content
    return text

def speak(text):
    tts = gTTS(text=text, lang='vi')
    tts.save("response.mp3")
    os.system("mpg321 response.mp3")  # hoặc pygame.mixer

# Trong vòng lặp click
if detected_region:
    initial_text = ai_conversation(label)
    speak(initial_text)

    # Nghe người mù hỏi lại
    with sr.Microphone() as source:
        audio = r.listen(source)
        question = r.recognize_google(audio, language='vi-VN')
        follow_up = ai_conversation(label, question)
        speak(follow_up)