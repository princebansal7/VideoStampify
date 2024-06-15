import cv2
import time
from cap_from_youtube import cap_from_youtube
import requests
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

## Loading Model for inferencing on GPU
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base").to("cuda")

## Video Capture from youtube
# youtube_url = 'https://youtu.be/LXb3EKWsInQ' ## 5 min
# youtube_url = 'https://www.youtube.com/watch?v=snYu2JUqSWs' ## 11 sec
# youtube_url = 'https://www.youtube.com/watch?v=hp_-RlwNg04' ## 3min
youtube_url = 'https://www.youtube.com/watch?v=6Y3zqIL23i0' ## 4min15sec

cap = cap_from_youtube(youtube_url, '144p')

cv2.namedWindow('video', cv2.WINDOW_NORMAL)
frameNo = 0

sentences = [] ## text outputs

start = time.time()

while True:
    cap.set(cv2.CAP_PROP_POS_FRAMES, frameNo) ## sets the position of frame.
    frameNo += 30  ## skips 30 frames. 
    frameId = cap.get(1)  ## get the frame number. 
    ret, frame = cap.read()
    if not ret:
        break
    # print(frameId)
    cv2.imshow('video', frame)
    raw_image = frame
    # unconditional image captioning
    # start = time.time()
    inputs = processor(raw_image, return_tensors="pt").to("cuda")

    out = model.generate(**inputs)
    text = processor.decode(out[0], skip_special_tokens=True)
    print(frameId, text)
    sentences.append(text)
    # end = time.time()
    # print(end - start)
    
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

end = time.time()
print(end - start)

model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
sentence_embeddings = model.encode(sentences)

user_input = ["women in a pool"]
user_embedding = model.encode(user_input)

cosine_similarities = cosine_similarity(user_embedding, sentence_embeddings)

cnt = 0
timestamps = []
for i in cosine_similarities.flatten():
    if i > 0.3 :
        timestamps.append(cnt)
    cnt = cnt + 1

print(cosine_similarities)
print(timestamps)



